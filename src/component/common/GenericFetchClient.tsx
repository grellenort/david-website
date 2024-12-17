export class GenericFetchClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Generic async function to fetch data with query parameters
    async fetchData<T>(url: string, params: string): Promise<T> {


        const fullUrl = `${this.baseUrl}${url}?${params}`;

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Returns parsed JSON as type T
    }
}