import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
        return NextResponse.json({error: 'No file uploaded'}, {status: 400});
    }

    // const uploadForm = new FormData();
    // uploadForm.append('file', file);

    const res = await fetch('https://flipit-api.onrender.com/api/v1/files/upload', {
        method: 'POST',
        body: file
    });

    const data = await res.json();
    return NextResponse.json(data);
}
