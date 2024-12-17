import {ProductFile} from './product-file.ts';

export interface Product {
    name: string;
    categoryUrl: string;
    description: string;
    priceAmount: number;
    priceCurrency: string;
    isbn: string;
    url: string;
    file: ProductFile;
    quantity: number;
}
