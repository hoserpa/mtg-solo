export type AppSettings = {
  lastDifficulty: string;
  customConfig?: Record<string, unknown>;
  preferences: {
    reducedMotion: boolean;
  };
};
