import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    tripType: { type: String, default: 'One Way' },
    departureDate: { type: String },
    pickupTime: { type: String },
    hourlyPackage: { type: String },
    specialRequests: { type: String },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String },
    vehicleCategory: { type: String },
    routeType: { type: String },
    pricingType: { type: String },
    distanceKm: { type: Number },
    minimumKm: { type: Number },
    billableKm: { type: Number },
    ratePerKm: { type: Number },
    baseFare: { type: Number },
    driverAllowance: { type: Number },
    nightCharges: { type: Number },
    additionalCharges: { type: Object },
    totalFare: { type: Number },
    estimatedTotal: { type: Number },
    pricingSnapshot: { type: Object },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'bookings',
    timestamps: true,
    strict: false
  }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
