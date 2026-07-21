const { Schema, model } = require('mongoose');
const tenantPlugin = require('../../shared/plugins/tenantPlugin');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MAX_DAILY_MINUTES = 8 * 60; 
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

const AvailabilitySlotSchema = new Schema(
  {
    day: { type: String, enum: DAYS, required: true },
    startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ }, // "HH:mm"
    endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const DoctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    specialization: { type: String, required: true, trim: true },
    qualifications: { type: [String], default: [] },
    experience: { type: Number, default: 0, min: 0 },
    availability: { type: [AvailabilitySlotSchema], default: [] },
    consultationDuration: { type: Number, default: 30, min: 5 }, // minutes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DoctorSchema.plugin(tenantPlugin);
DoctorSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
DoctorSchema.index({ tenantId: 1, departmentId: 1 });
DoctorSchema.index({ tenantId: 1, isActive: 1 });
DoctorSchema.index({ 'availability.day': 1 });

DoctorSchema.pre('validate', function (next) {
  const minutesByDay = {};

  for (const slot of this.availability) {
    const start = toMinutes(slot.startTime);
    const end = toMinutes(slot.endTime);

    if (end <= start) {
      return next(new Error(`Availability for ${slot.day} has endTime before/equal to startTime`));
    }

    minutesByDay[slot.day] = (minutesByDay[slot.day] || 0) + (end - start);
  }

  for (const [day, minutes] of Object.entries(minutesByDay)) {
    if (minutes > MAX_DAILY_MINUTES) {
      return next(new Error(`Total availability on ${day} exceeds the 8-hour daily maximum (BR-005)`));
    }
  }

  next();
});

module.exports = model('Doctor', DoctorSchema);