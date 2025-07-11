import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from '../domains/canvas/slice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['canvas/setPixel'],
        ignoredPaths: ['canvas.pixels'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 