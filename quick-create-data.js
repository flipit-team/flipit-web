// QUICK SAMPLE DATA CREATOR
// Copy this entire script, paste in browser console while logged in, then run: quickCreate()

async function quickCreate() {
  console.log('🚀 Creating sample data...');

  // Listed Items
  const items = [
    {
      title: "iPhone 14 Pro Max 256GB",
      description: "Excellent condition iPhone 14 Pro Max with 256GB storage. Comes with original box, charger, and protective case. Battery health 98%. No scratches or dents.",
      imageKeys: ["phone1.jpg", "phone2.jpg", "phone3.jpg"],
      acceptCash: true,
      cashAmount: 450000,
      location: "Ikeja, Lagos, Nigeria",
      condition: "NEW",
      brand: "Apple",
      itemCategories: ["Electronics"]
    },
    {
      title: "Samsung 55-inch 4K Smart TV",
      description: "Barely used Samsung 55-inch 4K UHD Smart TV with HDR support. Perfect picture quality.",
      imageKeys: ["tv1.jpg", "tv2.jpg", "tv3.jpg"],
      acceptCash: true,
      cashAmount: 320000,
      location: "Victoria Island, Lagos, Nigeria",
      condition: "FAIRLY_USED",
      brand: "Samsung",
      itemCategories: ["Electronics"]
    },
    {
      title: "Nike Air Jordan 1 Chicago",
      description: "Classic Nike Air Jordan 1 in Chicago colorway. Size 42. Excellent condition with original box.",
      imageKeys: ["shoes1.jpg", "shoes2.jpg", "shoes3.jpg"],
      acceptCash: true,
      cashAmount: 85000,
      location: "Abuja, FCT, Nigeria",
      condition: "FAIRLY_USED",
      brand: "Nike",
      itemCategories: ["Fashion"]
    }
  ];

  // Create listed items
  for (const item of items) {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        console.log(`✅ Created: ${item.title}`);
      } else {
        console.log(`❌ Failed: ${item.title}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${item.title}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  // Create auction items
  const auctions = [
    {
      title: "Rolex Submariner Vintage",
      description: "Authentic Rolex Submariner from 1998. Recently serviced with original papers.",
      imageKeys: ["watch1.jpg", "watch2.jpg", "watch3.jpg"],
      location: "Victoria Island, Lagos, Nigeria",
      condition: "FAIRLY_USED",
      brand: "Rolex",
      itemCategories: ["Fashion"],
      startingBid: 1500000,
      bidIncrement: 50000,
      hours: 72
    },
    {
      title: "Canon EOS R5 Camera",
      description: "Professional Canon EOS R5 mirrorless camera. Excellent condition with low shutter count.",
      imageKeys: ["camera1.jpg", "camera2.jpg", "camera3.jpg"],
      location: "Abuja, FCT, Nigeria",
      condition: "FAIRLY_USED",
      brand: "Canon",
      itemCategories: ["Electronics"],
      startingBid: 600000,
      bidIncrement: 25000,
      hours: 48
    }
  ];

  for (const auction of auctions) {
    try {
      // Create item first
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

      const itemRes = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (itemRes.ok) {
        const item = await itemRes.json();
        console.log(`✅ Created item: ${auction.title}`);

        await new Promise(r => setTimeout(r, 500));

        // Create auction
        const startDate = new Date(Date.now() + 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + auction.hours * 60 * 60 * 1000);

        const auctionData = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reservePrice: auction.startingBid * 1.5,
          bidIncrement: auction.bidIncrement,
          startingBid: auction.startingBid,
          itemId: item.message?.id || item.id,
          title: auction.title,
          description: auction.description,
          imageKeys: auction.imageKeys,
          location: auction.location,
          condition: auction.condition,
          brand: auction.brand,
          itemCategories: auction.itemCategories
        };

        const auctionRes = await fetch('/api/v1/auction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auctionData)
        });

        if (auctionRes.ok) {
          console.log(`✅ Created auction: ${auction.title}`);
        } else {
          console.log(`❌ Failed auction: ${auction.title}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error with auction: ${auction.title}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('🎉 Done! Refresh your pages to see the data.');
}

console.log('📋 Sample data creator loaded!');
console.log('🚀 Run: quickCreate()');