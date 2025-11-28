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
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { MarkerIcon, MagnifierIcon, ClockIcon } from '../../components/Icons';
import { Tag } from '../../components/atoms/tag/Tag';
import { parseISO, format } from 'date-fns';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '@components/atoms/buttons/PrimaryButton';
import { useSession } from '@contexts/SessionContext';
import { useToast } from '@contexts/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const MainScreen = ({ navigation, route }: any) => {
  const { colors, scale } = useTheme();
  useFocusEffect(() => {});

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
        <View style={{ flex: 1 }}>{/* 고정 헤더 */}</View>
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
});

export default MainScreen;
