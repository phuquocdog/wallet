import React, { useEffect } from 'react';
import './shim.js';
import { AppRegistry,LogBox } from 'react-native';
import App from './App';
import { BlueStorageProvider } from './blue_modules/storage-context';
import { enableScreens } from 'react-native-screens';
LogBox.ignoreAllLogs();
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
