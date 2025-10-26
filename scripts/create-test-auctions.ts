/**
 * Script to create test auctions
 * Run with: npx ts-node scripts/create-test-auctions.ts
 *
 * NOTE: Make sure your backend server is running on localhost:8080
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

console.log(`Using API URL: ${API_BASE_URL}\n`);

interface CreateAuctionData {
  title: string;
  description: string;
  imageKeys: string[];
  stateCode: string;
  lgaCode: string;
  condition: string;
  brand: string;
  itemCategory: string;
  subcategory?: string;
  startDate: string;
  endDate: string;
  reservePrice: number;
  bidIncrement: number;
  startingBid: number;
  itemId?: number; // Optional if creating new item
}

const testAuctions: CreateAuctionData[] = [
  {
    title: 'iPhone 13 Pro Max - 256GB',
    description: 'Brand new iPhone 13 Pro Max in Sierra Blue. Never used, still in original packaging with all accessories.',
    imageKeys: ['iphone13-pro-max.jpg'],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'NEW',
    brand: 'Apple',
    itemCategory: 'Electronics',
    subcategory: 'Phones & Tablets',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    reservePrice: 450000,
    bidIncrement: 5000,
    startingBid: 400000,
  },
  {
    title: 'MacBook Pro M2 - 16GB RAM',
    description: 'Lightly used MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for developers and creators.',
    imageKeys: ['macbook-pro-m2.jpg'],
    stateCode: 'LA',
    lgaCode: 'VI',
    condition: 'USED',
    brand: 'Apple',
    itemCategory: 'Electronics',
    subcategory: 'Computers',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    reservePrice: 800000,
    bidIncrement: 10000,
    startingBid: 700000,
  },
  {
    title: 'Sony PlayStation 5 Console',
    description: 'PS5 Disc Edition with 2 controllers and 3 games. In excellent condition.',
    imageKeys: ['ps5-console.jpg'],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'USED',
    brand: 'Sony',
    itemCategory: 'Electronics',
    subcategory: 'Gaming',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    reservePrice: 350000,
    bidIncrement: 5000,
    startingBid: 300000,
  },
  {
    title: 'Samsung 55" 4K Smart TV',
    description: 'Samsung QLED 55 inch 4K Smart TV. HDR, WiFi, and all smart features. Barely used.',
    imageKeys: ['samsung-tv.jpg'],
    stateCode: 'LA',
    lgaCode: 'IKEJA',
    condition: 'LIKE_NEW',
    brand: 'Samsung',
    itemCategory: 'Electronics',
    subcategory: 'TV & Audio',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    reservePrice: 280000,
    bidIncrement: 3000,
    startingBid: 250000,
  },
  {
    title: 'Canon EOS R6 Camera Body',
    description: 'Professional mirrorless camera. Full frame sensor, 20MP, 4K video. Perfect for photography enthusiasts.',
    imageKeys: ['canon-eos-r6.jpg'],
    stateCode: 'AB',
    lgaCode: 'ABA_N',
    condition: 'USED',
    brand: 'Canon',
    itemCategory: 'Electronics',
    subcategory: 'Cameras',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    reservePrice: 1200000,
    bidIncrement: 15000,
    startingBid: 1000000,
  },
  {
    title: 'Nike Air Jordan 1 Retro High',
    description: 'Limited edition Air Jordan 1 in Chicago colorway. Size 43 (US 10). Deadstock with original box.',
    imageKeys: ['jordan1-chicago.jpg'],
    stateCode: 'LA',
    lgaCode: 'SURULERE',
    condition: 'NEW',
    brand: 'Nike',
    itemCategory: 'Fashion',
    subcategory: 'Shoes',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    reservePrice: 180000,
    bidIncrement: 2000,
    startingBid: 150000,
  },
  {
    title: 'DJI Mini 3 Pro Drone',
    description: 'Compact drone with 4K camera, 3-axis gimbal, and obstacle avoidance. Includes extra batteries.',
    imageKeys: ['dji-mini3.jpg'],
    stateCode: 'LA',
    lgaCode: 'LEKKI',
    condition: 'LIKE_NEW',
    brand: 'DJI',
    itemCategory: 'Electronics',
    subcategory: 'Cameras',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    reservePrice: 420000,
    bidIncrement: 5000,
    startingBid: 380000,
  },
];

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.token;
}

async function createAuction(token: string, auctionData: CreateAuctionData) {
  const response = await fetch(`${API_BASE_URL}/auction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(auctionData),
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let error = '';
    if (isJson) {
      const errorData = await response.json();
      error = JSON.stringify(errorData, null, 2);
    } else {
      error = await response.text();
    }
    throw new Error(`Failed to create auction: ${response.status} - ${error}`);
  }

  return isJson ? response.json() : response.text();
}

async function main() {
  console.log('Logging in...\n');

  let token: string;
  try {
    token = await login('jose@gmail.com', 'Oliver066.');
    console.log('✓ Login successful\n');
  } catch (error) {
    console.error(`✗ Login failed: ${error}`);
    process.exit(1);
  }

  console.log('Creating test auctions...\n');

  for (const auctionData of testAuctions) {
    try {
      console.log(`Creating auction: ${auctionData.title}...`);
      const result = await createAuction(token, auctionData);
      console.log(`✓ Created auction with ID: ${result.id}`);
      console.log(`  Starting bid: ₦${auctionData.startingBid.toLocaleString()}`);
      console.log(`  Ends: ${new Date(auctionData.endDate).toLocaleDateString()}\n`);
    } catch (error) {
      console.error(`✗ Failed to create auction: ${auctionData.title}`);
      console.error(`  Error: ${error}\n`);
    }
  }

  console.log('Done!');
}

main();
