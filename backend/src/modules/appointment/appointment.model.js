const { Schema, model } = require('mongoose');
const tenantPlugin = require('../../shared/plugins/tenantPlugin');

const AppointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true }, // denormalized for reporting
    date: { type: Date, required: true }, // stored as midnight UTC for the appointment day
    startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed', 'no-show'],
      default: 'booked',
    },
    reasonForVisit: { type: String, default: '' },
    notes: { type: String, default: '' },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cancellation: {
      reason: { type: String, default: null },
      cancelledBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      cancelledAt: { type: Date, default: null },
      overridden: { type: Boolean, default: false }, // true if staff bypassed the 24h rule (BR-004)
    },
  },
  { timestamps: true }
);

AppointmentSchema.plugin(tenantPlugin);
AppointmentSchema.index({ tenantId: 1, doctorId: 1, date: 1 });
AppointmentSchema.index({ tenantId: 1, patientId: 1, date: -1 });
AppointmentSchema.index({ tenantId: 1, status: 1 });

module.exports = model('Appointment', AppointmentSchema);