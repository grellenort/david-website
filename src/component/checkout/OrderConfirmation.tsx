import React, { useEffect } from "react";
import {useBasket} from "../basket/BasketContext.tsx";

const OrderConfirmationComponent: React.FC = () => {
    const { dispatch } = useBasket(); // Get the dispatch function from the basket context

    // Clear the basket when the component loads
    useEffect(() => {
        dispatch({ type: "CLEAR_BASKET" });
    }, [dispatch]);

    return (
        <div className="text-center mt-5">
            Your order has been successfully placed. Thank you for shopping with us!
        </div>
    );
};

export default OrderConfirmationComponent;