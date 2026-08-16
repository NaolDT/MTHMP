const CHECKLIST = [
  { key: 'tagline', label: 'Tagline', check: (p) => !!p.tagline },
  { key: 'shortDescription', label: 'Short description', check: (p) => !!p.shortDescription },
  { key: 'fullDescription', label: 'Full description', check: (p) => !!p.fullDescription },
  { key: 'history', label: 'History', check: (p) => !!p.history },
  { key: 'missionVision', label: 'Mission & vision', check: (p) => !!p.mission && !!p.vision },
  { key: 'facilities', label: 'Facilities', check: (p) => p.facilities?.length > 0 },
  { key: 'contact', label: 'Contact information', check: (p) => !!p.contactAddress?.phone && !!p.contactAddress?.city },
  { key: 'workingHours', label: 'Working hours', check: (p) => p.workingHours?.length > 0 },
];

export function getProfileCompletion(profile) {
  const items = CHECKLIST.map((item) => ({ label: item.label, done: item.check(profile) }));
  const doneCount = items.filter((i) => i.done).length;
  const percent = Math.round((doneCount / CHECKLIST.length) * 100);
  return { percent, items };
}