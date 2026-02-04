export default function PageLoader({ label = "Loading..." }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
            aria-hidden="true"
          />
          <div className="text-sm font-medium text-gray-700">{label}</div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-3 w-2/3 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
          <div className="h-3 w-5/6 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
