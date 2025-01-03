export class GenericFetchClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Generic async function to fetch data with query parameters
    async  fetchData<T>(url: string, params: string): Promise<T> {


        const fullUrl = `${this.baseUrl}${url}?${params}`;

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Returns parsed JSON as type T
    }

    // Method to make POST requests
    async post<T>(url: string, body: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }
}