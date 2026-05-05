import { API_BASE } from '@/lib/api-config';

/**
 * apiFetch — Authenticated wrapper around fetch().
 * Automatically attaches the Bearer token from localStorage.
 * Throws on non-2xx responses (and shows a console error).
 */
export async function apiFetch(endpoint, options = {}) {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('pace_auth_token')
        : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.message || `API error: ${response.status}`;
            console.error('[apiFetch]', endpoint, message);
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        console.error('[apiFetch] Failed to reach API:', endpoint, error.message);
        throw error;
    }
}
