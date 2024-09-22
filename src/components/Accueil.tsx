import React, { useState } from "react";
import Calendar from "./Calendar";
import CreateTask from "./CreateTask";

const Accueil: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenCreateTask = () => {
    if (selectedDate) {
      setIsCreateTaskModalOpen(true);
    }
  };

  const handleCreateTask = (
    title: string,
    description: string,
    date: string,
    category: string,
    priority: number
  ) => {
    // Logique pour créer une tâche
    console.log("Création de tâche:", {
      title,
      description,
      date,
      category,
      priority,
    });
    setIsCreateTaskModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accueil</h1>
      <Calendar onDateSelect={handleDateSelect} />
      <div className="mt-4">
        <button
          onClick={handleOpenCreateTask}
          disabled={!selectedDate}
          className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
            selectedDate
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Ajouter une tâche
        </button>
      </div>

      {isCreateTaskModalOpen && selectedDate && (
        <CreateTask
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
          selectedDate={selectedDate}
          categories={[]} // Vous devrez gérer les catégories ici
          onAddCategory={() => Promise.resolve({ _id: "", name: "" })} // À implémenter
          onDeleteCategory={() => Promise.resolve()} // À implémenter
        />
      )}
    </div>
  );
};

export default Accueil;
