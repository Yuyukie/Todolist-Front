import React from "react";
import { useNavigate } from "react-router-dom";

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Bienvenue sur votre ToDoList Every Day
        </h2>
        <nav className="flex space-x-4">
          <button
            onClick={() => console.log("Configuration clicked")}
            className="bg-blue-300 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            Configuration
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-300 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Déconnexion
          </button>
        </nav>
      </div>
      <p className="text-lg text-blue-50 mt-4 text-center sm:text-left">
        Organisez vos tâches et restez productif !
      </p>
    </div>
  );
};

export default Banner;
