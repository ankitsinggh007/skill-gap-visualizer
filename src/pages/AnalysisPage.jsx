import { useNavigate } from "react-router-dom";
import { useAnalyze } from "@/context/AnalyzeContext";

export default function AnalysisPage() {
  const { analysisResult, resetSession } = useAnalyze();
  const navigate = useNavigate();

  if (!analysisResult) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <div className="space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">No analysis yet</h2>
          <p className="text-gray-600">
            Start the wizard to upload a resume and run an analysis.
          </p>
          <button
            type="button"
            onClick={() => {
              resetSession();
              navigate("/wizard");
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Start wizard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="space-y-4 rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Analysis Ready</h2>
        <p className="text-gray-600">
          Your analysis has been generated. Visualization coming next.
        </p>
      </div>
    </div>
  );
}
