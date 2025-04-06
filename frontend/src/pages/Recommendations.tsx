import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { ProductCard } from '../components/ProductCard';
import { useRecommendations } from '../contexts/RecommendationContext';
import { useAuth } from '../contexts/AuthContext';

const RecommendationsPage: React.FC = () => {
  const router = useRouter();
  const { recommendations, loading, error } = useRecommendations();
  const { user } = useAuth();

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
        Personalized Recommendations
      </Typography>
      <Grid container spacing={3}>
        {recommendations.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} showPsychographicMatch />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendationsPage; 