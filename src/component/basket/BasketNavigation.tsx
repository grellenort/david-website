import React from "react";
import { Cart, Trash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../../App.tsx";
import { useBasket } from "./BasketContext";

const BasketNavigation: React.FC = () => {
    const { state, dispatch } = useBasket();

    const getTotalPrice = () =>
        state.items.reduce((total, item) => total + item.product.priceAmount * item.quantity, 0);

    const getTotalCount = () => state.items.reduce((count, item) => count + item.quantity, 0);

    const handleClearBasket = () => {
        dispatch({ type: "CLEAR_BASKET" });
    };

    return (
        <div className="d-flex align-items-center justify-content-between">
            <Link className="d-flex align-items-center" to={ROUTES.CHECKOUT}>
                <Cart />
                <span className="ms-2">{getTotalCount()} items</span> | <span className="ms-2">{getTotalPrice()} Kč</span>
            </Link>
            <span className="d-flex align-items-center ms-3" onClick={handleClearBasket} style={{ cursor: "pointer" }}>
                <Trash size={24} />
            </span>
        </div>
    );
};

export default BasketNavigation;