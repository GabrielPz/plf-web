// UpdateContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface UpdateContextType {
  refreshState: boolean;
  toggleRefresh: () => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const useUpdate = (): UpdateContextType => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdate must be used within a UpdateProvider');
  }
  return context;
};

interface UpdateProviderProps {
  children: ReactNode;
}

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const [refreshState, setRefreshState] = useState<boolean>(false);

  const toggleRefresh = () => {
    setRefreshState((prev) => !prev);
  };

  return (
    <UpdateContext.Provider value={{ refreshState, toggleRefresh }}>
      {children}
    </UpdateContext.Provider>
  );
};
