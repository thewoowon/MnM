import { createStackNavigator } from '@react-navigation/stack';
import TicketScreen from './TicketScreen';
import TicketDetailScreen from './TicketDetailScreen';

const Stack = createStackNavigator();

const TicketStack = () => (
  <Stack.Navigator
    screenOptions={{
      detachPreviousScreen: true,
    }}
  >
    <Stack.Screen
      name="TicketScreen"
      component={TicketScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TicketDetailScreen"
      component={TicketDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default TicketStack;
