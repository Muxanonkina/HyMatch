import { SwipeCard } from "@/components/SwipeCards";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { likeJob, dislikeJob, resetMatches, state } = useApp();
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  const currentJob = state.jobs[currentJobIndex];

  const handleLike = useCallback(
    (job: any) => {
      try {
        if (!job || !job.id) {
          console.error("Invalid job object in handleLike");
          return;
        }
        likeJob(job);
        setCurrentJobIndex((prev) => prev + 1);
      } catch (error) {
        console.error("Error in handleLike:", error);
        Alert.alert("Error", "Failed to like the job");
      }
    },
    [likeJob]
  );

  const handleDislike = useCallback(
    (job: any) => {
      try {
        if (!job || !job.id) {
          console.error("Invalid job object in handleDislike");
          return;
        }
        dislikeJob(job);
        setCurrentJobIndex((prev) => prev + 1);
      } catch (error) {
        console.error("Error in handleDislike:", error);
        Alert.alert("Error", "Failed to dislike the job");
      }
    },
    [dislikeJob]
  );

  const handleHamburgerMenu = () => {
    Alert.alert("Menu", "Profile and language settings will be here");
  };

  const handleFilter = () => {
    Alert.alert("Filter", "Filter options will be here");
  };

  const handleContact = () => {
    if (currentJob) {
      Alert.alert(
        "Contact Employer",
        `Contact information for: ${currentJob.title}`,
        [
          {
            text: "Call",
            onPress: () => Alert.alert("Call", "Calling employer..."),
          },
          {
            text: "Email",
            onPress: () => Alert.alert("Email", "Opening email..."),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Jobs",
      "Are you sure you want to start over with all jobs?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: () => {
            resetMatches();
            setCurrentJobIndex(0);
          },
        },
      ]
    );
  };

  const renderNoMoreJobs = () => (
    <View style={styles.noJobsContainer}>
      <Ionicons
        name="checkmark-circle"
        size={width * 0.15}
        color={colors.tint}
      />
      <Text style={[styles.noJobsTitle, { color: colors.text }]}>
        Great job!
      </Text>
      <Text style={[styles.noJobsSubtitle, { color: colors.secondaryText }]}>
        You&apos;ve reviewed all available jobs
      </Text>
      <View style={styles.noJobsStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {state.likedJobs.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Liked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.danger }]}>
            {state.dislikedJobs.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Disliked
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.tint }]}
        onPress={handleReset}
      >
        <Ionicons name="refresh" size={width * 0.05} color="white" />
        <Text style={styles.resetButtonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobCard = () => {
    if (!currentJob) {
      return renderNoMoreJobs();
    }

    return (
      <>
        {state.jobs.map((job) => (
          <SwipeCard
            key={job.id}
            job={job}
            onSwipeLeft={() => handleDislike(job)}
            onSwipeRight={() => handleLike(job)}
          />
        ))}
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Gradient Background */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#0f141a", "#0b1117", "#0a0f14"]
            : ["#f6f3ee", "#f0ece5", "#e8f3fb"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleHamburgerMenu}
          style={[
            styles.iconPill,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <Ionicons name="menu" size={width * 0.05} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Ionicons name="briefcase" size={width * 0.05} color={colors.tint} />
          <Text style={[styles.title, { color: colors.text }]}>HyMatch</Text>
        </View>

        <TouchableOpacity
          onPress={handleFilter}
          style={[
            styles.iconPill,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <Ionicons name="filter" size={width * 0.05} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.tabIconDefault }]}>
          {currentJobIndex + 1} of {state.jobs.length}
        </Text>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colors.tabIconDefault },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.tint,
                width: `${((currentJobIndex + 1) / state.jobs.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>{renderJobCard()}</View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navCircle,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255, 77, 79, 0.15)"
                  : "rgba(244, 67, 54, 0.12)",
            },
          ]}
          onPress={() => currentJob && handleDislike(currentJob)}
          disabled={!currentJob}
        >
          <Ionicons
            name="close-circle"
            size={width * 0.07}
            color={!currentJob ? colors.tabIconDefault : "#F44336"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContact}
          style={[styles.contactButton, { backgroundColor: colors.tint }]}
          disabled={!currentJob}
        >
          <Ionicons name="call" size={width * 0.07} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navCircle,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(76, 175, 80, 0.18)"
                  : "rgba(76, 175, 80, 0.12)",
            },
          ]}
          onPress={() => currentJob && handleLike(currentJob)}
          disabled={!currentJob}
        >
          <Ionicons
            name="heart"
            size={width * 0.07}
            color={!currentJob ? colors.tabIconDefault : "#4CAF50"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    borderBottomWidth: 0,
  },
  iconPill: {
    padding: width * 0.02,
    borderRadius: width * 0.08,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.01,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  progressContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
  },
  progressText: {
    fontSize: width * 0.03,
    textAlign: "center",
    marginBottom: height * 0.005,
  },
  progressBar: {
    height: height * 0.006,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    opacity: 0.9,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  noJobsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.08,
  },
  noJobsTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  noJobsSubtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  noJobsStats: {
    flexDirection: "row",
    gap: width * 0.08,
    marginBottom: height * 0.03,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: width * 0.035,
    marginTop: height * 0.005,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    gap: width * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  resetButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderTopWidth: 0,
  },
  navCircle: {
    padding: width * 0.03,
    borderRadius: width * 0.1,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  contactButton: {
    padding: width * 0.035,
    borderRadius: width * 0.12,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
});
