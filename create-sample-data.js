const API_BASE_URL = 'http://localhost:8080/api/v1';

// Sample data for creating items
const sampleListedItems = [
  {
    title: "iPhone 14 Pro Max 256GB",
    description: "Excellent condition iPhone 14 Pro Max with 256GB storage. Comes with original box, charger, and protective case. Battery health 98%. No scratches or dents.",
    imageKeys: ["iphone-14-1.jpg", "iphone-14-2.jpg", "iphone-14-3.jpg", "iphone-14-4.jpg"],
    acceptCash: true,
    cashAmount: 450000,
    location: "Ikeja, Lagos, Nigeria",
    condition: "NEW",
    brand: "Apple",
    itemCategories: ["Electronics"]
  },
  {
    title: "MacBook Pro 13-inch M2",
    description: "Brand new sealed MacBook Pro 13-inch with M2 chip, 8GB RAM, 256GB SSD. Space Gray color. Perfect for students and professionals.",
    imageKeys: ["macbook-1.jpg", "macbook-2.jpg", "macbook-3.jpg"],
    acceptCash: true,
    cashAmount: 850000,
    location: "Victoria Island, Lagos, Nigeria",
    condition: "NEW",
    brand: "Apple",
    itemCategories: ["Electronics"]
  },
  {
    title: "Samsung 55-inch 4K Smart TV",
    description: "Barely used Samsung 55-inch 4K UHD Smart TV with HDR support. Perfect picture quality. Includes original remote and wall mount.",
    imageKeys: ["samsung-tv-1.jpg", "samsung-tv-2.jpg", "samsung-tv-3.jpg"],
    acceptCash: true,
    cashAmount: 320000,
    location: "Abuja, FCT, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Samsung",
    itemCategories: ["Electronics"]
  },
  {
    title: "PlayStation 5 Console",
    description: "Brand new PlayStation 5 console with controller and charging dock. Comes with Spider-Man Miles Morales game. Still in warranty.",
    imageKeys: ["ps5-1.jpg", "ps5-2.jpg", "ps5-3.jpg", "ps5-4.jpg"],
    acceptCash: true,
    cashAmount: 280000,
    location: "Port Harcourt, Rivers, Nigeria",
    condition: "NEW",
    brand: "Sony",
    itemCategories: ["Electronics"]
  },
  {
    title: "Nike Air Force 1 White Size 42",
    description: "Classic Nike Air Force 1 in white leather. Size 42 (EU) / 8.5 (US). Worn only twice, excellent condition. Original box included.",
    imageKeys: ["nike-af1-1.jpg", "nike-af1-2.jpg", "nike-af1-3.jpg"],
    acceptCash: true,
    cashAmount: 35000,
    location: "Kano, Kano, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Nike",
    itemCategories: ["Fashion"]
  },
  {
    title: "Honda Civic 2018",
    description: "Well maintained Honda Civic 2018 model. 45,000km mileage. Full service history. AC working perfectly. First body paint.",
    imageKeys: ["civic-1.jpg", "civic-2.jpg", "civic-3.jpg", "civic-4.jpg"],
    acceptCash: true,
    cashAmount: 8500000,
    location: "Ikeja, Lagos, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Honda",
    itemCategories: ["Vehicles"]
  }
];

