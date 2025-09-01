import { Colors } from "@/constants/Colors";
import { scale } from "@/hooks/useResponsive";
import { Job } from "@/types";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { JobCard } from "./JobCard";

const { width: screenWidth } = Dimensions.get("window");

interface SwipeCardProps {
  job: Job;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeProgress?: ({
    direction,
    value,
  }: {
    direction: "left" | "right";
    value: number;
  }) => void;
}

const SWIPE_THRESHOLD = screenWidth * 0.25;
const SWIPE_OUT_DURATION = 250;
const ROTATION_ANGLE = 10;

export function SwipeCard({
  job,
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
}: SwipeCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Shared values for animations
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Reset any ongoing animations
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Update swipe progress
      if (onSwipeProgress) {
        const direction = event.translationX > 0 ? "right" : "left";
        const progress = Math.min(
          Math.abs(event.translationX) / SWIPE_THRESHOLD,
          1
        );
        runOnJS(onSwipeProgress)({ direction, value: progress });
      }
    },
    onEnd: (event) => {
      const shouldSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        // Swipe out
        const direction = event.translationX > 0 ? "right" : "left";
        const toValue =
          direction === "left" ? -screenWidth * 1.5 : screenWidth * 1.5;

        translateX.value = withTiming(toValue, {
          duration: SWIPE_OUT_DURATION,
        });
        scaleValue.value = withTiming(0.8, { duration: SWIPE_OUT_DURATION });
        opacity.value = withTiming(0, { duration: SWIPE_OUT_DURATION }, () => {
          // Call callback after animation completes
          if (direction === "left") {
            runOnJS(onSwipeLeft)();
          } else {
            runOnJS(onSwipeRight)();
          }
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { stiffness: 100, damping: 8 });
        translateY.value = withSpring(0, { stiffness: 100, damping: 8 });
        scaleValue.value = withSpring(1, { stiffness: 100, damping: 8 });
      }
    },
  });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolate.CLAMP
    );

    const cardScale = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [0.95, 1, 0.95],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: cardScale },
      ],
      opacity: opacity.value,
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const dislikeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Like Overlay - Top Right */}
        <Animated.View
          style={[
            styles.overlay,
            styles.likeOverlay,
            likeOverlayStyle,
            { borderColor: "#4CAF50", backgroundColor: "transparent" },
          ]}
        >
          <View style={[styles.overlayCircle, { backgroundColor: "#E8F5E8" }]}>
            <Text style={[styles.overlayText, { color: "#4CAF50" }]}>
              Choose
            </Text>
          </View>
        </Animated.View>

        {/* Dislike Overlay - Top Left */}
        <Animated.View
          style={[
            styles.overlay,
            styles.dislikeOverlay,
            dislikeOverlayStyle,
            { borderColor: "#F44336", backgroundColor: "transparent" },
          ]}
        >
          <View style={[styles.overlayCircle, { backgroundColor: "#FFEBEE" }]}>
            <Text style={[styles.overlayText, { color: "#F44336" }]}>
              Refuse
            </Text>
          </View>
        </Animated.View>

        {/* Card Content */}
        <JobCard job={job} />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: screenWidth * 0.9,
    height: screenWidth * 1.2,
    alignSelf: "center",
  },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(50),
    borderWidth: 4,
    zIndex: 1,
  },
  likeOverlay: {
    top: scale(20),
    right: scale(20),
    width: scale(120),
    height: scale(120),
  },
  dislikeOverlay: {
    top: scale(20),
    left: scale(20),
    width: scale(120),
    height: scale(120),
  },
  overlayCircle: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: scale(28),
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
