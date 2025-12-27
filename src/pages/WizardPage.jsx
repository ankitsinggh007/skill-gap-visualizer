import { useAnalyze } from "@/context/AnalyzeContext";
import Step1Upload from "@/features/wizard/Step1Upload";
import Step2ExtractedSkills from "@/features/wizard/Step2ExtractedSkills";

export default function WizardPage() {
  const { currentStep } = useAnalyze();

  const steps = {
    1: <Step1Upload />,
    2: <Step2ExtractedSkills />,
    // step 3,4,5,6 will be added later
  };

  console.log(currentStep, "currenetStep");
  return <div className="mx-auto max-w-3xl py-8">{steps[currentStep]}</div>;
}
