import React, { createContext, useContext, useReducer } from "react";
import { Product } from "../product/model/Product";

export type BasketItem = {
    product: Product;
    quantity: number;
};

type BasketState = {
    items: BasketItem[];
};

type BasketAction =
    | { type: "ADD_TO_BASKET"; product: Product; quantity: number }
    | { type: "CLEAR_BASKET" }
    | { type: "REMOVE_ITEM"; productUrl: string };

const BASKET_KEY = "userBasket";

// Initialize state from localStorage
const initialState: BasketState = {
    items: JSON.parse(localStorage.getItem(BASKET_KEY) || "[]"),
};

const basketReducer = (state: BasketState, action: BasketAction): BasketState => {
    switch (action.type) {
        case "ADD_TO_BASKET": {
            const { product, quantity } = action;
            const existingItemIndex = state.items.findIndex(
                (item) => item.product.url === product.url
            );
            let updatedItems;

            if (existingItemIndex !== -1) {
                updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += quantity;
            } else {
                updatedItems = [...state.items, { product, quantity }];
            }

            localStorage.setItem(BASKET_KEY, JSON.stringify(updatedItems));
            return { items: updatedItems };
        }
        case "CLEAR_BASKET": {
            localStorage.removeItem(BASKET_KEY);
            return { items: [] };
        }

        case "REMOVE_ITEM": {
            const updatedItems = state.items.filter(
                (item) => item.product.url !== action.productUrl
            );

            localStorage.setItem(BASKET_KEY, JSON.stringify(updatedItems));
            return { items: updatedItems };
        }
        default:
            return state;
    }
};

const BasketContext = createContext<{
    state: BasketState;
    dispatch: React.Dispatch<BasketAction>;
} | null>(null);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(basketReducer, initialState);

    return (
        <BasketContext.Provider value={{ state, dispatch }}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error("useBasket must be used within a BasketProvider");
    }
    return context;
};