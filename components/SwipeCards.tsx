import { Job } from "@/types";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  RollInLeft,
  RollInRight,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { JobCard } from "./JobCard";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

type SwipeCardProps = {
  job: Job;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function SwipeCard({ job, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const [swipeDirection, setSwipeDirection] = React.useState<
    "left" | "right" | null
  >(null);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      if (event.translationX > 0) {
        runOnJS(setSwipeDirection)("right");
      } else if (event.translationX < 0) {
        runOnJS(setSwipeDirection)("left");
      } else {
        runOnJS(setSwipeDirection)(null);
      }
    },
    onEnd: () => {
      const shouldSwipe = Math.abs(translateX.value) > SWIPE_THRESHOLD;
      if (shouldSwipe) {
        const toLeft = translateX.value < 0;
        translateX.value = withSpring(toLeft ? -width : width, {}, () => {
          runOnJS(toLeft ? onSwipeLeft : onSwipeRight)();
          runOnJS(setSwipeDirection)(null);
        });
      } else {
        translateX.value = withSpring(0);
        runOnJS(setSwipeDirection)(null);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-15, 0, 15]
    );
    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  // Overlay for swipe feedback
  const renderOverlay = () => {
    if (swipeDirection === "right") {
      return (
        <View style={[styles.overlayCircle, styles.greenCircle]}>
          <Text style={[styles.overlayText, styles.greenText]}>選択</Text>
        </View>
      );
    }
    if (swipeDirection === "left") {
      return (
        <View style={[styles.overlayCircle, styles.redCircle]}>
          <Text style={[styles.overlayText, styles.redText]}>拒否</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[styles.card, animatedStyle]}
        entering={
          swipeDirection === "left"
            ? RollInLeft
            : swipeDirection === "right"
            ? RollInRight
            : undefined
        }
      >
        <JobCard job={job} />
        {renderOverlay()}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayCircle: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -60 }],
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
    zIndex: 10,
  },
  greenCircle: {
    borderColor: "#00e676",
    backgroundColor: "transparent",
  },
  redCircle: {
    borderColor: "#ff1744",
    backgroundColor: "transparent",
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
    textAlign: "center",
    transform: [{ rotate: "-10deg" }],
  },
  greenText: {
    color: "#00e676",
  },
  redText: {
    color: "#ff1744",
  },
});
