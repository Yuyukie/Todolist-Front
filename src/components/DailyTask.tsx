import React from "react";
import Card from "./Card";

export interface Task {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: {
    _id: string;
    name: string;
  };
  priority: number;
  isCompleted: boolean;
}

interface DailyTaskProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskComplete: (id: string, isCompleted: boolean) => void;
}

const DailyTask: React.FC<DailyTaskProps> = ({
  tasks,
  onTaskClick,
  onTaskDelete,
  onTaskComplete,
}) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <Card
          key={task._id}
          id={task._id}
          title={task.title}
          description={task.description}
          category={task.category.name}
          priority={getPriorityName(task.priority)}
          onClick={() => onTaskClick(task)}
          onDelete={onTaskDelete}
          onComplete={(id) => onTaskComplete(id, !task.isCompleted)}
          isCompleted={task.isCompleted}
        />
      ))}
    </div>
  );
};

export default DailyTask;
