const express = require('express'); 
const https = require('https'); 
const cors = require('cors'); 
const fs = require('fs'); //read ssl certs
require('dotenv').config({ path: __dirname + '/.env' });
const path = require('path');

//load environment variables
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT 

const keyPath = path.resolve(__dirname, process.env.SSL_KEY);
const certPath = path.resolve(__dirname, process.env.SSL_CERT);

//configure HTTPS server with credentials
const serverOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

//init express app
const app = express();
app.use(express.json());
app.use(cors());

// validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

//load frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

//redirect user to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

//API to handle string calculation 
app.post('/calculate', validateApiKey, (req, res) => {
  const { expression } = req.body;
  
  if (!expression) {
    return res.status(400).json({ error: 'Expression required' });
  }
  
  try {
    const result = calculate(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//start server
https.createServer(serverOptions, app).listen(PORT, () => {
  console.log(`Hello Global Blue! This is my assessment for User Story 1.`);
  console.log(`Server running on https://localhost:${PORT}, click to open in browser!`);
});

// helper function to calculate expression
const calculate = (expression) => {
  try {
    //sanitize input
    const clean = expression.replace(/\s/g, '');
    if (!/^[0-9+\-*/().]+$/.test(clean)) {
      throw new Error('Invalid characters');
    }
    
    //safe eval
    const result = Function('"use strict"; return (' + clean + ')')();
    
    if (!isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
};