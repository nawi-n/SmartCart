import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface Recommendation {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  explanation: string;
  confidence: number;
}

const Recommendations: NextPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Recommendations - SmartCart</title>
        <meta name="description" content="Personalized product recommendations" />
      </Head>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Your Recommendations
        </Typography>
        
        {loading ? (
          <Typography>Loading recommendations...</Typography>
        ) : (
          <Grid container spacing={4}>
            {recommendations.map((rec) => (
              <Grid item key={rec.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={rec.product.image}
                    alt={rec.product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {rec.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rec.product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      ${rec.product.price}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Why we recommend this:
                      </Typography>
                      <Typography variant="body2">
                        {rec.explanation}
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ mt: 2 }}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Recommendations; 