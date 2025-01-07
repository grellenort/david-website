import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { useNavigate, useLocation } from "react-router-dom";
import { ProductSortType } from "./model/ProductSortType.ts";
import { useDebounce } from "../../DebounceUtils.tsx";
import { Product } from './model/Product.ts';
import { GenericFetchClient } from "../common/GenericFetchClient.tsx";
import ProductItemListView from "./ProductItemListView.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useBasket } from "../basket/BasketContext.tsx";

const baseURL = 'https://waldashop.herokuapp.com/api';
const productClient = new GenericFetchClient(baseURL);

const ProductListComponent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        name: '',
        categories: '',
        priceMin: 0,
        priceMax: 1000,
        pageNumber: 1,
        pageSize: 20,
        sort: 'ASC',
        sortBy: ProductSortType.NAME, // Default sorting field
        detailed: true,
    });

    const debouncedFilters = useDebounce(filters, 500);
    const { dispatch } = useBasket();
    const navigate = useNavigate();
    const location = useLocation();

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

    // Initialize filters from URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const priceMin = urlParams.get('priceMin') ? Number(urlParams.get('priceMin')) : 0;
        const priceMax = urlParams.get('priceMax') ? Number(urlParams.get('priceMax')) : 1000;
        const sortBy = urlParams.get('sortBy') as ProductSortType || ProductSortType.NAME;
        const sort = urlParams.get('sort') || 'ASC';
        const pageNumber = urlParams.get('pageNumber') ? Number(urlParams.get('pageNumber')) : 1;
        const categoryId = urlParams.get('categoryId') || '';

        setFilters((prevFilters) => ({
            ...prevFilters,
            priceMin,
            priceMax,
            sortBy,
            sort,
            pageNumber,
            categories: categoryId,
        }));
    }, [location.search]); // Update when the URL changes

    // Update the URL when filters change (priceMin, priceMax, sortBy, categoryId)
    const updateURLParams = (newFilters: any) => {
        const params = new URLSearchParams(location.search);
        if (newFilters.priceMin !== undefined) params.set('priceMin', newFilters.priceMin.toString());
        if (newFilters.priceMax !== undefined) params.set('priceMax', newFilters.priceMax.toString());
        if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
        if (newFilters.sort) params.set('sort', newFilters.sort);
        if (newFilters.pageNumber) params.set('pageNumber', newFilters.pageNumber.toString());
        if (newFilters.categories) params.set('categoryId', newFilters.categories);

        navigate({
            pathname: location.pathname,
            search: `?${params.toString()}`,
        });
    };

    const handlePriceRangeChange = (value: [number, number]) => {
        const updatedFilters = {
            ...filters,
            priceMin: value[0],
            priceMax: value[1],
        };
        setFilters(updatedFilters);
        updateURLParams(updatedFilters); // Update URL params
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sortBy = event.target.value as ProductSortType;
        const updatedFilters = {
            ...filters,
            sortBy,
        };
        setFilters(updatedFilters); // Update filters state
        updateURLParams(updatedFilters); // Update URL params
    };

    const handlePageChange = (page: number) => {
        const updatedFilters = {
            ...filters,
            pageNumber: page,
        };
        setFilters(updatedFilters); // Update state
        updateURLParams(updatedFilters); // Update URL params
    };

    const addToCart = (product: Product) => {
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
                const response = await productClient.fetchData<{ data: Product[]; meta: any }>(
                    '/products/filter',
                    buildQueryString(debouncedFilters)
                );
                setProducts(response.data);
                setError(null);
            } catch (error) {
                setError('Error loading products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [debouncedFilters]);

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div>
            {error} <button onClick={() => setFilters({ ...filters })}>Retry</button>
        </div>
    );

    return (
        <div className="d-flex">
            {/* Sidebar for filters */}
            <Col md={3} className="p-3">
                <h5>Filters</h5>

                {/* Price Range Filter (Slider) */}
                <div>
                    <label>Price Range</label>
                    <ReactSlider
                        min={0}
                        max={1000}
                        step={10}
                        value={[filters.priceMin, filters.priceMax]}
                        onChange={handlePriceRangeChange}
                        renderTrack={(props, state) => (
                            <div {...props} className="slider-track" />
                        )}
                        renderThumb={(props) => <div {...props} className="slider-thumb" />}
                    />
                    <div className="d-flex justify-content-between">
                        <span>${filters.priceMin}</span>
                        <span>${filters.priceMax}</span>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="mt-4">
                    <label>Sort By</label>
                    <select value={filters.sortBy} onChange={handleSortChange} className="form-select">
                        <option value={ProductSortType.NAME}>Name</option>
                        <option value={ProductSortType.PRICE}>Price</option>
                    </select>
                </div>
            </Col>

            {/* Product list */}
            <Col md={9}>
                <Row className="gy-4">
                    {products.map((product) => (
                        <Col key={product.url} md={4} lg={3}>
                            <ProductItemListView
                                product={product}
                                onAddToCart={(prod) => addToCart(prod)}
                                onViewDetails={(prod) => navigate(`/product-detail/${prod.url}`)}
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
            </Col>
        </div>
    );
};

export default ProductListComponent;