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
} from "react-native-reanimated";
import { Job } from "../types";
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

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const shouldSwipe = Math.abs(translateX.value) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        const toLeft = translateX.value < 0;
        translateX.value = withSpring(toLeft ? -width : width, {}, () => {
          runOnJS(toLeft ? onSwipeLeft : onSwipeRight)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  // Overlay for "Choose" and "Refusal"
  const chooseStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const refusalStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = () => {
    onSwipeLeft(jobs[currentIndex]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = () => {
    onSwipeRight(jobs[currentIndex]);
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= jobs.length) {
    return <View style={styles.noMoreCards} />;
  }

  // Show up to 3 cards in the stack
  const cardsToShow = jobs.slice(currentIndex, currentIndex + 3);

  return (
    <View style={styles.container}>
      {cardsToShow
        .map((job, i) => {
          if (i === 0) {
            return (
              <SwipeCard
                key={job.id}
                job={job}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            );
          }
          return (
            <View
              key={job.id}
              style={[
                styles.card,
                {
                  top: i * 10,
                  zIndex: -i,
                  transform: [{ scale: 1 - i * 0.05 }],
                  position: "absolute",
                },
              ]}
              pointerEvents="none"
            >
              <JobCard job={job} />
            </View>
          );
        })
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
  noMoreCards: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
