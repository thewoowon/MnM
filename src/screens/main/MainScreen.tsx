import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Tag } from '../../components/atoms/tag/Tag';
import { parseISO, format } from 'date-fns';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '@components/atoms/buttons/PrimaryButton';
import { useToast } from '@contexts/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { theme } from '@contexts/theme';
import BaseInput from '@components/atoms/inputs/BaseInput';
import { useForm } from '@contexts/FormContext';
import { BookMarkIcon, ProfileIcon, RightArrowIcon } from '@components/Icons';

const MainScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  const [contents, setContents] = useState<string>('');
  const { form, setForm, resetForm } = useForm();

  // YYYY년 M월 d일
  const formattedDate = format(new Date(), 'yyyy년 M월 d일');

  const saveContent = async () => {
    try {
      await AsyncStorage.setItem('savedContent', contents);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const loadContent = async () => {
    try {
      // 오늘 작성한 일기 불러오기
      // /api/v1/diaries/today
      const response = await customAxios.get(`${API_PREFIX}/diaries/today`);

      // {
      //   "content": "string",
      //   "purpose": "string",
      //   "mood": "string",
      //   "diary_date": "2025-12-06",
      //   "id": 0,
      //   "user_id": 0,
      //   "created_at": "2025-12-06T12:12:44.995Z",
      //   "updated_at": "2025-12-06T12:12:44.995Z"
      // }

      if (response.data && response.data.content) {
        setContents(response.data.content);
      }
    } catch (error) {
      // 오늘 작성한 일기 없는 것임.
      console.error('Error loading content:', error);
    }
  };

  const saveDiary = async () => {
    try {
      // {
      //   "content": "string",
      //   "diary_date": "2025-12-07"
      // }
      await customAxios.post(`${API_PREFIX}/diaries/`, {
        content: contents,
        diary_date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (error) {
      // 이미 오늘 일기 작성한 경우 등
      // 그냥 무시
      console.error('Error saving diary:', error);
    }
  };

  const nextStep = async () => {
    // 저장된 일기 내용을 Context에 저장
    // POST => /api/v1/diaries/
    await saveDiary();

    setForm({ ...form, diary: contents });
    navigation.navigate('MainSelectScreen');
  };

  useEffect(() => {
    loadContent();
    resetForm();
  }, []);

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={[styles.backgroundStyle]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 20,
              paddingVertical: 18,
              paddingHorizontal: 20,
            }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate('Ticket', {
                  screen: 'TicketScreen',
                })
              }
            >
              <BookMarkIcon />
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('MyPage', {
                  screen: 'MainScreen',
                })
              }
            >
              <ProfileIcon />
            </Pressable>
          </View>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 42,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 56,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 27,
                  }}
                >
                  <View
                    style={[
                      styles.flexColumnBox,
                      {
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Image
                      source={require('@assets/images/eye-glasses.png')}
                      style={{ width: 119, height: 119 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.dateText}>{formattedDate}</Text>
                  </View>
                  <View
                    style={[
                      styles.flexColumnBox,
                      {
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text style={styles.mainText}>어서오세요.</Text>
                    <Text style={styles.mainText}>
                      오늘 어떤 일이 있었나요?
                    </Text>
                  </View>
                </View>
                <View style={{ width: '100%' }}>
                  <BaseInput
                    multiline
                    numberOfLines={4}
                    placeholder="오늘 있었던 일, 지금 감정을 입력해보세요. 당신을 다시 태어나게 해줄 영화를 추천해줄게요"
                    placeholderTextColor={theme.colors.gray}
                    textAlignVertical="top"
                    style={{
                      height: 200,
                      width: '100%',
                      fontSize: 16,
                      lineHeight: 24,
                      fontFamily: 'GalmuriMono9',
                      marginTop: 72,
                      backgroundColor: 'transparent',
                      color: '#F8F5CC',
                    }}
                    onChangeText={text => {
                      setContents(text);
                    }}
                    value={contents}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <Pressable
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 10,
                gap: 6,
                backgroundColor:
                  contents.length === 0 ? 'transparent' : '#E03A31',
              }}
              disabled={contents.length === 0}
              onPress={nextStep}
            >
              <Text
                style={{
                  color: contents.length === 0 ? '#737373' : '#FFFFFF',
                  fontSize: 14,
                  fontFamily: 'GalmuriMono9',
                }}
              >
                티켓
              </Text>
              <RightArrowIcon
                color={contents.length === 0 ? '#737373' : '#FFFFFF'}
              />
            </Pressable>
            {contents.length > 0 && (
              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  gap: 6,
                  backgroundColor:
                    contents.length === 0 ? 'transparent' : '#1C1917',
                }}
                disabled={contents.length === 0}
                onPress={() => {
                  // 로컬 저장
                  saveContent();
                  Alert.alert(
                    '임시 저장 완료',
                    '입력하신 내용이 임시 저장되었습니다.',
                    [
                      {
                        text: '확인',
                        onPress: () => {
                          return;
                        },
                      },
                    ],
                  );
                }}
              >
                <Text
                  style={{
                    color: contents.length === 0 ? '#737373' : '#FFFFFF',
                    fontSize: 14,
                    fontFamily: 'GalmuriMono9',
                  }}
                >
                  임시 저장
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBoxLabel: {
    gap: 4,
    flexDirection: 'row',
    padding: 8,
  },
  columnDivider: {
    width: 1,
    backgroundColor: '#E9E9E9',
    height: 16,
  },
  mainText: {
    color: '#F8F5CC',
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
  },
  dateText: {
    color: '#F8F5CC',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
  },
  keyboardAvoid: {
    flex: 1,
  },
});

export default MainScreen;
