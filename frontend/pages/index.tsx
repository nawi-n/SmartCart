import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { PersonaMoodPanel } from '../components/PersonaMoodPanel';
import { ChatInterface } from '../components/ChatInterface';
import { productService } from '../services/productService';
import { recommendationService } from '../services/recommendationService';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import { voiceService } from '../services/voiceService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, recommendationsData] = await Promise.all([
          productService.getProducts(),
          user ? recommendationService.getRecommendations(user.id) : Promise.resolve([]),
        ]);
        setProducts(productsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const filteredProducts = await productService.searchProducts(query);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const text = await voiceService.speechToText(audioBlob);
        handleSearch(text);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleMoodChange = async (mood: number) => {
    if (user) {
      try {
        const updatedRecommendations = await recommendationService.getRecommendations(user.id, mood);
        setRecommendations(updatedRecommendations);
      } catch (error) {
        console.error('Error updating recommendations:', error);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to SmartCart
        </Typography>
        
        {user && <PersonaMoodPanel onMoodChange={handleMoodChange} />}

        <Box mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    color={isRecording ? 'error' : 'default'}
                  >
                    <MicIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Products" />
            <Tab label="Recommendations" />
            <Tab label="Chat Assistant" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {recommendations.length > 0 ? (
              <Grid container spacing={3}>
                {recommendations.map((recommendation) => (
                  <Grid item xs={12} sm={6} md={4} key={recommendation.product.id}>
                    <RecommendationCard recommendation={recommendation} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No recommendations available. Please log in to see personalized recommendations.
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ChatInterface />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 