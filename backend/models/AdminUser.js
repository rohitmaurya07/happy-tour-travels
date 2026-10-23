import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, default: 'admin' },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Happy Tour & Travels Admin' },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'admin_users',
    timestamps: true,
    strict: false
  }
);

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;
