import React from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { ProductProvider } from './contexts/ProductContext';
import { RecommendationProvider } from './contexts/RecommendationContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <CustomerProvider>
            <ProductProvider>
              <RecommendationProvider>
                <VoiceProvider>
                  <ChatProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </ChatProvider>
                </VoiceProvider>
              </RecommendationProvider>
            </ProductProvider>
          </CustomerProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
