import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { JobCard } from "@/components/JobCard";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/context/AppContext";
import { mockJobs } from "@/data/mockJobs";
import { useColorScheme } from "@/hooks/useColorScheme";
import { JapaneseLevel, Job, JobType } from "@/types";

export default function ExploreScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, likeJob, dislikeJob } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<JobType | "all">(
    "all"
  );
  const [selectedJapaneseLevel, setSelectedJapaneseLevel] = useState<
    JapaneseLevel | "all"
  >("all");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const jobTypes: JobType[] = [
    "cooking",
    "customer_service",
    "cleaning",
    "factory",
    "delivery",
    "hotel",
    "warehouse",
    "office",
    "retail",
  ];

  const japaneseLevels: JapaneseLevel[] = ["N1", "N2", "N3", "N4", "N5"];

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Job type filter
      const matchesJobType =
        selectedJobType === "all" || job.jobType === selectedJobType;

      // Japanese level filter
      const matchesJapaneseLevel =
        selectedJapaneseLevel === "all" ||
        job.japaneseLevel === selectedJapaneseLevel;

      // Salary filter
      const minSalaryNum = minSalary ? parseInt(minSalary) : 0;
      const maxSalaryNum = maxSalary ? parseInt(maxSalary) : 9999;
      const matchesSalary =
        job.salary.min >= minSalaryNum && job.salary.max <= maxSalaryNum;

      return (
        matchesSearch && matchesJobType && matchesJapaneseLevel && matchesSalary
      );
    });
  }, [
    searchQuery,
    selectedJobType,
    selectedJapaneseLevel,
    minSalary,
    maxSalary,
  ]);

  const handleLike = (job: Job) => {
    likeJob(job);
    Alert.alert("Success", "Job added to your liked list!");
  };

  const handleDislike = (job: Job) => {
    dislikeJob(job);
    Alert.alert("Success", "Job added to your disliked list!");
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobItem}>
      <JobCard job={item} />
      <View style={styles.jobActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#F44336" }]}
          onPress={() => handleDislike(item)}
        >
          <Ionicons name="close" size={20} color="white" />
          <Text style={styles.actionText}>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.actionText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => handleLike(item)}
        >
          <Ionicons name="heart" size={20} color="white" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Search & Filters
      </Text>

      {/* Search Input */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.tabIconDefault,
            color: colors.text,
          },
        ]}
        placeholder="Search jobs, locations..."
        placeholderTextColor={colors.tabIconDefault}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Job Type Filter */}
      <Text style={[styles.filterLabel, { color: colors.text }]}>
        Job Type:
      </Text>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedJobType === "all" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSelectedJobType("all")}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedJobType === "all" && { color: "white" },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {jobTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedJobType === type && { backgroundColor: colors.tint },
            ]}
            onPress={() => setSelectedJobType(type)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedJobType === type && { color: "white" },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Japanese Level Filter */}
      <Text style={[styles.filterLabel, { color: colors.text }]}>
        Japanese Level:
      </Text>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedJapaneseLevel === "all" && { backgroundColor: colors.tint },
          ]}
          onPress={() => setSelectedJapaneseLevel("all")}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedJapaneseLevel === "all" && { color: "white" },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {japaneseLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterChip,
              selectedJapaneseLevel === level && {
                backgroundColor: colors.tint,
              },
            ]}
            onPress={() => setSelectedJapaneseLevel(level)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedJapaneseLevel === level && { color: "white" },
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Salary Range */}
      <Text style={[styles.filterLabel, { color: colors.text }]}>
        Salary Range (¥/hour):
      </Text>
      <View style={styles.salaryRow}>
        <TextInput
          style={[
            styles.salaryInput,
            {
              backgroundColor: colors.background,
              borderColor: colors.tabIconDefault,
              color: colors.text,
            },
          ]}
          placeholder="Min"
          placeholderTextColor={colors.tabIconDefault}
          value={minSalary}
          onChangeText={setMinSalary}
          keyboardType="numeric"
        />
        <Text style={[styles.salarySeparator, { color: colors.text }]}>-</Text>
        <TextInput
          style={[
            styles.salaryInput,
            {
              backgroundColor: colors.background,
              borderColor: colors.tabIconDefault,
              color: colors.text,
            },
          ]}
          placeholder="Max"
          placeholderTextColor={colors.tabIconDefault}
          value={maxSalary}
          onChangeText={setMaxSalary}
          keyboardType="numeric"
        />
      </View>

      <Text style={[styles.resultsCount, { color: colors.tabIconDefault }]}>
        {filteredJobs.length} jobs found
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={colors.tabIconDefault} />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No jobs found
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
        Try adjusting your search criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderFilterSection}
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
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  salaryInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  salarySeparator: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultsCount: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  jobItem: {
    marginBottom: 20,
  },
  jobActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 12,
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
