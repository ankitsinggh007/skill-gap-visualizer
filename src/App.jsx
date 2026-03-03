import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/ui/PageLoader";
import PageNotFound from "./pages/PageNotFound";
import WizardPage from "./pages/WizardPage";
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));

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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppShell>
  );
}

export default App;
