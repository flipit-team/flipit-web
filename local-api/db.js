// In-memory database with file persistence
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const defaultData = () => ({
  users: [
    {
      id: 1, title: 'Mr', firstName: 'Michael', middleName: '', lastName: 'Davis',
      email: 'michael@flipit.ng', phoneNumber: '+2348012345678', password: 'password123',
      avatar: '', avgRating: 4.7, reviewCount: 12, status: 'ACTIVE',
      phoneNumberVerified: true, dateVerified: '2025-01-15T00:00:00', dateCreated: '2024-06-01T00:00:00',
      bio: 'Electronics trader in Lagos', idVerified: true,
      roles: [{ id: 1, name: 'USER', system: false }]
    },
    {
      id: 2, title: 'Mrs', firstName: 'Sarah', middleName: '', lastName: 'Johnson',
      email: 'sarah@flipit.ng', phoneNumber: '+2348098765432', password: 'password123',
      avatar: '', avgRating: 4.2, reviewCount: 8, status: 'ACTIVE',
      phoneNumberVerified: true, dateVerified: '2025-02-10T00:00:00', dateCreated: '2024-07-15T00:00:00',
      bio: 'Fashion and accessories', idVerified: false,
      roles: [{ id: 1, name: 'USER', system: false }]
    },
    {
      id: 3, title: 'Mr', firstName: 'Admin', middleName: '', lastName: 'User',
      email: 'admin@flipit.ng', phoneNumber: '+2348011111111', password: 'admin123',
      avatar: '', avgRating: 5.0, reviewCount: 0, status: 'ACTIVE',
      phoneNumberVerified: true, dateVerified: '2024-01-01T00:00:00', dateCreated: '2024-01-01T00:00:00',
      bio: 'Platform administrator', idVerified: true,
      roles: [{ id: 2, name: 'ADMIN', system: true }]
    }
  ],

  categories: [
    { name: 'Electronics & Gadgets', description: 'Phones, laptops, cameras', thumbnail: '', brands: ['Apple', 'Samsung', 'Sony', 'Canon', 'HP'], subcategories: ['Phones', 'Laptops', 'Cameras', 'Tablets', 'Accessories'] },
    { name: 'Fashion', description: 'Clothing and accessories', thumbnail: '', brands: ['Nike', 'Adidas', 'Gucci', 'Zara', 'Coach'], subcategories: ['Men', 'Women', 'Shoes', 'Bags', 'Watches'] },
    { name: 'Home Appliances', description: 'Home electronics and appliances', thumbnail: '', brands: ['LG', 'Samsung', 'Hisense', 'Thermocool'], subcategories: ['Kitchen', 'Laundry', 'Cooling', 'Cleaning'] },
    { name: 'Vehicles', description: 'Cars, bikes, and parts', thumbnail: '', brands: ['Toyota', 'Honda', 'Mercedes', 'BMW'], subcategories: ['Cars', 'Motorcycles', 'Parts', 'Accessories'] },
    { name: 'Furniture', description: 'Home and office furniture', thumbnail: '', brands: [], subcategories: ['Living Room', 'Bedroom', 'Office', 'Outdoor'] },
    { name: 'Sports & Games', description: 'Sports equipment and games', thumbnail: '', brands: ['Nike', 'Adidas', 'Puma'], subcategories: ['Football', 'Basketball', 'Gaming', 'Fitness'] },
  ],

  itemConditions: ['NEW', 'LIKE_NEW', 'FAIRLY_USED', 'USED', 'FOR_PARTS'],

  items: [
    {
      id: 1, title: 'Canon EOS RP Camera + Small Rig', description: 'High-quality mirrorless camera with small rig cage. Perfect for videography and photography.',
      imageUrls: ['https://picsum.photos/seed/item1/600/400'], acceptCash: true, cashAmount: 1300000,
      location: 'Lagos, Nigeria', condition: 'FAIRLY_USED', brand: 'Canon', sold: false, delivered: false,
      liked: false, published: true, promoted: false, dateCreated: '2025-05-01T10:00:00',
      itemCategory: { name: 'Electronics & Gadgets', description: 'Phones, laptops, cameras', thumbnail: '', subcategories: ['Cameras'] },
      subcategory: 'Cameras', seller: { id: 1 }, stateCode: 'LA', lgaCode: 'IKJ'
    },
    {
      id: 2, title: 'iPhone 15 Pro Max 256GB', description: 'Brand new iPhone 15 Pro Max, Natural Titanium color. Never used.',
      imageUrls: ['https://picsum.photos/seed/item2/600/400'], acceptCash: true, cashAmount: 950000,
      location: 'Abuja, Nigeria', condition: 'NEW', brand: 'Apple', sold: false, delivered: false,
      liked: false, published: true, promoted: true, dateCreated: '2025-05-10T14:00:00',
      itemCategory: { name: 'Electronics & Gadgets', description: 'Phones, laptops, cameras', thumbnail: '', subcategories: ['Phones'] },
      subcategory: 'Phones', seller: { id: 2 }, stateCode: 'FC', lgaCode: 'ABJ'
    },
    {
      id: 3, title: 'Sony A7III Full Frame Camera', description: 'Sony Alpha A7III with 28-70mm kit lens. Excellent condition.',
      imageUrls: ['https://picsum.photos/seed/item3/600/400'], acceptCash: false, cashAmount: 0,
      location: 'Lagos, Nigeria', condition: 'LIKE_NEW', brand: 'Sony', sold: false, delivered: false,
      liked: false, published: true, promoted: false, dateCreated: '2025-05-15T09:00:00',
      itemCategory: { name: 'Electronics & Gadgets', description: 'Phones, laptops, cameras', thumbnail: '', subcategories: ['Cameras'] },
      subcategory: 'Cameras', seller: { id: 1 }, stateCode: 'LA', lgaCode: 'VIC'
    },
    {
      id: 4, title: 'Coach Tabby 26 Shoulder Bag', description: 'Authentic Coach Tabby 26 in brown leather. Barely used.',
      imageUrls: ['https://picsum.photos/seed/item4/600/400'], acceptCash: true, cashAmount: 280000,
      location: 'Port Harcourt, Nigeria', condition: 'LIKE_NEW', brand: 'Coach', sold: false, delivered: false,
      liked: false, published: true, promoted: false, dateCreated: '2025-05-20T11:00:00',
      itemCategory: { name: 'Fashion', description: 'Clothing and accessories', thumbnail: '', subcategories: ['Bags'] },
      subcategory: 'Bags', seller: { id: 2 }, stateCode: 'RV', lgaCode: 'PHC'
    },
    {
      id: 5, title: 'MacBook Pro 16" M3 Max 1TB', description: 'Top spec MacBook Pro M3 Max, 36GB RAM, 1TB SSD. Space Black. AppleCare+ until 2027.',
      imageUrls: ['https://picsum.photos/seed/item5/600/400'], acceptCash: true, cashAmount: 1800000,
      location: 'Lagos, Nigeria', condition: 'LIKE_NEW', brand: 'Apple', sold: false, delivered: false,
      liked: false, published: true, promoted: true, dateCreated: '2025-04-15T08:00:00',
      itemCategory: { name: 'Electronics & Gadgets', description: 'Phones, laptops, cameras', thumbnail: '', subcategories: ['Laptops'] },
      subcategory: 'Laptops', seller: { id: 1 }, stateCode: 'LA', lgaCode: 'VIC'
    },
    {
      id: 6, title: 'PlayStation 5 Slim + 2 Controllers', description: 'PS5 Slim disc edition with extra DualSense controller. Comes with FIFA 25 and GTA V.',
      imageUrls: ['https://picsum.photos/seed/item6/600/400'], acceptCash: true, cashAmount: 450000,
      location: 'Abuja, Nigeria', condition: 'FAIRLY_USED', brand: 'Sony', sold: false, delivered: false,
      liked: false, published: true, promoted: false, dateCreated: '2025-05-05T12:00:00',
      itemCategory: { name: 'Sports & Games', description: 'Sports equipment and games', thumbnail: '', subcategories: ['Gaming'] },
      subcategory: 'Gaming', seller: { id: 2 }, stateCode: 'FC', lgaCode: 'ABJ'
    },
    {
      id: 7, title: 'Samsung 75" Neo QLED 4K Smart TV', description: 'Samsung QN85B 75-inch Neo QLED. Stunning picture quality. Wall mount included.',
      imageUrls: ['https://picsum.photos/seed/item7/600/400'], acceptCash: true, cashAmount: 1500000,
      location: 'Lagos, Nigeria', condition: 'NEW', brand: 'Samsung', sold: false, delivered: false,
      liked: false, published: true, promoted: true, dateCreated: '2025-04-28T10:00:00',
      itemCategory: { name: 'Home Appliances', description: 'Home electronics and appliances', thumbnail: '', subcategories: ['Living Room'] },
      subcategory: 'Living Room', seller: { id: 1 }, stateCode: 'LA', lgaCode: 'LKI'
    },
    {
      id: 8, title: 'Nike Air Jordan 1 Retro High OG', description: 'Brand new, deadstock. Size 43 EU. Chicago colorway. Comes with original box and receipt.',
      imageUrls: ['https://picsum.photos/seed/item8/600/400'], acceptCash: true, cashAmount: 180000,
      location: 'Enugu, Nigeria', condition: 'NEW', brand: 'Nike', sold: false, delivered: false,
      liked: false, published: true, promoted: false, dateCreated: '2025-05-22T16:00:00',
      itemCategory: { name: 'Fashion', description: 'Clothing and accessories', thumbnail: '', subcategories: ['Shoes'] },
      subcategory: 'Shoes', seller: { id: 2 }, stateCode: 'EN', lgaCode: 'ENN'
    },
  ],

  auctions: [
    {
      id: 1, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE', reservePrice: 1500000, bidIncrement: 50000, startingBid: 1000000,
      item: { id: 5 }, biddingsCount: 3, biddings: []
    },
    {
      id: 2, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE', reservePrice: 800000, bidIncrement: 25000, startingBid: 500000,
      item: { id: 6 }, biddingsCount: 2, biddings: []
    },
    {
      id: 3, startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ENDED', reservePrice: 2000000, bidIncrement: 100000, startingBid: 1200000,
      item: { id: 7 }, biddingsCount: 2, biddings: []
    },
    {
      id: 4, startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE', reservePrice: 350000, bidIncrement: 10000, startingBid: 200000,
      item: { id: 8 }, biddingsCount: 4, biddings: []
    },
  ],

  biddings: [
    // Auction 1: Michael outbid by Sarah
    { auctionId: 1, bidder: { id: 1 }, amount: 1100000, bidTime: '2025-06-01T10:00:00' },
    { auctionId: 1, bidder: { id: 2 }, amount: 1200000, bidTime: '2025-06-01T12:00:00' },
    // Auction 2: Michael is highest (pending — auction still active)
    { auctionId: 2, bidder: { id: 2 }, amount: 525000, bidTime: '2025-06-02T09:00:00' },
    { auctionId: 2, bidder: { id: 1 }, amount: 600000, bidTime: '2025-06-02T11:00:00' },
    // Auction 3: Michael is highest on ended auction (won)
    { auctionId: 3, bidder: { id: 2 }, amount: 1500000, bidTime: '2025-06-03T08:00:00' },
    { auctionId: 3, bidder: { id: 1 }, amount: 1700000, bidTime: '2025-06-03T11:00:00' },
    // Auction 4: Michael outbid by Sarah
    { auctionId: 4, bidder: { id: 1 }, amount: 250000, bidTime: '2025-06-04T14:00:00' },
    { auctionId: 4, bidder: { id: 2 }, amount: 270000, bidTime: '2025-06-04T17:00:00' },
  ],

  offers: [
    { id: 1, withCash: true, cashAmount: 200000, status: 'PENDING', sentBy: { id: 2 }, item: { id: 1 }, offeredItem: { id: 4 }, dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 2, withCash: false, cashAmount: 0, status: 'PENDING', sentBy: { id: 2 }, item: { id: 3 }, offeredItem: { id: 2 }, dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 3, withCash: true, cashAmount: 850000, status: 'ACCEPTED', sentBy: { id: 2 }, item: { id: 2 }, offeredItem: null, dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 4, withCash: true, cashAmount: 1100000, status: 'PENDING', sentBy: { id: 1 }, item: { id: 4 }, offeredItem: { id: 3 }, dateCreated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 5, withCash: false, cashAmount: 0, status: 'REJECTED', sentBy: { id: 1 }, item: { id: 2 }, offeredItem: { id: 1 }, dateCreated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: 6, withCash: true, cashAmount: 300000, status: 'PENDING', sentBy: { id: 1 }, item: { id: 6 }, offeredItem: null, dateCreated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 7, withCash: true, cashAmount: 250000, status: 'ACCEPTED', sentBy: { id: 1 }, item: { id: 4 }, offeredItem: null, dateCreated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    { id: 8, withCash: false, cashAmount: 0, status: 'ACCEPTED', sentBy: { id: 2 }, item: { id: 1 }, offeredItem: { id: 8 }, dateCreated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    { id: 9, withCash: true, cashAmount: 900000, status: 'ACCEPTED', sentBy: { id: 1 }, item: { id: 8 }, offeredItem: { id: 3 }, dateCreated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  ],
  transactions: [],
  reviews: [],
  chats: [
    { chatId: 'chat-1', title: 'Canon EOS RP Camera', initiatorId: 1, receiverId: 2, initiatorAvatar: '', receiverAvatar: '', initiatorName: 'Michael Davis', receiverName: 'Sarah Johnson', dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { chatId: 'chat-2', title: 'iPhone 15 Pro Max', initiatorId: 2, receiverId: 1, initiatorAvatar: '', receiverAvatar: '', initiatorName: 'Sarah Johnson', receiverName: 'Michael Davis', dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { chatId: 'chat-3', title: 'Coach Tabby 26 Bag', initiatorId: 1, receiverId: 2, initiatorAvatar: '', receiverAvatar: '', initiatorName: 'Michael Davis', receiverName: 'Sarah Johnson', dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  ],
  messages: [
    { message: 'Hi, is the Canon camera still available?', sentBy: 1, chatId: 'chat-1', readByReceiver: true, dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { message: 'Yes it is! Are you interested?', sentBy: 2, chatId: 'chat-1', readByReceiver: true, dateCreated: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString() },
    { message: 'Can I see more videos of the item?', sentBy: 1, chatId: 'chat-1', readByReceiver: false, dateCreated: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
    { message: 'Sure! I will send them shortly', sentBy: 2, chatId: 'chat-1', readByReceiver: false, dateCreated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { message: 'Hello, I want to buy the iPhone', sentBy: 2, chatId: 'chat-2', readByReceiver: false, dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { message: 'Great! It is still available. What is your offer?', sentBy: 1, chatId: 'chat-2', readByReceiver: false, dateCreated: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString() },
    { message: 'I can do 900k, is that okay?', sentBy: 2, chatId: 'chat-2', readByReceiver: false, dateCreated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { message: 'Hi, is the Coach bag authentic?', sentBy: 1, chatId: 'chat-3', readByReceiver: true, dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { message: 'Yes 100% authentic. I have the receipt', sentBy: 2, chatId: 'chat-3', readByReceiver: true, dateCreated: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
    { message: 'Can you do 250k?', sentBy: 1, chatId: 'chat-3', readByReceiver: false, dateCreated: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
  ],
  notifications: [],
  likes: [],
  states: [
    { name: 'Lagos', code: 'LA', lgas: [{ name: 'Ikeja', code: 'IKJ' }, { name: 'Victoria Island', code: 'VIC' }, { name: 'Lekki', code: 'LKI' }, { name: 'Surulere', code: 'SUR' }] },
    { name: 'Abuja', code: 'FC', lgas: [{ name: 'Abuja Municipal', code: 'ABJ' }, { name: 'Gwagwalada', code: 'GWG' }] },
    { name: 'Rivers', code: 'RV', lgas: [{ name: 'Port Harcourt', code: 'PHC' }, { name: 'Obio-Akpor', code: 'OAK' }] },
    { name: 'Enugu', code: 'EN', lgas: [{ name: 'Enugu North', code: 'ENN' }, { name: 'Enugu South', code: 'ENS' }] },
    { name: 'Oyo', code: 'OY', lgas: [{ name: 'Ibadan North', code: 'IBN' }, { name: 'Ibadan South', code: 'IBS' }] },
  ],
  roles: [
    { id: 1, name: 'USER', system: false },
    { id: 2, name: 'ADMIN', system: true }
  ]
});

let db;

function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } else {
      db = defaultData();
      save();
    }
  } catch {
    db = defaultData();
    save();
  }
  return db;
}

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function reset() {
  db = defaultData();
  save();
  return db;
}

function get() {
  if (!db) load();
  return db;
}

module.exports = { load, save, reset, get };
