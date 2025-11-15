import React, {createContext, useContext, useState} from 'react';

type SessionContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isFirstSession: boolean;
  setIsFirstSession: (isFirstSession: boolean) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isFirstSession, setIsFirstSession] = useState<boolean>(true);

  return (
    <SessionContext.Provider
      value={{token, setToken, isFirstSession, setIsFirstSession}}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
