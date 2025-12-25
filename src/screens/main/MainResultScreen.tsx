import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { parseISO, format } from 'date-fns';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import PrimaryButton from '@components/atoms/buttons/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Movie from '../../type/movie';
import { useForm } from '@contexts/FormContext';
import { useFocusEffect } from '@react-navigation/native';
import LeftTextHeader from '@components/layout/LeftTextHeader';
import { BookMarkIcon, RefreshIcon } from '@components/Icons';

const MainResultScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  const [response, setResponse] = useState<{
    explanation: string;
    movies: Movie[];
    keywords: string[];
  }>({
    explanation: '',
    movies: [],
    keywords: [],
  });
  const { form, setForm, resetForm } = useForm();
  const [movieIndex, setMovieIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // YYYY년 M월 d일
  const formattedDate = format(new Date(), 'yyyy년 M월 d일');

  console.log('Form data in MainResultScreen:', form);

  const fetchMovies = async () => {
    if (!form) return;
    try {
      const response = await customAxios.post(
        `${API_PREFIX}/movies/recommend`,
        {
          diary_content: form.diary,
          purpose: form.value,
          top_k: 3,
        },
      );
      console.log('Recommended movies response:', response.data);
      setResponse(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    }
  };

  const saveTicket = async (movie: Movie) => {
    try {
      // {
      //   "movie_id": 0,
      //   "purpose": "string",
      //   "explanation": "string",
      //   "comment": "string"
      // }
      await customAxios.post(`${API_PREFIX}/tickets/`, {
        movie_id: movie.id,
        purpose: form?.value || '',
        explanation: response.explanation,
        comment: '',
      });
      console.log('Movie saved to tickets:', movie.name);
    } catch (error) {
      console.error('Error saving movie to tickets:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // fetchMovies();
    }, []),
  );

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
        <LeftTextHeader
          title="얻고싶은 것 다시 선택"
          onPress={() => navigation.goBack()}
          isBack={true}
        />
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator
              size="large"
              color={'#F8F5CC'}
              style={{ marginBottom: 20 }}
            />
            <Text
              style={{
                color: '#F8F5CC',
                fontSize: 16,
                fontFamily: 'GalmuriMono9',
                lineHeight: 24,
                letterSpacing: -0.01,
              }}
            >
              영화를 준비하고 있어요
            </Text>
            <Text
              style={{
                color: '#F8F5CC',
                fontSize: 16,
                fontFamily: 'GalmuriMono9',
                lineHeight: 24,
                letterSpacing: -0.01,
              }}
            >
              조금만 기다려주세요
            </Text>
          </View>
        ) : (
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    paddingHorizontal: 20,
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 60,
                  }}
                >
                  <View style={{ marginTop: 32, marginLeft: 20 }}>
                    <Text style={styles.summary}>{response.explanation}</Text>
                  </View>
                  {response.movies.length === 0 ? (
                    <Text style={styles.mainText}>추천 영화가 없습니다.</Text>
                  ) : (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 32,
                        alignItems: 'center',
                      }}
                    >
                      <View>
                        <Text style={styles.dateText}>{formattedDate}</Text>
                        <Text style={styles.titleText}>오늘의 영화</Text>
                      </View>
                      <View
                        style={{
                          position: 'relative',
                          maxWidth: 314,
                          width: '100%',
                          height: 555,
                        }}
                      >
                        <Image
                          source={require('@assets/images/movie_image_main.png')}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="contain"
                        />
                      </View>
                      <View>
                        <Text style={styles.mainText}>
                          제목: {response.movies[movieIndex]?.name}
                        </Text>
                        <Text style={styles.mainText}>
                          감독: {response.movies[movieIndex].director}
                        </Text>
                        <Text style={styles.mainText}>
                          출연: {response.movies[movieIndex].cast}
                        </Text>
                        <Text style={styles.mainText}>
                          {response.movies[movieIndex].summary}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={{ alignItems: 'center', gap: 15 }}>
                    <View
                      style={{
                        paddingHorizontal: 20,
                        display: 'flex',
                        flexDirection: 'row',
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
                          backgroundColor: '#404040',
                        }}
                        onPress={() => {
                          const nextIndex =
                            (movieIndex + 1) % response.movies.length;
                          setMovieIndex(nextIndex);
                        }}
                      >
                        <RefreshIcon />
                      </Pressable>
                      <Pressable
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          gap: 6,
                          backgroundColor: '#E03A31',
                        }}
                        onPress={() => {
                          saveTicket(response.movies[movieIndex]);
                          navigation.navigate('Ticket', {
                            screen: 'TicketScreen',
                          });
                        }}
                      >
                        <BookMarkIcon color="#FFFFFF" />
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 14,
                            fontFamily: 'GalmuriMono9',
                          }}
                        >
                          이 영화 보관하기
                        </Text>
                      </Pressable>
                    </View>
                    <Text
                      style={[
                        styles.mainText,
                        {
                          color: '#525252',
                        },
                      ]}
                    >
                      한 영화를 선택하면 다른 하나는 저장할 수 없어요
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
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
  summary: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },
  titleText: {
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
  mainText: {
    color: '#F8F5CC',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Bold',
  },
});

export default MainResultScreen;
