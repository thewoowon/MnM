import React, {useState} from 'react';
import {FlatList, Text, View, StyleSheet, ViewStyle} from 'react-native';

const dates = [2023, 2024, 2025, 2026, 2027].map(year => {
  return `${year}년`;
});

type CustomDatePickerProps = {
  values: string[];
  onChange: (value: string) => void;
  // 단위
  unit?: string;
  style?: ViewStyle;
  containerHeight?: number;
};

export default function CustomDatePicker({
  values = dates,
  onChange,
  unit,
  style,
  containerHeight,
}: CustomDatePickerProps) {
  const ITEM_HEIGHT = 40;
  const VISIBLE_COUNT = values.length >= 5 ? 5 : values.length;
  const CONTAINER_HEIGHT = containerHeight || 120;

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={[styles.container, {height: CONTAINER_HEIGHT}, style]}>
      <FlatList
        style={{zIndex: 1}}
        data={values}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingVertical: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
          // 위아래 패딩 줘서 중앙 정렬
        }}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          setSelectedIndex(index);
          onChange(values[index]);
          console.log(values[index] + (unit ?? ''));
        }}
        renderItem={({item, index}) => {
          const isSelected = index === selectedIndex;
          return (
            <View style={[styles.item, {height: ITEM_HEIGHT}]}>
              <Text
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextSelected,
                ]}>
                {item}
                {unit && unit}
              </Text>
            </View>
          );
        }}
      />

      {/* 가운데 포커스 영역 */}
      <View
        style={[
          styles.focusOverlay,
          {top: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2, height: ITEM_HEIGHT},
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    overflow: 'hidden', // 깔끔하게 자르기
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BDBDBD',
    zIndex: 1,
  },
  itemTextSelected: {
    color: '#000',
  },
  focusOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    zIndex: 0,
    borderRadius: 8,
  },
});
