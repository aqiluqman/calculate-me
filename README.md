# calculate-me

A simple project where a client talks to a server through a local HTTPS REST API call. It uses a self-signed SSL certificate to simulate actual HTTPS communication. The server exposes a single endpoint _/calculate_, which accepts an object containing the property "expression". The request is validated by checking the provided API key against the expected API key. If the key is valid, _/calculate_ returns the result of the expression.

---

## Getting Started  

1. Clone repository 
   ```bash
   git clone https://github.com/aqiluqman/calculate-me.git
   ```
2. Navigate to project directory
   ```bash
   cd calculate-me
   ```
3. Install dependencies  
   ```bash
   npm install
   ```
4. Start the server  
   ```bash
   npm start
   ```
5. Open [https://localhost:3443](https://localhost:3443) in your browser.  
6. Accept/Proceed the security warning shown by browser (note: this project uses self-signed SSL certs).
7. Enter a math expression → **voila!** 🎉 The result is shown.  

---

## Project Structure
The aim is to organize the files to enhance readability and maintanability. Each backend and frontend have their respective folders. Certificates are also kept in one folder. 
```
│── backend/
│   ├── server.js   # Express.js with Node.js for HTTPS server
│   └── .env
│
│── certs/          # Self-signed SSL certificates
│   ├── cert.pem
│   ├── key.pem
│
│── frontend/       # Web client
│   ├── index.html  # Simple HTML for math input + result
│   ├── script.js   # Calls the HTTPS server
│   └── style.css
│
│── package.json    # Required dependencies
```
_Note: The .env file and certificates are committed for convenience to run this project._

## 🔑 Environment Variables

The application uses the following environment variables. The `.env` file is already included in the `backend/` directory.

```env
#path to the SSL private key
SSL_KEY=../certs/key.pem

#path to the SSL certificate
SSL_CERT=../certs/cert.pem

#API Key for authentication
API_KEY=gb-calc-key

#port used for the HTTPS server
PORT=3443
```


## How the Project Works

### Server
> It uses the existing Express.js inside Node.js with HTTPS.  
> Only contains single endpoint, POST /calculate  
> API Key authentication resides in the server (gb-calc-key)  
> Math operations follows the proper precedence for the operators _+, -, *, /_   
> Invalid expressions and missing API keys are handled.  

### Client
> It is a simple web interface to enter math expression and display results.  
> It makes the HTTPS API calls to the server with API Key in the request header.  
> Displays error for server or invalid inputs.  

## API Usage 

**Endpoint:**  
```
POST https://localhost:3443/calculate
```

**Headers:**  
```
Content-Type: application/json
x-api-key: gb-calc-key
```

**Request body sample:**  
```json
{
  "expression": "2 + 3 * 4"
}
```

**Response:**  
```json
{
  "result": 14
}
```

## Algorithms Used

## `/calculate` Endpoint

```js
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
```

#### Explanation
It accepts a POST request with `expression` in the body. Then, it validates the API key, checks if the expression exists, and then evaluates it with the `calculate()` function. Results are returned as JSON, while errors return a 400 status.

#### Why
A simple, readable and secure design.
- It has the `validateApiKey` to ensure only authorized access.
- It has status codes for error handlings.

## `calculate()` Function
```js
const calculate = (expression) => {
  try {
    //sanitize input
    const clean = expression.replace(/\s/g, '');
    if (!/^[0-9+\-*/().]+$/.test(clean)) {
      throw new Error('Invalid characters');
    }
    
    // Safe evaluation
    const result = Function('"use strict"; return (' + clean + ')')();
    
    if (!isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
};
```

#### Explanation
Evaluates mathematical expression provided as a string. The input is sanitized by removing whitespace and rejecting any characters other than math expression (eg. num & operators). The expression is then evaluated using JavaScript's `Function` constructor. If the result is not a valid number (e.g division by zero), an error is thrown.

#### Why
This approach was chosen to:
- Able to restrict characters to numbers and math operators.
- Simple evaluation logic and contained in one function.
- Handles invalid results and throw clear errors.

## Tech Stack
- Node.js (runtime)  
- Express.js (server framework)  
- OpenSSL (for generating self-signed certificates)

Certificates generated with below command:  
```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365
```

## Dependencies
```json
{
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^4.18.2"
}
```
cors: lets server accept requests from client

dotenv: loads environment profile (eg. SSL certs and API key)

express: web framework to provide HTTPS REST API calls

## Test Cases

### Positive Tests

| Input            | Expected Output |
|------------------|--------|
| 2 + 3            | 5      |
| 10 - 4           | 6      |
| 5 * 6            | 30     |
| 15 / 3           | 5      |
| 2 + 3 * 4        | 14  | (precedence: * before +)
| (2 + 3) * 4      | 20    | (parentheses override)

### Negative Tests

| Input             | Expected Output                          |
|-------------------|---------------------------------|
| Empty expression  | Please enter an expression      |
| 5 / 0             | Invalid Expression              |
| abc + 2           | Invalid Expression              |
| Wrong API key     | 401 Error (Invalid API Key)     |


_Note: This project is built for submission of Global Blue's Assessment for User Story 1_

Thank you for your time!
