import React, { useEffect, useState } from "react";
import { Product } from "./model/Product";
import { GenericFetchClient } from "../common/GenericFetchClient";
import { Row, Col } from "react-bootstrap";
import ProductItemListView from "./ProductItemListView";
import {Filters} from "./model/Filters.ts";
const baseURL = "https://waldashop.herokuapp.com/api";
const productClient = new GenericFetchClient(baseURL);
import {Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useBasket} from "../basket/BasketContext.tsx";

interface ProductListProps {
    filters: Filters;
}

const ProductList: React.FC<ProductListProps> = ({ filters }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { dispatch } = useBasket();
    const navigate = useNavigate();

    const addToCart = (product: Product) => {
        // Dispatch action to add product to basket via context
        console.log(`Added ${product.name} to cart`);
        dispatch({
            type: 'ADD_TO_BASKET',
            product,
            quantity: 1,
        });
    };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    priceMin: filters.priceMin.toString(),
                    priceMax: filters.priceMax.toString(),
                    sortBy: filters.sortBy,
                    pageNumber: filters.pageNumber.toString(),
                    pageSize: filters.pageSize.toString(),
                });

                const response = await productClient.fetchData<{ data: Product[] }>("/products/filter", `${params}`);
                setProducts(response.data);
                setError(null);
            } catch (err) {
                setError("Error loading products.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [filters]);

    return (
        <div>
            {/* Conditionally render loading spinner */}
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status"/>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product.name} md={4} lg={3}>
                            <ProductItemListView product={product}
                                                 onAddToCart={(prod) => {
                                                     addToCart(prod);
                                                 }}
                                                 onViewDetails={(prod) => {
                                                     navigate(`/product-detail/${prod.url}`);
                                                 }}
                            />


                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ProductList;