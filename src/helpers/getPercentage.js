export function getPercentageValue(total, percent) {
    if (total && percent) {
        let amount = total * (Number(percent) / 100);
        return (amount);
    } else {
        return 0;
    }
}