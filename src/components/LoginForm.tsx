import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs de saisie");
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez fournir un email valide");
      return;
    }

    const data = { email, password };

    try {
      const response = await fetch("http://localhost:1234/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("authToken", result.token);
        console.log("Login successful:", result);
        onClose();
        navigate("/accueil");
      } else {
        const errorData = await response.json();
        if (errorData.message === "Email invalide") {
          setError("L'email fourni n'est pas valide.");
        } else {
          setError(
            errorData.message || "Une erreur est survenue lors de la connexion."
          );
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError(
          "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet."
        );
      } else {
        setError(
          "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-blue-800" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-blue-800"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-blue-800"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Se connecter
        </button>
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
