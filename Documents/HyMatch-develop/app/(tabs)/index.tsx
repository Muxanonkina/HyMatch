import React, { useState } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";
import { Job } from "../../types/index";

interface SwipeCardsProps {
  jobs: Job[];
  onSwipeLeft: (job: Job) => void;
  onSwipeRight: (job: Job) => void;
}

export default function SwipeCards({
  jobs,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-20deg", "0deg", "20deg"],
    extrapolate: "clamp",
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        // свайп вправо (Like)
        Animated.timing(position, {
          toValue: { x: 500, y: gesture.dy },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeRight(jobs[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -120) {
        // свайп влево (Dislike)
        Animated.timing(position, {
          toValue: { x: -500, y: gesture.dy },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeLeft(jobs[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        // возврат
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  if (currentIndex >= jobs.length) {
    return (
      <View style={styles.center}>
        <Text>Нет больше карточек</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs
        .slice(currentIndex, currentIndex + 2)
        .reverse()
        .map((job, i) => {
          const isTopCard =
            i === jobs.slice(currentIndex, currentIndex + 2).length - 1;
          return (
            <Animated.View
              key={job.id}
              style={[
                styles.card,
                isTopCard
                  ? {
                      transform: [
                        ...position.getTranslateTransform(),
                        { rotate },
                      ],
                    }
                  : { top: 10, zIndex: -1 },
              ]}
              {...(isTopCard ? panResponder.panHandlers : {})}
            >
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.company}>{job.company}</Text>
              <Text style={styles.description}>{job.description}</Text>
            </Animated.View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  company: {
    fontSize: 18,
    color: "#555",
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
});
