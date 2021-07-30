import React, {useEffect, useState, useCallback} from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from '../screens/AuthScreen';
import ClientsOverviewScreen from '../screens/ClientsOverviewScreen';
import EditClientScreen from '../screens/EditClientScreen';
import { View } from 'react-native';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.sgray
    },
    headerTintColor: Colors.secondary,
    headerBackTitleVisible: false
};

const ClientsStack = createStackNavigator()

export const ClientsNavigator = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isAuth, setIsAuth] = useState<boolean>(false)

    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = useCallback(async () => {
        setLoading(true)
        try {
            const tokenExist = await AsyncStorage.getItem('token')
            if (!tokenExist) {
                setIsAuth(false)
                console.log('TOKEN NOT EXIST')
            } else {
                setIsAuth(true)
                console.log('TOKEN EXIST')
            }
            setLoading(false)
        } catch (err) {
            console.log('Error with checking token')
            setLoading(false)
        }
    }, [isAuth, loading])

    if(loading) {
        return <View></View>
    }

    return (
        <ClientsStack.Navigator screenOptions={defaultNavOptions} initialRouteName={isAuth ? "ClientsOverview" : "Auth" } >
            <ClientsStack.Screen
                name="Auth"
                component={AuthScreen}
            />
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