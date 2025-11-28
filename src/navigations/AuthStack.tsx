import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen } from '@screens/auth';
import {} from "@screens/LoginScreen"
import SignUpStack from './SignUpStack';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpStack} />
  </Stack.Navigator>
);

export default AuthStack;
