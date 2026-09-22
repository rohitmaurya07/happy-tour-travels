import assert from 'assert';
import { calculateFare, calculateAllFares, resolveRouteDetails, calculateDistance, validateVehiclePricing } from '../utils/pricingEngine.js';
import { readJson, writeJson } from '../utils/storage.js';

console.log('[Test Suite] Starting Taxi Pricing Engine Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`     Error: ${err.message}\n`);
  }
}

// TEST 1: Local One-Way Slabs for Dzire
test('1. Local Slab Matching: 25 KM -> Dzire 20–35 KM Slab = ₹900', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Kapurthala', // 22 km distance
    distanceKm: 25,
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.pricingType, 'local_slab');
  assert.strictEqual(result.baseFare, 900, 'Base fare for 25km Dzire should match slab price 900');
  assert.strictEqual(result.driverAllowance, 300);
  assert.strictEqual(result.estimatedTotal, 1200);
});

test('1b. Local Slab Matching: 60 KM -> Dzire 55–75 KM Slab = ₹1300', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Ludhiana',
    distanceKm: 60,
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.pricingType, 'local_slab');
  assert.strictEqual(result.baseFare, 1300, 'Base fare for 60km Dzire should match slab price 1300');
  assert.strictEqual(result.estimatedTotal, 1600);
});

// TEST 2: Long Distance Threshold Calculation
// Formula: pricing.longDistance.baseFare + (distance - pricing.longDistance.startAfterKm) * pricing.longDistance.additionalKmRate
test('2. Long Distance Threshold: 385 KM for Dzire (~₹5,000 benchmark for Jalandhar to Delhi)', () => {
  const fleet = readJson('fleet');
  const dzire = fleet.find(v => v.id === 'dzire');
  const ld = dzire.longDistance;

  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Gurgaon',
    distanceKm: 385,
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  const expectedBaseFare = ld.baseFare + ((385 - ld.startAfterKm) * ld.additionalKmRate);
  assert.strictEqual(result.pricingType, 'long_distance');
  assert.strictEqual(result.baseFare, expectedBaseFare, `Base fare should match formula: ₹${ld.baseFare} + (385-${ld.startAfterKm})*${ld.additionalKmRate} = ₹${expectedBaseFare}`);
  assert.strictEqual(result.driverAllowance, 300);
  assert.strictEqual(result.estimatedTotal, expectedBaseFare + 300);
  assert.ok(result.pricingSnapshot, 'Pricing snapshot must exist');
});

test('2b. Benchmark Vehicle Rates for 385 KM (One Way & Round Trip)', () => {
  // Dzire Pure Per-KM ~ ₹5,005 (385 * 13.0) | Round Trip 770 KM @ 11.70 = 9009
  const dzireRt = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Gurgaon',
    distanceKm: 385,
    vehicleId: 'dzire',
    tripType: 'Round Trip'
  });
  assert.strictEqual(dzireRt.billableKm, 770);
  assert.strictEqual(dzireRt.ratePerKm, 11.7);
  assert.strictEqual(dzireRt.baseFare, 9009);

  // Verna One-Way (385 * 14.30 = 5505.5 -> ~5506) | Round Trip 770 KM @ 14.00 = 10780
  const vernaRt = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Gurgaon',
    distanceKm: 385,
    vehicleId: 'verna',
    tripType: 'Round Trip'
  });
  assert.strictEqual(vernaRt.billableKm, 770);
  assert.strictEqual(vernaRt.ratePerKm, 14.0);
  assert.strictEqual(vernaRt.baseFare, 10780);

  // Innova One-Way (385 * 20.70 = 7969.5 -> ~7970) | Round Trip 770 KM @ 18.20 = 14014
  const innovaRt = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Gurgaon',
    distanceKm: 385,
    vehicleId: 'innova',
    tripType: 'Round Trip'
  });
  assert.strictEqual(innovaRt.billableKm, 770);
  assert.strictEqual(innovaRt.ratePerKm, 18.2);
  assert.strictEqual(innovaRt.baseFare, 14014);
});

