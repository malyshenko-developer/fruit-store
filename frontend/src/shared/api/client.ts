const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => res.ok)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

export async function apiFetch<T>(path: string, options?: RequestInit, isRetry = false): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include"
    });

    if (res.status === 401 && !isRetry && path !== "/auth/refresh") {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            return apiFetch<T>(path, options, true);
        }
    }

    if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${path}`);
    }

    if (res.status === 204) {
        return undefined as T
    }

    return res.json();
}