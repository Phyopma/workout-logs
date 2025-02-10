// Environment configuration

import { Platform } from 'react-native';

const env = {
  API_BASE_URL: Platform.select({
    ios: 'http://localhost:3000/auth',
    android: 'http://10.0.2.2:3000/auth',
  }),
  // Add other environment variables here
};

export default env;