export function displayPrice(price: number) {
    return price ? `£${price.toLocaleString()}` : '';
}