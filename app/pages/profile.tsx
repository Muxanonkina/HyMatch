import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileFormProps = {
  onSaveProfile: (profile: any) => void;
};

const Profile: React.FC<ProfileFormProps> = ({ onSaveProfile }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");

  const handlePickPhoto = () => {
    Alert.alert("写真を選択", "", [
      {
        text: "Camera",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) return;
          const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
          if (!result.canceled) setPhoto(result.assets[0].uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) return;
          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.7,
          });
          if (!result.canceled) setPhoto(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = () => {
    if (!firstName || !lastName) {
      Alert.alert("エラー", "名前を入力してください");
      return;
    }
    const profileData = {
      name: `${firstName} ${lastName}`,
      photo,
    };
    console.log("Saved Profile:", profileData);
    Alert.alert("保存しました", `${profileData.name} が保存されました`);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f9f9f9",
      }}
      edges={["top", "bottom"]}
    >
      <View style={styles.container}>
        {/* Photo Block */}
        <TouchableOpacity onPress={handlePickPhoto} style={styles.photoWrapper}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.plus}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  photoWrapper: {
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    fontSize: 28,
    color: "#fff",
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
