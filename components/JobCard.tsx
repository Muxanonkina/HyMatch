import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DayOfWeek, Job, JobType } from "@/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface JobCardProps {
  job: Job;
}

const getJobTypeIcon = (jobType: JobType): string => {
  const icons = {
    cooking: "🍳",
    customer_service: "👥",
    cleaning: "🧹",
    factory: "🏭",
    delivery: "🚚",
    hotel: "🏨",
    warehouse: "📦",
    office: "🏢",
    retail: "🛒",
  };
  return icons[jobType] || "💼";
};

const getDayAbbreviation = (day: DayOfWeek): string => {
  const abbreviations = {
    MON: "月",
    TUE: "火",
    WED: "水",
    THU: "木",
    FRI: "金",
    SAT: "土",
    SUN: "日",
  };
  return abbreviations[day] || day;
};

export function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.jobTypeIcon, { fontSize: 32 }]}>
          {getJobTypeIcon(job.jobType)}
        </Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {job.title}
          </Text>
          <Text style={[styles.location, { color: colors.tabIconDefault }]}>
            📍 {job.location}
          </Text>
        </View>
      </View>

      {/* Salary */}
      <View style={styles.salaryContainer}>
        <Text style={[styles.salaryLabel, { color: colors.text }]}>
          {t("hourlyWage")}
        </Text>
        <Text style={[styles.salary, { color: colors.tint }]}>
          ¥{job.salary.min.toLocaleString()} - ¥
          {job.salary.max.toLocaleString()}
        </Text>
      </View>

      {/* Requirements */}
      <View style={styles.requirementsContainer}>
        <View style={styles.requirement}>
          <Text style={[styles.requirementLabel, { color: colors.text }]}>
            {t("japaneseLevel")}
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.tint }]}>
            <Text style={styles.badgeText}>{job.japaneseLevel}</Text>
          </View>
        </View>

        <View style={styles.requirement}>
          <Text style={[styles.requirementLabel, { color: colors.text }]}>
            {t("commutingTime")}
          </Text>
          <Text style={[styles.requirementValue, { color: colors.text }]}>
            {job.commutingTime} {t("minutes")}
          </Text>
        </View>
      </View>

      {/* Available Days */}
      <View style={styles.daysContainer}>
        <Text style={[styles.daysLabel, { color: colors.text }]}>
          {t("availableDays")}
        </Text>
        <View style={styles.daysList}>
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
            <View
              key={day}
              style={[
                styles.dayBadge,
                {
                  backgroundColor: job.availableDays.includes(day as DayOfWeek)
                    ? colors.tint
                    : colors.tabIconDefault,
                },
              ]}
            >
              <Text style={styles.dayText}>
                {getDayAbbreviation(day as DayOfWeek)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Appealing Points */}
      <View style={styles.appealingContainer}>
        <Text style={[styles.appealingLabel, { color: colors.text }]}>
          {t("appealingPoints")}
        </Text>
        <View style={styles.appealingList}>
          {job.appealingPoints.map((point, index) => (
            <View
              key={index}
              style={[
                styles.appealingBadge,
                { backgroundColor: colors.tabIconDefault },
              ]}
            >
              <Text style={[styles.appealingText, { color: colors.text }]}>
                {point}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={[styles.description, { color: colors.text }]}>
          {job.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  jobTypeIcon: {
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
  },
  salaryContainer: {
    marginBottom: 15,
  },
  salaryLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  salary: {
    fontSize: 20,
    fontWeight: "bold",
  },
  requirementsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  requirement: {
    alignItems: "center",
  },
  requirementLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  requirementValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  daysContainer: {
    marginBottom: 15,
  },
  daysLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  daysList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  appealingContainer: {
    marginBottom: 15,
  },
  appealingLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  appealingList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  appealingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appealingText: {
    fontSize: 12,
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
