import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import PageHeader from '../../shared/components/PageHeader';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchMyHospitalProfile, updateHospitalProfile, submitHospitalProfileForReview } from '../../api/hospitalProfile.api';
import { getProfileCompletion } from './completionScore';
import CompletionBar from './CompletionBar';
import ProfileSection from './ProfileSection';
import ImageUpload from '../../shared/components/ImageUpload';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/hospital-profile', label: 'Hospital Profile' },
  { to: '/admin/departments', label: 'Departments' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/appointments', label: 'Appointments' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const statusMeta = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
  published: { label: 'Published', color: 'bg-green-100 text-green-700' },
};

function useSectionForm(profile, fields, queryClient) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f, profile?.[f] ?? ''])));
  const [loadedProfileId, setLoadedProfileId] = useState(profile?._id);
  const [saved, setSaved] = useState(false);

  
  if (profile && profile._id !== loadedProfileId) {
    setLoadedProfileId(profile._id);
    setValues(Object.fromEntries(fields.map((f) => [f, profile[f] ?? ''])));
  }

  const mutation = useMutation({
    mutationFn: updateHospitalProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['hospital-profile'], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function setField(name, value) {
    setValues((p) => ({ ...p, [name]: value }));
  }

  function save() {
    mutation.mutate(values);
  }

  return {
    values,
    setField,
    save,
    isSaving: mutation.isPending,
    saved,
    saveError: mutation.isError ? mutation.error.response?.data?.message : null,
  };
}

export default function HospitalProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['hospital-profile'], queryFn: fetchMyHospitalProfile });

  const basicInfo = useSectionForm(profile, ['tagline', 'shortDescription', 'foundingYear'], queryClient);
  const about = useSectionForm(profile, ['fullDescription', 'history'], queryClient);
  const missionVision = useSectionForm(profile, ['mission', 'vision'], queryClient);
  const contact = useSectionForm(profile, ['contactAddress'], queryClient);

  const [facilitiesInput, setFacilitiesInput] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);

  const [loadedFacilitiesId, setLoadedFacilitiesId] = useState(null);

