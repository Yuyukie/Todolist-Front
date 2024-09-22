import React, { useState, useCallback, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CreateProps {
  onClose: () => void;
}

const CreateForm: React.FC<CreateProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const validateForm = useCallback(() => {
    if (!email || !confirmEmail || !password || !confirmPassword) {
      return "Veuillez remplir tous les champs de saisie";
    } else if (!validateEmail(email)) {
      return "Veuillez fournir un email valide";
    } else if (email !== confirmEmail) {
      return "Les 2 emails ne sont pas identiques";
    } else if (!validatePassword(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.";
    } else if (password !== confirmPassword) {
      return "Les deux mots de passe ne sont pas identiques";
    }
    return "";
  }, [email, confirmEmail, password, confirmPassword]);

  useEffect(() => {
    if (formSubmitted) {
      const validationError = validateForm();
      setError(validationError);
    }
  }, [
    email,
    confirmEmail,
    password,
    confirmPassword,
    formSubmitted,
    validateForm,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Vérification de l'existence de l'utilisateur
      const checkResponse = await fetch(
        `http://localhost:1234/api/user/check/${email}`
      );
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.exists) {
          setError("Cet utilisateur existe déjà");
          return;
        }
      }

      // Création du compte
      const createResponse = await fetch(
        "http://localhost:1234/api/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (createResponse.ok) {
        const data = await createResponse.json();
        console.log("User creation successful:", data);
        onClose();
      } else {
        const errorData = await createResponse.json();
        setError(
          errorData.message ||
            "Une erreur est survenue lors de la création du compte"
        );
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
    <form onSubmit={handleSubmit} className="space-y-4 text-blue-800">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-blue-800"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Entrez votre adresse email"
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="confirmEmail"
          className="block text-sm font-medium text-blue-800"
        >
          Confirmer Email
        </label>
        <input
          id="confirmEmail"
          type="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder="Confirmez votre adresse email"
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-blue-800"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez votre mot de passe"
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
        >
          {showPassword ? (
            <FaEyeSlash className="text-blue-800" />
          ) : (
            <FaEye className="text-blue-800" />
          )}
        </button>
      </div>
      <div className="relative">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-blue-800"
        >
          Confirmer Mot de passe
        </label>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmez votre mot de passe"
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
        >
          {showConfirmPassword ? (
            <FaEyeSlash className="text-blue-800" />
          ) : (
            <FaEye className="text-blue-800" />
          )}
        </button>
      </div>
      <p className="text-xs text-blue-800 mt-1">
        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une
        minuscule et un chiffre.
      </p>

      {formSubmitted && error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
};

export default CreateForm;
