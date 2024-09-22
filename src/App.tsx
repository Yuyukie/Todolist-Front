import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import Accueil from "./pages/Accueil/Accueil";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold text-gray-800">404 - Page non trouvée</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/accueil"
              element={
                <ProtectedRoute>
                  <Accueil />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
