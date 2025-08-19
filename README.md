# calculate-me

A simple project where a client talks with a server through a local HTTPS REST API call. It uses a self-signed SSL certificate to simulate actual HTTPS communication. The server exposes a single endpoint _/calculate_, which accepts an object containing the property "expression". The request is validated by checking the provided API key against the expected API key. If the key is valid, _/calculate_ returns the result of the expression.

---

## Getting Started  

1. Install dependencies  
   ```bash
   npm install
   ```
2. Start the server  
   ```bash
   npm start
   ```
3. Open [https://localhost:3443](https://localhost:3443) in your browser.  
4. Accept/Proceed the security warning shown by browser (note: this project uses self-signed SSL certs).
5. Enter a math expression → **voila!** 🎉 The result is shown.  

---

## Project Structure

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
