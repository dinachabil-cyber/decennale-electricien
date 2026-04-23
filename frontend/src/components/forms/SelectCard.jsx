import React from 'react';

function SelectCard({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-3 ${
            value === option.value
              ? 'border-yellow-500 bg-yellow-50 shadow-md'
              : 'border-gray-200 bg-light hover:border-yellow-300 hover:shadow-sm'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            value === option.value ? 'bg-yellow-500 text-dark' : 'bg-gray-100 text-gray-500'
          }`}>
            <i className={`fas ${option.icon}`}></i>
          </div>
          <span className={`font-medium ${value === option.value ? 'text-dark' : 'text-gray-700'}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default SelectCard;