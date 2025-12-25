import {
  AppleIcon,
  CoinIcon,
  DetailIcon,
  KakaoIcon,
  NaverIcon,
  RightChevronIcon,
  XIcon,
} from '@components/Icons';
import CircularProgressProfile from '@components/molecules/CircularProgressProfile';
import { useTheme } from '@contexts/ThemeContext';
import useAuth from '@hooks/useAuth';
import { confirm } from '@utils/confirm';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { logout } from '@services/auth';
import { useQuery } from '@tanstack/react-query';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { Ticket } from '../../type/ticket';

const TicketScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = async () => {
    try {
      const response = await customAxios.get(`${API_PREFIX}/tickets/`);

      setTickets(response.data);
    } catch (error) {
      // 오늘 작성한 일기 없는 것임.
      console.error('Error loading content:', error);
    }
  };

  useEffect(() => {
    loadTickets();
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
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <Header
          title="보관한 티켓"
          onPress={() => navigation.goBack()}
          isBack={true}
        />

        <View
          style={[
            styles.flexBox,
            styles.flexColumn,
            {
              paddingHorizontal: 20,
              paddingVertical: 18,
            },
          ]}
        >
          <View>
            {tickets.map((ticket, index) => (
              <View key={index}>
                <Text style={styles.mainText}>{ticket.movie.name}</Text>
                <Text style={styles.mainText}>{ticket.purpose}</Text>
                <Text style={styles.mainText}>{ticket.explanation}</Text>
                <Text style={styles.mainText}>{ticket.comment}</Text>
              </View>
            ))}
          </View>
        </View>
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
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default TicketScreen;
