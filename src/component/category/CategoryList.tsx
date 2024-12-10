import { Category } from "./model/category";
import { useEffect, useState } from "react";
import { CategoryResponse } from "./model/category-response";

const baseURL = 'https://waldashop.herokuapp.com/api/categories';

class ApiService {
    // Generic async function to fetch data from a given URL
    async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Returns parsed JSON as type T
    }
}

const apiService = new ApiService();

function CategoryListComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch the CategoryResponse
                const data = await apiService.fetchData<CategoryResponse>(baseURL);
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
                <li key={category.name}>
                    <strong>{category.name}</strong>: {category.description}
                </li>
            ))}
        </ul>
    );
}

export default CategoryListComponent;