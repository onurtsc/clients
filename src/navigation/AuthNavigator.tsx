import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Colors from '../constants/colors';

import AuthScreen from '../screens/AuthScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.ivory
    },
    headerTintColor: Colors.primary,
    headerBackTitleVisible: false
};

const AuthStack = createStackNavigator()

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={defaultNavOptions} >
            <AuthStack.Screen
                name="Auth"
                component={AuthScreen}
            />
        </AuthStack.Navigator>
    )
}