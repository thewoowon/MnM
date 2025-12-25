// components/form/Input.tsx
import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  boxStyle?: StyleProp<ViewStyle>;
};

const BaseInput = forwardRef<TextInput, InputProps>(
  ({ label, error, style, boxStyle, ...props }, ref) => {
    const { colors, spacing, borderRadius, fontSize } = useTheme();
    const [focused, setFocused] = useState(false);

    return (
      <View style={[{ marginBottom: spacing.md }, boxStyle]}>
        {label && (
          <Text
            style={{
              marginBottom: 10,
              fontSize: fontSize.md,
              color: colors.text,
              fontWeight: 'bold',
              lineHeight: 24,
              paddingLeft: 16,
            }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          {...props}
          style={[
            {
              borderWidth: error ? 1 : focused ? 1 : 0,
              borderColor: error
                ? colors.subpointRed
                : focused
                ? colors.primary
                : '#ccc',
              // inside border
              borderRadius: borderRadius.md,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              fontSize: fontSize.md,
              color: colors.text,
              backgroundColor: '#F6F6F6',
              height: 50,
            },
            style,
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {error && (
          <Text
            style={{
              color: colors.subpointRed,
              fontSize: fontSize.sm,
              marginTop: 4,
              paddingLeft: 20,
            }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;
