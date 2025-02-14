const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/default-avatar.png' },
    status: { type: String, default: 'Hey there!' },
    googleId: { type: String }, // For Google login
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Update last seen timestamp
userSchema.methods.updateLastSeen = async function () {
  this.lastSeen = Date.now();
  await this.save();
};

// Update user status
userSchema.methods.updateStatus = async function (status) {
  this.status = status;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
