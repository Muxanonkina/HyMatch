import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type ProfileFormProps = {
  onSaveProfile: (profile: any) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ onSaveProfile }) => {
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const handleSave = () => {
    onSaveProfile({
      name: `${lastName} ${firstName}`,
      birthday,
      email,
      phone,
      age,
      nationality,
      gender,
      photo,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Horizontal block: Avatar + Name inputs */}
      <View style={styles.horizontalBlock}>
        {/* Left: Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => {
            Alert.alert("写真を選択", "", [
              {
                text: "Camera",
                onPress: async () => {
                  const permissionResult =
                    await ImagePicker.requestCameraPermissionsAsync();
                  if (!permissionResult.granted) {
                    Alert.alert(
                      "エラー",
                      "カメラへのアクセスを許可してください"
                    );
                    return;
                  }
                  const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                  });
                  if (!result.canceled) {
                    setPhoto(result.assets[0].uri);
                  }
                },
              },
              {
                text: "Gallery",
                onPress: async () => {
                  const permissionResult =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!permissionResult.granted) {
                    Alert.alert(
                      "エラー",
                      "ギャラリーへのアクセスを許可してください"
                    );
                    return;
                  }
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                  });
                  if (!result.canceled) {
                    setPhoto(result.assets[0].uri);
                  }
                },
              },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color="#ccc" />
            </View>
          )}
        </TouchableOpacity>
        {/* Right: Name inputs */}
        <KeyboardAvoidingView style={styles.nameInputsBlock} behavior="padding">
          {" "}
          <TextInput
            style={styles.input}
            placeholder="姓（Last）"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="名（First）"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />
        </KeyboardAvoidingView>
      </View>

      {/* 年齢 (Age) */}
      <View style={styles.row}>
        <Icon name="cake" size={28} color="#ffb300" style={styles.icon} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: age ? "#000" : "#aaa" }}>
            {age || "年齢 (Age)"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={Array.from({ length: 45 }, (_, i) => (i + 16).toString())}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setAge(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Birthday */}
      <View style={styles.row}>
        <Icon
          name="calendar-today"
          size={28}
          color="#32cd32"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="生年月日"
          value={birthday}
          onChangeText={setBirthday}
        />
      </View>

      {/* Email */}
      <View style={styles.row}>
        <Icon name="email" size={28} color="#ff4500" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="メール"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Phone */}
      <View style={styles.row}>
        <Icon name="phone" size={28} color="#20b2aa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="電話番号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  horizontalBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  nameInputsBlock: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: "#ff9800",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ff9800",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default ProfileForm;
