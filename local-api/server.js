const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'flipit-local-dev-secret';
const upload = multer({ dest: '/tmp/flipit-uploads/' });

app.use(cors());
app.use(express.json());

// ============ HELPERS ============

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email, roles: user.roles.map(r => r.name) }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ apierror: { message: 'Authentication required' } });
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ apierror: { message: 'Invalid or expired token' } });
  }
}

function getUserDTO(user) {
  if (!user) return null;
  const { password, roles, ...dto } = typeof user === 'object' && user.id ? user : db.get().users.find(u => u.id === user) || {};
  return dto;
}

function getItemDTO(item) {
  if (!item) return null;
  const data = db.get();
  const seller = getUserDTO(data.users.find(u => u.id === (item.seller?.id || item.seller)));
  return { ...item, seller, itemCategory: item.itemCategory || { name: 'General', description: '' } };
}

let nextId = { item: 100, user: 100, offer: 100, tx: 100, chat: 100, auction: 100, notification: 100, review: 100, bid: 100 };

// ============ PING ============

app.get('/', (req, res) => res.json({ message: 'Flipit Local API running' }));
app.get('/checkJwt', authMiddleware, (req, res) => res.json({ message: 'Token valid', userId: req.user.userId }));

// ============ AUTH ============

app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  const data = db.get();
  const user = data.users.find(u => (u.email === username) && u.password === password);
  if (!user) return res.status(401).json({ apierror: { message: 'Invalid credentials' } });
  res.json({ jwt: generateToken(user), user: getUserDTO(user) });
});

app.post('/api/v1/auth/logout', (req, res) => res.json({ message: 'Logged out' }));

app.post('/api/v1/auth/forgot-password', (req, res) => {
  res.json({ message: 'Password reset email sent' });
});

app.post('/api/v1/auth/reset-password', (req, res) => {
  res.json({ message: 'Password reset successful' });
});

app.get('/api/v1/auth/login/google', (req, res) => {
  res.json({ url: `http://localhost:${PORT}/api/v1/auth/google/callback?code=mock-google-code` });
});

app.get('/api/v1/auth/google/callback', (req, res) => {
  const data = db.get();
  const user = data.users[0];
  res.json({ jwt: generateToken(user), user: getUserDTO(user) });
});

app.get('/api/v1/auth/roles', (req, res) => res.json(db.get().roles));

// ============ USER ============

app.post('/api/v1/user/signup', (req, res) => {
  const data = db.get();
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ apierror: { message: 'Email already registered' } });
  }
  const id = nextId.user++;
  const user = {
    id, title: '', firstName, middleName: '', lastName, email, phoneNumber, password,
    avatar: '', avgRating: 0, reviewCount: 0, status: 'ACTIVE',
    phoneNumberVerified: false, dateVerified: '', dateCreated: new Date().toISOString(),
    bio: '', idVerified: false, roles: [{ id: 1, name: 'USER', system: false }]
  };
  data.users.push(user);
  db.save();
  res.json({ jwt: generateToken(user), user: getUserDTO(user) });
});

app.get('/api/v1/user/profile', authMiddleware, (req, res) => {
  const user = db.get().users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ apierror: { message: 'User not found' } });
  res.json(getUserDTO(user));
});

app.put('/api/v1/user/update-profile', authMiddleware, (req, res) => {
  const data = db.get();
  const user = data.users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ apierror: { message: 'User not found' } });
  if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
  if (req.body.avatar) user.avatar = req.body.avatar;
  db.save();
  res.json(getUserDTO(user));
});

app.post('/api/v1/user/change-password', authMiddleware, (req, res) => {
  const data = db.get();
  const user = data.users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ apierror: { message: 'User not found' } });
  user.password = req.body.newPassword;
  db.save();
  res.json({ message: 'Password changed successfully' });
});

app.get('/api/v1/user/performance', authMiddleware, (req, res) => {
  res.json({ impressionsCount: 245, visitorsCount: 128, phoneViewsCount: 34, chatRequestsCount: 18 });
});

app.get('/api/v1/user/findAll', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 15;
  const users = db.get().users.map(getUserDTO);
  res.json({ content: users.slice(page * size, (page + 1) * size), totalElements: users.length, totalPages: Math.ceil(users.length / size) });
});

app.get('/api/v1/user/:id', (req, res) => {
  const user = db.get().users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ apierror: { message: 'User not found' } });
  res.json(getUserDTO(user));
});

