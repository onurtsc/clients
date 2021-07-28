import React, {useEffect} from 'react';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import { Platform, View, Button, SafeAreaView } from 'react-native';
import Colors from '../constants/colors';

import { ClientsNavigator, AddClientsNavigator } from './ClientsNavigator';
import CustomIcon from '../components/UI/CustomIcon';
import ButtonText from '../components/UI/ButtonText';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ClientsDrawerNavigator = createDrawerNavigator()

const DrawerNavigator = () => {
    // const dispatch = useDispatch();
    return (
        <ClientsDrawerNavigator.Navigator
            drawerPosition="right"
            screenOptions={defaultNavOptions}
            drawerContent={props => {
                const logoutHandler = () => { }
                return (
                    <View style={{ flex: 1, padding: 20, height: '100%' }} >
                        <SafeAreaView>
                            <DrawerItemList {...props} />
                            <View style={{flexDirection: 'row', alignItems: 'center'}} >
                                <CustomIcon name='logout' />
                                <ButtonText style={{}} title='Logout' color={Colors.danger} onPress={logoutHandler} hide={false} />
                            </View>
                        </SafeAreaView>
                    </View>
                );
            }}
            drawerContentOptions={{ activeTintColor: Colors.primary }}
        >
            <ClientsDrawerNavigator.Screen
                name="Clients"
                component={ClientsNavigator}
                options={{
                    drawerIcon: () => <CustomIcon name='group'/>
                }}
            />
            <ClientsDrawerNavigator.Screen
                name="Add Client"
                component={AddClientsNavigator}
                options={{
                    drawerIcon: () => <CustomIcon name='add'/>
                }}
            />
        </ClientsDrawerNavigator.Navigator>
    )
}

export default DrawerNavigator

