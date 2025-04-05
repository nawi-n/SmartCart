import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomerPersona } from '../api/client';

interface CustomerContextType {
  customer: CustomerPersona | null;
  setCustomer: (customer: CustomerPersona | null) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerPersona | null>(null);

  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}; 