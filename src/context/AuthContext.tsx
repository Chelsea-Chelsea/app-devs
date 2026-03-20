import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'project';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  loginWithGoogle: () => void;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('gosign_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const defaultWorkspaces: Workspace[] = [
        { id: 'w1', name: 'My Workspace', type: 'personal' },
        { id: 'w2', name: 'Alpha Project', type: 'project' }
      ];
      setWorkspaces(defaultWorkspaces);
      setCurrentWorkspace(defaultWorkspaces[0]);
    } else {
      // Auto-login for seamless access without login screen
      const mockUser: User = {
        id: 'u1',
        name: 'Chelsea',
        email: 'chelsea@xpla.io',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chelsea'
      };
      const defaultWorkspaces: Workspace[] = [
        { id: 'w1', name: 'My Workspace', type: 'personal' },
        { id: 'w2', name: 'Alpha Project', type: 'project' }
      ];
      setUser(mockUser);
      setWorkspaces(defaultWorkspaces);
      setCurrentWorkspace(defaultWorkspaces[0]);
    }
  }, []);

  const loginWithGoogle = () => {
    // Simulate Google Login
    const mockUser: User = {
      id: 'u1',
      name: 'Alex Developer',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };
    const defaultWorkspaces: Workspace[] = [
      { id: 'w1', name: 'My Workspace', type: 'personal' },
      { id: 'w2', name: 'Alpha Project', type: 'project' }
    ];
    
    localStorage.setItem('gosign_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setWorkspaces(defaultWorkspaces);
    setCurrentWorkspace(defaultWorkspaces[0]);
  };

  const logout = () => {
    localStorage.removeItem('gosign_user');
    setUser(null);
    setWorkspaces([]);
    setCurrentWorkspace(null);
  };

  const switchWorkspace = (workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (ws) {
      setCurrentWorkspace(ws);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, currentWorkspace, workspaces, loginWithGoogle, logout, switchWorkspace }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
