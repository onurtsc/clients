import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { ClientsNavigator } from './ClientsNavigator';
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
            <ClientsNavigator />
        </NavigationContainer>
    )
};

export default AppContainer;