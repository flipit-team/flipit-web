import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCK, updateTransactionStatus } from '~/lib/mock-store';

// Mock-only: simulates the package physically arriving at buyer's door.
// Real backend will have its own delivery confirmation mechanism.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (USE_MOCK) {
            const tx = updateTransactionStatus(Number(id), 'ARRIVED');
            if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
            return NextResponse.json(tx);
        }

        // Real API: no equivalent endpoint — skip gracefully
        return NextResponse.json({ message: 'Not applicable in live mode' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
