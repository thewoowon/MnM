import {StyleSheet, Image} from 'react-native';
import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@contexts/ThemeContext';
import {RightChevronIcon} from '@components/Icons';

const ORDER_PHASES: {
  [key: number]: string;
} = {
  0: '주문접수',
  1: '포장중',
  2: '포장완료',
};

const OrderStatusAlert = () => {
  const {colors, scale} = useTheme();
  // phase 1: 주문접수, phase 2: 포장중, phase 3: 포장완료
  // 1 -> 0%, 2 -> 50%, 3 -> 100%
  const phase = 1; // 예시로 포장완료 상태를 사용
  const widthPercent = phase * 50; // 0, 50, 100
  return (
    <View style={styles.alertContainer}>
      <View style={styles.alert}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 6,
          }}>
          <View style={{position: 'relative', width: 30, height: 30}}>
            <Image
              source={require('../../assets/images/deco/confetti.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[
              styles.heading,
              {
                color: scale.gray.gray1,
              },
            ]}>
            포장이 완료되었습니다!
          </Text>
        </View>
        <RightChevronIcon color={scale.gray.gray1} />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
          width: '100%',
        }}>
        <View style={styles.container}>
          <View
            style={[
              styles.bar,
              {
                width: `${widthPercent}%`,
                backgroundColor: colors.primary,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: colors.primary,
              },
            ]}
          />
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 1,
            }}>
            {Object.keys(ORDER_PHASES).map((key, index) => (
              <View
                key={key}
                style={[
                  styles.tinyBall,
                  {
                    backgroundColor:
                      index <= phase ? '#EEA106' : scale.gray.gray6,
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          {Object.values(ORDER_PHASES).map((value, index) => (
            <Text
              key={index}
              style={[
                styles.progressText,
                {
                  color: index <= phase ? colors.primary : scale.gray.gray6,
                  fontFamily:
                    index <= phase ? 'Pretendard-Bold' : 'Pretendard-Regular',
                },
              ]}>
              {value}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFF5E7',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
  },
  alert: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  heading: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Bold',
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#A5A5A5',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
  },
  tinyBall: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#EEA106',
  },
});

export default OrderStatusAlert;