app.put('/api/v1/user/:id', authMiddleware, (req, res) => {
  const data = db.get();
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ apierror: { message: 'User not found' } });
  Object.assign(user, req.body);
  db.save();
  res.json(getUserDTO(user));
});

app.delete('/api/v1/user/:id', authMiddleware, (req, res) => {
  const data = db.get();
  data.users = data.users.filter(u => u.id !== parseInt(req.params.id));
  db.save();
  res.json({ message: 'User deleted' });
});

app.put('/api/v1/user/:id/deactivateUser', authMiddleware, (req, res) => {
  const user = db.get().users.find(u => u.id === parseInt(req.params.id));
  if (user) { user.status = 'INACTIVE'; db.save(); }
  res.json({ message: 'User deactivated' });
});

app.put('/api/v1/user/:id/reactivateUser', authMiddleware, (req, res) => {
  const user = db.get().users.find(u => u.id === parseInt(req.params.id));
  if (user) { user.status = 'ACTIVE'; db.save(); }
  res.json({ message: 'User reactivated' });
});

app.get('/api/v1/user/:id/verify-email', (req, res) => {
  res.json({ message: 'Email verified' });
});

app.post('/api/v1/user/:id/verify-phoneNumber', (req, res) => {
  const user = db.get().users.find(u => u.id === parseInt(req.params.id));
  if (user) { user.phoneNumberVerified = true; db.save(); }
  res.json({ message: 'Phone verified' });
});

app.post('/api/v1/user/:id/verifyProfile', authMiddleware, upload.single('file'), (req, res) => {
  res.json({ message: 'Profile verification submitted' });
});

// ============ ITEMS ============

app.get('/api/v1/items', (req, res) => {
  const data = db.get();
  let items = data.items.filter(i => i.published && !i.sold);
  const { search, category, subcategory, stateCode, lgaCode, sort, minAmount, maxAmount, page = 0, size = 15 } = req.query;
  if (search) items = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  if (category) items = items.filter(i => i.itemCategory?.name === category);
  if (subcategory) items = items.filter(i => i.subcategory === subcategory);
  if (stateCode) items = items.filter(i => i.stateCode === stateCode);
  if (minAmount) items = items.filter(i => i.cashAmount >= parseInt(minAmount));
  if (maxAmount) items = items.filter(i => i.cashAmount <= parseInt(maxAmount));
  if (sort === 'low-high') items.sort((a, b) => a.cashAmount - b.cashAmount);
  if (sort === 'high-low') items.sort((a, b) => b.cashAmount - a.cashAmount);
  const p = parseInt(page), s = parseInt(size);
  const paged = items.slice(p * s, (p + 1) * s);
  res.json({ content: paged.map(getItemDTO), totalElements: items.length, totalPages: Math.ceil(items.length / s), number: p, size: s, first: p === 0, last: (p + 1) * s >= items.length, empty: paged.length === 0 });
});

app.post('/api/v1/items', authMiddleware, (req, res) => {
  const data = db.get();
  const id = nextId.item++;
  const item = { id, ...req.body, imageUrls: req.body.imageKeys || [], seller: { id: req.user.userId }, sold: false, delivered: false, liked: false, published: true, promoted: false, dateCreated: new Date().toISOString(), location: `${req.body.stateCode || ''}, Nigeria` };
  data.items.push(item);
  db.save();
  res.json(getItemDTO(item));
});

app.get('/api/v1/items/categories', (req, res) => res.json(db.get().categories));
app.get('/api/v1/items/itemConditions', (req, res) => res.json(db.get().itemConditions));

app.get('/api/v1/items/user/:userId', authMiddleware, (req, res) => {
  const items = db.get().items.filter(i => (i.seller?.id || i.seller) === parseInt(req.params.userId));
  res.json(items.map(getItemDTO));
});

app.get('/api/v1/items/:id', (req, res) => {
  const item = db.get().items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ apierror: { message: 'Item not found' } });
  res.json(getItemDTO(item));
});

app.put('/api/v1/items/:id', authMiddleware, (req, res) => {
  const data = db.get();
  const item = data.items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ apierror: { message: 'Item not found' } });
  Object.assign(item, req.body);
  if (req.body.imageKeys) item.imageUrls = req.body.imageKeys;
  db.save();
  res.json(getItemDTO(item));
});

