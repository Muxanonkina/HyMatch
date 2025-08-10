const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Add this line:
  config.transpilePackages = ["expo-router"];

  return config;
})();
