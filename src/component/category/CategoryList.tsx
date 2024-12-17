import {Category} from "./model/Category.ts";
import {useEffect, useState} from "react";
import {CategoryResponse} from "./model/CategoryResponse.ts";
import {GenericFetchClient} from "../common/GenericFetchClient.tsx";
import {Link} from "react-router-dom";

const baseURL = 'https://waldashop.herokuapp.com';

const apiService = new GenericFetchClient(baseURL);

function CategoryListComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch the CategoryResponse
                const data = await apiService.fetchData<CategoryResponse>('/api/categories','');
                // Set categories from the data field of CategoryResponse
                setCategories(data.data); // Assuming `data` contains the list of categories
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        fetchCategories();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!categories.length) return <div>Loading...</div>;

    return (
        <ul>
            {categories.map((category) => (
                <div key={category.name}>
                    <strong>{category.name}</strong>: {category.description}: '{category.url}'
                    <Link to={`/products/${category.url}`}>{category.name}</Link>
                </div>
            ))}
        </ul>
    );
}

export default CategoryListComponent;