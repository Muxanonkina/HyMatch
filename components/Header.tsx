// components/TopRightMenu.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Divider, IconButton, Menu } from "react-native-paper";

export default function TopRightMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="dots-vertical" // material icon: вертикальные точки
            onPress={openMenu}
            size={24}
            accessibilityLabel="Открыть меню"
          />
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.push("/pages/profile"); // пример навигации через expo-router
          }}
          title="Profil sozlamalari"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            // здесь логика смены языка
          }}
          title="Tilni o'zgartirish"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            closeMenu();
            // logout logic
          }}
          title="Chiqish"
        />
      </Menu>
    </View>
  );
}
