import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  IconButton,
  Grid,
  Avatar,
  Chip,
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

const moodEmojis = {
  1: { icon: SentimentVeryDissatisfiedIcon, label: 'Very Dissatisfied', color: 'error' },
  2: { icon: SentimentDissatisfiedIcon, label: 'Dissatisfied', color: 'warning' },
  3: { icon: SentimentNeutralIcon, label: 'Neutral', color: 'action' },
  4: { icon: SentimentSatisfiedIcon, label: 'Satisfied', color: 'primary' },
  5: { icon: SentimentVerySatisfiedIcon, label: 'Very Satisfied', color: 'success' },
};

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
    const { icon: Icon, color } = moodEmojis[value as keyof typeof moodEmojis];
    return <Icon color={color as any} />;
  };

  if (!persona) {
    return null;
  }

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Shopping Persona
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                Shopping Preferences
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {persona.preferences.split(',').map((pref: string, index: number) => (
                  <Chip
                    key={index}
                    label={pref.trim()}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            <Box mt={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                Shopping Style
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {persona.shopping_style}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                Current Mood
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={mood}
                  onChange={handleMoodChange}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {Object.entries(moodEmojis).map(([value, { icon: Icon, label, color }]) => (
                  <Box
                    key={value}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      opacity: mood === Number(value) ? 1 : 0.5,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                    onClick={() => handleMoodChange({} as Event, Number(value))}
                  >
                    <IconButton>
                      <Icon color={color as any} />
                    </IconButton>
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 