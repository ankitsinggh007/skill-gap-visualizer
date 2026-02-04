import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { lazy, Suspense } from "react";
import PageLoader from "./components/ui/PageLoader";
const WizardPage = lazy(() => import("./pages/WizardPage"));
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));

function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/wizard" replace />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
