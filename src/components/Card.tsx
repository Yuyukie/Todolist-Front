import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

interface CardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  onClick?: () => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
  isCompleted: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  category,
  priority,
  onClick,
  onDelete,
  onComplete,
  isCompleted: initialIsCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);

  useEffect(() => {
    setIsCompleted(initialIsCompleted);
  }, [initialIsCompleted]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      onDelete(id);
    }
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete(id, e);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Basse":
        return "bg-green-100 text-green-800";
      case "Moyenne":
        return "bg-yellow-100 text-yellow-800";
      case "Haute":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedStyle = isCompleted ? "text-gray-500 line-through" : "";

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-all duration-300 border-2 ${
        isCompleted
          ? "border-green-400 hover:border-green-500"
          : "border-blue-400 hover:border-blue-600"
      } cursor-pointer transform hover:scale-105 relative flex flex-col items-center text-center h-full`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-blue-500 hover:text-red-600 transition-colors duration-200"
      >
        <FaTimes />
      </button>
      <button
        onClick={handleComplete}
        className={`absolute top-2 left-2 ${
          isCompleted ? "text-green-600" : "text-gray-400"
        } hover:text-green-700 transition-colors duration-200`}
      >
        <FaCheck />
      </button>
      <h3
        className={`text-xl font-semibold mb-3 bg-blue-100 px-3 py-2 rounded-md w-full shadow-sm ${
          isCompleted ? "text-gray-500 line-through" : "text-blue-900"
        }`}
      >
        {title}
      </h3>
      <div className="mb-2 w-full">
        <span
          className={`text-sm px-3 py-2 rounded-md ${getPriorityColor(
            priority
          )} font-semibold shadow-sm w-full inline-block ${completedStyle}`}
        >
          Priorité : {priority}
        </span>
      </div>
      <div className="mb-3 w-full">
        <span
          className={`text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-md font-semibold shadow-sm w-full inline-block ${completedStyle}`}
        >
          Catégorie : {category}
        </span>
      </div>
      <div className="flex-grow w-full flex flex-col">
        <p
          className={`text-blue-700 bg-blue-50 px-4 py-3 rounded-md w-full border border-blue-200 shadow-inner ${completedStyle} overflow-hidden break-words text-left flex-grow`}
        >
          {truncateDescription(description, 50)}
        </p>
      </div>
    </div>
  );
};

export type { CardProps };
export default Card;
