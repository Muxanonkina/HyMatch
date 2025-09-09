import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import Header from "../../components/Header";
export default function HomeScreen() {
  return (
    <>
      <Appbar.Header>
        <Header />
        <Appbar.Content title="Ishlar ro'yxati" />

        <Appbar.Action
          icon="menu"
          onPress={() => {
            /* open drawer */
          }}
        />
      </Appbar.Header>

      <View style={styles.container}>{/* контент */}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
