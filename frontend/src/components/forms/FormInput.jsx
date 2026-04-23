import React from 'react';

function FormInput({ value, onChange, placeholder, icon, required, type = 'text', autoFocus }) {
  return (
    <div className="flex w-full min-w-0">
      <span className="flex items-center px-4 py-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl shrink-0">
        <i className={`fas ${icon} text-yellow-500`}></i>
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        className="flex-1 min-w-0 w-full px-4 py-4 border border-gray-200 rounded-r-xl bg-light focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-200"
      />
    </div>
  );
}

export default FormInput;