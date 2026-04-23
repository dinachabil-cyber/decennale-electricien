import React from 'react';

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`text-xs font-medium ${
              index <= currentStep ? 'text-yellow-600' : 'text-gray-400'
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default StepIndicator;