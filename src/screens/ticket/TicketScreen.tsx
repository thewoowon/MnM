import {
  LeftArrowIcon,
  MenuIcon,
  RightArrowIcon,
  XIcon,
  ImageIcon,
  BetweenIcon,
} from '@components/Icons';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { Ticket } from '../../type/ticket';
import { useFocusEffect } from '@react-navigation/native';
import { format, getYear, getMonth } from 'date-fns';

const TicketScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [displayType, setDisplayType] = useState<'image' | 'list'>('list');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const loadTickets = async () => {
    try {
      const response = await customAxios.get(`${API_PREFIX}/tickets/`);
      setAllTickets(response.data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  // 현재 선택된 연도와 월에 해당하는 티켓만 필터링
  const filteredTickets = allTickets.filter(ticket => {
    const createdAt = new Date(ticket.created_at);
    const ticketYear = getYear(createdAt);
    const ticketMonth = getMonth(createdAt) + 1; // getMonth()는 0-11 반환하므로 +1

    return ticketYear === year && ticketMonth === month;
  });

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
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
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <Header
          title="보관한 영화"
          onPress={() => navigation.goBack()}
          isBack={true}
        />
        <View
          style={[
            styles.flexBox,
            styles.flexRow,
            { width: '100%', justifyContent: 'space-between' },
            {
              paddingHorizontal: 20,
              paddingVertical: 18,
            },
          ]}
        >
          <View style={[styles.flexBox, styles.flexRow, { gap: 12 }]}>
            <Pressable
              onPress={() => {
                setDisplayType('image');
              }}
            >
              <ImageIcon
                color={displayType === 'image' ? '#F8F5CC' : '#41433D'}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setDisplayType('list');
              }}
            >
              <MenuIcon
                color={displayType === 'list' ? '#F8F5CC' : '#41433D'}
              />
            </Pressable>
          </View>
          <View style={[styles.flexBox, styles.flexRow, { gap: 24 }]}>
            <Pressable onPress={handlePrevMonth}>
              <LeftArrowIcon />
            </Pressable>
            <Text style={styles.monthFormatText}>{`${year}년 ${month}월`}</Text>
            <Pressable onPress={handleNextMonth}>
              <RightArrowIcon />
            </Pressable>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingTop: 60,
              paddingHorizontal: 20,
              gap: 34,
            }}
          >
            {filteredTickets.map((ticket, index) => {
              const createdAt = new Date(ticket.created_at);
              const formattedDate = format(createdAt, 'd일');
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Ticket', {
                      screen: 'TicketDetailScreen',
                      params: {
                        ticketId: ticket.id,
                      },
                    });
                  }}
                  key={index}
                  style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 18,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <View
                      style={[
                        styles.flexBox,
                        styles.flexRow,
                        {
                          justifyContent: 'flex-start',
                        },
                      ]}
                    >
                      <Text style={styles.mainText}>{formattedDate}</Text>
                      <BetweenIcon />
                      <Text
                        style={[
                          styles.mainText,
                          {
                            color: 'white',
                          },
                        ]}
                      >
                        {ticket.movie.name}
                      </Text>
                    </View>
                    <Text style={styles.mainText}>
                      {ticket.explanation.length > 90
                        ? ticket.explanation.slice(0, 90) + '...'
                        : ticket.explanation}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 86,
                      height: 122,
                      backgroundColor: 'white',
                    }}
                  ></View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  mainText: {
    color: '#F8F5CC',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.1,
  },
  monthFormatText: {
    color: '#F8F5CC',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
  },
  scrollContent: {
    flex: 1,
  },
});

export default TicketScreen;
