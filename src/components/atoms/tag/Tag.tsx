import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

type TagProps = {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  boxStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedBackgroundColor?: string;
  selectedTextColor?: string;
};

export const Tag = ({
  label,
  onPress,
  selected,
  boxStyle,
  textStyle,
  selectedBackgroundColor,
  selectedTextColor,
}: TagProps) => {
  const {colors, spacing, borderRadius} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.full,
        },
        boxStyle || {},
        selected && {
          backgroundColor: selectedBackgroundColor,
          borderColor: colors.primary,
          borderWidth: 1,
        },
      ]}>
      <Text
        style={[
          {color: 'white', fontSize: 12},
          textStyle || {},
          selected && {color: selectedTextColor},
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};
