import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { MainStack } from '../screens/main';
import { TicketStack } from '../screens/ticket';
import { MyPageStack } from '@screens/myPage';
import {
  HomeIcon,
  HeartIcon,
  MarkerIcon,
  MyPageIcon,
  OrderIcon,
  HeartSolidIcon,
} from '../components/Icons';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useUser } from '@contexts/UserContext';
import useAuth from '@hooks/useAuth';
import { logout } from '@services/auth';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: undefined;
  FullScreens: undefined;
};

export type TabsParamList = {
  Main: undefined;
  Favorites: undefined;
  Map: undefined;
  Order: undefined;
  MyPage: undefined;
};

export type FullScreenStackParamList = {
  MainDetailScreen: undefined;
  MainLocationScreen: undefined;
  MainAddressScreen: undefined;
  MainNoticeScreen: undefined;
  MainPaymentScreen: undefined;
  MainCompleteLayer1Screen: undefined;
  MainCompleteLayer2Screen: undefined;
  MainPortOneScreen: undefined;
  MainSearchStoreScreen: undefined;
  MainGuideLayer1Screen: undefined;
  MainGuideLayer2Screen: undefined;
  MainStoreReviewScreen: undefined;
  OrderDetailScreen: undefined;
  OrderReviewScreen: undefined;
  OrderWriteScreen: undefined;
  ReviewManagementScreen: undefined;
  CustomerServiceScreen: undefined;
  WithdrawalScreen: undefined;
  EditProfileScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();
const FullStack = createStackNavigator<FullScreenStackParamList>();

const CustomTabBar = (props: any) => {
  return <BottomTabBar {...props} />;
};

// 탭바를 숨길 자식 스크린들의 이름(스택 안의 screen name)
const HIDE_TABBAR_ON: Record<string, true> = {
  MainDetailScreen: true,
};

function getDeepFocusedRouteNameFromState(state: any): string | undefined {
  console.log('getDeepFocusedRouteNameFromState', state);
  // 활성 탭
  let current = state?.routes?.[state.index];
  let nested = current?.state;

  // 탭 → (스택) → (더 깊은 네비게이터 …) 끝까지 내려감
  while (nested && nested.index != null) {
    current = nested.routes[nested.index];
    nested = current?.state;
  }
  return current?.name; // 최하위 포커스 스크린 이름
}

function shouldHideByState(state: any) {
  const leafName = getDeepFocusedRouteNameFromState(state);
  return !!leafName && !!HIDE_TABBAR_ON[leafName];
}

const VISIBLE_TABBAR = {
  height: 90,
  paddingTop: 7,
  backgroundColor: '#fff',
} as const;

const HIDDEN_TABBAR = {
  display: 'none',
  height: 0,
  borderTopWidth: 0,
  elevation: 0,
  backgroundColor: 'transparent',
} as const;

// route에서 "가장 깊은" 포커스 스크린 이름 가져오기 (fallback 포함)
function getLeafRouteName(route: any): string | undefined {
  // 1단계: 보통은 이걸로 충분
  let name = getFocusedRouteNameFromRoute(route);

  // 추가: 더 깊은 네비게이터가 중첩된 경우를 대비해 state를 타고 내려감
  // (route.state는 있을 수도, 없을 수도)
  let cur: any = route?.state?.routes?.[route.state.index];
  while (cur?.state && cur.state.index != null) {
    const next = cur.state.routes[cur.state.index];
    name = next?.name ?? name;
    cur = next;
  }

  // 초기 탭 루트일 때는 name이 undefined일 수 있으므로 빈문자 방지
  return name;
}

function getTabBarStyleByRoute(route: any) {
  const leaf = getLeafRouteName(route) ?? '';
  if (leaf && HIDE_TABBAR_ON[leaf]) return HIDDEN_TABBAR;
  return VISIBLE_TABBAR;
}

const MainTab = () => {
  const { scale } = useTheme();
  const { isGuest } = useUser();
  const { setIsAuthenticated } = useAuth();

  return (
    <Tabs.Navigator
      sceneContainerStyle={{ backgroundColor: '#fff' }}
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarStyle: { display: 'none' },
        // safeAreaInsets:
        //   getLeafRouteName(route) && HIDE_TABBAR_ON[getLeafRouteName(route)!]
        //     ? {bottom: 0}
        //     : undefined,
        // sceneContainerStyle:
        //   getLeafRouteName(route) && HIDE_TABBAR_ON[getLeafRouteName(route)!]
        //     ? {backgroundColor: '#fff', paddingBottom: 0}
        //     : {backgroundColor: '#fff'},
        // tabBarBackground:
        //   getLeafRouteName(route) && HIDE_TABBAR_ON[getLeafRouteName(route)!]
        //     ? undefined
        //     : () => <View style={{flex: 1, backgroundColor: '#fff'}} />,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Pretendard-Regular',
          color: '#8E979E',
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="Main"
        component={MainStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <HomeIcon color={focused ? 'black' : '#C7CDD1'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => (
            <Text
              style={[
                styles.tabBarItemTextStyle,
                {
                  color: focused ? scale.gray.gray1 : scale.gray.gray5,
                },
              ]}
            >
              메인
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Ticket"
        component={TicketStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <HomeIcon color={focused ? 'black' : '#C7CDD1'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => (
            <Text
              style={[
                styles.tabBarItemTextStyle,
                {
                  color: focused ? scale.gray.gray1 : scale.gray.gray5,
                },
              ]}
            >
              티켓
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="MyPage"
        component={MyPageStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MyPageIcon color={focused ? 'black' : '#C7CDD1'} />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => (
            <Text
              style={[
                styles.tabBarItemTextStyle,
                {
                  color: focused ? scale.gray.gray1 : scale.gray.gray5,
                },
              ]}
            >
              MY
            </Text>
          ),
        }}
        listeners={({ navigation }: { navigation: any; route: any }) => ({
          tabPress: (e: any) => {
            if (isGuest) {
              e.preventDefault(); // 탭 이동 막기
              Alert.alert(
                '로그인이 필요합니다',
                '마이페이지는 로그인 후 이용할 수 있어요.',
                [
                  { text: '취소', style: 'cancel' },
                  {
                    text: '로그인 하기',
                    onPress: async () => {
                      setIsAuthenticated(false); // 로그아웃 처리
                      await logout(); // 로그아웃 서비스 호출
                    },
                  },
                ],
              );
            }
          },
        })}
      />
    </Tabs.Navigator>
  );
};

function FullScreenStack() {
  return (
    <FullStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <FullStack.Screen name="MainDetailScreen" component={MainDetailScreen} /> */}
    </FullStack.Navigator>
  );
}

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={MainTab} />
      <RootStack.Screen name="FullScreens" component={FullScreenStack} />
    </RootStack.Navigator>
  );
}

export default RootNavigator;

const styles = StyleSheet.create({
  tabBarItemTextStyle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  visibleTabBar: {
    height: 90,
    paddingTop: 7,
  },
  hiddenTabBar: {
    height: 0,
    overflow: 'hidden',
    display: 'none',
  },
});