app.delete('/api/v1/items/:id', authMiddleware, (req, res) => {
  const data = db.get();
  data.items = data.items.filter(i => i.id !== parseInt(req.params.id));
  db.save();
  res.json({ message: 'Item deleted' });
});

app.put('/api/v1/items/:id/markAsSold', authMiddleware, (req, res) => {
  const item = db.get().items.find(i => i.id === parseInt(req.params.id));
  if (item) { item.sold = true; db.save(); }
  res.json(getItemDTO(item));
});

// ============ LIKES ============

app.get('/api/v1/likes/items', authMiddleware, (req, res) => {
  const data = db.get();
  const likedIds = data.likes.filter(l => l.userId === req.user.userId).map(l => l.itemId);
  const items = data.items.filter(i => likedIds.includes(i.id));
  res.json(items.map(i => getItemDTO({ ...i, liked: true })));
});

app.post('/api/v1/likes/items/:itemId', authMiddleware, (req, res) => {
  const data = db.get();
  data.likes.push({ userId: req.user.userId, itemId: parseInt(req.params.itemId) });
  db.save();
  res.json({ message: 'Item liked' });
});

app.delete('/api/v1/likes/items/:itemId', authMiddleware, (req, res) => {
  const data = db.get();
  data.likes = data.likes.filter(l => !(l.userId === req.user.userId && l.itemId === parseInt(req.params.itemId)));
  db.save();
  res.json({ message: 'Item unliked' });
});

// ============ OFFERS ============

app.post('/api/v1/offer', authMiddleware, (req, res) => {
  const data = db.get();
  const id = nextId.offer++;
  const item = data.items.find(i => i.id === req.body.itemId);
  const offeredItem = req.body.offeredItemId ? data.items.find(i => i.id === req.body.offeredItemId) : null;
  const offer = { id, withCash: req.body.withCash || false, cashAmount: req.body.cashAmount || 0, status: 'PENDING', sentBy: getUserDTO(data.users.find(u => u.id === req.user.userId)), item: getItemDTO(item), offeredItem: offeredItem ? getItemDTO(offeredItem) : null, dateCreated: new Date().toISOString() };
  data.offers.push(offer);
  db.save();
  res.json(offer);
});

app.get('/api/v1/offer/:offerId', authMiddleware, (req, res) => {
  const offer = db.get().offers.find(o => o.id === parseInt(req.params.offerId));
  if (!offer) return res.status(404).json({ apierror: { message: 'Offer not found' } });
  res.json(resolveOffer(offer));
});

app.delete('/api/v1/offer/:offerId', authMiddleware, (req, res) => {
  const data = db.get();
  data.offers = data.offers.filter(o => o.id !== parseInt(req.params.offerId));
  db.save();
  res.json({ message: 'Offer deleted' });
});

app.post('/api/v1/offer/:offerId/accept', authMiddleware, (req, res) => {
  const offer = db.get().offers.find(o => o.id === parseInt(req.params.offerId));
  if (!offer) return res.status(404).json({ apierror: { message: 'Offer not found' } });
  offer.status = 'ACCEPTED';
  db.save();
  res.json(resolveOffer(offer));
});

app.post('/api/v1/offer/:offerId/reject', authMiddleware, (req, res) => {
  const offer = db.get().offers.find(o => o.id === parseInt(req.params.offerId));
  if (!offer) return res.status(404).json({ apierror: { message: 'Offer not found' } });
  offer.status = 'REJECTED';
  db.save();
  res.json(resolveOffer(offer));
});

app.get('/api/v1/offer/items/:itemId/offers', authMiddleware, (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const offers = db.get().offers.filter(o => (o.item?.id || o.item) === itemId);
  res.json(offers.map(resolveOffer));
});

function resolveOffer(o) {
  const data = db.get();
  const sentBy = getUserDTO(data.users.find(u => u.id === (o.sentBy?.id || o.sentBy)));
  const item = getItemDTO(data.items.find(i => i.id === (o.item?.id || o.item)));
  const offeredItem = o.offeredItem ? getItemDTO(data.items.find(i => i.id === (o.offeredItem?.id || o.offeredItem))) : null;
  return { ...o, sentBy, item, offeredItem };
}

app.get('/api/v1/offer/user/:userId/sent', authMiddleware, (req, res) => {
  const offers = db.get().offers.filter(o => (o.sentBy?.id || o.sentBy) === parseInt(req.params.userId));
  res.json(offers.map(resolveOffer));
});

