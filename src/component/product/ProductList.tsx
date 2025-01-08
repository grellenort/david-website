import React, { useEffect, useState } from "react";
import { Product } from "./model/Product";
import { GenericFetchClient } from "../common/GenericFetchClient";
import { Row, Col } from "react-bootstrap";
import ProductItemListView from "./ProductItemListView";
import {Filters} from "./model/Filters.ts";
const baseURL = "https://waldashop.herokuapp.com/api";
const productClient = new GenericFetchClient(baseURL);

interface ProductListProps {
    filters: Filters;
}

const ProductList: React.FC<ProductListProps> = ({ filters }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    priceMin: filters.priceMin.toString(),
                    priceMax: filters.priceMax.toString(),
                    sortBy: filters.sortBy,
                    category: filters.category,
                    pageNumber: filters.pageNumber.toString(),
                    pageSize: filters.pageSize.toString(),
                });

                const response = await productClient.fetchData<{ data: Product[] }>("/products/filter", `?${params}`);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Row>
            {products.map((product) => (
                <Col key={product.name} md={4} lg={3}>
                    <ProductItemListView product={product} />
                </Col>
            ))}
        </Row>
    );
};

export default ProductList;