import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Job } from "@/types";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { JobCard } from "./JobCard";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

interface SwipeCardsProps {
  jobs: Job[];
  onLike: (job: Job) => void;
  onDislike: (job: Job) => void;
}

export function SwipeCards({ jobs, onLike, onDislike }: SwipeCardsProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const translateX = useSharedValue(0);

  const handleSwipe = useCallback(
    (direction: "right" | "left") => {
      try {
        console.log(
          "Swiped:",
          direction,
          "Current index:",
          currentIndex,
          "Jobs length:",
          jobs.length
        );
        if (currentIndex >= jobs.length) {
          console.log("Index out of bounds, returning");
          return;
        }
        if (direction === "right") {
          console.log("Calling onLike with job:", jobs[currentIndex]);
          // onLike(jobs[currentIndex]);
        } else {
          console.log("Calling onDislike with job:", jobs[currentIndex]);
          // onDislike(jobs[currentIndex]);
        }
        setCurrentIndex((prev) => prev + 1);
      } catch (e) {
        console.error("Error in handleSwipe:", e);
      }
    },
    [currentIndex, jobs]
  );

  React.useEffect(() => {
    console.log("Current index:", currentIndex);
  }, [currentIndex]);

  const panGesture = Gesture.Pan()
    .enabled(!isAnimating)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      console.log(
        "Gesture ended. TranslationX:",
        event.translationX,
        "VelocityX:",
        event.velocityX
      );
      if (isAnimating) return;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      if (shouldSwipeRight) {
        setIsAnimating(true);
        translateX.value = withSpring(
          width * 1.2,
          { velocity: event.velocityX },
          (finished) => {
            if (finished) {
              translateX.value = 0;
              runOnJS(handleSwipe)("right");
              runOnJS(setIsAnimating)(false);
            }
          }
        );
      } else if (shouldSwipeLeft) {
        setIsAnimating(true);
        translateX.value = withSpring(
          -width * 1.2,
          { velocity: event.velocityX },
          (finished) => {
            if (finished) {
              translateX.value = 0;
              runOnJS(handleSwipe)("left");
              runOnJS(setIsAnimating)(false);
            }
          }
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Animated indicator opacity
  const likeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });
  const dislikeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  if (currentIndex >= jobs.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t("noJobsFound")}
        </Text>
      </View>
    );
  }

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];

  return (
    <View style={styles.container}>
      {/* Background card */}
      {nextJob && (
        <View
          style={[
            styles.backgroundCard,
            { backgroundColor: colors.background },
          ]}
        >
          <JobCard job={nextJob} />
        </View>
      )}

      {/* Current card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <JobCard job={currentJob} />

          {/* Swipe indicators */}
          <Animated.View
            style={[styles.indicator, styles.likeIndicator, likeIndicatorStyle]}
          >
            <Text style={styles.indicatorText}>{t("choose")}</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.indicator,
              styles.dislikeIndicator,
              dislikeIndicatorStyle,
            ]}
          >
            <Text style={styles.indicatorText}>{t("refuse")}</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={[styles.instructionText, { color: colors.text }]}>
          {t("swipeRight")} | {t("swipeLeft")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    position: "absolute",
    zIndex: 2,
  },
  backgroundCard: {
    position: "absolute",
    zIndex: 1,
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  indicator: {
    position: "absolute",
    top: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
  },
  likeIndicator: {
    left: 20,
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    borderColor: "#4CAF50",
  },
  dislikeIndicator: {
    right: 20,
    backgroundColor: "rgba(244, 67, 54, 0.8)",
    borderColor: "#F44336",
  },
  indicatorText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructions: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
});
