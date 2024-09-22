import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import CreateForm from "../../components/CreateForm";
import Footer from "../../components/Footer";

const LoginPage: React.FC = () => {
  const [view, setView] = useState<"buttons" | "login" | "create">("buttons");

  const showLogin = () => setView("login");
  const showCreate = () => setView("create");
  const showButtons = () => setView("buttons");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-8">
            <div className="bg-white rounded-full w-72 h-72 flex items-center justify-center shadow-xl">
              <h1 className="text-center text-4xl font-extrabold text-blue-800 leading-tight">
                My
                <br />
                ToDoList
                <br />
                Every Day
              </h1>
            </div>
          </div>
          <div className="w-full bg-white p-8 rounded-lg shadow-2xl">
            {view === "buttons" && (
              <div className="space-y-4">
                <button
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  onClick={showLogin}
                >
                  Login
                </button>
                <button
                  className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-lg font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  onClick={showCreate}
                >
                  Create Account
                </button>
              </div>
            )}
            {view === "login" && <LoginForm onClose={showButtons} />}
            {view === "create" && <CreateForm onClose={showButtons} />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
