// components/form/NumberInput.tsx
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

type NumberInputProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  placeholder?: string;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconSize?: number;
};

const BaseNumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  placeholder = '0',
  style,
  boxStyle,
  inputStyle,
  iconSize = 20,
}) => {
  const {colors, spacing, fontSize} = useTheme();
  const [focused, setFocused] = useState(false);

  const handleChangeText = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
      return;
    }
    onChange(num);
  };

  const increment = () => {
    if (max !== undefined && value + step > max) return;
    onChange(value + step);
  };

  const decrement = () => {
    if (min !== undefined && value - step < min) return;
    onChange(value - step);
  };

  return (
    <View style={[{marginBottom: spacing.md}, style]}>
      {label && (
        <Text
          style={{
            marginBottom: 10,
            fontSize: fontSize.md,
            color: colors.text,
            fontWeight: 'bold',
            lineHeight: 24,
            paddingLeft: 16,
          }}>
          {label}
        </Text>
      )}
      <View style={[styles.wrapper, boxStyle]}>
        <Pressable onPress={decrement} style={styles.button}>
          <Text
            style={[
              {fontSize: fontSize.lg, color: colors.gray},
              {
                fontSize: iconSize,
              },
            ]}>
            －
          </Text>
        </Pressable>

        <TextInput
          value={value.toString()}
          keyboardType="numeric"
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={[
            styles.input,
            {
              fontSize: fontSize.md,
              color: colors.text,
            },
            inputStyle,
          ]}
        />

        <Pressable onPress={increment} style={styles.button}>
          <Text
            style={[
              {fontSize: fontSize.lg, color: colors.gray},
              {
                fontSize: iconSize,
              },
            ]}>
            ＋
          </Text>
        </Pressable>
      </View>

      {error && (
        <Text
          style={{
            color: colors.secondary,
            fontSize: fontSize.sm,
            marginTop: 4,
          }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5F6',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  button: {},
  input: {
    textAlign: 'center',
    width: 32,
  },
});

export default BaseNumberInput;
