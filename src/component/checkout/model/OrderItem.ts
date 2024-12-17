export class OrderItem {
    productUrl: string;
    count: number;

    constructor(productUrl: string, quantity: number) {
        this.productUrl = productUrl;
        this.count = quantity;
    }
}
