import mongoose from 'mongoose';

const popularRouteSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String },
    routes: [{ type: Object }]
  },
  {
    collection: 'popular_routes',
    timestamps: true,
    strict: false
  }
);

export const PopularRoute = mongoose.models.PopularRoute || mongoose.model('PopularRoute', popularRouteSchema);
export default PopularRoute;
