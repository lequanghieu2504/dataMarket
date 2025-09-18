import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SurveyPage from "./pages/SurveyPage";
import { mockAuthService } from "./services/mockAuthService";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

function App() {
  const user = mockAuthService.getCurrentUser();

  useEffect(() => {
    // Show welcome back toast if user is logged in
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
    }
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <div>Dashboard Page (Coming Soon)</div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/survey" element={<SurveyPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={"/dashboard"} />} />

      {/* 404 route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
