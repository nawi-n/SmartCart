import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box p={3}>
      <Typography variant="h3" gutterBottom>
        Welcome to SmartCart
      </Typography>
      <Typography variant="body1" paragraph>
        Your personalized shopping experience powered by AI.
      </Typography>

      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} md={4}>
          <Box p={3} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Smart Recommendations
            </Typography>
            <Typography variant="body2" paragraph>
              Get personalized product recommendations based on your preferences and behavior.
            </Typography>
            <Link href="/recommendations" passHref>
              <Button variant="contained" color="primary">
                View Recommendations
              </Button>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box p={3} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Browse Products
            </Typography>
            <Typography variant="body2" paragraph>
              Explore our wide range of products with smart search and filtering.
            </Typography>
            <Link href="/products" passHref>
              <Button variant="contained" color="primary">
                Shop Now
              </Button>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box p={3} border={1} borderColor="primary.main" borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Your Profile
            </Typography>
            <Typography variant="body2" paragraph>
              Manage your preferences and view your shopping history.
            </Typography>
            <Link href="/customer" passHref>
              <Button variant="contained" color="primary">
                View Profile
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 