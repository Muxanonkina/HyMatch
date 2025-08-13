import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
import { Job } from "../types";
import { JobCard } from "./JobCard";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

type SwipeCardProps = {
  job: Job;
  index: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

function SwipeCard({ job, index, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacityOverlay = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Плавное появление оверлея
      opacityOverlay.value = interpolate(
        Math.abs(translateX.value),
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      );
    },
    onEnd: () => {
      const shouldSwipe = Math.abs(translateX.value) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        const toLeft = translateX.value < 0;
        translateX.value = withTiming(
          toLeft ? -width * 1.5 : width * 1.5,
          {},
          () => {
            opacityOverlay.value = 0; // убрать надпись
            runOnJS(toLeft ? onSwipeLeft : onSwipeRight)();
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        opacityOverlay.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 20}deg` },
      { scale: 1 - index * 0.05 },
    ],
    top: index * 10,
    zIndex: -index,
  }));

  const chooseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const refusalStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Overlays */}
        <Animated.View
          style={[styles.overlay, styles.chooseOverlay, chooseStyle]}
        >
          <Text style={styles.chooseText}>Choose</Text>
        </Animated.View>
        <Animated.View
          style={[styles.overlay, styles.refusalOverlay, refusalStyle]}
        >
          <Text style={styles.refusalText}>Refusal</Text>
        </Animated.View>

        <JobCard job={job} />
      </Animated.View>
    </PanGestureHandler>
  );
}

type SwipeCardsProps = {
  jobs: Job[];
  onSwipeLeft: (job: Job) => void;
  onSwipeRight: (job: Job) => void;
};

export function SwipeCards({
  jobs,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardsProps) {
  const [cards, setCards] = useState(jobs);

  const handleSwipeLeft = (index: number) => {
    const swipedJob = cards[index];
    setCards((prev) => prev.filter((_, i) => i !== index));
    onSwipeLeft(swipedJob);
  };

  const handleSwipeRight = (index: number) => {
    const swipedJob = cards[index];
    setCards((prev) => prev.filter((_, i) => i !== index));
    onSwipeRight(swipedJob);
  };

  return (
    <View style={styles.container}>
      {cards
        .map((job, i) => (
          <SwipeCard
            key={job.id}
            job={job}
            index={i}
            onSwipeLeft={() => handleSwipeLeft(i)}
            onSwipeRight={() => handleSwipeRight(i)}
          />
        ))
        .reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  card: {
    position: "absolute",
    width: "90%",
    aspectRatio: 3 / 4,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  chooseOverlay: {
    borderWidth: 6,
    borderColor: "#4CAF50",
    borderRadius: 100,
    padding: 16,
    backgroundColor: "rgba(76, 175, 80, 0.08)",
  },
  refusalOverlay: {
    borderWidth: 6,
    borderColor: "#F44336",
    borderRadius: 100,
    padding: 16,
    backgroundColor: "rgba(244, 67, 54, 0.08)",
  },
  chooseText: {
    color: "#4CAF50",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  refusalText: {
    color: "#F44336",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
