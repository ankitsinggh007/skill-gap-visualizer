import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import AnalysisPage from "./pages/AnalysisPage";
import WizardPage from "./pages/WizardPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/wizard" replace />} />
        <Route path="/wizard" element={<WizardPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
