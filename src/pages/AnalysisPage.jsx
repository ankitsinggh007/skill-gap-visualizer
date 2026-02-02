import { useNavigate } from "react-router-dom";
import { useAnalyze } from "@/context/AnalyzeContext";
import { buildAnalysisVM } from "@/features/analysis/viewModel";
import SummaryHero from "@/features/analysis/sections/SummaryHero";
import CategoryBreakdown from "@/features/analysis/sections/CategoryBreakdown";
import SkillCloud from "@/features/analysis/sections/SkillCloud";
import RadarPlaceholder from "@/features/analysis/sections/RadarPlaceholder";
import Strengths from "@/features/analysis/sections/Strengths";
import Weaknesses from "@/features/analysis/sections/Weaknesses";
import CriticalGaps from "@/features/analysis/sections/CriticalGaps";
import PersonalizedPlan from "@/features/analysis/sections/PersonalizedPlan";

export default function AnalysisPage() {
  const { analysisResult, resetSession } = useAnalyze();
  const navigate = useNavigate();
  const viewModel = buildAnalysisVM(analysisResult);

  if (!viewModel.hasAnalysis) {
    return (
      <div className="mx-auto max-w-3xl">
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
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Your Analysis</h1>
          <p className="text-gray-600">
            Deep dive into your resume skills and recommendations.
          </p>
        </div>

        <div className="flex gap-2 sm:pt-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            Export
          </button>

          <button
            type="button"
            onClick={() => {
              resetSession();
              navigate("/wizard", { replace: true });
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <SummaryHero
          score={viewModel.score}
          levelLabel={viewModel.levelLabel}
          metadata={viewModel.metadata}
        />

        <CategoryBreakdown categoryScores={viewModel.categoryScores} />

        <SkillCloud
          matched={viewModel.matched}
          missing={viewModel.missing}
          weakSignals={viewModel.weakSignals}
        />

        <RadarPlaceholder />

        <Strengths
          strengths={viewModel.strengths}
          matched={viewModel.matched}
        />

        <Weaknesses
          weaknesses={viewModel.weaknesses}
          missing={viewModel.missing}
        />

        <CriticalGaps
          recommendations={viewModel.recommendationsByPriority.P0}
          insights={viewModel.insights}
        />

        <PersonalizedPlan
          recommendationsByPriority={viewModel.recommendationsByPriority}
        />
      </div>
    </div>
  );
}
