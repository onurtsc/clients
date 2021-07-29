import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native'
import PersonItem from '../components/items/PersonItem'
import ButtonIcon from '../components/UI/ButtonIcon'
import SafeScrollView from '../components/UI/SafeScrollView'
import SearchBar from '../components/UI/SearchBar'
import Colors from '../constants/colors'
import Client from '../models/Client'

const ClientsOverviewScreen: React.FC = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')
    const [toastType, setToastType] = useState<string>('default')
    const [searchedItems, setSearchedItems] = useState<Client[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [hasError, setHasError] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 5

    const success = props.route.params?.success

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Clients',
            headerLeft: () => <ButtonIcon style={{}} name='logout' onPress={logoutHandler} loading={false} />,
            headerRight: () => <ButtonIcon style={{}} name='add' onPress={() => { props.navigation.navigate('EditClient', { person: null }) }} loading={false} />,
        })
    }, [])

    useEffect(() => {
        if (success) {
            setToastType('success')
            setToastMessage('O cliente foi criado com sucesso!')
            setToastVisible(true)
        }
    }, [success])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadClients.bind(this, 1))
        return () => {
            unsubscribe()
        };
    }, []);

    const loadClients = useCallback(async (pageNumber: number) => {
        setLoading(true)
        setHasError(false)
        try {
            const res = await fetch("http://localhost:5000/clientes")
            const customers = await res.json()
            setClients(customers)
            setSearchedItems(customers.slice(0, pageNumber * itemsPerPage))
            setLoading(false)
        } catch (err) {
            setToastType('warning')
            setToastMessage('Ocorreu um erro ao buscar os clientes')
            setToastVisible(true)
            setLoading(false)
            setHasError(true)
            console.log(err);

        }
    }, [])

    const deleteClientHandler = async (id: number) => {
        try {
            await fetch(`http://localhost:5000/clientes/${id.toString()}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            setToastType('success')
            setToastMessage('Cliente excluído com sucesso!')
            setToastVisible(true)
            const updatedClients = clients.filter((cli) => cli.id !== id)
            setClients(updatedClients)
            setSearchedItems(updatedClients)
        } catch (err) {
            setToastType('warning')
            setToastMessage('Ocorreu um erro com o servidor!')
            setToastVisible(true)
        }
    }

    const logoutHandler = () => {
        Alert.alert(
            'Você quer sair??',
            '',
            [
                { text: 'Cancelar', style: 'default', onPress: () => { } },
                { text: 'Sair', style: 'destructive', onPress: signout }
            ]
        );
    }

    const signout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            props.navigation.navigate('Auth')
        } catch (err) {
            console.log('logoutHandler Error: ', err);
        }
    }

    const showDeleteAlert = (id: number) => {
        Alert.alert(
            'Aviso!',
            'Tem certeza de que deseja excluir este cliente??', [{
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'Excluir',
                onPress: deleteClientHandler.bind(this, id),
                style: 'destructive'
            },], {
            cancelable: false
        }
        )
        return true;
    }

    const toastOptions = {
        toastVisible: toastVisible,
        hideToast: (val: boolean) => setToastVisible(val),
        message: toastMessage,
        messagePosition: 'center',
        type: toastType
    }

    const isCloseToBottom: (lm: any) => boolean = ({ layoutMeasurement, contentOffset, contentSize }) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    return (
        <SafeScrollView
            style={{ paddingBottom: 50 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            toastOptions={toastOptions}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent) && currentPage * itemsPerPage <= searchedItems.length) {
                    setCurrentPage(currentPage + 1)
                    loadClients(currentPage + 1)
                }
            }}
        >
            <SearchBar
                data={clients}
                setFixedData={(val) => { setSearchedItems(val) }}
                showLoading={(val) => setSearchLoading(val)}
            />
            {searchLoading && <ActivityIndicator style={{ marginTop: 20 }} size='large' color={Colors.primary} />}
            {!loading && hasError && <Text style={{ textAlign: 'center', marginTop: 20 }}>Ocorreu um erro com o servidor!</Text>}
            {!searchLoading && searchedItems && searchedItems.map((item: any, index: any) => (
                <PersonItem key={index} person={item} onPressEdit={() => props.navigation.navigate('EditClient', { person: item })} onPressDelete={showDeleteAlert.bind(this, item.id)} />
            ))}
            {loading && <ActivityIndicator style={{ marginTop: 20 }} size='large' color={Colors.primary} />}
        </SafeScrollView>
    )
}

const style = StyleSheet.create({})

export default ClientsOverviewScreen