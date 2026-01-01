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
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { Ticket } from '../../type/ticket';
import { useFocusEffect } from '@react-navigation/native';
import { format, getYear, getMonth } from 'date-fns';
import Svg, {
  Defs,
  Rect,
  Path,
  Mask,
  G,
  Pattern,
  Use,
  Image as SvgImage,
} from 'react-native-svg';

const TicketScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [displayType, setDisplayType] = useState<'image' | 'list'>('list');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { width: screenWidth } = Dimensions.get('window');

  const loadTickets = async () => {
    try {
      const response = await customAxios.get(`${API_PREFIX}/tickets/`);
      console.log('Fetched tickets:', response.data);
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
      {displayType === 'image' &&
        filteredTickets[currentImageIndex]?.movie?.url && (
          <Image
            source={{ uri: filteredTickets[currentImageIndex].movie.url }}
            style={styles.backgroundImage}
            blurRadius={10}
          />
        )}
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
        {displayType === 'list' && (
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
                    <Svg
                      width="86"
                      height="123"
                      viewBox="0 0 86 123"
                      fill="none"
                    >
                      <Mask
                        id="mask0_4776_570"
                        style={{
                          maskType: 'alpha',
                        }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="86"
                        height="123"
                      >
                        <Path
                          d="M76.9473 2.2627H81.4736V4.52637H83.7373V9.05273H86V113.158H83.7373V117.685H81.4736V119.947H76.9473V122.211H9.05273V119.947H4.52637V117.685H2.2627V113.158H0V9.05273H2.2627V4.52637H4.52637V2.2627H9.05273V0H76.9473V2.2627Z"
                          fill="#D9D9D9"
                        />
                      </Mask>
                      <G mask="url(#mask0_4776_570)">
                        <Rect
                          width="86"
                          height="122.211"
                          fill="url(#pattern0_4776_570)"
                        />
                      </G>
                      <Defs>
                        <Pattern
                          id="pattern0_4776_570"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <Use
                            xlinkHref="#image0_4776_570"
                            transform="matrix(0.001 0 0 0.000703704 0 -0.00314815)"
                          />
                        </Pattern>
                        <SvgImage
                          id="image0_4776_570"
                          width="1000"
                          height="1430"
                          preserveAspectRatio="none"
                          xlinkHref={{ uri: ticket.movie.url }}
                        />
                      </Defs>
                    </Svg>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
        {displayType === 'image' && (
          <View style={{ flex: 1, paddingTop: 40 }}>
            <Carousel
              loop={false}
              width={screenWidth}
              height={600}
              data={filteredTickets}
              onSnapToItem={index => setCurrentImageIndex(index)}
              renderItem={({ item: ticket, index }) => {
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
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        gap: 31,
                      }}
                    >
                      <View
                        style={[
                          styles.flexBox,
                          styles.flexRow,
                          {
                            justifyContent: 'center',
                            gap: 8,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.mainText,
                            { fontSize: 16, lineHeight: 24 },
                          ]}
                        >
                          {formattedDate}
                        </Text>
                        <BetweenIcon />
                        <Text
                          style={[
                            styles.mainText,
                            {
                              color: 'white',
                              fontSize: 16,
                              lineHeight: 24,
                            },
                          ]}
                        >
                          {ticket.movie.name}
                        </Text>
                      </View>
                      <Svg
                        width="280"
                        height="400"
                        viewBox="0 0 86 123"
                        fill="none"
                      >
                        <Mask
                          id={`mask_${index}`}
                          style={{
                            maskType: 'alpha',
                          }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="86"
                          height="123"
                        >
                          <Path
                            d="M76.9473 2.2627H81.4736V4.52637H83.7373V9.05273H86V113.158H83.7373V117.685H81.4736V119.947H76.9473V122.211H9.05273V119.947H4.52637V117.685H2.2627V113.158H0V9.05273H2.2627V4.52637H4.52637V2.2627H9.05273V0H76.9473V2.2627Z"
                            fill="#D9D9D9"
                          />
                        </Mask>
                        <G mask={`url(#mask_${index})`}>
                          <Rect
                            width="86"
                            height="123"
                            fill={`url(#pattern_${index})`}
                          />
                        </G>
                        <Defs>
                          <Pattern
                            id={`pattern_${index}`}
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1"
                          >
                            <Use
                              xlinkHref={`#image_${index}`}
                              transform="matrix(0.001 0 0 0.000703704 0 -0.00314815)"
                            />
                          </Pattern>
                          <SvgImage
                            id={`image_${index}`}
                            width="1000"
                            height="1430"
                            preserveAspectRatio="none"
                            xlinkHref={{ uri: ticket.movie.url }}
                          />
                        </Defs>
                      </Svg>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
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
