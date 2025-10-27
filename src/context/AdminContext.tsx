import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkIsAdmin, getUserRole, UserRole } from '../lib/admin';
import { useApp } from './AppContext';

interface AdminContextType {
  isAdmin: boolean;
  userRole: UserRole | null;
  loading: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [adminStatus, role] = await Promise.all([
        checkIsAdmin(),
        getUserRole()
      ]);

      setIsAdmin(adminStatus);
      setUserRole(role);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminStatus();
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, userRole, loading, refreshAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
