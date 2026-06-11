import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio: string;
  specialty: string;
  experienceLevel: string;
  country: string;
  isPremium: boolean;
}

interface UserState {
  profile: UserProfile | null;
  progress: {
    dailyTasks: number;
    weeklyStreak: number;
    totalStudyHours: number;
    migrationScore: number;
  };
  isOnboarded: boolean;
}

const initialState: UserState = {
  profile: null,
  progress: {
    dailyTasks: 0,
    weeklyStreak: 0,
    totalStudyHours: 0,
    migrationScore: 0,
  },
  isOnboarded: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setProgress: (state, action: PayloadAction<UserState['progress']>) => {
      state.progress = action.payload;
    },
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isOnboarded = action.payload;
    },
    updateProgress: (state, action: PayloadAction<Partial<UserState['progress']>>) => {
      state.progress = { ...state.progress, ...action.payload };
    },
  },
});

export const { setProfile, setProgress, setOnboarded, updateProgress } = userSlice.actions;
export default userSlice.reducer;
