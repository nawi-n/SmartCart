import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Button, 
  IconButton,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { cartService, CartItem } from '../src/services/cartService';
import Layout from '../components/Layout';

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setCartItems(cartService.getCart());
    setLoading(false);

    // Subscribe to cart changes
    const unsubscribe = cartService.addListener(() => {
      setCartItems(cartService.getCart());
    });

    return () => unsubscribe();
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    cartService.removeFromCart(productId);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout process
    router.push('/checkout');
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Loading cart...
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.product.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.product.image || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="h2">
                          {item.product.name}
                        </Typography>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {item.product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                          sx={{ width: 80 }}
                        />
                        <Typography variant="h6" color="primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Items ({cartService.getTotalItems()})</Typography>
                  <Typography>${cartService.getTotalPrice().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${cartService.getTotalPrice().toFixed(2)}</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Cart; 