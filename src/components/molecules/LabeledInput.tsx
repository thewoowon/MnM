import React from 'react';
import BaseInput from '@components/atoms/inputs/BaseInput';
import { theme } from '@contexts/theme';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  title: string;
  subTitle?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error: string;
  style?: StyleProp<ViewStyle>;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?: number;
  sparse?: boolean;
  inputStyle?: StyleProp<ViewStyle>;
};

type LabeledContainerProps = {
  title: string;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  sparse?: boolean;
};

export function LabeledInputContainer({
  title,
  subTitle,
  style,
  inputContainerStyle,
  children,
  sparse = false,
}: LabeledContainerProps) {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.headerContainer,
          {
            gap: sparse ? 10 : 0,
          },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
        {subTitle && <Text style={styles.subText}>{subTitle}</Text>}
      </View>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {children}
      </View>
    </View>
  );
}

export default function LabeledInput({
  title,
  subTitle,
  value,
  onChangeText,
  placeholder,
  error,
  style,
  keyboardType,
  maxLength,
  sparse = false,
  inputStyle,
}: Props) {
  return (
    <LabeledInputContainer title={title} subTitle={subTitle} style={style}>
      <BaseInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
        value={value}
        onChangeText={onChangeText}
        error={error}
        returnKeyType="next"
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={inputStyle}
      />
    </LabeledInputContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {},
  text: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: theme.fontFamily.bold,
      android: theme.fontFamily.bold,
    }),
    color: theme.colors.black,
    lineHeight: 27,
  },
  subText: {
    fontSize: theme.fontSize.sm,
    color: theme.scale.gray.gray4,
    lineHeight: 27,
  },
});
