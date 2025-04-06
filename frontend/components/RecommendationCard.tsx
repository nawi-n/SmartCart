import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/router';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { cartService } from '../services/cartService';

interface RecommendationCardProps {
  recommendation: {
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      brand: string;
      rating: number;
    };
    explanation: string;
    score: number;
  };
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const router = useRouter();
  const { product, explanation, score } = recommendation;

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product.id, 1);
      // You might want to show a success message here
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const matchPercentage = Math.round(score * 100);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || '/images/placeholder.jpg'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>
          <Chip
            label={`${matchPercentage}% Match`}
            color={matchPercentage >= 80 ? 'success' : matchPercentage >= 60 ? 'primary' : 'warning'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Why this product matches you:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
            {explanation}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" color="primary">
              ${product.price.toFixed(2)}
            </Typography>
            <Box>
              <Tooltip title="View Details">
                <IconButton
                  onClick={() => router.push(`/products/${product.id}`)}
                  sx={{ mr: 1 }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to Cart">
                <IconButton onClick={handleAddToCart}>
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 