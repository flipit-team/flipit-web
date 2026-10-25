/**
 * E2E API Test Script — Flipit Marketplace
 *
 * Tests 3 trade flows end-to-end:
 *   1. CASH_ONLY   — User B buys User A's item with cash
 *   2. SWAP         — User B swaps their item for User A's item
 *   3. SWAP_WITH_CASH — User B swaps item + cash for User A's item
 *
 * Each flow: Signup → Post Item → Offer → Accept → Transaction → Ship → Deliver → Review → Complete
 *
 * Usage: npx tsx e2e-test.ts
 */

const API = 'https://api.flipit.ng/api/v1';
const TS = Date.now();

// ─── Helpers ───────────────────────────────────────────────
async function api(method: string, path: string, body?: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const ct = res.headers.get('content-type') || '';
    let data: any = null;
    if (ct.includes('application/json')) {
        try { data = await res.json(); } catch { data = null; }
    } else {
        const text = await res.text();
        data = { _raw: text.substring(0, 200) };
    }

    return { status: res.status, ok: res.ok, data };
}

function log(icon: string, msg: string) {
    console.log(`${icon}  ${msg}`);
}

function pass(step: string, detail?: string) {
    log('✅', `${step}${detail ? ` — ${detail}` : ''}`);
}

function fail(step: string, detail: string) {
    log('❌', `${step} — ${detail}`);
}

function warn(step: string, detail: string) {
    log('⚠️', `${step} — ${detail}`);
}

function section(title: string) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${title}`);
    console.log('═'.repeat(60));
}

// ─── Test State ────────────────────────────────────────────
interface TestUser {
    email: string;
    password: string;
    token: string;
    id: number;
    firstName: string;
}

interface TestItem {
    id: number;
    title: string;
}

const results: { step: string; status: 'pass' | 'fail' | 'warn' | 'skip'; detail?: string }[] = [];

function record(step: string, status: 'pass' | 'fail' | 'warn' | 'skip', detail?: string) {
    results.push({ step, status, detail });
    if (status === 'pass') pass(step, detail);
    else if (status === 'fail') fail(step, detail!);
    else if (status === 'warn') warn(step, detail!);
    else log('⏭️', `${step} — SKIPPED`);
}

// ─── Step Functions ────────────────────────────────────────

async function signup(label: string, suffix: string): Promise<TestUser | null> {
    const email = `e2e_${suffix}_${TS}@flipit.test`;
    const password = 'TestPass123!';
    const firstName = `Test${suffix}`;
    const phone = `080${String(TS).slice(-8)}${suffix === 'A' ? '1' : '2'}`;

    const { status, ok, data } = await api('POST', '/user/signup', {
        firstName,
        lastName: 'E2E',
        email,
        password,
        phoneNumber: phone,
    });

    if (!ok) {
        record(`${label}: Signup`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data)}`);
        return null;
    }

    const token = data?.jwt || data?.token;
    const user = data?.user;
    if (!token || !user?.id) {
        record(`${label}: Signup`, 'fail', `Missing token or user ID in response: ${JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Signup`, 'pass', `id=${user.id}, email=${email}`);
    return { email, password, token, id: user.id, firstName };
}

async function postItem(
    label: string,
    user: TestUser,
    opts: { acceptCash: boolean; acceptSwap: boolean; cashAmount: number; title: string }
): Promise<TestItem | null> {
    const { status, ok, data } = await api('POST', '/items', {
        title: opts.title,
        description: `E2E test item — ${opts.title}`,
        imageKeys: ['test/e2e-placeholder.jpg'],
        acceptCash: opts.acceptCash,
        acceptSwap: opts.acceptSwap,
        cashAmount: opts.cashAmount,
        stateCode: 'LA',
        lgaCode: 'LAGOS_ISLAND',
        condition: 'NEW',
        brand: 'TestBrand',
        itemCategory: 'Electronics & Gadgets',
        subcategory: 'Laptops & Computers',
        published: true,
    }, user.token);

    if (!ok) {
        record(`${label}: Post Item`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 300)}`);
        return null;
    }

    const itemId = data?.id;
    if (!itemId) {
        record(`${label}: Post Item`, 'fail', `No item ID in response: ${JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Post Item`, 'pass', `id=${itemId}, "${opts.title}"`);
    return { id: itemId, title: opts.title };
}

async function makeOffer(
    label: string,
    buyer: TestUser,
    targetItemId: number,
    opts: { withCash: boolean; cashAmount?: number; offeredItemId?: number }
): Promise<number | null> {
    const body: any = {
        itemId: targetItemId,
        withCash: opts.withCash,
    };
    if (opts.cashAmount !== undefined) body.cashAmount = opts.cashAmount;
    if (opts.offeredItemId !== undefined) body.offeredItemId = opts.offeredItemId;

    const { status, ok, data } = await api('POST', '/offer', body, buyer.token);

    if (!ok) {
        record(`${label}: Make Offer`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 300)}`);
        return null;
    }

    const offerId = data?.id;
    if (!offerId) {
        record(`${label}: Make Offer`, 'fail', `No offer ID: ${JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Make Offer`, 'pass', `offerId=${offerId}`);
    return offerId;
}

