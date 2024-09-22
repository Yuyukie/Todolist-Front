import React, { createContext, useState, ReactNode } from "react";

export interface DataItem {
  id: number;
  title: string;
  description: string;
  selected: string; // Assurez-vous que ce champ est bien typé
}

interface ContextProps {
  data: DataItem[];
  setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const Context = createContext<ContextProps | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Context.Provider value={{ data, setData, selectedDate, setSelectedDate }}>
      {children}
    </Context.Provider>
  );
};
