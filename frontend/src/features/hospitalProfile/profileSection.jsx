export default function ProfileSection({ title, description, children, onSave, isSaving, saveError, saved }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
      <p className="font-bold text-slate-900">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}

      <div className="mt-4 space-y-4">{children}</div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-lg bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">Saved</span>}
        {saveError && <span className="text-xs text-red-600">{saveError}</span>}
      </div>
    </div>
  );
}