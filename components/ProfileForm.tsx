import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
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
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // Выбор фото из галереи или камеры
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Ошибка", "Разрешите доступ к галерее!");
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
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Ошибка", "Разрешите доступ к камере!");
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
  };

  const handleSave = () => {
    if (!name || !age || !email || !phone) {
      Alert.alert("未入力", "必須項目を入力してください");
      return;
    }
    onSaveProfile({ name, age, email, phone, nationality, gender, photo });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Фото профиля */}
      <View style={styles.row}>
        <Icon name="person" size={28} color="#ff7f50" style={styles.icon} />
        <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={styles.photoText}>アップロード</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
          <Icon name="photo-camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Имя */}
      <View style={styles.row}>
        <Icon name="badge" size={28} color="#4682b4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="名前"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Возраст */}
      <View style={styles.row}>
        <Icon
          name="calendar-today"
          size={28}
          color="#32cd32"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="年齢"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
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

      {/* Телефон */}
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

      {/* Национальность */}
      <View style={styles.row}>
        <Icon name="public" size={28} color="#daa520" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="国籍"
          value={nationality}
          onChangeText={setNationality}
        />
      </View>

      {/* Пол */}
      <View style={styles.row}>
        <Icon name="wc" size={28} color="#9932cc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="性別 (男/女/その他)"
          value={gender}
          onChangeText={setGender}
        />
      </View>

      {/* Кнопка 保存 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    padding: 12,
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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 4,
  },
  photoButton: {
    backgroundColor: "#f0f8ff",
    padding: 6,
    borderRadius: 6,
  },
  cameraButton: {
    marginLeft: 10,
    backgroundColor: "#4682b4",
    padding: 6,
    borderRadius: 6,
  },
  photoText: {
    color: "#555",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#32cd32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileForm;
