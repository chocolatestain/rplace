import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/store';
import { setSelectedColor } from '../slice';

const COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#ADFF2F', '#00FF00',
  '#00FA9A', '#00FFFF', '#00BFFF', '#0000FF', '#8A2BE2', '#FF00FF', '#FF1493',
  '#FF69B4', '#F0E68C', '#DDA0DD', '#B0C4DE', '#F5F5DC', '#DEB887', '#CD853F',
  '#A0522D', '#8B4513', '#696969', '#2F4F4F', '#000000', '#FFFFFF', '#C0C0C0',
  '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
];

const PalettePanel: React.FC = () => {
  const dispatch = useDispatch();
  const selectedColor = useSelector((state: RootState) => state.canvas.selectedColor);

  const handleColorSelect = (color: string) => {
    dispatch(setSelectedColor(color));
  };

  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        색상 팔레트
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          선택된 색상:
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: selectedColor,
            border: 2,
            borderColor: 'primary.main',
            borderRadius: 1,
            mb: 2
          }}
        />
      </Box>

      <Grid container spacing={1}>
        {COLORS.map((color) => (
          <Grid item key={color}>
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: color,
                border: 2,
                borderColor: selectedColor === color ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={() => handleColorSelect(color)}
              role="button"
              aria-label={`색상 선택: ${color}`}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PalettePanel; 