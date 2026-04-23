import React from 'react';

function ConsentCheckbox({ field, checked, onChange }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(field.key, e.target.checked)}
        className="mt-1 w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
      />
      <span className="text-xs md:text-sm text-gray-600">
        {field.consentText}
      </span>
    </div>
  );
}

export default ConsentCheckbox;