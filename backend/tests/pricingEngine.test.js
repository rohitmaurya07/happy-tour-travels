import assert from 'assert';
import { calculateFare, calculateAllFares, resolveRouteDetails, calculateDistance } from '../utils/pricingEngine.js';
import { readJson, writeJson } from '../utils/storage.js';

console.log('🧪 Starting Taxi Pricing Engine Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
  }
}

// TEST 1: Plain Route Pricing & Rate Selection
test('1. Plain Route: Jalandhar -> Delhi (Dzire @ Plain Rate)', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Delhi',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.routeType, 'PLAIN');
  assert.strictEqual(result.vehicleId, 'dzire');
  assert.strictEqual(result.ratePerKm, 10, 'Dzire plain rate should be 10');
  assert.strictEqual(result.distanceKm, 375, 'Distance Jalandhar to Delhi should be 375');
  assert.strictEqual(result.billableKm, 375, 'Billable KM should be 375 (since 375 > 250)');
  assert.strictEqual(result.baseFare, 3750, 'Base fare should be 375 * 10 = 3750');
  assert.strictEqual(result.driverAllowance, 300, 'Driver allowance should be 300');
  assert.strictEqual(result.estimatedTotal, 4050, 'Estimated total should be 3750 + 300 = 4050');
  assert.ok(result.pricingSnapshot, 'Pricing snapshot must exist');
});

// TEST 2: Hill Route Pricing & Route Classification
test('2. Hill Route: Jalandhar -> Shimla (Dzire @ Hill Rate & Under Minimum KM)', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Shimla',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.routeType, 'HILL', 'Shimla must be classified as HILL route');
  assert.strictEqual(result.ratePerKm, 11, 'Dzire hill rate should be 11');
  assert.strictEqual(result.distanceKm, 220, 'Distance Jalandhar to Shimla should be 220');
  assert.strictEqual(result.minimumKm, 250, 'Minimum KM should be 250');
  assert.strictEqual(result.billableKm, 250, 'Billable KM must be max(220, 250) = 250');
  assert.strictEqual(result.baseFare, 2750, 'Base fare must be 250 * 11 = 2750');
  assert.strictEqual(result.driverAllowance, 300, 'Driver allowance should be 300');
  assert.strictEqual(result.estimatedTotal, 3050, 'Estimated total must be 2750 + 300 = 3050');
});

// TEST 3: Minimum KM Rule (Under Minimum)
test('3. Minimum KM Rule: Actual 180 km < 250 km Minimum -> Billable 250 km', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Kasauli', // distance = 180 km, Hill station
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.distanceKm, 180);
  assert.strictEqual(result.minimumKm, 250);
  assert.strictEqual(result.billableKm, 250);
  assert.strictEqual(result.baseFare, 2750); // 250 * 11
});

// TEST 4: Above Minimum KM Rule
test('4. Above Minimum KM Rule: Actual 315 km > 250 km Minimum -> Billable 315 km', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Manali', // distance = 315 km, Hill station
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.distanceKm, 315);
  assert.strictEqual(result.minimumKm, 250);
  assert.strictEqual(result.billableKm, 315);
  assert.strictEqual(result.baseFare, 315 * 11); // 3465
});

// TEST 5: Specific Route Fixed Fare Override (Priority 1)
test('5. Fixed Route Override: Jalandhar -> Delhi Airport Fixed Tariff', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Delhi Airport',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.pricingType, 'fixed_route');
  assert.strictEqual(result.baseFare, 3500, 'Fixed fare for Dzire on Jalandhar -> Delhi Airport should be 3500');
  assert.strictEqual(result.estimatedTotal, 3800, 'Estimated total should be 3500 + 300 driver allowance = 3800');
});

