import React from 'react';

const StatusBadge = ({ status }) => {
  const configs = {
    published: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Published'
    },
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Pending Approval'
    },
    draft: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      label: 'Draft'
    },
    rejected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Rejected'
    },
    active: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'In Progress'
    },
    completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Completed'
    },
    suspended: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Suspended'
    }
  };

  const current = configs[status?.toLowerCase()] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    label: status
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {current.label}
    </span>
  );
};

export default StatusBadge;