if (profile && profile._id !== loadedFacilitiesId) {
  setLoadedFacilitiesId(profile._id);
  setFacilities(profile.facilities || []);
  setWorkingHours(
    profile.workingHours?.length
      ? profile.workingHours
      : DAYS.map((day) => ({ day, openTime: '09:00', closeTime: '17:00', isOpen: true }))
  );
}

  const facilitiesMutation = useMutation({
    mutationFn: updateHospitalProfile,
    onSuccess: (updated) => queryClient.setQueryData(['hospital-profile'], updated),
  });
  const workingHoursMutation = useMutation({
    mutationFn: updateHospitalProfile,
    onSuccess: (updated) => queryClient.setQueryData(['hospital-profile'], updated),
  });
  const submitMutation = useMutation({
    mutationFn: submitHospitalProfileForReview,
    onSuccess: (updated) => queryClient.setQueryData(['hospital-profile'], updated),
  });

  function addFacility() {
    if (!facilitiesInput.trim()) return;
    setFacilities((prev) => [...prev, facilitiesInput.trim()]);
    setFacilitiesInput('');
  }
  function removeFacility(index) {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  }
  function updateWorkingHourRow(index, field, value) {
    setWorkingHours((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  if (isLoading || !profile) {
    return (
      <AppLayout navItems={navItems} title="Hospital Admin">
        <p className="text-sm text-slate-400">Loading…</p>
      </AppLayout>
    );
  }

  const { percent, items } = getProfileCompletion(profile);
  const status = statusMeta[profile.status];

  return (
    <AppLayout navItems={navItems} title="Hospital Admin">
      <PageHeader
        title="Hospital Profile"
        subtitle="Manage your hospital's public information"
        actions={
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
            {profile.status === 'draft' && (
              <Button onClick={() => submitMutation.mutate()} isLoading={submitMutation.isPending}>
                Submit for Review
              </Button>
            )}
          </div>
        }
      />

      {profile.status === 'draft' && profile.rejectionReason && (
        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          <strong>Previous submission was rejected:</strong> {profile.rejectionReason}
        </div>
      )}

      <div className="mt-6 space-y-5">
        <CompletionBar percent={percent} items={items} />

        <ProfileSection title="Branding" description="Your hospital's logo and cover image">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <ImageUpload
      label="Logo"
      category="hospital-logo"
      value={profile.logoUrl}
      onChange={(url) => {
  console.log('Uploading logo, url:', url);
  updateHospitalProfile({ logoUrl: url }).then((updated) => queryClient.setQueryData(['hospital-profile'], updated));
}}
      aspectRatio="aspect-square"
    />
    <ImageUpload
      label="Cover Image"
      category="hospital-cover"
      value={profile.coverImageUrl}
      onChange={(url) => updateHospitalProfile({ coverImageUrl: url }).then((updated) => queryClient.setQueryData(['hospital-profile'], updated))}
      aspectRatio="aspect-video"
    />
  </div>
</ProfileSection>

        <ProfileSection title="Basic Information" description="Tagline, short summary, and founding year" {...basicInfo} onSave={basicInfo.save}>
          <Input
            id="tagline"
            label="Tagline"
            placeholder="e.g. Compassionate care, every day."
            value={basicInfo.values.tagline}
            onChange={(e) => basicInfo.setField('tagline', e.target.value)}
          />
          <Input
            id="shortDescription"
            label="Short Description"
            value={basicInfo.values.shortDescription}
            onChange={(e) => basicInfo.setField('shortDescription', e.target.value)}
          />
          <Input
            id="foundingYear"
            type="number"
            label="Founding Year"
            value={basicInfo.values.foundingYear}
            onChange={(e) => basicInfo.setField('foundingYear', e.target.value ? Number(e.target.value) : null)}
          />
        </ProfileSection>

        <ProfileSection title="About & History" {...about} onSave={about.save}>
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              value={about.values.fullDescription}
              onChange={(e) => about.setField('fullDescription', e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">History</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              value={about.values.history}
              onChange={(e) => about.setField('history', e.target.value)}
            />
          </div>
        </ProfileSection>

        <ProfileSection title="Mission & Vision" {...missionVision} onSave={missionVision.save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mission</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={missionVision.values.mission}
                onChange={(e) => missionVision.setField('mission', e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Vision</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={missionVision.values.vision}
                onChange={(e) => missionVision.setField('vision', e.target.value)}
              />
            </div>
          </div>
        </ProfileSection>

        <ProfileSection
          title="Facilities"
          description="List the facilities your hospital offers"
          onSave={() => facilitiesMutation.mutate({ facilities })}
          isSaving={facilitiesMutation.isPending}
          saved={facilitiesMutation.isSuccess}
          saveError={facilitiesMutation.isError ? facilitiesMutation.error.response?.data?.message : null}
        >
          <div className="flex gap-2">
            <Input
              id="facilityInput"
              placeholder="e.g. Emergency Care"
              value={facilitiesInput}
              onChange={(e) => setFacilitiesInput(e.target.value)}
            />
            <button
              type="button"
              onClick={addFacility}
              className="rounded-lg bg-slate-100 text-slate-700 px-4 text-sm font-medium hover:bg-slate-200 shrink-0"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {facilities.map((f, i) => (
              <span key={f + i} className="flex items-center gap-1.5 bg-blue-50 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                {f}
                <button onClick={() => removeFacility(i)} className="text-brand/60 hover:text-brand">×</button>
              </span>
            ))}
            {facilities.length === 0 && <p className="text-xs text-slate-400">No facilities added yet.</p>}
          </div>
        </ProfileSection>

        <ProfileSection title="Contact Information" {...contact} onSave={contact.save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="phone"
              label="Phone"
              value={contact.values.contactAddress?.phone || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, phone: e.target.value })}
            />
            <Input
              id="email"
              label="Email"
              value={contact.values.contactAddress?.email || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, email: e.target.value })}
            />
            <Input
              id="emergencyPhone"
              label="Emergency Phone"
              value={contact.values.contactAddress?.emergencyPhone || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, emergencyPhone: e.target.value })}
            />
            <Input
              id="city"
              label="City"
              value={contact.values.contactAddress?.city || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, city: e.target.value })}
            />
            <Input
              id="region"
              label="Region"
              value={contact.values.contactAddress?.region || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, region: e.target.value })}
            />
            <Input
              id="street"
              label="Street Address"
              value={contact.values.contactAddress?.street || ''}
              onChange={(e) => contact.setField('contactAddress', { ...contact.values.contactAddress, street: e.target.value })}
            />
          </div>
        </ProfileSection>

        <ProfileSection
          title="Working Hours"
          onSave={() => workingHoursMutation.mutate({ workingHours })}
          isSaving={workingHoursMutation.isPending}
          saved={workingHoursMutation.isSuccess}
          saveError={workingHoursMutation.isError ? workingHoursMutation.error.response?.data?.message : null}
        >
          <div className="space-y-2">
            {workingHours.map((row, i) => (
              <div key={row.day} className="flex flex-wrap items-center gap-3 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="w-20 text-sm font-medium text-slate-700 capitalize shrink-0">{row.day}</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  <input
                    type="checkbox"
                    checked={row.isOpen}
                    onChange={(e) => updateWorkingHourRow(i, 'isOpen', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Open
                </label>
                {row.isOpen && (
                  <>
                    <input
                      type="time"
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={row.openTime}
                      onChange={(e) => updateWorkingHourRow(i, 'openTime', e.target.value)}
                    />
                    <span className="text-slate-400 text-sm">–</span>
                    <input
                      type="time"
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={row.closeTime}
                      onChange={(e) => updateWorkingHourRow(i, 'closeTime', e.target.value)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </ProfileSection>
      </div>
    </AppLayout>
  );
}