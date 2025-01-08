import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ProductFilters from "./ProductFilters";
import ProductList from "./ProductList";
import {Filters} from "./model/Filters.ts";
import {Col} from "react-bootstrap";
import { useDebounce } from "../../DebounceUtils.tsx";

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
    const debouncedFilters = useDebounce(filters, 500);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("priceMin", debouncedFilters.priceMin.toString());
        params.set("priceMax", debouncedFilters.priceMax.toString());
        params.set("sortBy", debouncedFilters.sortBy);
        params.set("pageNumber", debouncedFilters.pageNumber.toString());
        params.set("pageSize", debouncedFilters.pageSize.toString());

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
                <ProductList filters={debouncedFilters}/>
            </Col>
        </div>
    );
};

export default ProductPage;