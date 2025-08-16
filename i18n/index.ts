/* eslint-disable import/no-named-as-default-member */
import { Language } from "@/types";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ja: {
    translation: {
      // Navigation
      home: "ホーム",
      explore: "探索",
      profile: "プロフィール",
      settings: "設定",
      language: "言語",

      // Job matching
      swipeRight: "右スワイプで選択",
      swipeLeft: "左スワイプで拒否",
      choose: "選択",
      refuse: "拒否",
      chooseList: "選択リスト",
      refuseList: "拒否リスト",

      // Job types
      cooking: "料理",
      customer_service: "接客",
      cleaning: "清掃",
      factory: "工場",
      delivery: "配送",
      hotel: "ホテル",
      warehouse: "倉庫",
      office: "オフィス",
      retail: "小売",

      // Job details
      hourlyWage: "時給",
      japaneseLevel: "日本語レベル",
      commutingTime: "通勤時間",
      availableDays: "勤務可能日",
      appealingPoints: "アピールポイント",
      shiftAdjustment: "シフト調整可能",
      staffMeal: "スタッフ食事提供",

      // Days of week
      mon: "月",
      tue: "火",
      wed: "水",
      thu: "木",
      fri: "金",
      sat: "土",
      sun: "日",

      // Profile
      basicInfo: "基本情報",
      firstName: "名",
      lastName: "姓",
      age: "年齢",
      profilePhoto: "プロフィール写真",
      nationality: "国籍",
      gender: "性別",
      male: "男性",
      female: "女性",
      other: "その他",

      // Station info
      nearestStation: "最寄り駅",
      homeStation: "自宅最寄り駅",
      schoolStation: "学校最寄り駅",
      walkTime: "徒歩時間",
      minutes: "分",

      // Address
      address: "住所",
      postalCode: "郵便番号",
      prefecture: "都道府県",
      city1: "市区町村1",
      city2: "市区町村2",
      streetAddress: "番地・建物名",

      // Contact
      contact: "連絡先",
      email: "メールアドレス",
      phone: "電話番号",

      // Visa
      visa: "在留資格",
      currentVisa: "現在の在留資格",
      plannedVisa: "予定の在留資格",
      uploadImage: "画像をアップロード",

      // Other
      currentOccupation: "現在の職業",
      student: "学生",
      desiredOccupation: "希望職種",
      workHistory: "職歴・アルバイト歴",

      // Actions
      save: "保存",
      cancel: "キャンセル",
      edit: "編集",
      delete: "削除",
      apply: "応募",
      filter: "フィルター",
      sort: "並び替え",

      // Validation
      required: "必須項目です",
      invalidEmail: "有効なメールアドレスを入力してください",
      invalidPhone: "有効な電話番号を入力してください",
      invalidPostalCode: "有効な郵便番号を入力してください",

      // Messages
      profileIncomplete: "プロフィールが不完全です",
      completeProfile: "プロフィールを完成させてください",
      jobApplied: "求人に応募しました",
      noJobsFound: "求人が見つかりません",

      // Filter options
      byHourlyWage: "時給順",
      byCommutingTime: "通勤時間順",
      byPostingDate: "投稿日順",
      salaryRange: "給与範囲",
      jobTypeFilter: "職種",
      japaneseLevelFilter: "日本語レベル",
      commutingConvenience: "通勤の利便性",
      importantFactors: "重視する点",
    },
  },
  en: {
    translation: {
      // Navigation
      home: "Home",
      explore: "Explore",
      profile: "Profile",
      settings: "Settings",
      language: "Language",

      // Job matching
      swipeRight: "Swipe right to choose",
      swipeLeft: "Swipe left to refuse",
      choose: "Choose",
      refuse: "Refuse",
      chooseList: "Choose List",
      refuseList: "Refuse List",

      // Job types
      cooking: "Cooking",
      customer_service: "Customer Service",
      cleaning: "Cleaning",
      factory: "Factory",
      delivery: "Delivery",
      hotel: "Hotel",
      warehouse: "Warehouse",
      office: "Office",
      retail: "Retail",

      // Job details
      hourlyWage: "Hourly Wage",
      japaneseLevel: "Japanese Level",
      commutingTime: "Commuting Time",
      availableDays: "Available Days",
      appealingPoints: "Appealing Points",
      shiftAdjustment: "Shift Adjustment Available",
      staffMeal: "Staff Meal Provided",

      // Days of week
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",

      // Profile
      basicInfo: "Basic Information",
      firstName: "First Name",
      lastName: "Last Name",
      age: "Age",
      profilePhoto: "Profile Photo",
      nationality: "Nationality",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",

      // Station info
      nearestStation: "Nearest Station",
      homeStation: "Home Station",
      schoolStation: "School Station",
      walkTime: "Walk Time",
      minutes: "minutes",

      // Address
      address: "Address",
      postalCode: "Postal Code",
      prefecture: "Prefecture",
      city1: "City 1",
      city2: "City 2",
      streetAddress: "Street Address",

      // Contact
      contact: "Contact",
      email: "Email",
      phone: "Phone",

      // Visa
      visa: "Visa",
      currentVisa: "Current Visa",
      plannedVisa: "Planned Visa",
      uploadImage: "Upload Image",

      // Other
      currentOccupation: "Current Occupation",
      student: "Student",
      desiredOccupation: "Desired Occupation",
      workHistory: "Work History",

      // Actions
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      apply: "Apply",
      filter: "Filter",
      sort: "Sort",

      // Validation
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
      invalidPostalCode: "Please enter a valid postal code",

      // Messages
      profileIncomplete: "Profile is incomplete",
      completeProfile: "Please complete your profile",
      jobApplied: "Job application submitted",
      noJobsFound: "No jobs found",

      // Filter options
      byHourlyWage: "By Hourly Wage",
      byCommutingTime: "By Commuting Time",
      byPostingDate: "By Posting Date",
      salaryRange: "Salary Range",
      jobTypeFilter: "Job Type",
      japaneseLevelFilter: "Japanese Level",
      commutingConvenience: "Commuting Convenience",
      importantFactors: "Important Factors",
    },
  },
  uz: {
    translation: {
      // Navigation
      home: "Bosh sahifa",
      explore: "Qidirish",
      profile: "Profil",
      settings: "Sozlamalar",
      language: "Til",

      // Job matching
      swipeRight: "Tanlash uchun o'ngga siling",
      swipeLeft: "Rad etish uchun chapga siling",
      choose: "Tanlash",
      refuse: "Rad etish",
      chooseList: "Tanlanganlar ro'yxati",
      refuseList: "Rad etilganlar ro'yxati",

      // Job types
      cooking: "Oshpazlik",
      customer_service: "Mijozlarga xizmat",
      cleaning: "Tozalash",
      factory: "Zavod",
      delivery: "Yetkazib berish",
      hotel: "Mehmonxona",
      warehouse: "Ombor",
      office: "Ofis",
      retail: "Chakana savdo",

      // Job details
      hourlyWage: "Soatlik ish haqi",
      japaneseLevel: "Yapon tili darajasi",
      commutingTime: "Ishga borish vaqti",
      availableDays: "Ishlash kunlari",
      appealingPoints: "Jalb qiluvchi jihatlar",
      shiftAdjustment: "Vaqt almashish mumkin",
      staffMeal: "Xodimlar uchun ovqat",

      // Days of week
      mon: "Dush",
      tue: "Sesh",
      wed: "Chor",
      thu: "Pay",
      fri: "Jum",
      sat: "Shan",
      sun: "Yak",

      // Profile
      basicInfo: "Asosiy ma'lumotlar",
      firstName: "Ism",
      lastName: "Familiya",
      age: "Yosh",
      profilePhoto: "Profil rasmi",
      nationality: "Millat",
      gender: "Jinsi",
      male: "Erkak",
      female: "Ayol",
      other: "Boshqa",

      // Station info
      nearestStation: "Eng yaqin stansiya",
      homeStation: "Uy stansiyasi",
      schoolStation: "Maktab stansiyasi",
      walkTime: "Yurish vaqti",
      minutes: "daqiqa",

      // Address
      address: "Manzil",
      postalCode: "Pochta indeksi",
      prefecture: "Prefektura",
      city1: "Shahar 1",
      city2: "Shahar 2",
      streetAddress: "Ko'cha manzili",

      // Contact
      contact: "Aloqa",
      email: "Elektron pochta",
      phone: "Telefon",

      // Visa
      visa: "Viza",
      currentVisa: "Hozirgi viza",
      plannedVisa: "Rejalashtirilgan viza",
      uploadImage: "Rasm yuklash",

      // Other
      currentOccupation: "Hozirgi kasb",
      student: "Talaba",
      desiredOccupation: "Kerakli kasb",
      workHistory: "Ish tarixi",

      // Actions
      save: "Saqlash",
      cancel: "Bekor qilish",
      edit: "Tahrirlash",
      delete: "O'chirish",
      apply: "Ariza berish",
      filter: "Filtrlash",
      sort: "Saralash",

      // Validation
      required: "Bu maydon to'ldirilishi shart",
      invalidEmail: "To'g'ri elektron pochta manzilini kiriting",
      invalidPhone: "To'g'ri telefon raqamini kiriting",
      invalidPostalCode: "To'g'ri pochta indeksini kiriting",

      // Messages
      profileIncomplete: "Profil to'liq emas",
      completeProfile: "Iltimos, profilingizni to'ldiring",
      jobApplied: "Ish uchun ariza yuborildi",
      noJobsFound: "Ish topilmadi",

      // Filter options
      byHourlyWage: "Soatlik ish haqi bo'yicha",
      byCommutingTime: "Ishga borish vaqti bo'yicha",
      byPostingDate: "E'lon sanasi bo'yicha",
      salaryRange: "Ish haqi diapazoni",
      jobTypeFilter: "Ish turi",
      japaneseLevelFilter: "Yapon tili darajasi",
      commutingConvenience: "Ishga borish qulayligi",
      importantFactors: "Muhim omillar",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ja", // default language
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3", // Add this to fix Intl API compatibility
});

export const changeLanguage = (language: Language) => {
  i18n.changeLanguage(language);
};

export default i18n;
