// Conversor de Moedas - Versão Estável

let exchangeRates = {};

// Taxas locais (funcionam sem internet)
const defaultRates = {
    'USD': 1,
    'BRL': 5.62,
    'EUR': 0.91,
    'GBP': 0.77,
    'JPY': 149.50,
    'ARS': 1035.00,
    'CAD': 1.43,
    'AUD': 1.57,
    'CHF': 0.88,
    'CNY': 7.24
};

// Inicializar ao carregar
window.onload = function() {
    console.log('Conversor iniciado!');
    
    // Usar taxas padrão imediatamente
    exchangeRates = { ...defaultRates };
    
    // Tentar buscar taxas atualizadas (não obrigatório)
    tryFetchRates();
    
    // Configurar Enter no input
    document.getElementById('amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') convert();
    });
    
    document.getElementById('lastUpdate').textContent = 'Pronto para converter!';
};

function tryFetchRates() {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            exchangeRates = data.rates;
            exchangeRates['USD'] = 1;
            document.getElementById('lastUpdate').textContent = 
                'Taxas atualizadas: ' + new Date(data.date).toLocaleDateString('pt-BR');
        })
        .catch(error => {
            console.log('API indisponível, usando taxas locais');
            document.getElementById('lastUpdate').textContent = 
                'Usando taxas locais (API indisponível)';
        });
}

function swapCurrencies() {
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    var temp = from.value;
    from.value = to.value;
    to.value = temp;
    
    var amount = document.getElementById('amount').value;
    if (amount && document.getElementById('result').style.display !== 'none') {
        convert();
    }
}

function convert() {
    var amount = parseFloat(document.getElementById('amount').value);
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    
    document.getElementById('error').textContent = '';
    
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('error').textContent = 'Digite um valor maior que zero';
        document.getElementById('result').style.display = 'none';
        return;
    }
    
    var amountInUSD = amount / exchangeRates[from];
    var convertedAmount = amountInUSD * exchangeRates[to];
    
    var formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: to
    }).format(convertedAmount);
    
    document.getElementById('resultValue').textContent = formatted;
    document.getElementById('resultDetail').textContent = 
        amount + ' ' + from + ' = ' + convertedAmount.toFixed(4) + ' ' + to;
    document.getElementById('result').style.display = 'flex';
}