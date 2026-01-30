import SectionCard from "./SectionCard";

export default function RadarPlaceholder() {
  return (
    <SectionCard title="Skill Radar">
      <div className="flex min-h-64 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="text-4xl text-gray-300">📊</div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Coming in V2</p>
          <p className="mt-1 text-sm text-gray-600">
            Interactive radar chart showing skill distribution across categories
            will be available soon.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
