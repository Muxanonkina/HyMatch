import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
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
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
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

  return (
    <View style={styles.container}>
      <SwipeCard
        job={jobs[currentIndex]}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "90%", // не на весь экран
    height: "75%", // занимаем большую часть по высоте
    borderRadius: 16, // скругляем углы
    backgroundColor: "#fff", // фон
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // тень на Android
    overflow: "hidden", // чтобы контент не выходил за края
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0, // remove extra padding
  },
  noMoreCards: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
