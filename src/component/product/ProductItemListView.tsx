import React from 'react';
import { Card, Button } from 'react-bootstrap';
import {Product} from "./model/Product.ts";

interface ProductItemViewProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}

const ProductItemListView: React.FC<ProductItemViewProps> = ({ product, onAddToCart, onViewDetails }) => {
    return (
        <Card className="h-100">
            <Card.Img
                variant="top"
                src={product.file?.bytes || 'https://via.placeholder.com/150'}
                alt={product.name}
                onClick={() => onViewDetails(product)}
            />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>
                    <strong>{product.priceAmount} {product.priceCurrency}</strong>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
                <Button variant="success" onClick={() => onAddToCart(product)}>
                    Add to Cart
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default ProductItemListView;