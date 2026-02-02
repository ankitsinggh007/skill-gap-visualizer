import { useEffect } from "react";
import { useAnalyze } from "@/context/AnalyzeContext";
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

  return <div className="mx-auto max-w-3xl">{steps[currentStep]}</div>;
}
