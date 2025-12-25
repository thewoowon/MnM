import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import MainSelectScreen from './MainSelectScreen';
import MainResultScreen from './MainResultScreen';
import { FormProvider } from '@contexts/FormContext';

const Stack = createStackNavigator();

const MainStack = () => (
  <FormProvider>
    <Stack.Navigator
      screenOptions={{
        detachPreviousScreen: true,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainSelectScreen"
        component={MainSelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainResultScreen"
        component={MainResultScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </FormProvider>
);

export default MainStack;
