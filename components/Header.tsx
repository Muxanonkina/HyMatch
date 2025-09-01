import { Colors } from "@/constants/Colors";
import { scale } from "@/hooks/useResponsive";
import { Feather, Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface HeaderProps {
  onFilterPress?: () => void;
  onDetailPress?: () => void;
  onSharePress?: () => void;
}

export function Header({
  onFilterPress,
  onDetailPress,
  onSharePress,
}: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [showDropdown, setShowDropdown] = useState(false);

  const handleHamburgerMenu = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleProfilePress = () => {
    closeDropdown();
    router.push("/pages/editProfile");
  };

  const handleLanguagePress = () => {
    closeDropdown();
    router.push("/pages/lang");
  };

  const handleLogoutPress = () => {
    closeDropdown();
    // Add logout logic here
    console.log("Logout pressed");
  };

  return (
    <>
      <View style={styles.header}>
        {/* Left: Hamburger Menu */}
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
          <Ionicons name="menu" size={scale(20)} color={colors.text} />
        </TouchableOpacity>

        {/* Center: Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("job_list")}
          </Text>
        </View>

        {/* Right: Action Icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={onFilterPress}
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
            <Feather name="filter" size={scale(20)} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDetailPress}
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
            <Feather name="info" size={scale(20)} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSharePress}
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
            <Feather name="share-2" size={scale(20)} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={[
                  styles.dropdown,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleProfilePress}
                >
                  <Ionicons
                    name="person"
                    size={scale(20)}
                    color={colors.tint}
                  />
                  <Text style={[styles.dropdownText, { color: colors.text }]}>
                    Profile
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={scale(16)}
                    color={colors.tabIconDefault}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLanguagePress}
                >
                  <Ionicons
                    name="language"
                    size={scale(20)}
                    color={colors.tint}
                  />
                  <Text style={[styles.dropdownText, { color: colors.text }]}>
                    Change Language
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={scale(16)}
                    color={colors.tabIconDefault}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogoutPress}
                >
                  <Ionicons
                    name="log-out"
                    size={scale(20)}
                    color={colors.danger}
                  />
                  <Text style={[styles.dropdownText, { color: colors.danger }]}>
                    Logout
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={scale(16)}
                    color={colors.tabIconDefault}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.042,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
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
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    gap: width * 0.02,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: height * 0.12,
    paddingLeft: width * 0.03,
  },
  dropdown: {
    minWidth: width * 0.6,
    borderRadius: scale(12),
    padding: scale(8),
    shadowColor: "#000",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: scale(32),
    paddingHorizontal: scale(36),
    borderRadius: scale(8),
    marginVertical: scale(2),
  },
  dropdownText: {
    flex: 1,
    fontSize: scale(16),
    fontWeight: "500",
    marginLeft: scale(12),
  },
});
