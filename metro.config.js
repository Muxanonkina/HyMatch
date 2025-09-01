const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for CommonJS modules
config.resolver.sourceExts.push("cjs");

// Enable modern package exports for better compatibility
config.resolver.unstable_enablePackageExports = true;

// Enhanced resolver configuration for Android 15 compatibility
config.resolver.platforms = ["native", "android", "ios", "web"];

module.exports = config;
