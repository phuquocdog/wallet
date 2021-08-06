/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
   // remap node packages to react-native packages
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-crypto'),
      os: require.resolve('os-browserify'),
      process: require.resolve('process'),
      stream: require.resolve('stream-http'),
      vm: require.resolve('vm-browserify')
    }
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
