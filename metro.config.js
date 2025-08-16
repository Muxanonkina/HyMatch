const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("cjs");

// Add this line 👇
config.transformer.unstable_allowRequireContext = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
