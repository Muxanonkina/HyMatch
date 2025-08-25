// constants/Colors.ts
export const VintagePalette = {
  // base paper tones
  cream: "#F6F3EE", // app background (soft cream)
  paper: "#FDFAF6", // card / paper background
  sand: "#EFE6D1", // alternate paper / accents

  // text tones
  text: "#40342A", // warm dark brown (primary text)
  mutedText: "#6B6157", // secondary text / captions

  // accents (pastel, warm)
  tint: "#B78A52", // primary accent (caramel)
  info: "#6B9080", // soft teal/green (info)
  success: "#A3B18A", // pastel green (success)
  danger: "#E07A5F", // warm red (danger)

  // UI neutrals
  tabIconDefault: "#BFB1A6", // muted icon color
  border: "#E4DDCF",
  placeholder: "#C9B79C",

  // shadow
  shadow: "rgba(0,0,0,0.08)",
} as const;

// Named export used across the app
export const Colors = {
  light: {
    background: VintagePalette.cream,
    cardBackground: VintagePalette.paper,
    cardAltBackground: VintagePalette.sand,
    text: VintagePalette.text,
    secondaryText: VintagePalette.mutedText,
    tint: VintagePalette.tint,
    tabIconDefault: VintagePalette.tabIconDefault,
    border: VintagePalette.border,
    placeholder: VintagePalette.placeholder,
    success: VintagePalette.success,
    danger: VintagePalette.danger,
    info: VintagePalette.info,
    shadow: VintagePalette.shadow,
  },
  dark: {
    // dark-theme analogs with the same "mood"
    background: "#0f1112",
    cardBackground: "#141516",
    cardAltBackground: "#1b1b1c",
    text: "#efe7dd",
    secondaryText: "#ccc5bd",
    tint: VintagePalette.tint,
    tabIconDefault: "#6E6A64",
    border: "#262625",
    placeholder: "#4B4743",
    success: "#9DB089",
    danger: "#D9765C",
    info: "#5F7F71",
    shadow: "rgba(0,0,0,0.6)",
  },
} as const;

// helper type (optional, useful in hooks)
export type ThemeColors = typeof Colors.light;
