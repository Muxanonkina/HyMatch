import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Swipe",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="swap-horizontal" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Search",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="search" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: "Liked",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="heart" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="disliked"
        options={{
          title: "Disliked",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="close-circle" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="settings" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