app.get('/api/v1/offer/user/:userId/received', authMiddleware, (req, res) => {
  const userId = parseInt(req.params.userId);
  const data = db.get();
  const offers = data.offers.filter(o => {
    const item = data.items.find(i => i.id === (o.item?.id || o.item));
    return item && (item.seller?.id || item.seller) === userId;
  });
  res.json(offers.map(resolveOffer));
});

// ============ TRANSACTIONS ============

app.post('/api/v1/transactions', authMiddleware, (req, res) => {
  const data = db.get();
  const id = nextId.tx++;
  const buyer = getUserDTO(data.users.find(u => u.id === req.body.buyerId));
  const seller = getUserDTO(data.users.find(u => u.id === req.body.sellerId));
  const tx = { id, orderId: req.body.orderId || id, buyer, seller, amount: req.body.amount || 0, reference: `FLPT-${id}`, transactionDate: new Date().toISOString(), status: 'PENDING', type: req.body.type || 'CASH_ONLY', paymentMethod: req.body.paymentMethod || '', description: req.body.description || '' };
  data.transactions.push(tx);
  db.save();
  res.json(tx);
});

app.get('/api/v1/transactions/me', authMiddleware, (req, res) => {
  const txs = db.get().transactions.filter(t => t.buyer?.id === req.user.userId || t.seller?.id === req.user.userId);
  res.json(txs);
});

app.get('/api/v1/transactions/:id', authMiddleware, (req, res) => {
  const tx = db.get().transactions.find(t => t.id === parseInt(req.params.id));
  if (!tx) return res.status(404).json({ apierror: { message: 'Transaction not found' } });
  res.json(tx);
});

const txStatusUpdate = (newStatus) => (req, res) => {
  const tx = db.get().transactions.find(t => t.id === parseInt(req.params.id));
  if (!tx) return res.status(404).json({ apierror: { message: 'Transaction not found' } });
  tx.status = newStatus;
  db.save();
  res.json(tx);
};

app.put('/api/v1/transactions/:id/cancel', authMiddleware, txStatusUpdate('CANCELLED'));
app.put('/api/v1/transactions/:id/complete', authMiddleware, txStatusUpdate('COMPLETED'));
app.put('/api/v1/transactions/:id/confirm-delivery', authMiddleware, txStatusUpdate('DELIVERED'));
app.put('/api/v1/transactions/:id/release', authMiddleware, txStatusUpdate('RELEASED'));
app.post('/api/v1/transactions/:id/verify', authMiddleware, txStatusUpdate('SUCCESS'));

// ============ AUCTIONS ============

app.get('/api/v1/auction', (req, res) => {
  const data = db.get();
  const auctions = data.auctions.map(a => {
    const item = getItemDTO(data.items.find(i => i.id === (a.item?.id || a.item)));
    const biddings = data.biddings.filter(b => b.auctionId === a.id).map(b => ({ ...b, bidder: getUserDTO(data.users.find(u => u.id === (b.bidder?.id || b.bidder))) }));
    return { ...a, item, biddings, biddingsCount: biddings.length };
  });
  res.json({ content: auctions, totalElements: auctions.length, totalPages: 1 });
});

app.post('/api/v1/auction', authMiddleware, (req, res) => {
  const data = db.get();
  const itemId = nextId.item++;
  const item = { id: itemId, title: req.body.title, description: req.body.description, imageUrls: req.body.imageKeys || [], acceptCash: req.body.acceptCash, cashAmount: req.body.cashAmount || 0, condition: req.body.condition, brand: req.body.brand, seller: { id: req.user.userId }, published: true, sold: false, delivered: false, liked: false, promoted: false, dateCreated: new Date().toISOString(), location: 'Nigeria', itemCategory: { name: req.body.itemCategory, description: '' }, subcategory: req.body.subcategory, stateCode: req.body.stateCode, lgaCode: req.body.lgaCode };
  data.items.push(item);
  const id = nextId.auction++;
  const auction = { id, startDate: req.body.startDate, endDate: req.body.endDate, status: 'ACTIVE', reservePrice: req.body.reservePrice, bidIncrement: req.body.bidIncrement, startingBid: req.body.startingBid, item: { id: itemId }, biddingsCount: 0, biddings: [] };
  data.auctions.push(auction);
  db.save();
  res.json({ ...auction, item: getItemDTO(item) });
});

