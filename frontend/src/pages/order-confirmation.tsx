import { useRouter } from 'next/router';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Layout from '../components/Layout';

const OrderConfirmation = () => {
  const router = useRouter();

  return (
    <Layout>
      <Container>
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
          <CardContent>
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 80, mb: 2 }} 
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Thank You for Your Order!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your order has been successfully placed. We've sent a confirmation email with your order details.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Order Number: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/products')}
                sx={{ mr: 2 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default OrderConfirmation; 