import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LeftTextHeader from '@components/layout/LeftTextHeader';
import { Ticket } from '../../type/ticket';

const TicketDetailScreen = ({ navigation, route }: any) => {
  const { ticketId } = route.params;
  const { colors, scale } = useTheme();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formattedDate = format(new Date(), 'yyyy년 M월 d일');

  const loadTicket = async () => {
    try {
      const response = await customAxios.get(
        `${API_PREFIX}/tickets/${ticketId}`,
      );
      setTicket(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTicket();
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
                  <View style={{ marginTop: 32 }}>
                    <Text style={styles.summary}>{ticket?.explanation}</Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 32,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.dateText}>
                        {ticket
                          ? format(
                              new Date(ticket?.created_at),
                              'yyyy년 M월 d일',
                            )
                          : formattedDate}
                      </Text>
                      <Text style={styles.titleText}>오늘의 영화</Text>
                    </View>
                    <View
                      style={{
                        position: 'relative',
                        // maxWidth: 314,
                        width: '100%',
                        height: 555,
                      }}
                    >
                      {/* <ImageMaskViewer /> */}
                      <Image
                        source={require('@assets/images/movie_image_main.png')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.mainText}>
                        제목: {ticket?.movie.name}
                      </Text>
                      <Text style={styles.mainText}>
                        감독: {ticket?.movie.director}
                      </Text>
                      <Text style={styles.mainText}>
                        출연: {ticket?.movie.cast}
                      </Text>
                      <Text style={styles.mainText}>
                        {ticket?.movie.summary}
                      </Text>
                    </View>
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

export default TicketDetailScreen;
