const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${path}`);
    }

    if (res.status === 204) {
        return undefined as T
    }

    return res.json();
}