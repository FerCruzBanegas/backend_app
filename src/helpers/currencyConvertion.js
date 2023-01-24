import fx from 'money';

export function convert(base, rates, amount, from, to) {
    var toCurrency;
    fx.base = base;
    fx.rates = rates;
    if (to) {
        toCurrency = to
    } else {
        toCurrency = base
    }
    let value = fx.convert(amount, { from, to: toCurrency });
    return value;
}

export function manualCurrencyConvertion({ amount, fromPrice, toPrice }) {
    if (!fromPrice) return amount;
    return Number((amount * (toPrice / fromPrice)).toFixed(2));
}