import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    role: { type: String, enum: ['USER', 'PROVIDER', 'ADMIN'], default: 'USER' },
    phoneVerified: { type: Boolean, default: true },
    accountStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    walletCredits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
