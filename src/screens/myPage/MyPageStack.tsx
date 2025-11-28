import { createStackNavigator } from '@react-navigation/stack';
import MyPageScreen from './MyPageScreen';

const Stack = createStackNavigator();

const MyPageStack = () => (
  <Stack.Navigator
    screenOptions={{
      detachPreviousScreen: true,
    }}
  >
    <Stack.Screen
      name="MyPageScreen"
      component={MyPageScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default MyPageStack;
