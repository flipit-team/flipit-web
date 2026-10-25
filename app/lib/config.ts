// Local dev uses localhost:8080, production uses real backend
const defaultApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.flipit.ng/api/v1'
    : 'http://localhost:8080/api/v1';

const API_BASE_URL = process.env.API_BASE_URL || defaultApiUrl;

// Alias kept for backward compatibility — same value
const API_BASE_PATH = API_BASE_URL;

export {API_BASE_URL, API_BASE_PATH};

/**
 * Safely parse a backend fetch response.
 * Guards against non-JSON responses (e.g. HTML 502 pages from nginx).
 * Returns { data, status } on success, or a NextResponse error on failure.
 */
export async function parseApiResponse(apiRes: Response): Promise<{ data: any; status: number } | null> {
    const ct = apiRes.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
        // Non-JSON — might be HTML error page
        return null;
    }
    try {
        const data = await apiRes.json();
        return { data, status: apiRes.status };
    } catch {
        return null;
    }
}

/**
 * Build a safe JSON response from a backend fetch.
 * Use in Next.js API routes instead of `const data = await res.json()`.
 */
import { NextResponse } from 'next/server';

export async function forwardApiResponse(apiRes: Response) {
    const parsed = await parseApiResponse(apiRes);

    if (!parsed) {
        console.error(`Backend returned non-JSON (${apiRes.status}): ${apiRes.url}`);
        return NextResponse.json(
            { apierror: { message: 'Server returned an unexpected response. Please try again later.' } },
            { status: 502 }
        );
    }

    if (!apiRes.ok) {
        return NextResponse.json(
            { apierror: parsed.data.apierror ?? parsed.data },
            { status: parsed.status }
        );
    }

    return NextResponse.json(parsed.data, { status: parsed.status });
}
