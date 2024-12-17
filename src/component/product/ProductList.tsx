import {useEffect, useState} from 'react';
import {Product} from './model/Product.ts';
import {GenericFetchClient} from "../common/GenericFetchClient.tsx";
import ProductItemListView from "./ProductItemListView.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useNavigate} from "react-router-dom"; // Pagination control component
const baseURL = 'https://waldashop.herokuapp.com/api';
const productClient = new GenericFetchClient(baseURL);


function ProductListComponent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const pageSize = 30; // Items per page
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

    const [filters] = useState({
        name: '', // default value, can be updated from user input
        categories: '', // default value, can be updated from user input
        priceMin: undefined,
        priceMax: undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
        sort: 'ASC', // default sorting order
        sortBy: 'NAME', // default sorting field
        detailed: false, // boolean flag for detailed results
    });

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await productClient.fetchData<{ data: Product[]; meta: any }>(
                    '/products/filter',
                    buildQueryString(filters)
                );
                setProducts(response.data);
                setTotalItems(response.meta.totalElements);
            } catch (error) {
                setError('Error loading products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentPage]); // Re-fetch when the page changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Row className="gy-4">
            {products.map((product) => (
                <Col key={product.url} md={4} lg={3}>
                    <ProductItemListView
                        product={product}
                        onAddToCart={(prod) => console.log(`Added ${prod.name} to cart`)}
                        onViewDetails={(prod) => {
                            console.log(`View details for ${prod.name}`)
                            navigate(`/product-detail/${prod.url}`); // Redirect to product details page
                        }
                        }
                    />
                </Col>
            ))}
        </Row>
    );
};

export default ProductListComponent;