// TEST 3: Dynamic Admin Reconfiguration without Code Change
test('3. Dynamic Admin Reconfiguration: 95->100 KM, Base ₹1700->₹1800, Add ₹13->₹14/KM', () => {
  const fleet = readJson('fleet');
  const dzireIndex = fleet.findIndex(v => v.id === 'dzire');
  const originalLongDistance = { ...fleet[dzireIndex].longDistance };

  try {
    // Admin changes configuration
    fleet[dzireIndex].longDistance = {
      startAfterKm: 100,
      baseFare: 1800,
      additionalKmRate: 14
    };
    writeJson('fleet', fleet);

    const result = calculateFare({
      pickup: 'Jalandhar',
      destination: 'Gurgaon',
      distanceKm: 385,
      vehicleId: 'dzire',
      tripType: 'One Way'
    });

    // 1800 + (385 - 100) * 14 = 1800 + 285 * 14 = 1800 + 3990 = 5790
    assert.strictEqual(result.baseFare, 5790, 'Base fare must automatically use new values 1800 + (385-100)*14 = 5790');
    assert.strictEqual(result.estimatedTotal, 6090, 'Estimated total must be 5790 + 300 = 6090');
  } finally {
    // Restore
    fleet[dzireIndex].longDistance = originalLongDistance;
    writeJson('fleet', fleet);
  }
});

// TEST 4: Hill Route Rate Selection
test('4. Hill Route: Jalandhar -> Shimla (Dzire @ Hill Rate & Under Minimum Outstation KM)', () => {
  const fleet = readJson('fleet');
  const dzire = fleet.find(v => v.id === 'dzire') || { hillRatePerKm: 15.5 };
  const hillRate = dzire.hillRatePerKm;

  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Shimla',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.routeType, 'HILL', 'Shimla must be classified as HILL route');
  assert.strictEqual(result.ratePerKm, hillRate, `Dzire hill rate should be ${hillRate}`);
  assert.strictEqual(result.distanceKm, 220, 'Distance Jalandhar to Shimla should be 220');
  assert.strictEqual(result.billableKm, 250, 'Billable KM must be max(220, 250) = 250');
  assert.strictEqual(result.baseFare, 250 * hillRate, `Base fare must be 250 * ${hillRate} = ${250 * hillRate}`);
  assert.strictEqual(result.estimatedTotal, 250 * hillRate + 300, `Estimated total must be ${250 * hillRate} + 300 = ${250 * hillRate + 300}`);
});

// TEST 5: Specific Fixed Route Tariff Override
test('5. Fixed Route Override: Jalandhar -> Delhi Airport Fixed Tariff', () => {
  const result = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Delhi Airport',
    vehicleId: 'dzire',
    tripType: 'One Way'
  });

  assert.strictEqual(result.pricingType, 'fixed_route');
  assert.strictEqual(result.baseFare, 5000, 'Fixed fare for Dzire on Jalandhar -> Delhi Airport should be 5000');
  assert.strictEqual(result.estimatedTotal, 5300, 'Estimated total should be 5000 + 300 driver allowance = 5300');
});

// TEST 6: Historical Pricing Snapshot Immutability
test('6. Historical Pricing Snapshot: Changing vehicle price later does NOT change historical booking', () => {
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

  const fleet = readJson('fleet');
  const dzireIndex = fleet.findIndex(v => v.id === 'dzire');
  const originalHillRate = fleet[dzireIndex].hillRatePerKm;

  try {
    fleet[dzireIndex].hillRatePerKm = 16;
    writeJson('fleet', fleet);

    const newFare = calculateFare({
      pickup: 'Jalandhar',
      destination: 'Shimla',
      vehicleId: 'dzire',
      tripType: 'One Way'
    });
    assert.strictEqual(newFare.ratePerKm, 16, 'New calculation must use updated rate 16');
    assert.strictEqual(newFare.baseFare, 250 * 16, 'New base fare must be 4000');

    const savedBookings = readJson('bookings');
    const retrieved = savedBookings.find(b => b.id === 'TEST-BK-HISTORICAL-001');

    assert.strictEqual(retrieved.ratePerKm, initialFare.ratePerKm, 'Historical booking ratePerKm MUST remain frozen');
    assert.strictEqual(retrieved.baseFare, initialFare.baseFare, 'Historical booking baseFare MUST remain frozen');
    assert.strictEqual(retrieved.pricingSnapshot.ratePerKm, initialFare.ratePerKm, 'Snapshot ratePerKm MUST remain frozen');
    assert.strictEqual(retrieved.pricingSnapshot.baseFare, initialFare.baseFare, 'Snapshot baseFare MUST remain frozen');
  } finally {
    // Cleanup
    fleet[dzireIndex].hillRatePerKm = originalHillRate;
    writeJson('fleet', fleet);
    const cleanupBookings = readJson('bookings', []) || [];
    writeJson('bookings', cleanupBookings.filter(b => b.id !== 'TEST-BK-HISTORICAL-001'));
  }
});