const sampleAuctionItems = [
  {
    title: "Vintage Rolex Submariner",
    description: "Authentic Rolex Submariner from 1995. Serviced recently. Comes with original papers and box. A collector's dream piece.",
    imageKeys: ["rolex-1.jpg", "rolex-2.jpg", "rolex-3.jpg", "rolex-4.jpg"],
    location: "Victoria Island, Lagos, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Rolex",
    itemCategories: ["Fashion"],
    startingBid: 1500000,
    bidIncrement: 50000,
    reservePrice: 2000000,
    auctionDurationHours: 72
  },
  {
    title: "MacBook Pro 16-inch M1 Max",
    description: "High-end MacBook Pro 16-inch with M1 Max chip, 32GB RAM, 1TB SSD. Perfect for video editing and design work. Minor wear on corners.",
    imageKeys: ["macbook-pro-1.jpg", "macbook-pro-2.jpg", "macbook-pro-3.jpg"],
    location: "Abuja, FCT, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Apple",
    itemCategories: ["Electronics"],
    startingBid: 800000,
    bidIncrement: 25000,
    reservePrice: 1100000,
    auctionDurationHours: 48
  },
  {
    title: "Canon EOS R5 Camera Kit",
    description: "Professional Canon EOS R5 mirrorless camera with 24-70mm f/2.8 lens. Includes batteries, memory cards, and professional bag.",
    imageKeys: ["canon-r5-1.jpg", "canon-r5-2.jpg", "canon-r5-3.jpg", "canon-r5-4.jpg"],
    location: "Ibadan, Oyo, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Canon",
    itemCategories: ["Electronics"],
    startingBid: 600000,
    bidIncrement: 20000,
    reservePrice: 850000,
    auctionDurationHours: 96
  },
  {
    title: "BMW X3 2020",
    description: "Luxury BMW X3 2020 model in excellent condition. 28,000km mileage. Full BMW service history. Panoramic roof, leather seats.",
    imageKeys: ["bmw-x3-1.jpg", "bmw-x3-2.jpg", "bmw-x3-3.jpg", "bmw-x3-4.jpg"],
    location: "Lagos Island, Lagos, Nigeria",
    condition: "FAIRLY_USED",
    brand: "BMW",
    itemCategories: ["Vehicles"],
    startingBid: 15000000,
    bidIncrement: 100000,
    reservePrice: 18000000,
    auctionDurationHours: 120
  }
];

// Function to make API call with authentication
async function makeAuthenticatedRequest(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // You'll need to add your auth token here
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
}

// Create listed items
async function createListedItems() {
  console.log('Creating listed items...');

  for (const item of sampleListedItems) {
    try {
      const result = await makeAuthenticatedRequest('/items', 'POST', item);
      console.log(`✅ Created listed item: ${item.title}`);
    } catch (error) {
      console.error(`❌ Failed to create item: ${item.title}`, error.message);
    }
  }
}

// Create auction items
async function createAuctionItems() {
  console.log('Creating auction items...');

  for (const auction of sampleAuctionItems) {
    try {
      // First create the item
      const itemData = {
        title: auction.title,
        description: auction.description,
        imageKeys: auction.imageKeys,
        acceptCash: false,
        cashAmount: 0,
        location: auction.location,
        condition: auction.condition,
        brand: auction.brand,
        itemCategories: auction.itemCategories
      };

      const item = await makeAuthenticatedRequest('/items', 'POST', itemData);
      console.log(`✅ Created item for auction: ${auction.title}`);

      // Calculate auction dates
      const startDate = new Date(Date.now() + 60 * 60 * 1000); // Start 1 hour from now
      const endDate = new Date(startDate.getTime() + auction.auctionDurationHours * 60 * 60 * 1000);

      // Then create the auction
      const auctionData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reservePrice: auction.reservePrice,
        bidIncrement: auction.bidIncrement,
        startingBid: auction.startingBid,
        itemId: item.id,
        title: auction.title,
        description: auction.description,
        imageKeys: auction.imageKeys,
        location: auction.location,
        condition: auction.condition,
        brand: auction.brand,
        itemCategories: auction.itemCategories
      };

      const auctionResult = await makeAuthenticatedRequest('/v1/auction', 'POST', auctionData);
      console.log(`✅ Created auction: ${auction.title}`);

    } catch (error) {
      console.error(`❌ Failed to create auction: ${auction.title}`, error.message);
    }
  }
}

// Main function
async function createSampleData() {
  console.log('🚀 Starting sample data creation...\n');

  console.log('⚠️  IMPORTANT: Make sure you:');
  console.log('1. Have the backend server running on localhost:8080');
  console.log('2. Are logged in and have an auth token');
  console.log('3. Update the Authorization header in this script\n');

  try {
    await createListedItems();
    console.log('\n');
    await createAuctionItems();
    console.log('\n✅ Sample data creation completed!');
  } catch (error) {
    console.error('❌ Error during data creation:', error);
  }
}

// Run the script
createSampleData();