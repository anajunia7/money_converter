const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.src = 'assets/light-mode.png';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.src = 'assets/light-mode.png';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.src = 'assets/dark-mode.png';
        localStorage.setItem('theme', 'light');
    }
});

const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const swapButton = document.querySelector('.swap-button');
const convertButton = document.querySelector('.convert-button');
const amountInput = document.getElementById('amount');
const fromResult = document.getElementById('from-result');
const toResultValue = document.getElementById('to-result-value');
const toResultCurrency = document.getElementById('to-result-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');

function updateFlags() {
    fromFlag.src = `assets/${fromCurrencySelect.value.toLowerCase()}.png`;
    toFlag.src = `assets/${toCurrencySelect.value.toLowerCase()}.png`;
}

fromCurrencySelect.addEventListener('change', updateFlags);
toCurrencySelect.addEventListener('change', updateFlags);

swapButton.addEventListener('click', () => {
    const tempValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempValue;
    updateFlags();
});

convertButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    let amountText = amountInput.value.trim();
    if (!amountText) {
        amountText = "0";
    }

    if (amountText.includes(",")) {
        amountText = amountText.replace(/\./g, "").replace(",", ".");
    }
    
    let parsedAmount = parseFloat(amountText);
    if (isNaN(parsedAmount)) {
        parsedAmount = 0;
    }

    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    try {
        const originalButtonText = "⟳ Converter valor";
        convertButton.textContent = "⟳ Convertendo...";
        convertButton.disabled = true;

        const fromCode = fromCurrency.toLowerCase();
        const toCode = toCurrency.toLowerCase();

        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCode}.json`);
        
        if (response.ok) {
            const data = await response.json();
            const rate = data[fromCode][toCode];
            const convertedAmount = parsedAmount * rate;

            const formatCurrency = (value, currencyCode) => {
                let minD = 2;
                let maxD = 2;
                if (currencyCode === 'BTC') {
                    minD = 6;
                    maxD = 8;
                }
                return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: minD, maximumFractionDigits: maxD }).format(value);
            };

            const formattedOriginal = formatCurrency(parsedAmount, fromCurrency);
            const formattedConverted = formatCurrency(convertedAmount, toCurrency);

            fromResult.textContent = `${formattedOriginal} ${fromCurrency} =`;
            toResultValue.textContent = formattedConverted;
            toResultCurrency.textContent = toCurrency;
        } else {
            alert('Erro ao buscar as taxas de câmbio na API.');
        }

        convertButton.textContent = originalButtonText;
        convertButton.disabled = false;
        
    } catch (error) {
        console.error('Erro na conversão:', error);
        alert('Erro ao converter o valor. Verifique sua conexão com a internet.');
        convertButton.textContent = "⟳ Converter valor";
        convertButton.disabled = false;
    }
});
