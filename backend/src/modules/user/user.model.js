const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['super-admin', 'admin', 'doctor', 'receptionist', 'patient'];

const UserSchema = new Schema(
  {
   
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: function () {
        return this.role !== 'super-admin';
      },
      default: null,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },
    phone: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    refreshTokenHash: { type: String, select: false, default: null },
    resetPasswordToken: { type: String, select: false, default: null },
    resetPasswordExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

UserSchema.index(
  { email: 1, tenantId: 1 },
  { unique: true, partialFilterExpression: { tenantId: { $type: 'objectId' } } }
);
UserSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { role: 'super-admin' } });
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ isActive: 1 });

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
};

module.exports = model('User', UserSchema);
module.exports.ROLES = ROLES;