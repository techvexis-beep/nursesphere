import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_TOKEN: 'nursesphere_auth_token',
  USER_ID: 'nursesphere_user_id',
  USER_DATA: 'nursesphere_user_data',
  REFRESH_TOKEN: 'nursesphere_refresh_token',
  ONBOARDING_COMPLETE: 'nursesphere_onboarding_complete',
  BIOMETRIC_ENABLED: 'nursesphere_biometric_enabled',
} as const;

export const SecureStorage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async removeRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  },

  async setUserId(userId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, userId);
  },

  async getUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.USER_ID);
  },

  async setUserData(data: Record<string, unknown>): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(data));
  },

  async getUserData<T = Record<string, unknown>>(): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(KEYS.USER_DATA);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
  },

  async setOnboardingComplete(complete: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ONBOARDING_COMPLETE, String(complete));
  },

  async isOnboardingComplete(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, String(enabled));
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN).catch(() => {}),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN).catch(() => {}),
      SecureStore.deleteItemAsync(KEYS.USER_ID).catch(() => {}),
      SecureStore.deleteItemAsync(KEYS.USER_DATA).catch(() => {}),
    ]);
  },
};
