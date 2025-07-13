import { SwipeCards } from "@/components/SwipeCards";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/context/AppContext";
import { mockJobs } from "@/data/mockJobs";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { likeJob, dislikeJob } = useApp();

  const handleLike = (job: any) => {
    likeJob(job);
    // Add haptic feedback here if needed
  };

  const handleDislike = (job: any) => {
    dislikeJob(job);
    // Add haptic feedback here if needed
  };

  const handleHamburgerMenu = () => {
    Alert.alert("Menu", "Profile and language settings will be here");
  };

  const handleFilter = () => {
    Alert.alert("Filter", "Filter options will be here");
  };

  const handleContact = () => {
    Alert.alert("Contact", "TEL/Mail modal will be here");
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

      {/* Main Content */}
      <View style={styles.content}>
        <SwipeCards
          jobs={mockJobs}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="close-circle" size={26} color="#F44336" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleContact} style={styles.contactButton}>
          <Ionicons name="call" size={26} color={colors.tint} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="heart" size={26} color="#4CAF50" />
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    backgroundColor: "#f5f5f5",
    borderRadius: 22,
  },
});
