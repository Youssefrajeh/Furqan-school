const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = 'quran_data.json';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Helper function to serve static files
function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json'
  }[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType, ...corsHeaders });
    res.end(data);
  });
}

// Helper function to read JSON data
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading data:', error);
  }
  return { students: [], entries: {}, lastSaved: null };
}

// Helper function to write JSON data
function writeData(data) {
  try {
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // API endpoints
  if (pathname === '/api/data') {
    if (req.method === 'GET') {
      // Return the JSON data file
      const data = readData();
      res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify(data));
    } else if (req.method === 'POST') {
      // Save data to JSON file
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (writeData(data)) {
            res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
            res.end(JSON.stringify({ status: 'success', message: 'Data saved successfully' }));
          } else {
            res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
            res.end(JSON.stringify({ status: 'error', message: 'Failed to save data' }));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json', ...corsHeaders });
          res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON data' }));
        }
      });
    }
  } else if (pathname === '/api/health') {
    // Health check endpoint
    res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    // Serve static files
    let filePath = pathname === '/' ? 'index.html' : pathname.substring(1);
    
    // Security check - prevent directory traversal
    if (filePath.includes('..') || filePath.startsWith('/')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }
    
    serveStaticFile(res, filePath);
  }
});

server.listen(PORT, () => {
  console.log(`Quran Recitation Logger server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
  console.log(`Data will be saved to: ${DATA_FILE}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer stopped');
  server.close();
  process.exit(0);
});
