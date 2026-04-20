export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-surface-container-highest bg-surface-container ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-slate-50 border-b border-surface-container-highest">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-surface-container-highest">{children}</tbody>;
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3 text-on-surface text-sm ${className}`} {...props}>
      {children}
    </td>
  );
}
