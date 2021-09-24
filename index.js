import React, { useEffect } from 'react';
import './shim.js';
import { AppRegistry } from 'react-native';
import App from './App';
import { BlueStorageProvider } from './blue_modules/storage-context';
import { enableScreens } from 'react-native-screens';


enableScreens(false);
if (!Error.captureStackTrace) {
  // captureStackTrace is only available when debugging
  Error.captureStackTrace = () => {};
}

const BlueAppComponent = () => {
  return (
    <BlueStorageProvider>
      <App />
    </BlueStorageProvider>
  );
};

AppRegistry.registerComponent('phuquocdogWallet', () => BlueAppComponent);
