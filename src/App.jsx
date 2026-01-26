import { Navigate, Route, Routes } from "react-router-dom";
import AnalysisPage from "./pages/AnalysisPage";
import WizardPage from "./pages/WizardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/wizard" replace />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
    </Routes>
  );
}

export default App;
