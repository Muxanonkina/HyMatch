import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { JobCard } from "../../components/JobCard";
import { Colors } from "../../constants/Colors";
import { useApp } from "../../context/AppContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Job } from "../../types/index";

export default function DislikedJobsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state } = useApp();
  const [sortBy, setSortBy] = useState<
    "salary" | "commutingTime" | "postingDate"
  >("postingDate");

  const sortedJobs = [...state.dislikedJobs].sort((a, b) => {
    switch (sortBy) {
      case "salary":
        return b.salary.max - a.salary.max;
      case "commutingTime":
        return a.commutingTime - b.commutingTime;
      case "postingDate":
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      default:
        return 0;
    }
  });

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobItem}>
      <JobCard job={item} />
      <View style={styles.jobActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.actionText}>Reconsider</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#9E9E9E" }]}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.actionText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t("refuseList")} ({state.dislikedJobs.length})
      </Text>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.text }]}>
          {t("sort")}:
        </Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "salary" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSortBy("salary")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === "salary" && { color: "white" },
            ]}
          >
            {t("byHourlyWage")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "commutingTime" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSortBy("commutingTime")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === "commutingTime" && { color: "white" },
            ]}
          >
            {t("byCommutingTime")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "postingDate" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSortBy("postingDate")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === "postingDate" && { color: "white" },
            ]}
          >
            {t("byPostingDate")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="close-circle-outline"
        size={64}
        color={colors.tabIconDefault}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {t("noJobsFound")}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
        {t("swipeLeft")} to add jobs to your refuse list
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={sortedJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
  },
  jobItem: {
    marginBottom: 20,
  },
  jobActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
