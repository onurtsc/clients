import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import DrawerNavigator from './DrawerNavigator'
import { ClientsNavigator } from './ClientsNavigator';
import { AuthNavigator } from './AuthNavigator';
import colors from '../constants/colors';

const AppContainer: React.FC = () => {

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colors.backgroundColor,
        }
    }

    return (
        <NavigationContainer theme={theme}>
            {/* <AuthNavigator/> */}
            <ClientsNavigator/>
        </NavigationContainer>
    )
};

export default AppContainer;