// TEST 6: Historical Pricing Snapshot Immutability
test('6. Historical Pricing Snapshot: Changing vehicle price later does NOT change historical booking', () => {
  // Step A: Calculate & create booking with current rate (₹11/km)
  const initialFare = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Shimla',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  const historicalBooking = {
    id: 'TEST-BK-HISTORICAL-001',
    vehicleId: initialFare.vehicleId,
    vehicleName: initialFare.vehicle,
    pickup: initialFare.pickup,
    destination: initialFare.destination,
    routeType: initialFare.routeType,
    ratePerKm: initialFare.ratePerKm,
    billableKm: initialFare.billableKm,
    baseFare: initialFare.baseFare,
    driverAllowance: initialFare.driverAllowance,
    totalFare: initialFare.estimatedTotal,
    pricingSnapshot: initialFare.pricingSnapshot,
    createdAt: new Date().toISOString()
  };

  const currentBookings = readJson('bookings', []) || [];
  writeJson('bookings', [...currentBookings, historicalBooking]);

  // Step B: Simulate Admin price update: Change Dzire hill rate from ₹11 to ₹16
  const fleet = readJson('fleet');
  const dzireIndex = fleet.findIndex(v => v.id === 'dzire');
  const originalHillRate = fleet[dzireIndex].hillRatePerKm;
  fleet[dzireIndex].hillRatePerKm = 16;
  writeJson('fleet', fleet);

  // Step C: Verify new calculation reflects ₹16/km
  const newFare = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Shimla',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });
  assert.strictEqual(newFare.ratePerKm, 16, 'New calculation must use updated rate 16');
  assert.strictEqual(newFare.baseFare, 250 * 16, 'New base fare must be 4000');

  // Step D: Retrieve historical booking and verify it is STILL frozen at ₹11 and ₹2750!
  const savedBookings = readJson('bookings');
  const retrieved = savedBookings.find(b => b.id === 'TEST-BK-HISTORICAL-001');

  assert.strictEqual(retrieved.ratePerKm, 11, 'Historical booking ratePerKm MUST remain 11');
  assert.strictEqual(retrieved.baseFare, 2750, 'Historical booking baseFare MUST remain 2750');
  assert.strictEqual(retrieved.pricingSnapshot.ratePerKm, 11, 'Snapshot ratePerKm MUST remain 11');
  assert.strictEqual(retrieved.pricingSnapshot.baseFare, 2750, 'Snapshot baseFare MUST remain 2750');

  // Cleanup: restore original rate & remove test booking
  fleet[dzireIndex].hillRatePerKm = originalHillRate;
  writeJson('fleet', fleet);
  writeJson('bookings', savedBookings.filter(b => b.id !== 'TEST-BK-HISTORICAL-001'));
});

// TEST 7: Security - Client Fare Tampering Ignored
test('7. Security: Injected client rate is ignored by server calculation engine', () => {
  const maliciousClientInput = {
    pickup: 'Jalandhar',
    destination: 'Shimla',
    vehicleId: 'dzire',
    ratePerKm: 1, // Tampered price
    baseFare: 100, // Tampered base fare
    driverAllowance: 0,
    estimatedTotal: 100
  };

  const calculated = calculateFare(maliciousClientInput);

  assert.strictEqual(calculated.ratePerKm, 11, 'Server MUST ignore client ratePerKm=1 and enforce database rate 11');
  assert.strictEqual(calculated.baseFare, 2750, 'Server MUST ignore client baseFare=100 and enforce 2750');
  assert.strictEqual(calculated.estimatedTotal, 3050, 'Server MUST enforce authoritative total 3050');
});

// TEST 8: Multi-Vehicle Search Query
test('8. Calculate All Fares: Returns sorted array of active vehicles', () => {
  const response = calculateAllFares({
    pickup: 'Jalandhar',
    destination: 'Chandigarh',
    tripType: 'One Way'
  });

  assert.ok(Array.isArray(response.results));
  assert.ok(response.results.length >= 5, 'Should calculate for all active fleet vehicles');
  assert.ok(response.results[0].estimatedTotal <= response.results[1].estimatedTotal, 'Must be sorted by estimatedTotal ascending');
});

console.log(`\n📊 Summary: ${passedTests} / ${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('🎉 ALL PRICING ENGINE TESTS PASSED SUCCESSFULLY!\n');
} else {
  process.exit(1);
}
