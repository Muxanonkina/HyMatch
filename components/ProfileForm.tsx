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
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [nationalityModalVisible, setNationalityModalVisible] = useState(false);
  const [homeType, setHomeType] = useState<string>("");
  const [walkTime, setWalkTime] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [prefecture, setPrefecture] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [japaneseLevel, setJapaneseLevel] = useState<string>("");
  const [residenceStatusImage, setResidenceStatusImage] = useState<
    string | null
  >(null);
  const [plannedChange, setPlannedChange] = useState<string>("");
  const [prefectureModalVisible, setPrefectureModalVisible] = useState(false);
  const [plannedChangeModalVisible, setPlannedChangeModalVisible] =
    useState(false);
  const [visaTypeModalVisible, setVisaTypeModalVisible] = useState(false);
  const [visaType, setVisaType] = useState("");
  const [certificateImage, setCertificateImage] = useState<string | null>(null);

  const nationalities: { name: string; flag: string }[] = [
    { name: "Uzbekistan", flag: "🇺🇿" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "China", flag: "🇨🇳" },
    { name: "Republic of Korea", flag: "🇰🇷" },
    { name: "Russian", flag: "🇷🇺" },
    { name: "United States", flag: "🇺🇸" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    { name: "Irish", flag: "🇮🇪" }, // Note: Same flag as Ireland
    { name: "France", flag: "🇫🇷" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Spain", flag: "🇪🇸" },
  ];
  const handleSave = () => {
    // TODO: Add validation
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

  const setupNationality = (value: string) => {
    setNationality(value); // Assuming value is the name of the nationality
    setNationalityModalVisible(false); // Close modal after selection
  };

  const handleAutoFillAddress = () => {
    // Пример автозаполнения из почтового кода
    if (postalCode === "1500041") {
      setPrefecture("東京都");
      setCity("渋谷区");
      setStreet("神南1-19-11");
    } else if (postalCode === "1600022") {
      setPrefecture("東京都");
      setCity("新宿区");
      setStreet("新宿3-1-1");
    } else {
      Alert.alert("エラー", "対応する住所が見つかりません");
    }
  };

  // Функция загрузки сертификата
  const handleCertificateUpload = async () => {
    try {
      // Открываем галерею для выбора изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // только фото
        allowsEditing: true, // можно кадрировать
        quality: 1, // лучшее качество
      });

      // Проверяем, выбрал ли пользователь фото
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setCertificateImage(uri); // сохраняем путь в state
      }
    } catch (error) {
      console.error("Ошибка загрузки сертификата:", error);
    }
  };

  // Функция выбора фото для residence status
  const handleResidenceStatusUpload = async () => {
    // Открываем галерею
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // только фото
      allowsEditing: true, // возможность обрезки
      quality: 1, // качество
    });

    // Если пользователь не отменил выбор
    if (!result.canceled) {
      setResidenceStatusImage(result.assets[0].uri); // сохраняем путь в state
    }
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

      {/* 国籍 (Nationality) */}
      <View style={styles.row}>
        <Icon name="flag" size={28} color="#007bff" style={styles.icon} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setNationalityModalVisible(true)}
        >
          <Text style={{ color: nationality ? "#000" : "#aaa" }}>
            {nationality || "国籍 (Nationality)"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={nationalityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNationalityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={nationalities}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => setupNationality(item.name)}
                >
                  <View style={styles.nationalityItemContainer}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.flagIcon}>{item.flag}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      {/* Gender Selection */}
      <View style={styles.row}>
        <Icon name="wc" size={28} color="#8a2be2" style={styles.icon} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Male" && styles.genderSelected,
            ]}
            onPress={() => setGender("Male")}
          >
            <Text style={styles.genderLabel}>♂️ 男性</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Female" && styles.genderSelected,
            ]}
            onPress={() => setGender("Female")}
          >
            <Text style={styles.genderLabel}>♀️ 女性</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "Other" && styles.genderSelected,
            ]}
            onPress={() => setGender("Other")}
          >
            <Text style={styles.genderLabel}>その他</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Home → Nearest Station */}
      <View style={styles.row}>
        <Icon name="home" size={28} color="#ff9800" style={styles.icon} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {["自宅", "住宅"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.genderOption,
                  homeType === type && styles.genderSelected,
                ]}
                onPress={() => setHomeType(type)}
              >
                <Text style={styles.genderLabel}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.label}>最寄り駅までの徒歩時間</Text>
            <FlatList
              horizontal
              data={["5分", "10分", "15分", "20分", "25分", "30分"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    walkTime === item && styles.genderSelected,
                  ]}
                  onPress={() => setWalkTime(item)}
                >
                  <Text style={styles.genderLabel}>{item}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ gap: 8 }}
            />
          </View>
        </View>
      </View>

      {/* Postal Code + Address */}
      <View style={styles.row}>
        <Icon
          name="location-on"
          size={28}
          color="#ff5722"
          style={styles.icon}
        />
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="郵便番号 (Postal Code)"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            maxLength={7}
          />
          <TouchableOpacity
            style={styles.autoFillButton}
            onPress={handleAutoFillAddress}
          >
            <Text style={styles.autoFillButtonText}>住所を自動入力</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="都道府県 (Prefecture)"
            value={prefecture}
            onFocus={() => setPrefectureModalVisible(true)}
            editable={false}
          />
          <Modal
            visible={prefectureModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setPrefectureModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={prefecture}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setPrefecture(item);
                        setPrefectureModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
          <TextInput
            style={styles.input}
            placeholder="市区町村 (City)"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="番地・建物 (Street/Building)"
            value={street}
            onChangeText={setStreet}
          />
        </View>
      </View>

      {/* Visa Type + Residence Status Upload */}
      <View style={styles.row}>
        <Icon name="assignment" size={28} color="#009688" style={styles.icon} />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setVisaTypeModalVisible(true)}
          >
            <Text style={{ color: visaType ? "#000" : "#aaa" }}>
              {visaType || "在留資格 (Visa Type)"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={visaTypeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisaTypeModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={visaType}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setVisaType(item);
                        setVisaTypeModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleResidenceStatusUpload}
          >
            <Icon name="photo-camera" size={24} color="#009688" />
            <Text style={styles.uploadText}>在留カード画像アップロード</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setPlannedChangeModalVisible(true)}
          >
            <Text style={{ color: plannedChange ? "#000" : "#aaa" }}>
              {plannedChange || "在留資格変更予定 (Planned Change)"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={plannedChangeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setPlannedChangeModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={plannedChange}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setPlannedChange(item);
                        setPlannedChangeModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.uploadBlock}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleResidenceStatusUpload}
        >
          <Text style={styles.uploadButtonText}>
            {residenceStatusImage ? "Изменить фото" : "写真をアップロード"}
          </Text>
        </TouchableOpacity>

        {/* Если пользователь выбрал фото – показываем его */}
        {residenceStatusImage && (
          <Image
            source={{ uri: residenceStatusImage }}
            style={styles.uploadedImage}
          />
        )}
      </View>

      {/* Certificate Upload + Visa Type */}
      <View style={styles.row}>
        <Icon
          name="insert-drive-file"
          size={28}
          color="#607d8b"
          style={styles.icon}
        />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleCertificateUpload}
          >
            <Icon name="file-upload" size={24} color="#607d8b" />
            <Text style={styles.uploadText}>証明書アップロード</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setVisaTypeModalVisible(true)}
          >
            <Text style={{ color: certificateImage ? "#000" : "#aaa" }}>
              {certificateImage || "在留資格 (Visa Type)"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={visaTypeModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisaTypeModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={visaType}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setCertificateImage(item);
                        setVisaTypeModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {/* Japanese Language Level */}
      <View style={styles.row}>
        <Icon name="translate" size={28} color="#3f51b5" style={styles.icon} />
        <FlatList
          horizontal
          data={["N1", "N2", "N3", "N4", "N5"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.genderOption,
                japaneseLevel === item && styles.genderSelected,
              ]}
              onPress={() => setJapaneseLevel(item)}
            >
              <Text style={styles.genderLabel}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 8 }}
        />
      </View>
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
  uploadButton: {
    backgroundColor: "#9c27b0", // фиолетовый
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  nationalityItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  flagIcon: {
    fontSize: 20, // Adjust size as needed
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    gap: 6,
  },
  genderSelected: {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  genderLabel: {
    fontSize: 16,
    color: "#444",
  },
  uploadText: {
    fontSize: 16,
    color: "#000", // или "#aaa"
    textAlign: "center",
  },
  autoFillButton: {
    backgroundColor: "#9c27b0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  autoFillButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default ProfileForm;
