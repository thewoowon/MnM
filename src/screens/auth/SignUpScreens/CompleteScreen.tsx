import PrimaryButton from '@components/atoms/buttons/PrimaryButton';
import useAuth from '@hooks/useAuth';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

const CompleteScreen = ({ navigation, route }: any) => {
  const { setIsAuthenticated } = useAuth();
  const handleNext = () => {
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <Rect width="40" height="40" rx="20" fill="#FFB92A" />
            <Path
              d="M27.2927 13.2931C27.6833 12.9027 28.3163 12.9026 28.7068 13.2931C29.0971 13.6836 29.0972 14.3167 28.7068 14.7072L17.7068 25.7072C17.3163 26.0976 16.6833 26.0975 16.2927 25.7072L11.2927 20.7072L11.2244 20.631C10.904 20.2382 10.9266 19.6592 11.2927 19.2931C11.6589 18.9271 12.2379 18.9044 12.6306 19.2247L12.7068 19.2931L16.9998 23.5861L27.2927 13.2931Z"
              fill="white"
            />
          </Svg>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.headerText}>무비앤미에 오신것을</Text>
            <Text style={styles.headerText}>환영합니다.</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            width: '100%',
          }}
        >
          <PrimaryButton title="무비앤미 시작하기" onPress={handleNext} />
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
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 50,
    borderBottomWidth: 1,
    borderColor: '#F2F4F6',
  },
  headerText: {
    color: '#181818',
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default CompleteScreen;
