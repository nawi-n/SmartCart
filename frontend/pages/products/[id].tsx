import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, Rating, Button, TextField } from '@mui/material';
import { productService, Product } from '../../src/services/productService';
import { cartService } from '../../src/services/cartService';
import Layout from '../../components/Layout';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const data = await productService.getProductById(id as string);
        if (data) {
          setProduct(data);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      cartService.addToCart(product, quantity);
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Loading product details...
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            {error || 'Product not found'}
          </Typography>
          <Button variant="contained" onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Button variant="outlined" onClick={() => router.push('/products')} sx={{ mb: 3 }}>
          Back to Products
        </Button>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.image || '/images/placeholder.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={product.rating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.rating})
                  </Typography>
                </Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Category: {product.category}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Subcategory: {product.subcategory}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Brand: {product.brand}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    inputProps={{ min: 1 }}
                    sx={{ width: 100 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProductDetail; 