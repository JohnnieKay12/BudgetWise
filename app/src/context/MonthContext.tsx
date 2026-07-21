import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
  
  type MonthContextType = {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
  };
  
  const MonthContext = createContext<MonthContextType | undefined>(undefined);
  
  const STORAGE_KEY = "budgetwise-selected-month";
  
  export function MonthProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [currentMonth, setCurrentMonthState] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
  
      return saved ? new Date(saved) : new Date();
    });
  
    useEffect(() => {
      localStorage.setItem(
        STORAGE_KEY,
        currentMonth.toISOString()
      );
    }, [currentMonth]);
  
    const setCurrentMonth = (date: Date) => {
      setCurrentMonthState(date);
    };
  
    return (
      <MonthContext.Provider
        value={{
          currentMonth,
          setCurrentMonth,
        }}
      >
        {children}
      </MonthContext.Provider>
    );
  }
  
  export function useMonth() {
    const context = useContext(MonthContext);
  
    if (!context) {
      throw new Error(
        "useMonth must be used inside MonthProvider"
      );
    }
  
    return context;
  }