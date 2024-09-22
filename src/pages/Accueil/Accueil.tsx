import React, { useState, useEffect, useCallback } from "react";
import DailyTask, { Task } from "../../components/DailyTask";
import Banner from "../../components/Banner";
import Calendar from "../../components/Calendar";
import Modal from "../../components/Modal";
import CreateTask from "../../components/CreateTask";
import { FaPencilAlt } from "react-icons/fa";
import Footer from "@/components/Footer";

interface Category {
  _id: string;
  name: string;
}

const Accueil: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const fetchTasks = useCallback(async (date: Date) => {
    try {
      const token = localStorage.getItem("authToken");
      const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      const response = await fetch(
        `http://localhost:1234/api/card/${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:1234/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error(
          "Échec de la récupération des catégories:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const handleAddCategory = async (newCategoryName: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:1234/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${errorText}`);
      }

      const addedCategory = await response.json();
      setCategories([...categories, addedCategory]);
      return addedCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const handleCreateCard = async (
    title: string,
    description: string,
    date: string,
    category: string,
    priority: number
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:1234/api/card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date,
          category,
          priority,
          isCompleted: false,
        }),
      });

      if (response.ok) {
        const newCard = await response.json();
        setTasks((prevTasks) => [...prevTasks, newCard]);
        setIsCreateModalOpen(false);
      } else {
        console.error("Failed to create card");
      }
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:1234/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to delete category: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(`Error deleting category: ${(error as Error).message}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:1234/api/card/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));

        // Vérifier si la tâche supprimée est celle actuellement affichée
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(null);
        }
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      if (!taskToUpdate) return;

      const newCompletionStatus = !taskToUpdate.isCompleted;

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:1234/api/card/${taskId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isCompleted: newCompletionStatus }),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, isCompleted: updatedTask.isCompleted }
              : task
          )
        );
        // Mettre à jour selectedTask si la tâche mise à jour est actuellement sélectionnée
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask({
            ...selectedTask,
            isCompleted: updatedTask.isCompleted,
          });
        }
      } else {
        console.error("Failed to update task completion status");
      }
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate, fetchTasks]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getPriorityName = (priority: number): string => {
    switch (priority) {
      case 1:
        return "Basse";
      case 2:
        return "Moyenne";
      case 3:
        return "Haute";
      default:
        return "Inconnue";
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (
    id: string,
    title: string,
    description: string,
    date: string,
    category: string,
    priority: number
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:1234/api/card/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, category, priority }),
      });

      if (response.ok) {
        const updatedCard = await response.json();
        setTasks(tasks.map((task) => (task._id === id ? updatedCard : task)));
        setSelectedTask(updatedCard);
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update card");
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 to-blue-200">
      <Banner />
      <div className="flex-grow flex flex-col p-8 space-y-8 justify-center">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">
              Tâches du jour ({selectedDate.toLocaleDateString()})
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Ajouter une tâche
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 overflow-auto">
            {tasks.length > 0 ? (
              <DailyTask
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onTaskDelete={handleDeleteTask}
                onTaskComplete={handleTaskComplete}
              />
            ) : (
              <div className="text-center text-blue-800">
                <p>Aucune tâche aujourd'hui.</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-[70%]">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Calendrier
            </h2>
            <div className="h-[500px] flex flex-col justify-center">
              <Calendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          </div>
          <div className="w-full md:w-[30%] mt-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Détails de la tâche
            </h2>
            <div className="bg-white rounded-lg shadow-xl p-6 h-[500px] overflow-y-auto relative">
              {selectedTask ? (
                <div className="h-full flex flex-col">
                  <button
                    onClick={() => handleEditTask(selectedTask)}
                    className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <FaPencilAlt size={20} />
                  </button>
                  <h3
                    className={`text-xl font-semibold text-blue-900 bg-blue-100 px-3 py-2 rounded-md w-full shadow-sm mb-3 ${
                      selectedTask.isCompleted
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {selectedTask.title}
                  </h3>
                  <div className="mb-2 w-full">
                    <span
                      className={`text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-md font-semibold shadow-sm w-full inline-block ${
                        selectedTask.isCompleted
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      Catégorie : {selectedTask.category.name}
                    </span>
                  </div>
                  <div className="mb-3 w-full">
                    <span
                      className={`text-sm px-3 py-2 rounded-md ${getPriorityColor(
                        getPriorityName(selectedTask.priority)
                      )} font-semibold shadow-sm w-full inline-block ${
                        selectedTask.isCompleted
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      Priorité : {getPriorityName(selectedTask.priority)}
                    </span>
                  </div>
                  <p
                    className={`text-blue-700 mt-2 bg-blue-50 px-3 py-2 pb-4 rounded-md w-full border border-blue-200 shadow-inner flex-grow overflow-y-auto break-words ${
                      selectedTask.isCompleted
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {selectedTask.description}
                  </p>
                </div>
              ) : (
                <p className="text-blue-800 h-full flex items-center justify-center">
                  Sélectionnez une tâche pour voir les détails
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une nouvelle carte"
      >
        <CreateTask
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTask={handleCreateCard}
          selectedDate={selectedDate}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </Modal>
      {selectedTask && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          title="Modifier la tâche"
        >
          <CreateTask
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            onCreateTask={(title, description, date, category, priority) =>
              handleUpdateTask(
                selectedTask._id,
                title,
                description,
                date,
                category,
                priority
              )
            }
            selectedDate={new Date(selectedTask.date)}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            initialTask={selectedTask}
          />
        </Modal>
      )}
      <Footer />
    </div>
  );
};

// Ajoutez cette fonction pour obtenir la couleur de priorité
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

export default Accueil;
