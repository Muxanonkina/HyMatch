import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useApp } from "@/context/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Language } from "@/types";
import ProfileForm from "../../components/ProfileForm";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { state, updateUserProfile, setLanguage, resetMatches } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === "dark"
  );
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    Alert.alert(
      "Language Changed",
      `App language changed to ${language.toUpperCase()}`
    );
  };

  const handleResetMatches = () => {
    Alert.alert(
      "Reset Matches",
      "Are you sure you want to clear all your liked and disliked jobs?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetMatches();
            Alert.alert("Success", "All matches have been reset!");
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Email: support@hymatch.com\nPhone: +81-3-1234-5678"
    );
  };

  const handleAboutApp = () => {
    Alert.alert(
      "About HyMatch",
      "HyMatch v1.0.0\n\nA job matching app for international workers in Japan.\n\nMade with ❤️ for the community."
    );
  };

  const handleSaveProfile = (newProfile: {
    name: string;
    email: string;
    phone: string;
  }) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
  };

  const renderProfileSection = () => {
    if (isEditingProfile) {
      return <ProfileForm onSaveProfile={handleSaveProfile} />;
    }

    if (profile) {
      return (
        <View style={styles.profileInfo}>
          <Text style={[styles.profileText, { color: colors.text }]}>
            Name: {profile.name}
          </Text>
          <Text style={[styles.profileText, { color: colors.text }]}>
            Email: {profile.email}
          </Text>
          <Text style={[styles.profileText, { color: colors.text }]}>
            Phone: {profile.phone}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={() => setIsEditingProfile(true)}
      >
        <Ionicons name="person-add" size={20} color="white" />
        <Text style={styles.buttonText}>Create Profile</Text>
      </TouchableOpacity>
    );
  };

  const renderLanguageSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Language Settings
      </Text>

      <View style={styles.languageOptions}>
        {(["ja", "en", "uz"] as Language[]).map((language) => (
          <TouchableOpacity
            key={language}
            style={[
              styles.languageButton,
              state.currentLanguage === language && {
                backgroundColor: colors.tint,
              },
            ]}
            onPress={() => handleLanguageChange(language)}
          >
            <Text
              style={[
                styles.languageText,
                state.currentLanguage === language && { color: "white" },
              ]}
            >
              {language.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        App Preferences
      </Text>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Ionicons name="notifications" size={20} color={colors.text} />
          <Text style={[styles.preferenceText, { color: colors.text }]}>
            Push Notifications
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.tabIconDefault, true: colors.tint }}
        />
      </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Ionicons name="moon" size={20} color={colors.text} />
          <Text style={[styles.preferenceText, { color: colors.text }]}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: colors.tabIconDefault, true: colors.tint }}
        />
      </View>
    </View>
  );

  const renderActionsSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
        onPress={handleResetMatches}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.actionButtonText}>Reset All Matches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.tint }]}
        onPress={handleContactSupport}
      >
        <Ionicons name="help-circle" size={20} color="white" />
        <Text style={styles.actionButtonText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#9E9E9E" }]}
        onPress={handleAboutApp}
      >
        <Ionicons name="information-circle" size={20} color="white" />
        <Text style={styles.actionButtonText}>About App</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Your Activity
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>
            {state.likedJobs.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Liked Jobs
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#F44336" }]}>
            {state.dislikedJobs.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Disliked Jobs
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>
            {state.jobMatches.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Total Actions
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderProfileSection()}
        {renderLanguageSection()}
        {renderPreferencesSection()}
        {renderStatsSection()}
        {renderActionsSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  profileInfo: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 58,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  languageOptions: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
});
