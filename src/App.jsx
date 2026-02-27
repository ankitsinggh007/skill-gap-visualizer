import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { lazy, Suspense } from "react";
import PageLoader from "./components/ui/PageLoader";
import WizardPage from "./pages/WizardPage";
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));
import ErrorBoundary from "./components/ErrorBoundary";
function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<WizardPage />} />

        <Route
          path="/analysis"
          element={
            <ErrorBoundary onReset={() => window.location.reload()}>
              <Suspense fallback={<PageLoader />}>
                <AnalysisPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Routes>
    </AppShell>
  );
}

export default App;
