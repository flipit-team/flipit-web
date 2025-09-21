// Run this script in your browser console while logged into the application

// Sample data for creating items
const sampleListedItems = [
  {
    title: "iPhone 14 Pro Max 256GB",
    description: "Excellent condition iPhone 14 Pro Max with 256GB storage. Comes with original box, charger, and protective case. Battery health 98%. No scratches or dents.",
    imageKeys: ["sample-phone-1.jpg", "sample-phone-2.jpg", "sample-phone-3.jpg"],
    acceptCash: true,
    cashAmount: 450000,
    location: "Ikeja, Lagos, Nigeria",
    condition: "NEW",
    brand: "Apple",
    itemCategories: ["Electronics"]
  },
  {
    title: "Samsung 4K Smart TV 55-inch",
    description: "Barely used Samsung 55-inch 4K UHD Smart TV with HDR support. Perfect picture quality. Includes original remote and wall mount.",
    imageKeys: ["sample-tv-1.jpg", "sample-tv-2.jpg", "sample-tv-3.jpg"],
    acceptCash: true,
    cashAmount: 320000,
    location: "Victoria Island, Lagos, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Samsung",
    itemCategories: ["Electronics"]
  },
  {
    title: "Nike Air Jordan 1 Size 42",
    description: "Classic Nike Air Jordan 1 in Chicago colorway. Size 42 (EU). Excellent condition with original box. Perfect for collectors and sneaker enthusiasts.",
    imageKeys: ["sample-shoes-1.jpg", "sample-shoes-2.jpg", "sample-shoes-3.jpg"],
    acceptCash: true,
    cashAmount: 85000,
    location: "Abuja, FCT, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Nike",
    itemCategories: ["Fashion"]
  },
  {
    title: "MacBook Air M2 2022",
    description: "Brand new MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Midnight color. Perfect for students and professionals. Still sealed in box.",
    imageKeys: ["sample-laptop-1.jpg", "sample-laptop-2.jpg", "sample-laptop-3.jpg"],
    acceptCash: true,
    cashAmount: 680000,
    location: "Port Harcourt, Rivers, Nigeria",
    condition: "NEW",
    brand: "Apple",
    itemCategories: ["Electronics"]
  }
];

const sampleAuctionItems = [
  {
    title: "Vintage Rolex Submariner Watch",
    description: "Authentic Rolex Submariner from 1998. Recently serviced with original papers and box. A true collector's piece in excellent condition.",
    imageKeys: ["sample-watch-1.jpg", "sample-watch-2.jpg", "sample-watch-3.jpg"],
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
    title: "Canon EOS R5 Professional Camera",
    description: "Professional Canon EOS R5 mirrorless camera body only. Excellent condition with low shutter count. Perfect for photographers and videographers.",
    imageKeys: ["sample-camera-1.jpg", "sample-camera-2.jpg", "sample-camera-3.jpg"],
    location: "Ibadan, Oyo, Nigeria",
    condition: "FAIRLY_USED",
    brand: "Canon",
    itemCategories: ["Electronics"],
    startingBid: 600000,
    bidIncrement: 25000,
    reservePrice: 800000,
    auctionDurationHours: 48
  },
  {
    title: "Gaming PC RTX 4080 Setup",
    description: "High-end gaming PC with RTX 4080, Intel i7-13700K, 32GB RAM, 1TB NVMe SSD. Perfect for gaming and content creation. Like new condition.",
    imageKeys: ["sample-pc-1.jpg", "sample-pc-2.jpg", "sample-pc-3.jpg"],
    location: "Kano, Kano, Nigeria",
    condition: "NEW",
    brand: "Custom Build",
    itemCategories: ["Electronics"],
    startingBid: 800000,
    bidIncrement: 30000,
    reservePrice: 1200000,
    auctionDurationHours: 96
  }
];

// Function to create listed items
async function createListedItems() {
  console.log('🛍️ Creating listed items...');

  for (const item of sampleListedItems) {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created: ${item.title}`);
      } else {
        const error = await response.json();
        console.error(`❌ Failed to create ${item.title}:`, error);
      }
    } catch (error) {
      console.error(`❌ Error creating ${item.title}:`, error);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Function to create auction items
async function createAuctionItems() {
  console.log('🔨 Creating auction items...');

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

      const itemResponse = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (!itemResponse.ok) {
        throw new Error(`Failed to create item: ${await itemResponse.text()}`);
      }

      const item = await itemResponse.json();
      console.log(`✅ Created item for auction: ${auction.title}`);

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));

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
        itemId: item.message?.id || item.id, // Handle different response formats
        title: auction.title,
        description: auction.description,
        imageKeys: auction.imageKeys,
        location: auction.location,
        condition: auction.condition,
        brand: auction.brand,
        itemCategories: auction.itemCategories
      };

      const auctionResponse = await fetch('/api/v1/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auctionData)
      });

      if (auctionResponse.ok) {
        console.log(`✅ Created auction: ${auction.title}`);
      } else {
        const error = await auctionResponse.json();
        console.error(`❌ Failed to create auction ${auction.title}:`, error);
      }

    } catch (error) {
      console.error(`❌ Error creating auction ${auction.title}:`, error);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Main function to create all sample data
async function createSampleData() {
  console.log('🚀 Starting sample data creation...\n');

  console.log('📝 Instructions:');
  console.log('1. Make sure you are logged in to the application');
  console.log('2. Open browser developer tools (F12)');
  console.log('3. Paste this entire script in the console');
  console.log('4. Call createSampleData() to start\n');

  try {
    await createListedItems();
    console.log('');
    await createAuctionItems();
    console.log('\n🎉 Sample data creation completed!');
    console.log('💡 Refresh your home page and live auction page to see the new items');
  } catch (error) {
    console.error('❌ Error during data creation:', error);
  }
}

// Usage instructions
console.log('📋 Sample Data Creator Loaded!');
console.log('');
console.log('To create sample data, run: createSampleData()');
console.log('');
console.log('This will create:');
console.log(`• ${sampleListedItems.length} listed items`);
console.log(`• ${sampleAuctionItems.length} auction items`);
console.log('');

// Export functions for manual use
window.createSampleData = createSampleData;
window.createListedItems = createListedItems;
window.createAuctionItems = createAuctionItems;