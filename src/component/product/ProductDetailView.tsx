import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "./model/Product.ts";
import { GenericFetchClient } from "../common/GenericFetchClient";
import { Spinner, Button, Alert, Card } from "react-bootstrap";

const baseURL = "https://waldashop.herokuapp.com/api";
const productClient = new GenericFetchClient(baseURL);

const ProductDetailViewComponent: React.FC = () => {
    const { slug } = useParams<{ slug: string }>(); // Get the slug from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productClient.fetchData<Product>(`/products/${slug}`, '');
                setProduct(response);
            } catch (err) {
                setError("Failed to load product details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" />
                <div>Loading product details...</div>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!product) {
        return <Alert variant="warning">Product not found.</Alert>;
    }

    return (
        <div className="container my-5">
            <Card>
                <Card.Img
                    variant="top"
                    src={getImage(product.file)}
                    alt={product.name}
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                />
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div className="mb-3">
                        <strong>Price:</strong> {product.priceAmount} {product.priceCurrency}
                    </div>
                    <div className="mb-3">
                        <strong>ISBN:</strong> {product.isbn}
                    </div>
                    <Button
                        variant="primary"
                        className="me-2"
                        onClick={() => console.log(`Add ${product.name} to cart`)}
                    >
                        Add to Cart
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Back to Products
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ProductDetailViewComponent;

// Helper function to get product image
function getImage(file: { bytes: string; type: string }) {
    if (file?.bytes && file?.type) {
        return `data:${file.type};base64,${file.bytes}`;
    }
    return "path/to/default-image.png"; // Default image fallback
}