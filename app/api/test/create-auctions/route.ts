import { NextRequest, NextResponse } from 'next/server';

const TEST_AUCTIONS = [
  {
    title: 'iPhone 13 Pro Max - 256GB',
    description: 'Brand new iPhone 13 Pro Max in Sierra Blue. Never used, still in original packaging with all accessories.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'NEW',
    brand: 'Apple',
    itemCategory: 'Electronics & Gadgets',
    subcategory: 'Smartphones',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 450000,
    bidIncrement: 5000,
    startingBid: 400000,
  },
  {
    title: 'MacBook Pro M2 - 16GB RAM',
    description: 'MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for developers and creators.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'VI',
    condition: 'NEW',
    brand: 'Apple',
    itemCategory: 'Electronics & Gadgets',
    subcategory: 'Computers',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 800000,
    bidIncrement: 10000,
    startingBid: 700000,
  },
  {
    title: 'Sony PlayStation 5 Console',
    description: 'PS5 Disc Edition with 2 controllers and 3 games.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'NEW',
    brand: 'Sony',
    itemCategory: 'Electronics & Gadgets',
    subcategory: 'Gaming',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 350000,
    bidIncrement: 5000,
    startingBid: 300000,
  },
  {
    title: 'Samsung 55" 4K Smart TV',
    description: 'Samsung QLED 55 inch 4K Smart TV. HDR, WiFi, and all smart features.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'NEW',
    brand: 'Samsung',
    itemCategory: 'Home Appliances',
    subcategory: 'TV',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 280000,
    bidIncrement: 3000,
    startingBid: 250000,
  },
  {
    title: 'Canon EOS R6 Camera Body',
    description: 'Professional mirrorless camera. Full frame sensor, 20MP, 4K video. Perfect for photography enthusiasts.',
    imageKeys: [],
    stateCode: 'AB',
    lgaCode: 'ABA_N',
    condition: 'NEW',
    brand: 'Canon',
    itemCategory: 'Electronics & Gadgets',
    subcategory: 'Cameras',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 1200000,
    bidIncrement: 15000,
    startingBid: 1000000,
  },
  {
    title: 'Nike Air Jordan 1 Retro High',
    description: 'Limited edition Air Jordan 1 in Chicago colorway. Size 43 (US 10). Deadstock with original box.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'SURULERE',
    condition: 'NEW',
    brand: 'Nike',
    itemCategory: 'Fashion & Clothing',
    subcategory: 'Shoes',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 180000,
    bidIncrement: 2000,
    startingBid: 150000,
  },
  {
    title: 'DJI Mini 3 Pro Drone',
    description: 'Compact drone with 4K camera, 3-axis gimbal, and obstacle avoidance. Includes extra batteries.',
    imageKeys: [],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'NEW',
    brand: 'DJI',
    itemCategory: 'Electronics & Gadgets',
    subcategory: 'Drones',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    reservePrice: 420000,
    bidIncrement: 5000,
    startingBid: 380000,
  },
];

export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = 'http://localhost:8080/api/v1';

    // Get token from cookies
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
          results.created.push({ title: auctionData.title, id: data.id });
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
      },
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
