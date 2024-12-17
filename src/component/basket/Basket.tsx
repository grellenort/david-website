import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {clearBasket, getBasket} from "./BasketSingleton.tsx";

const BasketComponent: React.FC = () => {
    const [basket, setBasket] = useState(getBasket());

    const handleClearBasket = () => {
        clearBasket();
        setBasket([]);
    };

    const calculateTotal = () => {
        return basket.reduce((total, item) => total + item.product.priceAmount * item.quantity, 0);
    };

    if (basket.length === 0) {
        return <div className="text-center mt-5">Your basket is empty!</div>;
    }

    return (
        <div className="basket-container">
            <h2 className="text-center mb-4">Your Basket</h2>
            <Row className="gy-4">
                {basket.map((item, index) => (
                    <Col key={index} md={6} lg={4}>
                        <Card className="h-100">
                            <Card.Img variant="top" src={getImage(item.product.file)} alt={item.product.name} />
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
                <h4>Total: {calculateTotal()} {basket[0]?.product.priceCurrency}</h4>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="danger" onClick={handleClearBasket}>
                        Clear Basket
                    </Button>
                    <Button variant="success" onClick={() => console.log("Proceed to checkout")}>
                        Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Helper function to get image from product file (base64 encoded)
function getImage(file: { bytes: string; type: string }) {
    if (file?.bytes && file?.type) {
        return `data:${file.type};base64,${file.bytes}`;
    }
    return "path/to/default-image.png"; // Default image path
}

export default BasketComponent;