async function acceptOffer(label: string, seller: TestUser, offerId: number): Promise<any> {
    const { status, ok, data } = await api('POST', `/offer/${offerId}/accept`, {}, seller.token);

    if (!ok) {
        record(`${label}: Accept Offer`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 300)}`);
        return null;
    }

    record(`${label}: Accept Offer`, 'pass', `Response keys: ${Object.keys(data || {}).join(', ')}`);
    return data;
}

async function createTransaction(
    label: string,
    buyer: TestUser,
    sellerId: number,
    offerId: number,
    amount: number,
    tradeType: string
): Promise<number | null> {
    const { status, ok, data } = await api('POST', '/transactions', {
        buyerId: buyer.id,
        sellerId,
        offerId,
        amount,
        tradeType,
        description: `E2E ${tradeType} transaction`,
    }, buyer.token);

    if (!ok) {
        record(`${label}: Create Transaction`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 300)}`);
        return null;
    }

    const txId = data?.id;
    if (!txId) {
        record(`${label}: Create Transaction`, 'fail', `No tx ID: ${JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Create Transaction`, 'pass', `txId=${txId}, status=${data?.status}, type=${data?.type}`);
    return txId;
}

async function getTransaction(label: string, token: string, txId: number): Promise<any> {
    const { status, ok, data } = await api('GET', `/transactions/${txId}`, undefined, token);

    if (!ok) {
        record(`${label}: Get Transaction`, 'fail', `${status} — ${data?.message || JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Get Transaction`, 'pass', `status=${data?.status}, type=${data?.type}, amount=${data?.amount}`);
    return data;
}

async function verifyTransaction(label: string, token: string, txId: number): Promise<boolean> {
    const { status, ok, data } = await api('POST', `/transactions/${txId}/verify`, {}, token);

    if (!ok) {
        record(`${label}: Verify Payment`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Verify Payment`, 'pass', `new status=${data?.status}`);
    return true;
}

async function shipItem(label: string, token: string, txId: number): Promise<boolean> {
    const { status, ok, data } = await api('PUT', `/transactions/${txId}/ship`, {}, token);

    if (!ok) {
        // This endpoint may not exist on BE — document it
        record(`${label}: Ship Item`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Ship Item`, 'pass', `new status=${data?.status}`);
    return true;
}

async function confirmDelivery(label: string, token: string, txId: number): Promise<boolean> {
    const { status, ok, data } = await api('PUT', `/transactions/${txId}/confirm-delivery`, {}, token);

    if (!ok) {
        record(`${label}: Confirm Delivery`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Confirm Delivery`, 'pass', `new status=${data?.status}`);
    return true;
}

async function releaseFunds(label: string, token: string, txId: number): Promise<boolean> {
    const { status, ok, data } = await api('PUT', `/transactions/${txId}/release`, {}, token);

    if (!ok) {
        record(`${label}: Release Funds`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Release Funds`, 'pass', `new status=${data?.status}`);
    return true;
}

async function leaveReview(label: string, token: string, userId: number, itemId: number): Promise<boolean> {
    const { status, ok, data } = await api('POST', '/reviews', {
        userId,
        itemId,
        rating: 5,
        message: 'Great E2E test transaction!',
    }, token);

    if (!ok) {
        record(`${label}: Leave Review`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Leave Review`, 'pass', `Reviewed user ${userId}`);
    return true;
}

async function completeTransaction(label: string, token: string, txId: number): Promise<boolean> {
    const { status, ok, data } = await api('PUT', `/transactions/${txId}/complete`, {}, token);

    if (!ok) {
        record(`${label}: Complete Transaction`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    record(`${label}: Complete Transaction`, 'pass', `final status=${data?.status}`);
    return true;
}

async function getMyTransactions(label: string, token: string): Promise<boolean> {
    const { status, ok, data } = await api('GET', '/transactions/me', undefined, token);

    if (!ok) {
        record(`${label}: Get My Transactions`, 'fail', `${status} — ${data?.message || JSON.stringify(data).substring(0, 200)}`);
        return false;
    }

    const count = Array.isArray(data) ? data.length : data?.content?.length ?? '?';
    record(`${label}: Get My Transactions`, 'pass', `${count} transactions found`);
    return true;
}

async function initiatePayment(label: string, token: string, itemId: number, amount: number): Promise<any> {
    const { status, ok, data } = await api('POST', '/payments/initiate', {
        itemId,
        amount,
        gateway: 'credo',
    }, token);

    if (!ok) {
        record(`${label}: Initiate Payment`, 'fail', `${status} — ${data?.message || data?.debugMessage || JSON.stringify(data).substring(0, 200)}`);
        return null;
    }

    record(`${label}: Initiate Payment`, 'pass', `gateway=${data?.gateway}, bank=${data?.bank?.name || 'N/A'}, status=${data?.status}`);
    return data;
}

// ─── Misc endpoint tests ──────────────────────────────────

async function testMiscEndpoints(token: string) {
    section('MISC ENDPOINT TESTS');

    // Categories
    const cats = await api('GET', '/items/categories');
    record('GET /items/categories', cats.ok ? 'pass' : 'fail',
        cats.ok ? `${Array.isArray(cats.data) ? cats.data.length : '?'} categories` : `${cats.status}`);

    // States
    const states = await api('GET', '/state');
    record('GET /state', states.ok ? 'pass' : 'fail',
        states.ok ? `${Array.isArray(states.data) ? states.data.length : '?'} states` : `${states.status}`);

    // Item conditions
    const conds = await api('GET', '/items/itemConditions');
    record('GET /items/itemConditions', conds.ok ? 'pass' : 'fail',
        conds.ok ? `${JSON.stringify(conds.data)}` : `${conds.status}`);

    // Top nav (auth)
    const nav = await api('GET', '/home/top_nav', undefined, token);
    record('GET /home/top_nav', nav.ok ? 'pass' : 'fail',
        nav.ok ? `auctions=${nav.data?.auctionsCount}, msgs=${nav.data?.messagesCount}, bids=${nav.data?.biddingCount}, notifs=${nav.data?.notificationsCount}` : `${nav.status}`);

    // Profile
    const profile = await api('GET', '/user/profile', undefined, token);
    record('GET /user/profile', profile.ok ? 'pass' : 'fail',
        profile.ok ? `id=${profile.data?.id}, email=${profile.data?.email}` : `${profile.status}`);

    // Performance
    const perf = await api('GET', '/user/performance', undefined, token);
    record('GET /user/performance', perf.ok ? 'pass' : 'fail',
        perf.ok ? `impressions=${perf.data?.impressionsCount}` : `${perf.status}`);

    // Notifications
    const notifs = await api('GET', '/notifications?page=0&size=5', undefined, token);
    record('GET /notifications', notifs.ok ? 'pass' : 'fail',
        notifs.ok ? `${JSON.stringify(notifs.data).substring(0, 100)}` : `${notifs.status}`);

    // Liked items
    const likes = await api('GET', '/likes/items', undefined, token);
    record('GET /likes/items', likes.ok ? 'pass' : 'fail',
        likes.ok ? `${Array.isArray(likes.data) ? likes.data.length : '?'} liked items` : `${likes.status}`);

    // Chats
    const chats = await api('GET', '/chats', undefined, token);
    record('GET /chats', chats.ok ? 'pass' : 'fail',
        chats.ok ? `seller=${chats.data?.seller?.length ?? '?'}, buyer=${chats.data?.buyer?.length ?? '?'}` : `${chats.status}`);
}

// ─── Full Flow Runner ──────────────────────────────────────

async function runFlow(
    flowLabel: string,
    userA: TestUser,
    userB: TestUser,
    tradeType: 'CASH_ONLY' | 'SWAP' | 'SWAP_WITH_CASH',
) {
    section(`FLOW: ${flowLabel} (${tradeType})`);

    // Step 1: User A posts item
    const itemOpts = {
        title: `E2E ${tradeType} Item by A`,
        acceptCash: tradeType !== 'SWAP',
        acceptSwap: tradeType !== 'CASH_ONLY',
        cashAmount: tradeType === 'SWAP' ? 0 : 5000,
    };
    const itemA = await postItem(flowLabel, userA, itemOpts);
    if (!itemA) return;

    // Step 2: For SWAP / SWAP_WITH_CASH, User B also needs an item to offer
    let itemB: TestItem | null = null;
    if (tradeType !== 'CASH_ONLY') {
        itemB = await postItem(flowLabel, userB, {
            title: `E2E Swap Item by B`,
            acceptCash: false,
            acceptSwap: true,
            cashAmount: 0,
        });
        if (!itemB) return;
    }

    // Step 3: User B makes offer on User A's item
    const offerOpts: any = {
        withCash: tradeType !== 'SWAP',
        cashAmount: tradeType === 'SWAP' ? undefined : 5000,
        offeredItemId: itemB?.id,
    };
    const offerId = await makeOffer(flowLabel, userB, itemA.id, offerOpts);
    if (!offerId) return;

    // Step 4: User A accepts the offer
    const acceptResult = await acceptOffer(flowLabel, userA, offerId);

    // Step 5: Check if accept-offer already created a transaction
    let txId: number | null = null;

    if (acceptResult?.id && acceptResult?.status) {
        // Accept offer returned a TransactionDTO directly
        txId = acceptResult.id;
        record(`${flowLabel}: Transaction (from accept)`, 'pass', `txId=${txId}, status=${acceptResult.status}`);
    } else {
        // Need to create transaction manually
        txId = await createTransaction(flowLabel, userB, userA.id, offerId, 5000, tradeType);
    }
    if (!txId) return;

    // Step 6: Get transaction to check state
    const tx = await getTransaction(flowLabel, userB.token, txId);
    if (!tx) return;

    // Step 7: Payment (skip for pure SWAP)
    if (tradeType !== 'SWAP') {
        // Try initiating payment
        await initiatePayment(flowLabel, userB.token, itemA.id, tx.amount || 5000);

        // Verify payment
        const verified = await verifyTransaction(flowLabel, userB.token, txId);
        if (!verified) {
            // Check if already at SUCCESS
            const txCheck = await getTransaction(flowLabel, userB.token, txId);
            if (txCheck?.status !== 'SUCCESS') return;
            record(`${flowLabel}: Payment (already SUCCESS)`, 'pass', 'Transaction was already at SUCCESS');
        }
    } else {
        // For SWAP, verify to move to SUCCESS
        await verifyTransaction(flowLabel, userB.token, txId);
    }

    // Step 8: Ship item (seller = User A)
    const shipped = await shipItem(flowLabel, userA.token, txId);
    if (!shipped) {
        warn(flowLabel, 'Ship endpoint failed — this is a known missing BE endpoint. Skipping remaining steps.');
        record(`${flowLabel}: Ship → Deliver → Review → Complete`, 'skip', 'Blocked by missing PUT /transactions/{id}/ship');
        return;
    }

    // Step 9: Confirm delivery (buyer = User B)
    const delivered = await confirmDelivery(flowLabel, userB.token, txId);
    if (!delivered) return;

    // Step 10: Release funds
    const released = await releaseFunds(flowLabel, userB.token, txId);
    if (!released) return;

    // Step 11: Leave review (buyer reviews seller)
    await leaveReview(flowLabel, userB.token, userA.id, itemA.id);

    // Step 12: Complete transaction
    await completeTransaction(flowLabel, userB.token, txId);

    // Step 13: Verify final state
    const finalTx = await getTransaction(flowLabel, userB.token, txId);
    if (finalTx) {
        const finalStatus = finalTx.status;
        if (['COMPLETED', 'RELEASED', 'VERIFIED'].includes(finalStatus)) {
            record(`${flowLabel}: FINAL STATE`, 'pass', `Transaction ended at ${finalStatus}`);
        } else {
            record(`${flowLabel}: FINAL STATE`, 'warn', `Expected COMPLETED but got ${finalStatus}`);
        }
    }
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
    console.log('\n🚀 FLIPIT E2E API TEST');
    console.log(`   Backend: ${API}`);
    console.log(`   Timestamp: ${TS}\n`);

    // Signup both users
    section('USER REGISTRATION');
    const userA = await signup('User A', 'A');
    const userB = await signup('User B', 'B');

    if (!userA || !userB) {
        console.log('\n❌ Cannot proceed — user registration failed.\n');
        return;
    }

    // Test misc endpoints
    await testMiscEndpoints(userA.token);

    // Run all 3 trade flows
    await runFlow('CASH_ONLY', userA, userB, 'CASH_ONLY');
    await runFlow('SWAP', userA, userB, 'SWAP');
    await runFlow('SWAP_WITH_CASH', userA, userB, 'SWAP_WITH_CASH');

    // Test My Transactions for both users
    section('TRANSACTION HISTORY');
    await getMyTransactions('User A', userA.token);
    await getMyTransactions('User B', userB.token);

    // Summary
    section('TEST RESULTS SUMMARY');
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warned = results.filter(r => r.status === 'warn').length;
    const skipped = results.filter(r => r.status === 'skip').length;

    console.log(`\n   ✅ Passed:  ${passed}`);
    console.log(`   ❌ Failed:  ${failed}`);
    console.log(`   ⚠️  Warned:  ${warned}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total:   ${results.length}\n`);

    if (failed > 0) {
        console.log('FAILURES:');
        results.filter(r => r.status === 'fail').forEach(r => {
            console.log(`   ❌ ${r.step}: ${r.detail}`);
        });
        console.log('');
    }

    if (warned > 0) {
        console.log('WARNINGS:');
        results.filter(r => r.status === 'warn').forEach(r => {
            console.log(`   ⚠️  ${r.step}: ${r.detail}`);
        });
        console.log('');
    }
}

main().catch(console.error);
