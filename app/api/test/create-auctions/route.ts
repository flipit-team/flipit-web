import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const TEST_AUCTIONS = [
  // === LIVE (started, not ended) ===
  {
    title: 'Toyota Camry 2022 - Low Mileage',
    description: 'Clean title Toyota Camry XSE 2022. Only 15,000km. Full service history.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'FAIRLY_USED',
    brand: 'Toyota',
    itemCategory: 'Vehicles',
    startDate: new Date(now - 2 * HOUR).toISOString(),
    endDate: new Date(now + 3 * DAY).toISOString(),
    reservePrice: 18000000,
    bidIncrement: 200000,
    startingBid: 15000000,
  },
  {
    title: 'Gold Necklace 18K - Italian Design',
    description: 'Beautiful 18K gold Italian chain necklace. 20 inches. Comes with certificate.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'VI',
    condition: 'NEW',
    brand: 'Other',
    itemCategory: 'Jewelry & Watches',
    startDate: new Date(now - 1 * HOUR).toISOString(),
    endDate: new Date(now + 5 * DAY).toISOString(),
    reservePrice: 750000,
    bidIncrement: 10000,
    startingBid: 500000,
  },
  {
    title: 'Treadmill - Commercial Grade',
    description: 'Heavy duty commercial treadmill. 3.5HP motor, incline, heart rate monitor.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'NEW',
    brand: 'Other',
    itemCategory: 'Sports & Fitness',
    startDate: new Date(now - 30 * 60 * 1000).toISOString(),
    endDate: new Date(now + 2 * DAY).toISOString(),
    reservePrice: 450000,
    bidIncrement: 5000,
    startingBid: 350000,
  },

  // === UPCOMING (starts in the future) ===
  {
    title: 'Sony PlayStation 5 Pro Bundle',
    description: 'PS5 Pro with 2 controllers, headset, and 5 games. Launching soon!',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'SURULERE',
    condition: 'NEW',
    brand: 'Sony',
    itemCategory: 'Electronics & Gadgets',
    startDate: new Date(now + 3 * HOUR).toISOString(),
    endDate: new Date(now + 3 * HOUR + 7 * DAY).toISOString(),
    reservePrice: 500000,
    bidIncrement: 5000,
    startingBid: 400000,
  },
  {
    title: 'Nike Air Jordan 4 Retro - Limited Edition',
    description: 'Exclusive colorway dropping soon. Size 43. Deadstock.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'NEW',
    brand: 'Nike',
    itemCategory: 'Fashion & Clothing',
    startDate: new Date(now + 6 * HOUR).toISOString(),
    endDate: new Date(now + 6 * HOUR + 3 * DAY).toISOString(),
    reservePrice: 200000,
    bidIncrement: 2000,
    startingBid: 150000,
  },
  {
    title: 'DJI Mavic 3 Pro Drone',
    description: 'Triple camera system, 43-min flight time. Auction starts tomorrow.',
    imageKeys: [],
    stateCode: 'AB',
    lgaCode: 'ABA_N',
    condition: 'NEW',
    brand: 'DJI',
    itemCategory: 'Electronics & Gadgets',
    startDate: new Date(now + 1 * DAY).toISOString(),
    endDate: new Date(now + 1 * DAY + 5 * DAY).toISOString(),
    reservePrice: 1500000,
    bidIncrement: 20000,
    startingBid: 1200000,
  },

  // === ENDED (endDate in the past) ===
  {
    title: 'Canon EOS R6 Mark II Camera',
    description: 'Professional mirrorless camera. Full frame, 24MP. Auction has ended.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'NEW',
    brand: 'Canon',
    itemCategory: 'Electronics & Gadgets',
    startDate: new Date(now - 5 * DAY).toISOString(),
    endDate: new Date(now - 1 * HOUR).toISOString(),
    reservePrice: 1000000,
    bidIncrement: 10000,
    startingBid: 850000,
  },
  {
    title: 'Rolex Submariner Watch',
    description: 'Pre-owned Rolex Submariner Date. Excellent condition with papers.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'VI',
    condition: 'FAIRLY_USED',
    brand: 'Rolex',
    itemCategory: 'Jewelry & Watches',
    startDate: new Date(now - 7 * DAY).toISOString(),
    endDate: new Date(now - 2 * DAY).toISOString(),
    reservePrice: 8000000,
    bidIncrement: 100000,
    startingBid: 6000000,
  },
  {
    title: 'Samsung 65" OLED Smart TV',
    description: 'Samsung S95C OLED 65". This auction has concluded.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'NEW',
    brand: 'Samsung',
    itemCategory: 'Electronics & Gadgets',
    startDate: new Date(now - 3 * DAY).toISOString(),
    endDate: new Date(now - 30 * 60 * 1000).toISOString(),
    reservePrice: 900000,
    bidIncrement: 10000,
    startingBid: 700000,
  },
];

export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = API_BASE_PATH;

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated. Please log in first.' }, { status: 401 });
    }

    const results = {
      created: [] as any[],
      failed: [] as any[],
    };

    for (const auctionData of TEST_AUCTIONS) {
      try {
        const response = await fetch(`${API_BASE_URL}/auction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(auctionData),
        });

        if (response.ok) {
          const data = await response.json();
          results.created.push({ title: auctionData.title, id: data.id, type: getType(auctionData) });
        } else {
          const error = await response.text();
          results.failed.push({ title: auctionData.title, status: response.status, error });
        }
      } catch (error: any) {
        results.failed.push({ title: auctionData.title, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: TEST_AUCTIONS.length,
        created: results.created.length,
        failed: results.failed.length,
        breakdown: {
          live: results.created.filter(r => r.type === 'live').length,
          upcoming: results.created.filter(r => r.type === 'upcoming').length,
          ended: results.created.filter(r => r.type === 'ended').length,
        }
      },
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getType(auction: any): string {
  const now = Date.now();
  const start = new Date(auction.startDate).getTime();
  const end = new Date(auction.endDate).getTime();
  if (start > now) return 'upcoming';
  if (end < now) return 'ended';
  return 'live';
}
