import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  IconButton,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../services/customerService';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

interface PersonaMoodPanelProps {
  onMoodChange?: (mood: number) => void;
}

export const PersonaMoodPanel: React.FC<PersonaMoodPanelProps> = ({ onMoodChange }) => {
  const { user } = useAuth();
  const [persona, setPersona] = useState<any>(null);
  const [mood, setMood] = useState<number>(3);

  useEffect(() => {
    const fetchPersona = async () => {
      if (user) {
        try {
          const response = await customerService.getPersona(user.id);
          setPersona(response);
        } catch (error) {
          console.error('Error fetching persona:', error);
        }
      }
    };

    fetchPersona();
  }, [user]);

  const handleMoodChange = (event: Event, newValue: number | number[]) => {
    const moodValue = newValue as number;
    setMood(moodValue);
    if (onMoodChange) {
      onMoodChange(moodValue);
    }
  };

  const getMoodIcon = (value: number) => {
    switch (value) {
      case 1:
        return <SentimentVeryDissatisfiedIcon color="error" />;
      case 2:
        return <SentimentDissatisfiedIcon color="warning" />;
      case 3:
        return <SentimentNeutralIcon color="action" />;
      case 4:
        return <SentimentSatisfiedIcon color="primary" />;
      case 5:
        return <SentimentVerySatisfiedIcon color="success" />;
      default:
        return <SentimentNeutralIcon color="action" />;
    }
  };

  if (!persona) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your Shopping Persona
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1">Preferences</Typography>
              <Typography variant="body2" color="text.secondary">
                {persona.preferences}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1">Shopping Style</Typography>
              <Typography variant="body2" color="text.secondary">
                {persona.shopping_style}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Current Mood
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Slider
                  value={mood}
                  onChange={handleMoodChange}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  sx={{ width: '80%' }}
                />
                <IconButton>
                  {getMoodIcon(mood)}
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 