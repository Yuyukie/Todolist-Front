import React, { useState, useEffect } from "react";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    // Sélectionner le jour actuel au chargement initial
    const today = new Date();
    if (
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    ) {
      setSelectedDay(today.getDate());
      onDateSelect(today);
    }
  }, [currentDate, onDateSelect]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
      0,
      0,
      0
    );
    // Ajuster la date pour le fuseau horaire local
    const localDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    onDateSelect(localDate);
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-800">
          {currentDate.toLocaleString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={nextMonth}
          className="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium text-blue-800 mb-2">
            {day}
          </div>
        ))}
        {Array((firstDayOfMonth + 6) % 7)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="text-center p-2"></div>
          ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className={`text-center p-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
              ${
                day === selectedDay
                  ? "bg-blue-600 text-white"
                  : "text-blue-800 hover:bg-blue-300"
              }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
