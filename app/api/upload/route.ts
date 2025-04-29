import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const incomingFormData = await req.formData();
    const file = incomingFormData.get('file');

    if (!file || !(file instanceof Blob)) {
        console.error('No file uploaded or invalid file');
        return NextResponse.json({error: 'No file uploaded or invalid file'}, {status: 400});
    }

    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({error: 'Unauthorized: No token found'}, {status: 401});
    }

    // Create a new browser-like FormData
    const form = new FormData();
    form.append('file', file); // append Blob directly, no Buffer needed

    const res = await fetch(`${API_BASE_PATH}/files/upload`, {
        method: 'POST',
        body: form,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
            // ❌ do NOT set Content-Type manually when using browser FormData
        }
    });

    const responseText = await res.text();

    try {
        const jsonData = JSON.parse(responseText);
        return NextResponse.json(jsonData);
    } catch {
        return NextResponse.json({raw: responseText});
    }
}
