const API_URL = 'https://localhost:3443/calculate'; //local API endpoint for calculation
const API_KEY = 'gb-calc-key'; //load API-KEY

//calculator on the client side to make calls with server
async function calculate() {
    const expression = document.getElementById('expression').value.trim();
    const resultDiv = document.getElementById('result');

    //block empty input
    if (!expression) {
        showResult('Please enter an expression', 'error');
        return;
    }
    
    try {
        //POST to /calculate via HTTPS call including the API Key for validation on the server side
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ expression })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResult(`Result: ${data.result}`, 'success');
        } else {
            showResult(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        showResult('Error: Cannot connect to server. Please enable browser to proceed as it is self-signed cert. ', 'error');
    }
}

//to display the result or error message after receiving response
function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = `result ${type}`;
    resultDiv.classList.remove('hidden');
}

//event listener for enter key to run calculation
document.getElementById('expression').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});
