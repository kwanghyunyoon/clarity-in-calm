module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Must be last — transforms 'worklet' functions for Reanimated & react-native-worklets
      'react-native-reanimated/plugin',
    ],
  };
};
