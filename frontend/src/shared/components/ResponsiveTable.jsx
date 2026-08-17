export default function ResponsiveTable({ columns, rows, actions, emptyMessage = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && <td className="px-4 py-3.5">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row._id} className="bg-white rounded-2xl border border-slate-100 p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start py-1 text-sm">
                <span className="text-slate-400">{col.label}</span>
                <span className="text-slate-700 text-right ml-3">{col.render ? col.render(row) : row[col.key]}</span>
              </div>
            ))}
            {actions && <div className="mt-3 pt-3 border-t border-slate-100">{actions(row)}</div>}
          </div>
        ))}
      </div>
    </>
  );
}