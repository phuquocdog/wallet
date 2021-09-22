import * as Sentry from '@sentry/react-native';
import amplitude from 'amplitude-js';
import { getVersion, getSystemName, getUniqueId } from 'react-native-device-info';
import { Platform } from 'react-native';

// Sentry initial
Sentry.init({
  dsn: 'https://2025b32d68514cd2a021b7f80adb1ccf@o1009291.ingest.sentry.io/5973389',
  debug: __DEV__,
  environment: __DEV__ ? 'staging' : 'production'
})

//Sentry.nativeCrash();



const A = async event => {
  console.log('posting analytics...');
};


module.exports = A;
