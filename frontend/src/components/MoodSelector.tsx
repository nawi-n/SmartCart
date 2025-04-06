import React, { useState } from 'react';
import { Box, Typography, Slider, IconButton, Tooltip } from '@mui/material';
import { 
  SentimentVeryDissatisfied, 
  SentimentDissatisfied, 
  SentimentNeutral, 
  SentimentSatisfied, 
  SentimentVerySatisfied 
} from '@mui/icons-material';

interface MoodSelectorProps {
  onMoodChange: (mood: string) => void;
  initialMood?: string;
}

const moodIcons = {
  'very_dissatisfied': <SentimentVeryDissatisfied color="error" />,
  'dissatisfied': <SentimentDissatisfied color="warning" />,
  'neutral': <SentimentNeutral color="action" />,
  'satisfied': <SentimentSatisfied color="success" />,
  'very_satisfied': <SentimentVerySatisfied color="success" />
};

const moodLabels = {
  'very_dissatisfied': 'Very Dissatisfied',
  'dissatisfied': 'Dissatisfied',
  'neutral': 'Neutral',
  'satisfied': 'Satisfied',
  'very_satisfied': 'Very Satisfied'
};

const moodValues = {
  'very_dissatisfied': 1,
  'dissatisfied': 2,
  'neutral': 3,
  'satisfied': 4,
  'very_satisfied': 5
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodChange, initialMood = 'neutral' }) => {
  const [mood, setMood] = useState<string>(initialMood);

  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
    onMoodChange(newMood);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    const moodKey = Object.keys(moodValues).find(key => moodValues[key] === value);
    if (moodKey) {
      handleMoodChange(moodKey);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        How are you feeling today?
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {Object.entries(moodIcons).map(([key, icon]) => (
          <Tooltip key={key} title={moodLabels[key]}>
            <IconButton
              onClick={() => handleMoodChange(key)}
              color={mood === key ? 'primary' : 'default'}
              sx={{ 
                transform: mood === key ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s'
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Slider
        value={moodValues[mood]}
        onChange={handleSliderChange}
        min={1}
        max={5}
        step={1}
        marks={[
          { value: 1, label: '😠' },
          { value: 2, label: '😕' },
          { value: 3, label: '😐' },
          { value: 4, label: '😊' },
          { value: 5, label: '😄' }
        ]}
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-markLabel': {
            fontSize: '1.5rem'
          }
        }}
      />

      <Typography 
        variant="body1" 
        align="center" 
        sx={{ 
          mt: 2,
          color: mood === 'very_dissatisfied' ? 'error.main' :
                 mood === 'dissatisfied' ? 'warning.main' :
                 mood === 'neutral' ? 'text.secondary' :
                 'success.main'
        }}
      >
        {moodLabels[mood]}
      </Typography>
    </Box>
  );
};

export default MoodSelector; 