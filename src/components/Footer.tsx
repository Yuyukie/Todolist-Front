import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-6 items-center">
            <a
              href="https://www.linkedin.com/in/benjamin-mazars-emploi-alternance-apprentissage-developpeur-toulouse-2024-cdi/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-100 transition-colors duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="mailto:benjamin.mazars@example.com"
              className="hover:text-blue-100 transition-colors duration-300"
            >
              <FaEnvelope size={24} />
            </a>
            <a
              href="https://github.com/Yuyukie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-100 transition-colors duration-300"
            >
              <FaGithub size={24} />
            </a>
          </div>
          <div className="text-center text-sm text-blue-50">
            © {new Date().getFullYear()} Mazars Benjamin. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
