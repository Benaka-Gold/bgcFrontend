import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bgcinternal.app',
  appName: 'BGC Internal',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
