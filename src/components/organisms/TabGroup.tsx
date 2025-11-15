import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleProp, ViewStyle } from 'react-native';

const TabGroup = ({
  tabs,
  bottomLineStyle,
  bottomLineActiveColor,
  bottomLineInactiveColor,
}: {
  tabs: { title: string; component: React.JSX.Element }[];
  bottomLineStyle?: StyleProp<ViewStyle>;
  bottomLineActiveColor?: string;
  bottomLineInactiveColor?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors, scale } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => setActiveIndex(index)}
            style={{
              height: 60,
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeIndex === index ? '#000000' : '#8F8F8F',
                fontSize: 16,
                fontFamily: 'Pretendard-SemiBold',
              }}
            >
              {tab.title}
            </Text>
            <View
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: 3,
                  backgroundColor:
                    activeIndex === index
                      ? bottomLineActiveColor
                        ? bottomLineActiveColor
                        : colors.primary
                      : bottomLineInactiveColor
                      ? bottomLineInactiveColor
                      : scale.gray.gray7,
                },
                bottomLineStyle,
              ]}
            />
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1 }}>{tabs[activeIndex].component}</View>
    </View>
  );
};

export default TabGroup;
