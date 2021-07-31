import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Text, Alert, ActivityIndicator, Button } from 'react-native'
import PersonItem from '../components/items/PersonItem'
import ButtonIcon from '../components/UI/ButtonIcon'
import SafeScrollView from '../components/UI/SafeScrollView'
import SearchBar from '../components/UI/SearchBar'
import SortComponent from '../components/items/SortComponent'
import Colors from '../constants/colors'
import Client from '../models/Client'
import Logo from '../components/items/Logo'
import colors from '../constants/colors'

interface Props {
    navigation: {
        navigate: (param: string, object: { person: object }) => void;
        setOptions: (params: object) => void;
        addListener: (param: string, func: () => void) => void;
    };
    route: {
        params: {
            success: boolean
        }
    }
}

const ClientsOverviewScreen: React.FC<Props> = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')
    const [toastType, setToastType] = useState<string>('default')
    const [searchedItems, setSearchedItems] = useState<Client[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [hasError, setHasError] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [sortParam, setSortParam] = useState<string>('nome')
    const [bottomText, setBottomText] = useState<string>('')

    const itemsPerPage = 5
    const success = props.route.params?.success

    useEffect(() => {
        props.navigation?.setOptions({
            headerTitle: () => <Logo size={16} />,
            headerLeft: () => <ButtonIcon style={{}} name='logout' onPress={logoutHandler} loading={false} />,
            headerRight: () => <ButtonIcon style={{}} name='add' onPress={() => { props.navigation.navigate('EditClient', { person: null }) }} loading={false} />,
        })
    }, [])

    useEffect(() => {
        setBottomText('')
        if (success) {
            setToastType('success')
            setToastMessage('O cliente foi criado com sucesso!')
            setToastVisible(true)
        }
    }, [success])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => { setSearchedItems([]); setCurrentPage(1); loadClients(1, 'nome') })
        return () => {
            unsubscribe()
        };
    }, [success]);

    const loadClients = useCallback(async (pageNumber: number, sortBy: string) => {
        setLoading(true)
        setHasError(false)
        try {
            const res = await fetch(`http://localhost:5000/clientes?_sort=${sortBy}&_order=asc`)
            const customers = await res.json()
            let orderedCustomers = customers
            setClients(orderedCustomers)
            if (orderedCustomers?.length > itemsPerPage) {
                setSearchedItems(orderedCustomers.slice(0, pageNumber * itemsPerPage))
            } else {
                setSearchedItems(orderedCustomers)
            }
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
            'Você quer sair?',
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
                onPress: () => { },
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
                if (isCloseToBottom(nativeEvent) && currentPage * itemsPerPage <= clients?.length) {
                    setCurrentPage(currentPage + 1)
                    loadClients(currentPage + 1, sortParam)
                }
                if (isCloseToBottom(nativeEvent) && currentPage * itemsPerPage > clients?.length && !loading) {
                    setBottomText('Fim da lista')
                }
            }}
        >
            <View style={styles.filterContainer}>
                <SearchBar
                    data={clients}
                    setFixedData={(val) => { setSearchedItems(val) }}
                    showLoading={(val) => setSearchLoading(val)}
                />
                <SortComponent onPress={(val: string) => { setSortParam(val); setCurrentPage(1); loadClients(1, val) }} />
            </View>
            {searchLoading && <ActivityIndicator style={{ marginTop: 20 }} size='large' color={Colors.primary} />}
            {!loading && hasError && <Text style={{ textAlign: 'center', marginTop: 20 }}>Ocorreu um erro com o servidor!</Text>}
            {!searchLoading && searchedItems?.length > 0 && searchedItems?.map((item: any, index: any) => (
                <PersonItem key={index} person={item} onPressEdit={() => props.navigation.navigate('EditClient', { person: item })} onPressDelete={showDeleteAlert.bind(this, item.id)} />
            ))}
            {loading && <ActivityIndicator style={{ marginTop: 20 }} size='large' color={Colors.primary} />}
            {!loading && <Text style={styles.bottomText} >{bottomText}</Text>}
        </SafeScrollView>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10,
        marginBottom: 30,
    },
    bottomText: {
        color: colors.sgray,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic'
    },
})

export default ClientsOverviewScreen