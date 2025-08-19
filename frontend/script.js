const API_URL = 'https://localhost:3443/calculate'; //local API endpoint for calculation
const API_KEY = 'gb-calc-key'; //load API-KEY

async function calculate() {
    const expression = document.getElementById('expression').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!expression) {
        showResult('Please enter an expression', 'error');
        return;
    }
    
    try {
        //POST to /calculate
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

function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = `result ${type}`;
    resultDiv.classList.remove('hidden');
}

function setExpression(expr) {
    document.getElementById('expression').value = expr;
}

//event listener for enter key to run calculation
document.getElementById('expression').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});