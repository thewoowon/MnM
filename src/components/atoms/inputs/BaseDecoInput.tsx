// components/form/Input.tsx
import React, {useState} from 'react';
import {
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

type InputProps = TextInputProps & {
  icon?: React.ReactNode;
  boxStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const BaseDecoInput: React.FC<InputProps> = ({style, ...props}) => {
  const {colors, spacing, borderRadius, fontSize} = useTheme();

  return (
    <View
      style={[
        {
          position: 'relative',
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.xl,
          backgroundColor: '#F6F6F6',
          height: 50,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: spacing.sm,
        },
        props.boxStyle || {},
      ]}>
      {props.icon && props.icon}
      <TextInput
        {...props}
        style={[
          {
            fontSize: fontSize.md,
            color: colors.text,
          },
          props.inputStyle || {},
        ]}
      />
    </View>
  );
};

export default BaseDecoInput;
