'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SnackContextType {
  showSnack: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

export const useSnack = () => {
  const context = useContext(SnackContext);
  if (!context) throw new Error('useSnack must be used within SnackProvider');
  return context;
};

interface SnackProviderProps {
  children: ReactNode;
}

export const SnackProvider = ({ children }: SnackProviderProps) => {
  const [snack, setSnack] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showSnack = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnack({ message, type });
    setTimeout(() => setSnack(null), 3000);
  };

  return (
    <SnackContext.Provider value={{ showSnack }}>
      {children}

      {/* Snack Container */}
      <div className="fixed bottom-5 right-5 z-50">
        <AnimatePresence>
          {snack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-1 rounded-lg text-md font-medium shadow-lg text-white ${
                snack.type === 'success'
                  ? 'bg-green-800'
                  : snack.type === 'error'
                  ? 'bg-red-800'
                  : 'bg-gray-800'
              }`}
            >
              {snack.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SnackContext.Provider>
  );
};
