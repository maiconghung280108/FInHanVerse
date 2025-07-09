import 'dotenv/config'

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'fin-kid',
    slug: 'fin-kid',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      ['expo-dev-client', { launchMode: 'most-recent' }],
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'expo-audio',
        {
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    android: {
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.MODIFY_AUDIO_SETTINGS',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
      ],
      package: 'com.quangakiyama.expolatest',
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff',
      },
      networkSecurityConfig: './android/app/src/main/res/xml/network_security_config.xml',
    },
    ios: {
      bundleIdentifier: 'com.quangakiyama.expolatest',
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      tenantId: process.env.EXPO_PUBLIC_X_TENANT_ID,
    },
  },
}
