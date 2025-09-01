import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (iPhone 12 Pro as reference)
const baseWidth = 390;
const baseHeight = 844;

// Responsive scaling factors
export const scale = (size: number) => {
  const newSize = (SCREEN_WIDTH / baseWidth) * size;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(newSize);
};

export const verticalScale = (size: number) => {
  const newSize = (SCREEN_HEIGHT / baseHeight) * size;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(newSize);
};

export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Responsive font sizes
export const fontSize = {
  xs: scale(10),
  sm: scale(12),
  md: scale(14),
  lg: scale(16),
  xl: scale(18),
  xxl: scale(20),
  title: scale(24),
  largeTitle: scale(32),
};

// Responsive icon sizes
export const iconSize = {
  xs: scale(16),
  sm: scale(20),
  md: scale(24),
  lg: scale(28),
  xl: scale(32),
  xxl: scale(40),
};

// Responsive border radius
export const borderRadius = {
  sm: scale(4),
  md: scale(8),
  lg: scale(12),
  xl: scale(16),
  xxl: scale(20),
  round: scale(50),
};

export default {
  scale,
  verticalScale,
  moderateScale,
  spacing,
  fontSize,
  iconSize,
  borderRadius,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
