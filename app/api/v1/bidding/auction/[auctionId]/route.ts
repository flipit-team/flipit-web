import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/bidding/auction/{auctionId} - Get bids for auction
export async function GET(req: NextRequest, { params }: { params: Promise<{ auctionId: string }> }) {

    const { auctionId } = await params;

    try {
        const apiUrl = `${API_BASE_PATH}/bidding/auction/${auctionId}`;

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });


        const _ct = apiRes.headers.get('content-type') || '';



        if (!_ct.includes('application/json')) {



            console.error(`Backend non-JSON (${apiRes.status}): ${apiRes.url}`);



            return NextResponse.json({ apierror: { message: 'Server returned an unexpected response.' } }, { status: 502 });



        }



        let apiData: any;



        try { apiData = await apiRes.json(); } catch { return NextResponse.json({ apierror: { message: 'Invalid server response.' } }, { status: 502 }); }

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch auction bids'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}