import express from 'express';
import { calculateFare, calculateAllFares, resolveRouteDetails, calculateDistance } from '../utils/pricingEngine.js';

const router = express.Router();

/**
 * POST /api/fare/calculate
 * Calculate authoritative fare for a specific vehicle and route
 */
router.post('/calculate', (req, res) => {
  try {
    const {
      pickup,
      destination,
      vehicleId,
      tripType,
      departureDate,
      pickupTime,
      hourlyPackage,
      fromCoords,
      toCoords
    } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Both pickup and destination locations are required.'
      });
    }

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'vehicleId is required.'
      });
    }

    const fare = calculateFare({
      pickup,
      destination,
      vehicleId,
      tripType: tripType || 'One Way',
      departureDate,
      pickupTime: pickupTime || '09:00',
      hourlyPackage: hourlyPackage || '8h',
      fromCoords,
      toCoords
    });

    return res.json({
      success: true,
      fare
    });
  } catch (error) {
    console.error('Fare calculation error:', error.message);
    const statusCode = error.message.includes('not found') || error.message.includes('unavailable') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/fare/calculate-all
 * Calculate fares for all active vehicles for a search query
 */
router.post('/calculate-all', (req, res) => {
  try {
    const {
      pickup,
      destination,
      tripType,
      departureDate,
      pickupTime,
      hourlyPackage,
      fromCoords,
      toCoords
    } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Both pickup and destination locations are required.'
      });
    }

    const data = calculateAllFares({
      pickup,
      destination,
      tripType: tripType || 'One Way',
      departureDate,
      pickupTime: pickupTime || '09:00',
      hourlyPackage: hourlyPackage || '8h',
      fromCoords,
      toCoords
    });

    return res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('Calculate all fares error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/fare/route-info
 * Preview route details (route type, distance)
 */
router.get('/route-info', (req, res) => {
  try {
    const { pickup, destination } = req.query;
    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Query parameters "pickup" and "destination" are required.'
      });
    }

    const routeDetails = resolveRouteDetails(pickup, destination);
    const distanceKm = routeDetails.customDistance || calculateDistance(pickup, destination);

    return res.json({
      success: true,
      data: {
        pickup,
        destination,
        routeType: routeDetails.routeType,
        pricingType: routeDetails.pricingType,
        distanceKm
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
