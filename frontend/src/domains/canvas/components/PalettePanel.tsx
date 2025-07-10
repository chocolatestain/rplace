import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { PALETTE_COLORS } from '../../../shared/colors';

const PalettePanel: React.FC = () => {
  return (
    <Box p={2} role="navigation" aria-label="색상 팔레트">
      <Typography variant="h6" gutterBottom>
        팔레트
      </Typography>
      <Grid container spacing={1} columns={{ xs: 8, sm: 12, md: 1 }}>
        {PALETTE_COLORS.map((color) => (
          <Grid item xs={1} sm={1} md={1} key={color}>
            <Box
              tabIndex={0}
              aria-label={`색상 ${color}`}
              sx={{
                width: 32,
                height: 32,
                bgcolor: color,
                border: 1,
                borderColor: 'grey.400',
                cursor: 'pointer',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PalettePanel; 