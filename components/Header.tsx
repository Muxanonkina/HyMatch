import { Colors } from "@/constants/Colors";
import { scale } from "@/hooks/useResponsive";
import { Feather, Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
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
    console.log("Hamburger menu pressed"); // Debug log
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleProfilePress = () => {
    closeDropdown();
    // Navigate to profile editing screen with ProfileForm component
    router.push({
      pathname: "/pages/editProfile",
      params: {
        mode: "edit",
        title: t("edit_profile"),
      },
    });
  };

  const handleLanguagePress = () => {
    closeDropdown();
    // Navigate to language selection screen
    router.push({
      pathname: "/pages/lang",
      params: {
        title: t("change_language"),
      },
    });
  };

  const handleLogoutPress = () => {
    closeDropdown();
    // Show logout confirmation dialog
    Alert.alert(
      t("logout_confirmation_title", "ログアウト"),
      t("logout_confirmation_message", "ログアウトしますか？"),
      [
        {
          text: t("cancel", "キャンセル"),
          style: "cancel",
        },
        {
          text: t("logout", "ログアウト"),
          style: "destructive",
          onPress: () => {
            // Clear user data and navigate to login/splash screen
            // You can add AsyncStorage clearing logic here
            console.log("User logged out");
            // Navigate to login screen or reset app state
            router.replace("/");
          },
        },
      ]
    );
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
          activeOpacity={0.7}
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
            activeOpacity={0.7}
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
            activeOpacity={0.7}
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
            activeOpacity={0.7}
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
        statusBarTranslucent={false}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: colors.cardBackground,
                    },
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
                    <Text
                      style={[styles.dropdownText, { color: colors.danger }]}
                    >
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
        </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: height < 600 ? height * 0.08 : height * 0.12,
    paddingLeft: width < 400 ? width * 0.02 : width * 0.03,
  },
  dropdown: {
    minWidth: width * 0.6,
    maxWidth: width * 0.85,
    borderRadius: scale(12),
    padding: scale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    // Adaptive sizing for different screen sizes
    width: width < 400 ? width * 0.75 : width * 0.65,
    // Ensure dropdown doesn't interfere with other elements
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    marginVertical: scale(2),
    minHeight: scale(48),
    // Better touch target for mobile devices
    minWidth: scale(200),
  },
  dropdownText: {
    flex: 1,
    fontSize: width < 400 ? scale(14) : scale(16),
    fontWeight: "500",
    marginLeft: scale(12),
    // Ensure text doesn't get cut off on smaller screens
    flexWrap: "wrap",
  },
});
