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

const { width, height } = Dimensions.get("window");
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

  // Show up to 3 cards in the stack
  const cardsToShow = jobs.slice(currentIndex, currentIndex + 3);

  return (
    <View style={styles.container}>
      {
        cardsToShow
          .map((job, i) => {
            // The top card is interactive, others are just for stack effect
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
            // Stack effect: scale and vertical offset for next cards
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
          .reverse() // so the top card is rendered last (on top)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8", // нейтральный фон
  },
  card: {
    position: "absolute",
    width: "90%",
    aspectRatio: 3 / 4, // вместо фиксированной высоты — сохраняем пропорции (под Tinder-like UI)
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  noMoreCards: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
