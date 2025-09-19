const fs = require('fs');
const path = require('path');

// In-memory storage for Netlify (since we can't write files)
let dataStore = {
  students: [
    {
      "id": "S1",
      "name": "Zakareeya A.",
      "parentId": "P1",
      "parentName": "Zakareeya A.'s Parent"
    },
    {
      "id": "S2",
      "name": "Muhamad",
      "parentId": "P2",
      "parentName": "Muhamad's Parent"
    },
    {
      "id": "S3",
      "name": "Mousa",
      "parentId": "P3",
      "parentName": "Mousa's Parent"
    },
    {
      "id": "S4",
      "name": "Zakariya M.",
      "parentId": "P4",
      "parentName": "Zakariya M.'s Parent"
    },
    {
      "id": "S5",
      "name": "Bara",
      "parentId": "P5",
      "parentName": "Bara's Parent"
    },
    {
      "id": "S6",
      "name": "Ali",
      "parentId": "P6",
      "parentName": "Ali's Parent"
    },
    {
      "id": "S7",
      "name": "Shorouk",
      "parentId": "P7",
      "parentName": "Shorouk's Parent"
    },
    {
      "id": "S8",
      "name": "Ibrahim",
      "parentId": "P8",
      "parentName": "Ibrahim's Parent"
    },
    {
      "id": "S9",
      "name": "Belal",
      "parentId": "P9",
      "parentName": "Belal's Parent"
    },
    {
      "id": "S10",
      "name": "Juwariyyah",
      "parentId": "P10",
      "parentName": "Juwariyyah's Parent"
    },
    {
      "id": "S11",
      "name": "Lina",
      "parentId": "P11",
      "parentName": "Lina's Parent"
    },
    {
      "id": "S12",
      "name": "Jude",
      "parentId": "P12",
      "parentName": "Jude's Parent"
    },
    {
      "id": "S13",
      "name": "Aminah",
      "parentId": "P13",
      "parentName": "Aminah's Parent"
    }
  ],
  entries: {
    "S3": [
      {
        "date": "2025-01-19",
        "sura": "001",
        "personalCorrection": "10",
        "teacherCorrection": "10",
        "tajweed": "10",
        "fluency": "10",
        "finalMark": "10"
      }
    ]
  },
  parentCredentials: {
    "P1": { username: "parent1", password: "demo123" },
    "P2": { username: "parent2", password: "demo123" },
    "P3": { username: "parent3", password: "demo123" },
    "P4": { username: "parent4", password: "demo123" },
    "P5": { username: "parent5", password: "demo123" },
    "P6": { username: "parent6", password: "demo123" },
    "P7": { username: "parent7", password: "demo123" },
    "P8": { username: "parent8", password: "demo123" },
    "P9": { username: "parent9", password: "demo123" },
    "P10": { username: "parent10", password: "demo123" },
    "P11": { username: "parent11", password: "demo123" },
    "P12": { username: "parent12", password: "demo123" },
    "P13": { username: "parent13", password: "demo123" }
  },
  lastSaved: new Date().toISOString()
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
