const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const FRONTEND_URL = 'http://localhost:3001';
const API_BASE_URL = `${FRONTEND_URL}/api`;
const CREDENTIALS = {
  username: 'jose@gmail.com',
  password: 'Oliver066.'
};

// Store cookies for authenticated requests
let cookies = '';

// Sample data for items
const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Vehicles',
  'Real Estate'
];

const LISTED_ITEMS = [
  {
    title: 'iPhone 14 Pro Max - 256GB',
    description: 'Brand new iPhone 14 Pro Max in Space Black. 256GB storage, unlocked, comes with original box and accessories. Never used, perfect condition.',
    category: 'Electronics & Gadgets',
    brand: 'Apple',
    condition: 'NEW',
    cashAmount: 850000,
    acceptCash: true,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'Samsung 65" QLED 4K Smart TV',
    description: 'Stunning 65-inch QLED display with 4K resolution. Smart TV features, HDR support, and sleek design. Gently used for 3 months, still under warranty.',
    category: 'Electronics & Gadgets',
    brand: 'Samsung',
    condition: 'FAIRLY_USED',
    cashAmount: 450000,
    acceptCash: true,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'Nike Air Max 270 - Size 42',
    description: 'Classic Nike Air Max 270 sneakers in white/black colorway. Size 42 (EU). Worn only twice, almost like new. Original box included.',
    category: 'Fashion & Clothing',
    brand: 'Nike',
    condition: 'FAIRLY_USED',
    cashAmount: 45000,
    acceptCash: true,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'MacBook Pro 16" M2 Max',
    description: 'Powerful MacBook Pro with M2 Max chip, 32GB RAM, 1TB SSD. Perfect for video editing and professional work. 6 months old, excellent condition.',
    category: 'Electronics & Gadgets',
    brand: 'Apple',
    condition: 'FAIRLY_USED',
    cashAmount: 1200000,
    acceptCash: true,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'Sony PlayStation 5 Console',
    description: 'Brand new PS5 console with disc drive. Includes 2 controllers and 3 games (FIFA 24, Spider-Man 2, God of War Ragnarok). Sealed in box.',
    category: 'Electronics & Gadgets',
    brand: 'Sony',
    condition: 'NEW',
    cashAmount: 320000,
    acceptCash: true,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  }
];

const AUCTION_ITEMS = [
  {
    title: 'Vintage Rolex Submariner Watch',
    description: 'Authentic vintage Rolex Submariner from 1985. Fully serviced, working perfectly. Comes with box and certificate of authenticity. Rare collector\'s item.',
    category: 'Jewelry & Watches',
    brand: 'Rolex',
    condition: 'FAIRLY_USED',
    startingBid: 2000000,
    bidIncrement: 50000,
    reservePrice: 2500000,
    durationHours: 72,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'BMW 330i 2020 - Low Mileage',
    description: 'Beautiful BMW 330i in Alpine White. Only 25,000km driven. Full service history, accident-free. Loaded with premium features including leather seats, sunroof, and navigation.',
    category: 'Automotive',
    brand: 'BMW',
    condition: 'FAIRLY_USED',
    startingBid: 15000000,
    bidIncrement: 200000,
    reservePrice: 18000000,
    durationHours: 168,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  },
  {
    title: 'Canon EOS R5 Camera Body',
    description: 'Professional Canon EOS R5 mirrorless camera. 45MP full-frame sensor, 8K video capability. Perfect for professional photography. Barely used, includes all accessories.',
    category: 'Electronics & Gadgets',
    brand: 'Canon',
    condition: 'FAIRLY_USED',
    startingBid: 800000,
    bidIncrement: 25000,
    reservePrice: 950000,
    durationHours: 48,
    stateCode: 'LA',
    lgaCode: 'LA-IKJ'
  }
];

// Sample image URLs (using reliable placeholder service)
const SAMPLE_IMAGE_URLS = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3'
];

// Helper function to parse cookies from response headers
function parseCookies(response) {
  const rawCookies = response.headers.raw()['set-cookie'];
  if (!rawCookies) return '';

  return rawCookies.map(cookie => {
    // Extract just the cookie name=value part (before the first semicolon)
    return cookie.split(';')[0];
  }).join('; ');
}

