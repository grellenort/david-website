import { Category } from "./model/Category.ts";
import { useEffect, useState } from "react";
import { CategoryResponse } from "./model/CategoryResponse.ts";
import { GenericFetchClient } from "../common/GenericFetchClient.tsx";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const baseURL = 'https://waldashop.herokuapp.com';
const apiService = new GenericFetchClient(baseURL);

function CategoryListComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location to read query params

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiService.fetchData<CategoryResponse>('/api/categories', '');
                setCategories(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        fetchCategories();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!categories.length) return <div>Loading...</div>;

    const handleCategoryClick = (categoryUrl: string) => {
        const params = new URLSearchParams(location.search);

        // Navigate to the category products page and keep existing query parameters
        navigate({
            pathname: `/products/${categoryUrl}`, // Ensure category is passed in the path
            search: `?${params.toString()}`, // Keep existing query params
        });
    };

    return (
        <Nav className="justify-content-center">
            {categories.map((category) => (
                <Nav.Item key={category.name}>
                    <Nav.Link onClick={() => handleCategoryClick(category.url)}>
                        {category.name}
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
}

export default CategoryListComponent;