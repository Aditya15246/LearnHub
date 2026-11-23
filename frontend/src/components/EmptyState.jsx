import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There are no records matching your criteria.',
  action = null
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;