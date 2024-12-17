import {Product} from "../product/model/Product.ts";

export type BasketItem = {
    product: Product;
    quantity: number;
};

const BASKET_KEY = "userBasket";

export const getBasket = (): BasketItem[] => {
    const basket = localStorage.getItem(BASKET_KEY);
    return basket ? JSON.parse(basket) : [];
};

export const setBasket = (basket: BasketItem[]): void => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
};

export const addToBasket = (product: Product, quantity: number): void => {
    const basket = getBasket();
    const existingItemIndex = basket.findIndex((item) => item.product.url === product.url);
    if (existingItemIndex !== -1) {
        basket[existingItemIndex].quantity += quantity;
    } else {
        basket.push({ product, quantity });
    }
    setBasket(basket);
    console.log("Basket updated", basket);
};

export const clearBasket = (): void => {
    localStorage.removeItem(BASKET_KEY);
};