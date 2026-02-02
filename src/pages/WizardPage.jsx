import { useEffect } from "react";
import { useAnalyze } from "@/context/AnalyzeContext";
import StepIndicator from "@/components/StepIndicator";
import Step1Upload from "@/features/wizard/Step1Upload";
import Step2ExtractedSkills from "@/features/wizard/Step2ExtractedSkills";
import Step3BenchmarkForm from "@/features/wizard/Step3BenchmarkForm";

export default function WizardPage() {
  const { currentStep, setCurrentStep, extractedSkills, inferredSkills } =
    useAnalyze();
  const totalSkills = extractedSkills.length + inferredSkills.length;

  useEffect(() => {
    if (currentStep === 3 && totalSkills < 1) {
      setCurrentStep(2);
    }
  }, [currentStep, totalSkills, setCurrentStep]);

  const steps = {
    1: <Step1Upload />,
    2: <Step2ExtractedSkills />,
    3: <Step3BenchmarkForm />,
  };

  const stepTitles = {
    1: "Upload Resume",
    2: "Review Your Skills",
    3: "Benchmark Setup",
  };

  const stepDescriptions = {
    1: "Start by uploading your resume so we can extract your skills.",
    2: "Review extracted skills and add any missing ones.",
    3: "Select your target role, level, and company type for analysis.",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {stepTitles[currentStep]}
          </h1>
          <p className="text-lg text-gray-600">
            {stepDescriptions[currentStep]}
          </p>
        </div>

        <div>{steps[currentStep]}</div>
      </div>
    </div>
  );
}
