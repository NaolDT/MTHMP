import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import Button from '../../shared/components/Button';
import { fetchDepartments } from '../../api/department.api';
import { fetchDoctors } from '../../api/doctor.api';
import { fetchSlots, bookAppointment } from '../../api/appointment.api';

const navItems = [
  { to: '/patient', label: 'My Appointments' },
  { to: '/patient/book', label: 'Book Appointment' },
];

function todayPlusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayPlusDays(1)); // tomorrow, avoids "book in the past"
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: () => fetchDepartments({ activeOnly: 'true' }) });

  const { data: doctors } = useQuery({
    queryKey: ['doctors', departmentId],
    queryFn: () => fetchDoctors({ departmentId, activeOnly: 'true' }),
    enabled: !!departmentId,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', doctorId, date],
    queryFn: () => fetchSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });

  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.response?.data?.message || 'Failed to book appointment'),
  });

  function handleDepartmentChange(id) {
    setDepartmentId(id);
    setDoctorId('');
    setSelectedSlot(null);
  }

  function handleDoctorChange(id) {
    setDoctorId(id);
    setSelectedSlot(null);
  }

  function handleConfirm() {
    setError('');
    bookMutation.mutate({ doctorId, date, startTime: selectedSlot, reasonForVisit });
  }

  if (success) {
    return (
      <AppLayout navItems={navItems} title="My Account">
        <div className="max-w-md mx-auto text-center py-16">
          <h2 className="text-xl font-semibold text-brand-dark">Appointment Booked!</h2>
          <p className="mt-2 text-sm text-slate-500">
            Your appointment on {date} at {selectedSlot} is confirmed. Check your email for details.
          </p>
          <Button className="mt-6" onClick={() => navigate('/patient')}>
            View My Appointments
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout navItems={navItems} title="My Account">
      <h1 className="text-xl sm:text-2xl font-semibold text-brand-dark">Book an Appointment</h1>

      <div className="mt-6 max-w-xl space-y-5">
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">1. Department</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
            value={departmentId}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">Select a department</option>
            {departments?.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {departmentId && (
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">2. Doctor</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
              value={doctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
            >
              <option value="">Select a doctor</option>
              {doctors?.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.userId?.firstName} {d.userId?.lastName} — {d.specialization}
                </option>
              ))}
            </select>
          </div>
        )}

        {doctorId && (
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">3. Date</label>
            <input
              type="date"
              min={todayPlusDays(0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
              value={date}
              onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
            />
          </div>
        )}

        {doctorId && date && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">4. Available Times</label>
            {slotsLoading ? (
              <p className="text-sm text-slate-400">Loading slots…</p>
            ) : slots?.length === 0 ? (
              <p className="text-sm text-slate-400">No slots available on this date — try another day.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.startTime}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.startTime)}
                    className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-medium border transition-colors
                      ${!slot.available ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : ''}
                      ${slot.available && selectedSlot === slot.startTime ? 'bg-brand text-white border-brand' : ''}
                      ${slot.available && selectedSlot !== slot.startTime ? 'bg-white text-slate-700 border-slate-300 hover:border-brand' : ''}
                    `}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">5. Reason for visit (optional)</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand"
              rows={3}
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        {selectedSlot && (
          <Button onClick={handleConfirm} isLoading={bookMutation.isPending}>
            Confirm Booking — {date} at {selectedSlot}
          </Button>
        )}
      </div>
    </AppLayout>
  );
}