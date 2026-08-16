import { Check, Circle } from 'lucide-react';

export default function CompletionBar({ percent, items }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-900">Hospital Profile</p>
        <span className="text-sm font-semibold text-brand">{percent}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-brand transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs">
            {item.done ? (
              <Check size={13} className="text-green-600 shrink-0" />
            ) : (
              <Circle size={13} className="text-slate-300 shrink-0" />
            )}
            <span className={item.done ? 'text-slate-600' : 'text-slate-400'}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}