import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Job } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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

  // Debug information
  // This useEffect logs debug information about the SwipeCards component's state and props.
  // It prints the number of jobs, the current card index, animation state, whether jobs is an array, and the first job's ID.
  useEffect(() => {
    console.log("SwipeCards Debug Info:", {
      jobsLength: jobs?.length || 0,
      currentIndex,
      isAnimating,
      jobsIsArray: Array.isArray(jobs),
      firstJob: jobs?.[0]?.id || "none",
    });
  }, [jobs, currentIndex, isAnimating]);

  // Reset currentIndex when jobs array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [jobs]);

  // Validate jobs array
  useEffect(() => {
    if (!Array.isArray(jobs)) {
      console.error("SwipeCards: jobs prop must be an array");
      return;
    }
  }, [jobs]);

  const handleSwipe = useCallback(
    (direction: "right" | "left") => {
      try {
        // Validate current state
        if (!Array.isArray(jobs) || jobs.length === 0) {
          console.warn("SwipeCards: No jobs available");
          return;
        }

        if (currentIndex >= jobs.length) {
          console.warn("SwipeCards: Index out of bounds");
          return;
        }

        const job = jobs[currentIndex];
        if (!job || !job.id) {
          console.error("SwipeCards: Invalid job at current index");
          return;
        }

        console.log(
          "Swiped:",
          direction,
          "Current index:",
          currentIndex,
          "Jobs length:",
          jobs.length,
          "Job ID:",
          job.id
        );

        // Call the appropriate callback
        if (direction === "right") {
          onLike(job);
        } else {
          onDislike(job);
        }

        // Update index
        setCurrentIndex((prev) => {
          const newIndex = prev + 1;
          console.log("Updated index from", prev, "to", newIndex);
          return newIndex;
        });
      } catch (error) {
        console.error("Error in handleSwipe:", error);
        Alert.alert("Error", "An error occurred while processing the swipe");
      }
    },
    [currentIndex, jobs, onLike, onDislike]
  );

  const panGesture = Gesture.Pan()
    .enabled(!isAnimating && currentIndex < jobs.length)
    .onUpdate((event) => {
      if (!isAnimating) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (isAnimating || currentIndex >= jobs.length) {
        return;
      }

      console.log(
        "Gesture ended. TranslationX:",
        event.translationX,
        "VelocityX:",
        event.velocityX,
        "Current index:",
        currentIndex
      );

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

  // Handle empty or invalid jobs array
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t("noJobsFound")}
        </Text>
        <Text style={[styles.debugText, { color: colors.text }]}>
          Debug: jobs array is empty or invalid
        </Text>
      </View>
    );
  }

  // Handle when all jobs have been swiped
  if (currentIndex >= jobs.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t("noJobsFound")}
        </Text>
        <Text style={[styles.debugText, { color: colors.text }]}>
          Debug: All jobs swiped (index: {currentIndex}, total: {jobs.length})
        </Text>
      </View>
    );
  }

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];

  // Validate current job
  if (!currentJob || !currentJob.id) {
    console.error("SwipeCards: Invalid current job");
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t("noJobsFound")}
        </Text>
        <Text style={[styles.debugText, { color: colors.text }]}>
          Debug: Invalid job at index {currentIndex}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Debug Panel - Remove this in production */}
      <View style={styles.debugPanel}>
        <Text style={[styles.debugText, { color: colors.text }]}>
          Jobs: {jobs.length} | Index: {currentIndex} | Animating:{" "}
          {isAnimating ? "Yes" : "No"}
        </Text>
      </View>

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
  debugPanel: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  debugText: {
    fontSize: 12,
    textAlign: "center",
  },
});
