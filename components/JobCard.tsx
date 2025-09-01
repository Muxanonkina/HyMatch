import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  borderRadius,
  fontSize,
  scale,
  spacing,
  verticalScale,
} from "@/hooks/useResponsive";
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
    <View
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.jobTypeIcon, { fontSize: 32 }]}>
          {getJobTypeIcon(job.jobType)}
        </Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {job.title}
          </Text>
          <Text style={[styles.location, { color: colors.secondaryText }]}>
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
                    : colors.border,
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
                { backgroundColor: colors.border },
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
    maxWidth: scale(350),
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
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
    marginBottom: spacing.md,
  },
  jobTypeIcon: {
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  location: {
    fontSize: fontSize.md,
  },
  salaryContainer: {
    marginBottom: spacing.md,
  },
  salaryLabel: {
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  salary: {
    fontSize: fontSize.title,
    fontWeight: "bold",
  },
  requirementsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  requirement: {
    alignItems: "center",
  },
  requirementLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  requirementValue: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  badgeText: {
    color: "white",
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  daysContainer: {
    marginBottom: spacing.md,
  },
  daysLabel: {
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  daysList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBadge: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "white",
    fontSize: fontSize.sm,
    fontWeight: "bold",
  },
  appealingContainer: {
    marginBottom: spacing.md,
  },
  appealingLabel: {
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  appealingList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  appealingBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  appealingText: {
    fontSize: fontSize.sm,
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: verticalScale(20),
  },
});
