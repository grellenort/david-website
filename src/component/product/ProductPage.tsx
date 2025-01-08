import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ProductFilters from "./ProductFilters";
import ProductList from "./ProductList";
import {Filters} from "./model/Filters.ts";
import {Col} from "react-bootstrap";



const ProductPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {categoryId} = useParams(); // Get the category ID (slug) from URL

    const initialFilters = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            priceMin: Number(params.get("priceMin")) || 0,
            priceMax: Number(params.get("priceMax")) || 1000,
            sortBy: params.get("sortBy") || "NAME",
            category: categoryId || "",
            pageNumber: Number(params.get("pageNumber")) || 1,
            pageSize: Number(params.get("pageSize")) || 8,
        };
    }, [location.search, categoryId]); // Rebuild filters when URL changes

    const [filters, setFilters] = useState<Filters>(initialFilters);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("priceMin", filters.priceMin.toString());
        params.set("priceMax", filters.priceMax.toString());
        params.set("sortBy", filters.sortBy);
        params.set("category", filters.category);
        params.set("pageNumber", filters.pageNumber.toString());
        params.set("pageSize", filters.pageSize.toString());

        navigate({search: `?${params.toString()}`}, {replace: true});
    }, [filters, navigate]);

    const handleFilterChange = (updatedFilters: Partial<Filters>) => {
        setFilters((prev) => ({...prev, ...updatedFilters}));
    };

    return (
        <div className="d-flex">
            <Col lg={3}>
                <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Col>
            <Col lg={9}>
                <ProductList filters={filters}/>
            </Col>
        </div>
    );
};

export default ProductPage;