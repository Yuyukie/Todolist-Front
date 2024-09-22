import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaTrash } from "react-icons/fa";

interface Task {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: {
    _id: string;
    name: string;
  };
  priority: number;
}

interface Category {
  _id: string;
  name: string;
}

interface Priority {
  value: number;
  label: string;
}

interface CreateTaskProps {
  onClose: () => void;
  onCreateTask: (
    title: string,
    description: string,
    date: string,
    category: string,
    priority: number
  ) => void;
  selectedDate: Date | null;
  categories: Category[];
  onAddCategory: (name: string) => Promise<Category>;
  onDeleteCategory: (id: string) => Promise<void>;
  initialTask?: Task;
}

const MAX_TITLE_LENGTH = 16; // Modifié de 50 à 16

const CreateTask: React.FC<CreateTaskProps> = ({
  onClose,
  onCreateTask,
  selectedDate,
  categories,
  onAddCategory,
  onDeleteCategory,
  initialTask,
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [category, setCategory] = useState<string>(
    initialTask?.category._id || ""
  );
  const [priority, setPriority] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isPrioritySelectOpen, setIsPrioritySelectOpen] = useState(false);
  const categorySelectRef = useRef<HTMLDivElement>(null);
  const prioritySelectRef = useRef<HTMLDivElement>(null);
  const newCategoryRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const priorities: Priority[] = [
    { value: 1, label: "Basse" },
    { value: 2, label: "Moyenne" },
    { value: 3, label: "Haute" },
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(newTitle);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categorySelectRef.current &&
        !categorySelectRef.current.contains(event.target as Node)
      ) {
        setIsCategorySelectOpen(false);
      }
      if (
        prioritySelectRef.current &&
        !prioritySelectRef.current.contains(event.target as Node)
      ) {
        setIsPrioritySelectOpen(false);
      }
      if (
        isAddingCategory &&
        newCategoryRef.current &&
        !newCategoryRef.current.contains(event.target as Node)
      ) {
        setIsAddingCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddingCategory]);

  const validateForm = useCallback(() => {
    if (!title.trim()) {
      return "Veuillez entrer un titre pour la tâche";
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return `Le titre ne doit pas dépasser ${MAX_TITLE_LENGTH} caractères`;
    }
    if (!description.trim()) {
      return "Veuillez entrer une description pour la tâche";
    }
    if (!category) {
      return "Veuillez sélectionner une catégorie";
    }
    if (priority === null) {
      return "Veuillez sélectionner une priorité";
    }
    if (!selectedDate) {
      return "Veuillez sélectionner un jour";
    }
    return null;
  }, [title, description, category, priority, selectedDate]);

  useEffect(() => {
    setError(validateForm());
  }, [title, description, category, priority, selectedDate, validateForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    onCreateTask(
      title,
      description,
      selectedDate!.toISOString().split("T")[0],
      category,
      priority!
    );
    onClose();
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    try {
      const addedCategory = await onAddCategory(newCategory);
      setCategory(addedCategory._id);
      setNewCategory("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      alert(
        `Erreur lors de l'ajout de la catégorie: ${(error as Error).message}`
      );
    }
  };

  const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDeleteCategory(id);
      if (category === id) {
        setCategory("");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      alert(
        `Erreur lors de la suppression de la catégorie: ${
          (error as Error).message
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-blue-800">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-blue-800"
        >
          Titre
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            maxLength={MAX_TITLE_LENGTH}
            className="block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-sm text-gray-500">
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-blue-800"
        >
          Catégorie
        </label>
        <div className="relative" ref={categorySelectRef}>
          <div
            className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-50"
            onClick={() => setIsCategorySelectOpen(!isCategorySelectOpen)}
          >
            {category
              ? categories.find((cat) => cat._id === category)?.name
              : "Sélectionnez une catégorie"}
          </div>
          {isCategorySelectOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-300 rounded-md shadow-lg">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors duration-200 ease-in-out"
                  onClick={() => {
                    setCategory(cat._id);
                    setIsCategorySelectOpen(false);
                  }}
                >
                  {cat.name}
                  <FaTrash
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 ease-in-out"
                    onClick={(e) => handleDeleteCategory(cat._id, e)}
                  />
                </div>
              ))}
              <div
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600 transition-colors duration-200 ease-in-out"
                onClick={() => {
                  setIsAddingCategory(true);
                  setIsCategorySelectOpen(false);
                }}
              >
                + Ajouter une nouvelle catégorie
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddingCategory && (
        <div className="flex mt-2" ref={newCategoryRef}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-3 py-2 bg-white border border-blue-300 rounded-l-md text-blue-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de la nouvelle catégorie"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter
          </button>
        </div>
      )}

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-blue-800"
        >
          Priorité
        </label>
        <div className="relative" ref={prioritySelectRef}>
          <div
            className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-50"
            onClick={() => setIsPrioritySelectOpen(!isPrioritySelectOpen)}
          >
            {priority !== null
              ? priorities.find((p) => p.value === priority)?.label
              : "Sélectionner une priorité"}
          </div>
          {isPrioritySelectOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-300 rounded-md shadow-lg">
              {priorities.map((p) => (
                <div
                  key={p.value}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ease-in-out"
                  onClick={() => {
                    setPriority(p.value);
                    setIsPrioritySelectOpen(false);
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-blue-800"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-blue-800 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
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
          {initialTask ? "Modifier" : "Créer"}
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

export default CreateTask;
