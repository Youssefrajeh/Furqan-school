const fs = require('fs');
const path = require('path');

// In-memory storage for Netlify (since we can't write files)
let dataStore = {
  students: [],
  entries: {},
  parentCredentials: {},
  lastSaved: null
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const { httpMethod, path: requestPath, body } = event;

  try {
    if (requestPath === '/api/data') {
      if (httpMethod === 'GET') {
        // Return stored data
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(dataStore)
        };
      } else if (httpMethod === 'POST') {
        // Save data
        const newData = JSON.parse(body);
        dataStore = {
          ...newData,
          lastSaved: new Date().toISOString()
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            status: 'success', 
            message: 'Data saved successfully' 
          })
        };
      }
    } else if (requestPath === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok' })
      };
    }

    // For other paths, serve static files
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8')
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error', 
        message: error.message 
      })
    };
  }
};
