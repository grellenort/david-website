import { BasketItem, getBasket, clearBasket } from "./BasketSingleton.tsx";
import { useEffect, useState } from "react";
import { Cart, Trash } from "react-bootstrap-icons"; // Trash icon for clear basket
import { Link } from "react-router-dom";
import { ROUTES } from "../../App.tsx";

// Updated BasketNavigation component with recycle bin icon
const BasketNavigation = (props: { basketItems: BasketItem[] }) => {
    const [basket, setBasket] = useState<BasketItem[]>(() => getBasket());

    // Update the basket whenever basketItems in props change
    useEffect(() => {
        const loadedBasket = getBasket();
        setBasket(loadedBasket);
    }, [props.basketItems]);

    // Function to get the total price
    const getTotalPrice = () => {
        return basket.reduce((total, item) => total + item.product.priceAmount * 1, 0);
    };

    // Function to get the total item count
    const getTotalCount = () => {
        return basket.length;
    };

    // Handle clear basket logic
    const handleClearBasket = () => {
        clearBasket();  // Clears basket data from localStorage
        setBasket([]);  // Clears the basket state
    };

    return (
        <div className="d-flex align-items-center justify-content-between">
            <Link className="d-flex align-items-center" to={ROUTES.BASKET}>
                <Cart />
                <span className="ms-2">{getTotalCount()} items</span> | <span className="ms-2">{getTotalPrice()} Kč</span>
            </Link>

            {/* Recycle bin icon for clearing the basket */}
            <span
                className="d-flex align-items-center ms-3 cursor-pointer"
                onClick={handleClearBasket}
                style={{ cursor: 'pointer' }} // Inline style for pointer cursor
            >
                <Trash size={24} />
            </span>
        </div>
    );
};

export default BasketNavigation;