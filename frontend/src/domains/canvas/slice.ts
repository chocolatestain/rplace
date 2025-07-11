import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Pixel {
  x: number;
  y: number;
  color: string;
  modifiedBy?: number;
  modifiedAt?: string;
}

export interface CanvasState {
  pixels: Record<string, Pixel>;
  selectedColor: string;
  cooldownRemaining: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CanvasState = {
  pixels: {},
  selectedColor: '#FF0000',
  cooldownRemaining: 0,
  isLoading: false,
  error: null,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setPixel: (state, action: PayloadAction<Pixel>) => {
      const { x, y, color } = action.payload;
      const key = `${x},${y}`;
      state.pixels[key] = { x, y, color };
    },
    setSelectedColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
    setCooldownRemaining: (state, action: PayloadAction<number>) => {
      state.cooldownRemaining = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCanvas: (state) => {
      state.pixels = {};
    },
  },
});

export const {
  setPixel,
  setSelectedColor,
  setCooldownRemaining,
  setLoading,
  setError,
  clearCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer; 