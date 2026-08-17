import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import AppLayout from '../../shared/components/AppLayout';
import PageHeader from '../../shared/components/PageHeader';
import ImageUpload from '../../shared/components/ImageUpload';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchMyDoctorProfile, updateMyDoctorProfile } from '../../api/doctor.api';

const navItems = [
  { to: '/doctor', label: 'My Schedule' },
  { to: '/doctor/profile', label: 'My Profile' },
];

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['doctor', 'me'], queryFn: fetchMyDoctorProfile });

  const [bio, setBio] = useState('');
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [newDegree, setNewDegree] = useState({ degree: '', institution: '', year: '' });
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setEducation(profile.education || []);
      setCertifications(profile.certifications || []);
      setLanguages(profile.languages || []);
    }
  }, [profile?._id]);

  const photoMutation = useMutation({
    mutationFn: (photoUrl) => updateMyDoctorProfile({ photoUrl }),
    onSuccess: (updated) => queryClient.setQueryData(['doctor', 'me'], updated),
  });

  const saveMutation = useMutation({
    mutationFn: updateMyDoctorProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['doctor', 'me'], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function addEducation() {
    if (!newDegree.degree.trim() || !newDegree.institution.trim()) return;
    setEducation((prev) => [...prev, { ...newDegree, year: newDegree.year ? Number(newDegree.year) : null }]);
    setNewDegree({ degree: '', institution: '', year: '' });
  }
  function removeEducation(index) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }

  function addCertification() {
    if (!newCertification.trim()) return;
    setCertifications((prev) => [...prev, newCertification.trim()]);
    setNewCertification('');
  }
  function removeCertification(index) {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  }

  function addLanguage() {
    if (!newLanguage.trim()) return;
    setLanguages((prev) => [...prev, newLanguage.trim()]);
    setNewLanguage('');
  }
  function removeLanguage(index) {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    saveMutation.mutate({ bio, education, certifications, languages });
  }

  if (isLoading || !profile) {
    return (
      <AppLayout navItems={navItems} title="Doctor">
        <p className="text-sm text-slate-400">Loading…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout navItems={navItems} title="Doctor">
      <PageHeader title="My Profile" subtitle="Manage your professional information" />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
          <p className="font-bold text-slate-900 mb-3">Photo</p>
          <ImageUpload
            category="doctor-photo"
            value={profile.photoUrl}
            onChange={(url) => photoMutation.mutate(url)}
            aspectRatio="aspect-square"
          />
          <p className="mt-4 text-sm text-slate-500">
            Dr. {profile.userId?.firstName} {profile.userId?.lastName}
          </p>
          <p className="text-xs text-slate-400">{profile.specialization} · {profile.departmentId?.name}</p>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <p className="font-bold text-slate-900">Biography</p>
            <textarea
              rows={4}
              maxLength={1000}
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Tell patients a bit about your background and approach to care…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <p className="font-bold text-slate-900">Education</p>
            <div className="mt-3 space-y-2">
              {education.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.degree} — {item.institution}</p>
                    {item.year && <p className="text-xs text-slate-400">{item.year}</p>}
                  </div>
                  <button onClick={() => removeEducation(i)} className="text-slate-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input placeholder="Degree" value={newDegree.degree} onChange={(e) => setNewDegree((p) => ({ ...p, degree: e.target.value }))} />
              <Input placeholder="Institution" value={newDegree.institution} onChange={(e) => setNewDegree((p) => ({ ...p, institution: e.target.value }))} className="sm:col-span-2" />
              <Input placeholder="Year" type="number" value={newDegree.year} onChange={(e) => setNewDegree((p) => ({ ...p, year: e.target.value }))} />
            </div>
            <button onClick={addEducation} className="mt-2 flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              <Plus size={14} /> Add Education
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <p className="font-bold text-slate-900">Certifications</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <span key={cert + i} className="flex items-center gap-1.5 bg-blue-50 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                  {cert}
                  <button onClick={() => removeCertification(i)} className="text-brand/60 hover:text-brand">×</button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="e.g. Board Certified Cardiologist" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} />
              <button onClick={addCertification} className="rounded-lg bg-slate-100 text-slate-700 px-4 text-sm font-medium hover:bg-slate-200 shrink-0">
                Add
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
            <p className="font-bold text-slate-900">Languages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <span key={lang + i} className="flex items-center gap-1.5 bg-blue-50 text-brand text-xs font-medium px-3 py-1.5 rounded-full">
                  {lang}
                  <button onClick={() => removeLanguage(i)} className="text-brand/60 hover:text-brand">×</button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="e.g. Amharic" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
              <button onClick={addLanguage} className="rounded-lg bg-slate-100 text-slate-700 px-4 text-sm font-medium hover:bg-slate-200 shrink-0">
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} isLoading={saveMutation.isPending}>Save Profile</Button>
            {saved && <span className="text-xs text-green-600 font-medium">Saved</span>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}