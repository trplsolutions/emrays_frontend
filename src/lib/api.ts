const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Wrapper around fetch that:
 * - Always sends credentials (cookies) for HttpOnly JWT auth
 * - Always sets Content-Type JSON
 * - Returns { data, ok, status } for easy error handling
 */
export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data: T | null; ok: boolean; status: number }> {
    const url = `${API_BASE}${endpoint}`;

    try {
        const res = await fetch(url, {
            ...options,
            credentials: 'include',   // Required to send/receive HttpOnly cookies
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data: T = await res.json().catch(() => null as unknown as T);
        return { data, ok: res.ok, status: res.status };

    } catch {
        // Network or server-down error
        return { data: null, ok: false, status: 0 };
    }
}
