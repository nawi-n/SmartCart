import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useCustomer } from '../contexts/CustomerContext';
import PersonaMoodPanel from '../components/PersonaMoodPanel';

const CustomerProfilePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { customer, loading, error } = useCustomer();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box p={3} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body1">
              Name: {customer?.name}
            </Typography>
            <Typography variant="body1">
              Email: {customer?.email}
            </Typography>
            <Typography variant="body1">
              Age: {customer?.age}
            </Typography>
            <Typography variant="body1">
              Gender: {customer?.gender}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={3} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h6" gutterBottom>
              Shopping Preferences
            </Typography>
            <Typography variant="body1">
              Preferred Categories: {customer?.preferred_categories?.join(', ')}
            </Typography>
            <Typography variant="body1">
              Price Range: {customer?.price_range}
            </Typography>
            <Typography variant="body1">
              Shopping Frequency: {customer?.shopping_frequency}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PersonaMoodPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfilePage; 