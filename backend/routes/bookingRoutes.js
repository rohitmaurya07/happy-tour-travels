import express from 'express';
import { readJson, writeJson } from '../utils/storage.js';
import { calculateFare } from '../utils/pricingEngine.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking with immutable server-authoritative pricing snapshot
 */
router.post('/', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickup,
      destination,
      vehicleId,
      tripType,
      departureDate,
      pickupTime,
      hourlyPackage,
      specialRequests
    } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and Destination are required.'
      });
    }

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle selection is required.'
      });
    }

    // Authoritatively calculate fare on the server
    const fare = calculateFare({
      pickup,
      destination,
      vehicleId,
      tripType: tripType || 'One Way',
      departureDate,
      pickupTime: pickupTime || '09:00',
      hourlyPackage: hourlyPackage || '8h'
    });

    const bookings = readJson('bookings', []) || [];
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: bookingId,
      customerName: customerName || 'Valued Guest',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      pickup,
      destination,
      tripType: tripType || 'One Way',
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      pickupTime: pickupTime || '09:00',
      hourlyPackage: hourlyPackage || null,
      specialRequests: specialRequests || '',
      vehicleId: fare.vehicleId,
      vehicleName: fare.vehicle,
      vehicleCategory: fare.category,
      routeType: fare.routeType,
      pricingType: fare.pricingType,
      distanceKm: fare.distanceKm,
      minimumKm: fare.minimumKm,
      billableKm: fare.billableKm,
      ratePerKm: fare.ratePerKm,
      baseFare: fare.baseFare,
      driverAllowance: fare.driverAllowance,
      nightCharges: fare.nightCharges,
      additionalCharges: fare.additionalCharges,
      totalFare: fare.estimatedTotal,
      estimatedTotal: fare.estimatedTotal,
      pricingSnapshot: fare.pricingSnapshot,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    writeJson('bookings', bookings);

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create booking error:', error.message);
    const status = error.message.includes('not found') || error.message.includes('unavailable') ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/bookings/:id
 * Retrieve historical booking by ID (frozen snapshot preserved)
 */
router.get('/:id', (req, res) => {
  try {
    const bookings = readJson('bookings', []) || [];
    const booking = bookings.find((b) => b.id === req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