app.get('/api/v1/auction/:id', (req, res) => {
  const data = db.get();
  const auction = data.auctions.find(a => a.id === parseInt(req.params.id));
  if (!auction) return res.status(404).json({ apierror: { message: 'Auction not found' } });
  const item = getItemDTO(data.items.find(i => i.id === (auction.item?.id || auction.item)));
  const biddings = data.biddings.filter(b => b.auctionId === auction.id).map(b => ({ ...b, bidder: getUserDTO(data.users.find(u => u.id === (b.bidder?.id || b.bidder))) }));
  res.json({ ...auction, item, biddings, biddingsCount: biddings.length });
});

app.put('/api/v1/auction/:id', authMiddleware, (req, res) => {
  const auction = db.get().auctions.find(a => a.id === parseInt(req.params.id));
  if (!auction) return res.status(404).json({ apierror: { message: 'Auction not found' } });
  Object.assign(auction, req.body);
  db.save();
  res.json(auction);
});

app.delete('/api/v1/auction/:id', authMiddleware, (req, res) => {
  const data = db.get();
  data.auctions = data.auctions.filter(a => a.id !== parseInt(req.params.id));
  db.save();
  res.json({ message: 'Auction deleted' });
});

app.put('/api/v1/auction/:id/deactivate', authMiddleware, (req, res) => {
  const auction = db.get().auctions.find(a => a.id === parseInt(req.params.id));
  if (auction) { auction.status = 'CANCELLED'; db.save(); }
  res.json(auction);
});

app.put('/api/v1/auction/:id/reactivate', authMiddleware, (req, res) => {
  const auction = db.get().auctions.find(a => a.id === parseInt(req.params.id));
  if (auction) { auction.status = 'ACTIVE'; db.save(); }
  res.json(auction);
});

// ============ BIDDING ============

app.post('/api/v1/bidding', authMiddleware, (req, res) => {
  const data = db.get();
  const bid = { auctionId: req.body.auctionId, bidder: getUserDTO(data.users.find(u => u.id === req.user.userId)), amount: req.body.amount, bidTime: new Date().toISOString() };
  data.biddings.push(bid);
  const auction = data.auctions.find(a => a.id === req.body.auctionId);
  if (auction) auction.biddingsCount = data.biddings.filter(b => b.auctionId === auction.id).length;
  db.save();
  res.json(bid);
});

app.get('/api/v1/bidding/auction/:auctionId', (req, res) => {
  const data = db.get();
  const bids = data.biddings.filter(b => b.auctionId === parseInt(req.params.auctionId)).map(b => ({ ...b, bidder: getUserDTO(data.users.find(u => u.id === (b.bidder?.id || b.bidder))) }));
  res.json(bids);
});

// Get bids for current user
app.get('/api/v1/bidding/user/me', authMiddleware, (req, res) => {
  const data = db.get();
  const userId = req.user.userId;
  const userBids = data.biddings.filter(b => (b.bidder?.id || b.bidder) === userId);
  const result = userBids.map(b => {
    const auction = data.auctions.find(a => a.id === b.auctionId);
    const item = auction ? getItemDTO(data.items.find(i => i.id === (auction.item?.id || auction.item))) : null;
    const allBidsForAuction = data.biddings.filter(ab => ab.auctionId === b.auctionId);
    const highestBid = Math.max(...allBidsForAuction.map(ab => ab.amount));
    const isHighest = b.amount === highestBid;
    const auctionEnded = auction ? new Date(auction.endDate) < new Date() : false;
    let status = 'PENDING';
    if (auctionEnded && isHighest) status = 'WON';
    else if (auctionEnded && !isHighest) status = 'OUT_BID';
    else if (!isHighest) status = 'OUT_BID';
    return {
      auctionId: b.auctionId,
      amount: b.amount,
      bidTime: b.bidTime,
      status,
      auction: auction ? {
        id: auction.id,
        item,
        status: auction.status,
        endDate: auction.endDate,
        startingBid: auction.startingBid,
        currentBid: highestBid,
      } : null
    };
  });
  res.json(result);
});

// ============ CHATS ============

app.get('/api/v1/chats', authMiddleware, (req, res) => {
  const data = db.get();
  const userId = req.user.userId;
  const userChats = data.chats.filter(c => c.initiatorId === userId || c.receiverId === userId);
  const buyer = userChats.filter(c => c.initiatorId === userId).map(c => ({ chat: c, unreadCount: data.messages.filter(m => m.chatId === c.chatId && m.sentBy !== userId && !m.readByReceiver).length }));
  const seller = userChats.filter(c => c.receiverId === userId).map(c => ({ chat: c, unreadCount: data.messages.filter(m => m.chatId === c.chatId && m.sentBy !== userId && !m.readByReceiver).length }));
  res.json({ buyer, seller });
});

