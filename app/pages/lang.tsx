import { Colors } from "@/constants/Colors";
import { scale } from "@/hooks/useResponsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleBack = () => {
    router.back();
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {t("change_language")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.text }]}>
          Select Language
        </Text>

        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor:
                    i18n.language === lang.code ? colors.tint : colors.border,
                },
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {lang.name}
              </Text>
              {i18n.language === lang.code && (
                <Ionicons
                  name="checkmark"
                  size={scale(20)}
                  color={colors.tint}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.04,
  },
  message: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(32),
    textAlign: "center",
  },
  languageList: {
    gap: scale(16),
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flag: {
    fontSize: scale(24),
    marginRight: scale(16),
  },
  languageName: {
    flex: 1,
    fontSize: scale(18),
    fontWeight: "500",
  },
});
