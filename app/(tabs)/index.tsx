import { SwipeCard } from "@/components/SwipeCards";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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
        console.log("Liking job:", job.id, job.title);
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
        console.log("Disliking job:", job.id, job.title);
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
      <Ionicons name="checkmark-circle" size={64} color={colors.tint} />
      <Text style={[styles.noJobsTitle, { color: colors.text }]}>
        Great job!
      </Text>
      <Text style={[styles.noJobsSubtitle, { color: colors.tabIconDefault }]}>
        You&apos;ve reviewed all available jobs
      </Text>
      <View style={styles.noJobsStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
            {state.likedJobs.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Liked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#F44336" }]}>
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
        <Ionicons name="refresh" size={20} color="white" />
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleHamburgerMenu}
          style={styles.headerButton}
        >
          <Ionicons name="menu" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Ionicons name="briefcase" size={20} color={colors.tint} />
          <Text style={[styles.title, { color: colors.text }]}>HyMatch</Text>
        </View>

        <TouchableOpacity onPress={handleFilter} style={styles.headerButton}>
          <Ionicons name="filter" size={20} color={colors.text} />
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
          style={styles.navButton}
          onPress={() => currentJob && handleDislike(currentJob)}
          disabled={!currentJob}
        >
          <Ionicons
            name="close-circle"
            size={26}
            color={!currentJob ? colors.tabIconDefault : "#F44336"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContact}
          style={[styles.contactButton, { backgroundColor: colors.tint }]}
          disabled={!currentJob}
        >
          <Ionicons name="call" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => currentJob && handleLike(currentJob)}
          disabled={!currentJob}
        >
          <Ionicons
            name="heart"
            size={26}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  noJobsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  noJobsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  noJobsSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  noJobsStats: {
    flexDirection: "row",
    gap: 32,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navButton: {
    padding: 6,
  },
  contactButton: {
    padding: 8,
    borderRadius: 22,
  },
  undoButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  undoButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
