import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerProvider } from './contexts/CustomerContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CustomerProfile from './pages/CustomerProfile';
import Products from './pages/Products';
import Recommendations from './pages/Recommendations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/customer" element={<CustomerProfile />} />
              <Route path="/products" element={<Products />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </Layout>
        </Router>
      </CustomerProvider>
    </QueryClientProvider>
  );
};

export default App;