// Helper function to make authenticated requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(cookies && { 'Cookie': cookies }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
  }

  return data;
}

// Login function
async function login() {
  console.log('🔐 Logging in...');
  try {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(CREDENTIALS)
    });

    // Store cookies from response
    cookies = parseCookies(response);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log('✅ Login successful!');
    return data;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
}

// Download image from URL
async function downloadImage(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer;
}

// Upload image to S3
async function uploadImage(imageBuffer, filename) {
  console.log(`  📤 Uploading image: ${filename}`);

  const formData = new FormData();
  formData.append('file', imageBuffer, filename);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Cookie': cookies,
      ...formData.getHeaders()
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status} - ${JSON.stringify(data)}`);
  }

  console.log(`  ✅ Image uploaded: ${data.key}`);
  return data.key;
}

// Upload multiple images
async function uploadImages(count = 3) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    try {
      const imageUrl = SAMPLE_IMAGE_URLS[i % SAMPLE_IMAGE_URLS.length];
      const imageBuffer = await downloadImage(imageUrl);
      const filename = `item-image-${Date.now()}-${i}.jpg`;
      const key = await uploadImage(imageBuffer, filename);
      keys.push(key);
    } catch (error) {
      console.error(`  ❌ Failed to upload image ${i}:`, error.message);
    }
  }
  return keys;
}

// Create a listed item
async function createListedItem(itemData) {
  console.log(`\n📦 Creating listed item: ${itemData.title}`);

  try {
    // Upload images
    const imageKeys = await uploadImages(3);

    if (imageKeys.length < 3) {
      console.log('  ⚠️  Warning: Less than 3 images uploaded, skipping item creation');
      return null;
    }

    // Create item
    const requestData = {
      title: itemData.title,
      description: itemData.description,
      imageKeys: imageKeys,
      acceptCash: itemData.acceptCash,
      cashAmount: itemData.cashAmount,
      stateCode: itemData.stateCode,
      lgaCode: itemData.lgaCode,
      condition: itemData.condition,
      brand: itemData.brand,
      itemCategory: itemData.category
    };

    const item = await makeRequest('/items', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    console.log(`✅ Listed item created successfully! ID: ${item.id}`);
    return item;
  } catch (error) {
    console.error(`❌ Failed to create listed item:`, error.message);
    return null;
  }
}

// Create an auction item
async function createAuctionItem(itemData) {
  console.log(`\n🔨 Creating auction item: ${itemData.title}`);

  try {
    // Upload images
    const imageKeys = await uploadImages(3);

    if (imageKeys.length < 3) {
      console.log('  ⚠️  Warning: Less than 3 images uploaded, skipping auction creation');
      return null;
    }

    // Calculate dates
    const startDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const endDate = new Date(startDate.getTime() + itemData.durationHours * 60 * 60 * 1000);

    // Create auction
    const requestData = {
      title: itemData.title,
      description: itemData.description,
      imageKeys: imageKeys,
      stateCode: itemData.stateCode,
      lgaCode: itemData.lgaCode,
      condition: itemData.condition,
      brand: itemData.brand,
      itemCategory: itemData.category,
      startingBid: itemData.startingBid,
      bidIncrement: itemData.bidIncrement,
      reservePrice: itemData.reservePrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      itemId: 0
    };

    const auction = await makeRequest('/v1/auction', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });

    console.log(`✅ Auction created successfully! ID: ${auction.id}`);
    return auction;
  } catch (error) {
    console.error(`❌ Failed to create auction:`, error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting item creation script...\n');

  try {
    // Login
    await login();

    // Create listed items
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 CREATING LISTED ITEMS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const createdItems = [];
    for (const itemData of LISTED_ITEMS) {
      const item = await createListedItem(itemData);
      if (item) {
        createdItems.push(item);
      }
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Create auction items
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔨 CREATING AUCTION ITEMS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const createdAuctions = [];
    for (const itemData of AUCTION_ITEMS) {
      const auction = await createAuctionItem(itemData);
      if (auction) {
        createdAuctions.push(auction);
      }
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Listed items created: ${createdItems.length}/${LISTED_ITEMS.length}`);
    console.log(`✅ Auction items created: ${createdAuctions.length}/${AUCTION_ITEMS.length}`);
    console.log('\n🎉 Script completed successfully!');

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
