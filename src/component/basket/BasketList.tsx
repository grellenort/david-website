import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useBasket } from "./BasketContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../App.tsx";

const BasketListComponent: React.FC = () => {
    const { state, dispatch } = useBasket();
    const navigate = useNavigate();

    const handleClearBasket = () => {
        dispatch({ type: "CLEAR_BASKET" });
    };

    const calculateTotal = () =>
        state.items.reduce((total, item) => total + item.product.priceAmount * item.quantity, 0);

    const handleCheckout = () => {
        navigate(ROUTES.CHECKOUT);
    };

    if (state.items.length === 0) {
        return <div className="text-center mt-5">Your basket is empty!</div>;
    }

    return (
        <div className="basket-container">
            <h2 className="text-center mb-4">Your Basket</h2>
            <Row className="gy-4">
                {state.items.map((item, index) => (
                    <Col key={index} md={6} lg={4}>
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                // src={`data:${item.product.file.type};base64,${item.product.file.bytes}`}
                                alt={item.product.name}
                            />
                            <Card.Body>
                                <Card.Title>{item.product.name}</Card.Title>
                                <Card.Text>
                                    Quantity: {item.quantity}
                                    <br />
                                    Price: {item.product.priceAmount} {item.product.priceCurrency}
                                    <br />
                                    Subtotal: {item.product.priceAmount * item.quantity} {item.product.priceCurrency}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="mt-4">
                <h4>Total: {calculateTotal()} {state.items[0]?.product.priceCurrency}</h4>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="danger" onClick={handleClearBasket}>
                        Clear Basket
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BasketListComponent;