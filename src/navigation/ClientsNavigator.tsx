import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Colors from '../constants/colors';

import ClientsOverviewScreen from '../screens/ClientsOverviewScreen';
import EditClientScreen from '../screens/EditClientScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.accent
    },
    headerTintColor: 'white',
    headerBackTitleVisible: false
};

const ClientsStack = createStackNavigator()

export const ClientsNavigator = () => {
    return (
        <ClientsStack.Navigator screenOptions={defaultNavOptions} >
            <ClientsStack.Screen
                name="ClientsOverview"
                component={ClientsOverviewScreen}
            />
            <ClientsStack.Screen
                name="EditClient"
                component={EditClientScreen}
            />
        </ClientsStack.Navigator>
    )
}

const AddClientStack = createStackNavigator()

export const AddClientsNavigator = () => {
    return (
        <AddClientStack.Navigator screenOptions={defaultNavOptions} >
            <AddClientStack.Screen
                name="ClientsOverview"
                component={EditClientScreen}
            />
        </AddClientStack.Navigator>
    )
}