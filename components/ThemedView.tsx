import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'card' | 'cardAlt';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  variant = 'background',
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    variant === 'card' ? 'cardBackground' : 
    variant === 'cardAlt' ? 'cardAltBackground' : 'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
