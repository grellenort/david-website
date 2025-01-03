import React, { useEffect, useState } from 'react';
import { Product } from './model/Product.ts';
import { GenericFetchClient } from "../common/GenericFetchClient.tsx";
import ProductItemListView from "./ProductItemListView.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../basket/BasketContext.tsx";  // Use context

const baseURL = 'https://waldashop.herokuapp.com/api';
const productClient = new GenericFetchClient(baseURL);

const ProductListComponent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        name: '', // default value, can be updated from user input
        categories: '', // default value, can be updated from user input
        priceMin: undefined,
        priceMax: undefined,
        pageNumber: 1, // default page number
        pageSize: 30, // Items per page
        sort: 'ASC', // default sorting order
        sortBy: 'NAME', // default sorting field
        detailed: false, // boolean flag for detailed results
    });

    const { dispatch } = useBasket();  // Access basket state and dispatch from context
    const navigate = useNavigate();

    // Function to build query string from filter object
    const buildQueryString = (filters: any): string => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, value.toString());
            }
        }
        return `?${params.toString()}`;
    };

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            pageNumber: page,
        }));
    };

    const addToCart = (product: Product) => {
        // Dispatch action to add product to basket via context
        console.log(`Added ${product.name} to cart`);
        dispatch({
            type: 'ADD_TO_BASKET',
            product,
            quantity: 1,  // You can modify this if you need to add a different quantity
        });
    };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await productClient.fetchData<{ data: Product[]; meta: any }>(
                    '/products/filter',
                    buildQueryString(filters)
                );
                setProducts(response.data);
                setError(null);  // Clear any previous errors
            } catch (error) {
                setError('Error loading products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [filters]); // Re-fetch whenever filters change

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div>
            {error} <button onClick={() => setFilters({ ...filters })}>Retry</button>
        </div>
    );

    return (
        <div>
            <Row className="gy-4">
                {products.map((product) => (
                    <Col key={product.url} md={4} lg={3}>
                        <ProductItemListView
                            product={product}
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

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handlePageChange(filters.pageNumber - 1)}
                    disabled={filters.pageNumber <= 1}
                >
                    Previous
                </button>
                <span className="mx-3">Page {filters.pageNumber}</span>
                <button onClick={() => handlePageChange(filters.pageNumber + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductListComponent;