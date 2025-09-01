// The following import causes an error because this file is treated as a CommonJS module,
// but '@react-navigation/bottom-tabs' is an ECMAScript module. To fix this, use a dynamic import:
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
let useBottomTabBarHeight: () => number;

try {
  // Dynamically import the hook at runtime
  // This avoids static import issues between CommonJS and ESM modules
  // and works in React Native Metro bundler.
  // @ts-ignore
  useBottomTabBarHeight =
    require("@react-navigation/bottom-tabs").useBottomTabBarHeight;
} catch (e) {
  // Fallback in case the import fails
  useBottomTabBarHeight = () => 0;
}

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