app.post('/api/v1/chats', authMiddleware, (req, res) => {
  const data = db.get();
  const chatId = uuidv4();
  const initiator = data.users.find(u => u.id === req.user.userId);
  const receiver = data.users.find(u => u.id === req.body.receiverId);
  const chat = { chatId, title: req.body.title || '', initiatorId: req.user.userId, receiverId: req.body.receiverId, initiatorAvatar: initiator?.avatar || '', receiverAvatar: receiver?.avatar || '', initiatorName: `${initiator?.firstName} ${initiator?.lastName}`, receiverName: `${receiver?.firstName} ${receiver?.lastName}`, dateCreated: new Date().toISOString() };
  data.chats.push(chat);
  db.save();
  res.json(chat);
});

app.post('/api/v1/chats/message', authMiddleware, (req, res) => {
  const data = db.get();
  const msg = { message: req.body.message || req.body.content, sentBy: req.user.userId, chatId: req.body.chatId, readByReceiver: false, dateCreated: new Date().toISOString() };
  data.messages.push(msg);
  db.save();
  res.json(msg);
});

app.get('/api/v1/chats/:chatId/messages', authMiddleware, (req, res) => {
  const msgs = db.get().messages.filter(m => m.chatId === req.params.chatId);
  res.json(msgs);
});

app.delete('/api/v1/chats/:chatId', authMiddleware, (req, res) => {
  const data = db.get();
  data.chats = data.chats.filter(c => c.chatId !== req.params.chatId);
  data.messages = data.messages.filter(m => m.chatId !== req.params.chatId);
  db.save();
  res.json({ message: 'Chat deleted' });
});

// ============ REVIEWS ============

app.post('/api/v1/reviews', authMiddleware, (req, res) => {
  const data = db.get();
  const review = { rating: req.body.rating, message: req.body.message, userId: req.body.userId, postedById: req.user.userId, createdDate: new Date().toISOString() };
  data.reviews.push(review);
  const target = data.users.find(u => u.id === req.body.userId);
  if (target) {
    target.reviewCount = (target.reviewCount || 0) + 1;
    const userReviews = data.reviews.filter(r => r.userId === target.id);
    target.avgRating = userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length;
    target.mostRecentReview = review;
  }
  db.save();
  res.json(review);
});

app.get('/api/v1/reviews/user/:userId', (req, res) => {
  const reviews = db.get().reviews.filter(r => r.userId === parseInt(req.params.userId));
  res.json(reviews);
});

// ============ NOTIFICATIONS ============

app.get('/api/v1/notifications', authMiddleware, (req, res) => {
  const data = db.get();
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 20;
  const userNotifs = data.notifications.filter(n => n.userId === req.user.userId);
  res.json({ content: userNotifs.slice(page * size, (page + 1) * size), totalElements: userNotifs.length, totalPages: Math.ceil(userNotifs.length / size), number: page, size });
});

app.put('/api/v1/notifications/:id/markAsRead', authMiddleware, (req, res) => {
  const notif = db.get().notifications.find(n => n.id === parseInt(req.params.id));
  if (notif) { notif.read = true; db.save(); }
  res.json({ message: 'Marked as read' });
});

// ============ HOME ============

app.get('/api/v1/home/top_nav', authMiddleware, (req, res) => {
  const data = db.get();
  const userId = req.user.userId;
  const messagesCount = data.messages.filter(m => m.sentBy !== userId && !m.readByReceiver).length;
  const notificationsCount = data.notifications.filter(n => n.userId === userId && !n.read).length;
  res.json({ auctionsCount: data.auctions.filter(a => a.status === 'ACTIVE').length, messagesCount, biddingCount: data.biddings.filter(b => (b.bidder?.id || b.bidder) === userId).length, notificationsCount, topNotifications: data.notifications.filter(n => n.userId === userId).slice(0, 5) });
});

// ============ FILES ============

app.post('/api/v1/files/upload', upload.single('file'), (req, res) => {
  const key = `uploads/${uuidv4()}`;
  res.json({ key, url: `http://localhost:${PORT}/files/${key}` });
});

