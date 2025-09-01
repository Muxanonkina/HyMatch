import ProfileForm from "@/components/ProfileForm";
import { Colors } from "@/constants/Colors";
import { scale } from "@/hooks/useResponsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleBack = () => {
    router.back();
  };

  const handleSaveProfile = (profile: any) => {
    // Handle profile saving logic here
    console.log("Profile saved:", profile);
    // You can add AsyncStorage saving logic here
    // AsyncStorage.setItem('userProfile', JSON.stringify(profile));

    // Show success message and navigate back
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {params.title || t("edit_profile")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Form Content */}
      <View style={styles.content}>
        <ProfileForm onSaveProfile={handleSaveProfile} />
      </View>
    </View>
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
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: scale(8),
  },
  title: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  placeholder: {
    width: scale(40),
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
  },
  message: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(16),
  },
  subMessage: {
    fontSize: scale(16),
    textAlign: "center",
  },
});
