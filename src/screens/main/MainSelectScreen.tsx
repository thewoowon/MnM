import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { useForm } from '@contexts/FormContext';
import MainSelectionButtons, {
  ButtonType,
} from '@components/molecules/MainSelectionButtons';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// adrenaline: '#FF6B6B', // 빨강 - 아드레날린
// deepThinking: '#1476B5', // 파랑 - 깊은 생각, 영감
// thrill: '#9B59B6', // 보라 - 스릴
// tear: '#3498DB', // 하늘색 - 눈물 샤워
// mood: '#F39C12', // 주황 - 기분 전환, 웃음
// forget: '#1ABC9C', // 청록 - 잠시 잊기
// motivation: '#E74C3C', // 진한 빨강 - 동기부여, 성장
// art: '#8E44AD', // 진한 보라 - 예술적 영감
// comfort: '#27AE60', // 초록 - 위로, 유대감

const VALUE_MAP: {
  [key in ButtonType]: string;
} = {
  adrenaline: '아드레날린',
  deepThinking: '깊은 생각, 영감',
  thrill: '스릴',
  tear: '눈물 샤워',
  mood: '기분 전환, 웃음',
  forget: '잠시 잊기',
  motivation: '동기부여, 성장',
  art: '예술적 영감',
  comfort: '위로, 유대감',
};

const MainSelectScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const [value, setValue] = useState<ButtonType | null>(null);
  const { form, setForm } = useForm();

  const nextStep = () => {
    if (!value || value.length === 0) {
      return;
    }
    setForm({ ...form, value: VALUE_MAP[value] });
    navigation.navigate('MainResultScreen');
  };

  const handleValueSelect = (type: ButtonType) => {
    setValue(type);
  };

  useEffect(() => {
    if (value) {
      // 3초 기다리기
      const timer = setTimeout(() => {
        nextStep();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <SafeAreaView style={[styles.backgroundStyle]}>
        <Header
          title=""
          onPress={() => navigation.goBack()}
          isBack={true}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text style={styles.mainText}>영화를 감상하고</Text>
            <Text style={styles.mainText}>얻고싶은 것은 무엇인가요?</Text>
          </View>
          <MainSelectionButtons
            width={screenWidth}
            onSelect={handleValueSelect}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    display: 'flex',
  },
  flexRowBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexColumnBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  columnDivider: {
    width: 1,
    backgroundColor: '#E9E9E9',
    height: 16,
  },
  soldoutCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  soldoutText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Pretendard-Bold',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  modalText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  modalPadding: {
    paddingVertical: 5,
  },
  mainText: {
    color: '#F8F5CC',
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
  },
});

export default MainSelectScreen;