app.get('/api/v1/files/presign-upload-url', (req, res) => {
  res.json({ uploadUrl: `http://localhost:${PORT}/api/v1/files/upload`, key: req.query.key || uuidv4() });
});

app.get('/api/v1/files/presign-download-url', (req, res) => {
  res.json({ downloadUrl: `http://localhost:${PORT}/files/${req.query.key}` });
});

// ============ SUPPORT ============

app.post('/api/v1/support/report_abuse', authMiddleware, (req, res) => {
  res.json({ message: 'Abuse report submitted successfully' });
});

app.post('/api/v1/support/request_callback', authMiddleware, (req, res) => {
  res.json({ message: 'Callback request submitted successfully' });
});

// ============ STATE / LOCATION ============

app.get('/api/v1/state', (req, res) => res.json(db.get().states));

// ============ ADMIN ============

app.get('/api/v1/admin/dashboard/summary', authMiddleware, (req, res) => {
  const data = db.get();
  res.json({ totalListings: data.items.length, totalListingsChangePercent: 12.5, customers: data.users.length, customersChangePercent: 8.3, totalBids: data.biddings.length, totalBidsChangePercent: 15.2 });
});

app.get('/api/v1/admin/dashboard/recent_activities', authMiddleware, (req, res) => {
  res.json([
    { id: '1', timestamp: new Date().toISOString(), activity: 'New user registered', userId: '2', action: 'signup' },
    { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), activity: 'Item listed', userId: '1', action: 'create' },
  ]);
});

app.get('/api/v1/admin/listings/all_listings', authMiddleware, (req, res) => {
  res.json(db.get().items.map(i => ({ id: String(i.id), title: i.title, description: i.description, price: i.cashAmount, status: i.published ? 'ACTIVE' : 'INACTIVE', createdAt: i.dateCreated })));
});

app.get('/api/v1/admin/listings/summary', authMiddleware, (req, res) => {
  const items = db.get().items;
  res.json({ activeListings: items.filter(i => i.published).length, activeListingsChangePercent: 5, soldListings: items.filter(i => i.sold).length, soldListingsChangePercent: 3, pendingListings: 0, pendingListingsChangePercent: 0 });
});

app.get('/api/v1/admin/customers/all_customers', authMiddleware, (req, res) => {
  res.json(db.get().users.map(u => ({ custId: String(u.id), name: `${u.firstName} ${u.lastName}`, email: u.email, regDate: u.dateCreated, status: u.status?.toLowerCase() || 'active', listingsBids: String(db.get().items.filter(i => (i.seller?.id || i.seller) === u.id).length) })));
});

app.get('/api/v1/admin/customers/summary', authMiddleware, (req, res) => {
  const users = db.get().users;
  res.json({ totalCustomers: users.length, totalCustomersChangePercent: 10, activeCustomers: users.filter(u => u.status === 'ACTIVE').length, activeCustomersChangePercent: 8, blacklistedCustomers: 0, blacklistedCustomersChangePercent: 0 });
});

app.get('/api/v1/admin/bids/all_bids', authMiddleware, (req, res) => {
  res.json(db.get().biddings.map((b, i) => ({ bidId: String(i + 1), listingId: String(b.auctionId), customerId: String(b.bidder?.id || b.bidder), bidAmount: String(b.amount), bidDate: b.bidTime, status: 'pending' })));
});

app.get('/api/v1/admin/bids/summary', authMiddleware, (req, res) => {
  const bids = db.get().biddings;
  res.json({ totalBids: bids.length, totalBidsChangePercent: 5, pendingBids: bids.length, pendingBidsChangePercent: 3, acceptedBids: 0, acceptedBidsChangePercent: 0 });
});

// ============ RESET (dev utility) ============

app.post('/api/v1/dev/reset', (req, res) => {
  db.reset();
  res.json({ message: 'Database reset to defaults' });
});

// ============ START ============

db.load();
app.listen(PORT, () => {
  console.log(`\n🚀 Flipit Local API running on http://localhost:${PORT}`);
  console.log(`📖 84 endpoints mirroring api.flipit.ng Swagger spec`);
  console.log(`\n🔑 Test credentials:`);
  console.log(`   Email: michael@flipit.ng  Password: password123`);
  console.log(`   Email: sarah@flipit.ng    Password: password123`);
  console.log(`   Email: admin@flipit.ng    Password: admin123`);
  console.log(`\n🔄 POST /api/v1/dev/reset to reset database\n`);
});
