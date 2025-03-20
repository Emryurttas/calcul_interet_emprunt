document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const duration = parseFloat(document.getElementById('duration').value);
    const periodicity = document.getElementById('periodicity').value;
    const repaymentType = document.getElementById('repayment-type').value;

    if (amount <= 0 || rate < 0 || duration <= 0) {
        alert("Veuillez entrer des valeurs valides (supérieures à zéro).");
        return;
    }
    let periodsPerYear;
    let periodicRate;

    switch (periodicity) {
        case 'monthly':
            periodsPerYear = 12;
            periodicRate = Math.pow(1 + rate, 1 / 12) - 1;
            break;
        case 'quarterly':
            periodsPerYear = 4;
            periodicRate = Math.pow(1 + rate, 1/4)-1;
            console.log(periodicRate);
            break;
        case 'semi-annually':
            periodsPerYear = 2;
            periodicRate =  Math.pow(1 + rate, 1/2)-1;
            break;
        case 'annually':
            periodsPerYear = 1;
            periodicRate = rate;
            break;
    }

    const totalPeriods = duration * periodsPerYear;

    let tableHTML = '<table><tr><th>Années</th><th>Capital Restant en début de période</th><th>Intérêt</th><th>Amortissement</th><th>Annuité emprunt</th><th>Capital Restant en fin de période</th></tr>';

    let remainingCapital = amount;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let totalAnnuity = 0;

    if (repaymentType === 'constant-annuities') {
        const annuity = (amount * periodicRate) / (1 - Math.pow(1 + periodicRate, -totalPeriods));

        for (let i = 1; i <= totalPeriods; i++) {
            const interest = remainingCapital * periodicRate;
            const principal = annuity - interest;
            const remainingCapitalEnd = remainingCapital - principal;

            totalInterest += interest;
            totalPrincipal += principal;
            totalAnnuity += annuity;

            tableHTML += `<tr>
                <td>${i}</td>
                <td>${remainingCapital.toFixed(2)}</td>
                <td>${interest.toFixed(2)}</td>
                <td>${principal.toFixed(2)}</td>
                <td>${annuity.toFixed(2)}</td>
                <td>${remainingCapitalEnd.toFixed(2)}</td>
            </tr>`;

            remainingCapital = remainingCapitalEnd;
        }
    } else if (repaymentType === 'constant-amortizations') {
        const principalPayment = amount / totalPeriods;

        for (let i = 1; i <= totalPeriods; i++) {
            const interest = remainingCapital * periodicRate;
            const annuity = principalPayment + interest;
            const remainingCapitalEnd = remainingCapital - principalPayment;

            totalInterest += interest;
            totalPrincipal += principalPayment;
            totalAnnuity += annuity;

            tableHTML += `<tr>
                <td>${i}</td>
                <td>${remainingCapital.toFixed(2)}</td>
                <td>${interest.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${annuity.toFixed(2)}</td>
                <td>${remainingCapitalEnd.toFixed(2)}</td>
            </tr>`;

            remainingCapital = remainingCapitalEnd;
        }
    }

    tableHTML += `<tr class="total"><td>Total</td><td>0.00</td><td>${totalInterest.toFixed(2)}</td><td>${totalPrincipal.toFixed(2)}</td><td>${totalAnnuity.toFixed(2)}</td><td>0.00</td></tr>`;
    tableHTML += '</table>';
    document.getElementById('result').innerHTML = tableHTML;
});
