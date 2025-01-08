import React, { memo } from "react";
import ReactSlider from "react-slider";
import {Filters} from "./model/Filters.ts";

interface ProductFiltersProps {
    filters: Filters;
    onFilterChange: (updatedFilters: Partial<Filters>) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = memo(({ filters, onFilterChange }) => {
    const handlePriceChange = (values: [number, number]) => {
        onFilterChange({ priceMin: values[0], priceMax: values[1] });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ sortBy: e.target.value });
    };

    return (
        <div className="filters p-3">
            <h5>Filters</h5>

            {/* Price Range Slider */}
            <div>
                <label>Price Range</label>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    min={0}
                    max={1000}
                    value={[filters.priceMin, filters.priceMax]}
                    onChange={handlePriceChange}
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
                    <option value="NAME">Name</option>
                    <option value="PRICE">Price</option>
                </select>
            </div>
        </div>
    );
});

export default ProductFilters;