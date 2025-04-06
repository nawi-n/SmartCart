import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  Badge,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { cartService } from '../src/services/cartService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    // Initial load
    setCartItems(cartService.getTotalItems());

    // Subscribe to cart changes
    const unsubscribe = cartService.addListener(() => {
      setCartItems(cartService.getTotalItems());
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>SmartCart</title>
        <meta name="description" content="Smart shopping experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            SmartCart
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => router.push('/products')}
            >
              Products
            </Button>
            <IconButton 
              color="inherit" 
              onClick={() => router.push('/cart')}
            >
              <Badge badgeContent={cartItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout; 