// TEST 7: Pricing Validation Engine
test('7. Validation Engine: Rejects negative prices, overlapping slabs, invalid thresholds', () => {
  // Test 7a: Negative rate
  const invalidNegative = validateVehiclePricing({
    name: 'Test Car',
    plainRatePerKm: -10
  });
  assert.strictEqual(invalidNegative.valid, false, 'Negative rate must be rejected');

  // Test 7b: Overlapping slabs
  const invalidOverlap = validateVehiclePricing({
    name: 'Test Car',
    minBookingKm: 20,
    slabs: [
      { minKm: 20, maxKm: 40, price: 900 },
      { minKm: 35, maxKm: 60, price: 1200 } // Overlaps with 20-40!
    ]
  });
  assert.strictEqual(invalidOverlap.valid, false, 'Overlapping slabs must be rejected');
  assert.ok(invalidOverlap.message.includes('Overlapping slabs'), 'Error message must mention overlapping slabs');

  // Test 7c: Long distance threshold < min booking KM
  const invalidThreshold = validateVehiclePricing({
    name: 'Test Car',
    minBookingKm: 50,
    longDistance: {
      startAfterKm: 30, // 30 < 50 invalid!
      baseFare: 1000,
      additionalKmRate: 12
    }
  });
  assert.strictEqual(invalidThreshold.valid, false, 'Threshold lower than minBookingKm must be rejected');

  // Test 7d: Valid configuration passes
  const validCar = validateVehiclePricing({
    name: 'Valid Car',
    minBookingKm: 20,
    slabs: [
      { minKm: 20, maxKm: 35, price: 900 },
      { minKm: 35, maxKm: 55, price: 1100 }
    ],
    longDistance: {
      startAfterKm: 95,
      baseFare: 1700,
      additionalKmRate: 12
    }
  });
  assert.strictEqual(validCar.valid, true, 'Valid car pricing must pass validation');
});

// TEST 8: Hourly Package Pricing with Included KM
test('8. Hourly Package: Dzire 4H / 40KM Package (₹1000 base + extra KM charge)', () => {
  const fleet = readJson('fleet');
  const dzire = fleet.find(v => v.id === 'dzire');
  const extraRate = dzire.extraKmRate || 12;

  // 30 km (within 40 included) -> ₹1000
  const result40 = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Local Rental',
    distanceKm: 30,
    vehicleId: 'dzire',
    tripType: 'Hourly Rental',
    hourlyPackage: '4h'
  });
  assert.strictEqual(result40.baseFare, 1000);

  // 55 km (15 km over 40 included @ dzire.extraKmRate extra) -> 1000 + 15 * extraRate
  const result55 = calculateFare({
    pickup: 'Jalandhar',
    destination: 'Local Rental',
    distanceKm: 55,
    vehicleId: 'dzire',
    tripType: 'Hourly Rental',
    hourlyPackage: '4h'
  });
  assert.strictEqual(result55.baseFare, 1000 + (15 * extraRate));
});

// TEST 9: Multi-Vehicle Search Query
test('9. Calculate All Fares: Returns sorted array of active vehicles', () => {
  const response = calculateAllFares({
    pickup: 'Jalandhar',
    destination: 'Chandigarh',
    tripType: 'One Way'
  });

  assert.ok(Array.isArray(response.results));
  assert.ok(response.results.length >= 5, 'Should calculate for all active fleet vehicles');
  assert.ok(response.results[0].estimatedTotal <= response.results[1].estimatedTotal, 'Must be sorted by estimatedTotal ascending');
});

console.log(`\n[Summary] ${passedTests} / ${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('[SUCCESS] ALL PRICING ENGINE TESTS PASSED SUCCESSFULLY!\n');
} else {
  process.exit(1);
}

