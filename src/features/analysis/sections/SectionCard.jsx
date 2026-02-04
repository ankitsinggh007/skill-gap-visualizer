export default function SectionCard({ title, children }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm print:border-gray-300 print:p-4 print:shadow-none">
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-gray-900 print:mb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
