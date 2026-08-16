import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../shared/components/AppLayout';
import PageHeader from '../../shared/components/PageHeader';
import Modal from '../../shared/components/Modal';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { fetchPendingHospitalProfiles, approveHospitalProfile, rejectHospitalProfile } from '../../api/hospitalProfile.api';

const navItems = [
  { to: '/super-admin', label: 'Hospitals' },
  { to: '/super-admin/pending-reviews', label: 'Pending Reviews' },
];

export default function PendingReviewsPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['hospital-profile', 'pending'],
    queryFn: fetchPendingHospitalProfiles,
  });

  const approveMutation = useMutation({
    mutationFn: approveHospitalProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hospital-profile', 'pending'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectHospitalProfile(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospital-profile', 'pending'] });
      setRejectTarget(null);
      setReason('');
    },
    onError: (err) => setRejectError(err.response?.data?.message || 'Failed to reject'),
  });

  function handleRejectSubmit(e) {
    e.preventDefault();
    setRejectError('');
    rejectMutation.mutate({ id: rejectTarget._id, reason });
  }

  return (
    <AppLayout navItems={navItems} title="Super Admin">
      <PageHeader title="Pending Reviews" subtitle="Hospital profiles awaiting approval" />

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <p className="text-sm text-slate-400">No hospital profiles awaiting review.</p>
          </div>
        ) : (
          profiles.map((profile) => {
            const isExpanded = expandedId === profile._id;
            return (
              <div key={profile._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : profile._id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900">{profile.tenantId?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted {new Date(profile.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">
                    Pending
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4">
                    {profile.tagline && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase">Tagline</p>
                        <p className="text-sm text-slate-700 mt-0.5">{profile.tagline}</p>
                      </div>
                    )}
                    {profile.shortDescription && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase">Short Description</p>
                        <p className="text-sm text-slate-700 mt-0.5">{profile.shortDescription}</p>
                      </div>
                    )}
                    {profile.fullDescription && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase">Full Description</p>
                        <p className="text-sm text-slate-700 mt-0.5">{profile.fullDescription}</p>
                      </div>
                    )}
                    {profile.facilities?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase">Facilities</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {profile.facilities.map((f) => (
                            <span key={f} className="text-xs bg-blue-50 text-brand px-2 py-1 rounded-full">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.contactAddress?.phone && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase">Contact</p>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {profile.contactAddress.phone} · {profile.contactAddress.city}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveMutation.mutate(profile._id)}
                        isLoading={approveMutation.isPending}
                      >
                        Approve &amp; Publish
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => { setRejectTarget(profile); setReason(''); setRejectError(''); }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Hospital Profile">
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-sm text-slate-500">
            Rejecting <strong>{rejectTarget?.tenantId?.name}</strong>'s profile submission. This reverts it to draft
            and the reason will be shown to the hospital admin.
          </p>
          <Input
            id="reason"
            label="Reason for rejection"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          {rejectError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{rejectError}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="danger" isLoading={rejectMutation.isPending}>
              Confirm Rejection
            </Button>
            <Button type="button" variant="secondary" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}