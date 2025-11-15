// components/form/Select.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {DownChevronIcon} from '../../Icons';

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string | number;
  onSelect?: (value: string | number) => void;
  error?: string;
  placeholder?: string;
  boxStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  custom?: {
    onSelect?: () => void;
    errorColor?: string;
    errorMarginLeft?: number;
  };
  iconStyle?: {
    width?: number;
    height?: number;
    color?: string;
  } | null;
};

const BaseSelect: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onSelect,
  error,
  placeholder = '선택하세요',
  boxStyle,
  style,
  custom,
  iconStyle,
}) => {
  const {colors, spacing, borderRadius, fontSize} = useTheme();
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <View style={[{marginBottom: spacing.md}, boxStyle]}>
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
      <Pressable
        onPress={() => {
          if (custom?.onSelect) {
            custom.onSelect();
            return;
          }
          setOpen(true);
        }}
        style={[
          {
            borderWidth: error ? 1 : 0,
            borderColor: error
              ? custom?.errorColor || colors.secondary
              : '#ccc',
            borderRadius: borderRadius.md,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            backgroundColor: colors.disabled,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            height: 50,
          },
          style,
        ]}>
        <Text
          style={{
            color: value ? colors.text : '#A6A6A6',
            fontSize: fontSize.md,
            fontWeight: 500,
          }}>
          {custom
            ? value === ''
              ? placeholder
              : value
            : selectedLabel || placeholder}
        </Text>
        <DownChevronIcon
          width={iconStyle?.width || 20}
          height={iconStyle?.height || 20}
          color={iconStyle?.color || colors.text}
        />
      </Pressable>

      {error && (
        <Text
          style={{
            color: custom?.errorColor || colors.secondary,
            fontSize: fontSize.sm,
            marginTop: 4,
            marginLeft: custom?.errorMarginLeft || 0,
          }}>
          {error}
        </Text>
      )}

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{flex: 1, backgroundColor: '#00000066'}}
          onPress={() => setOpen(false)}>
          <View
            style={{
              backgroundColor: 'white',
              margin: 40,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              marginTop: 200,
            }}>
            <FlatList
              data={options}
              keyExtractor={item => item.value.toString()}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => {
                    onSelect!(item.value);
                    setOpen(false);
                  }}
                  style={{paddingVertical: spacing.sm}}>
                  <Text style={{fontSize: fontSize.md}}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default BaseSelect;
