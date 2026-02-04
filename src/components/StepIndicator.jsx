/**
 * Step Indicator Component
 * Visual progress indicator for multi-step wizard flows
 */
export default function StepIndicator({ currentStep = 1, totalSteps = 3 }) {
  return (
    <div className="mb-8 space-y-4">
      {/* Progress Bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Dots */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center gap-2 ${
              step === currentStep ? "opacity-100" : "opacity-60"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                step < currentStep
                  ? "bg-green-500 text-white"
                  : step === currentStep
                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            <span className="text-xs font-medium text-gray-600">
              Step {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
