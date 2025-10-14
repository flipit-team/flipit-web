const fetch = require('node-fetch');

// Configuration
const FRONTEND_URL = 'http://localhost:3001';
const API_BASE_URL = `${FRONTEND_URL}/api`;
const CREDENTIALS = {
  username: 'jose@gmail.com',
  password: 'Oliver066.'
};

// Store cookies for authenticated requests
let cookies = '';

// Helper function to parse cookies from response headers
function parseCookies(response) {
  const rawCookies = response.headers.raw()['set-cookie'];
  if (!rawCookies) return '';

  return rawCookies.map(cookie => {
    return cookie.split(';')[0];
  }).join('; ');
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

// Delete item
async function deleteItem(itemId) {
  console.log(`🗑️  Deleting item ${itemId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookies
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to delete: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log(`✅ Deleted item ${itemId}`);
  } catch (error) {
    console.error(`❌ Failed to delete item ${itemId}:`, error.message);
  }
}

// Delete auction
async function deleteAuction(auctionId) {
  console.log(`🗑️  Deleting auction ${auctionId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auction/${auctionId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': cookies
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to delete: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log(`✅ Deleted auction ${auctionId}`);
  } catch (error) {
    console.error(`❌ Failed to delete auction ${auctionId}:`, error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting cleanup and recreation...\n');

  try {
    // Login
    await login();

    // Delete items (IDs 1-5)
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  DELETING ITEMS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (let id = 1; id <= 5; id++) {
      await deleteItem(id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Delete auctions (IDs 1-3)
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  DELETING AUCTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (let id = 1; id <= 3; id++) {
      await deleteAuction(id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Cleanup complete! Now run create-items.js to recreate items with working images.');

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
