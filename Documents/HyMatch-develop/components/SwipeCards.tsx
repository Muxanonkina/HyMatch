import { Dimensions, StyleSheet } from "react-native";
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

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
  },
});
