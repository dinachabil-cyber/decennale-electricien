import React from 'react';

function StepContainer({ children, isActive }) {
  return (
    <div
      className={`transition-all duration-300 ${
        isActive
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 absolute -translate-x-4 pointer-events-none'
      }`}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}

export default StepContainer;