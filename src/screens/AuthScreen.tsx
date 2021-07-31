import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ButtonBox from '../components/UI/ButtonBox'
import InputBox from '../components/UI/InputBox'
import SafeScrollView from '../components/UI/SafeScrollView'
import colors from '../constants/colors'
import User from '../models/User'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/items/Logo'

interface Props {
    navigation: {
        navigate: (param: string) => void
        setOptions: (params: object) => void
    };
}

const AuthScreen: React.FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [invalidInputs, setInvalidInputs] = useState<any[]>(['email', 'senha'])


    useEffect(() => {
        props.navigation?.setOptions({
            headerTitle: '',
            headerTitleStyle: {},
            headerTintColor: colors.tertiary,
            headerLeft: null,
            headerStyle: {
                backgroundColor: colors.backgroundColor,
                elevation: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
            },
        })
    }, [])

    const loginHandler = async () => {
        let hasError = invalidInputs.length === 0 ? false : true
        if (hasError) {
            let errorText: string = ''
            let emailError = invalidInputs.find(i => i === 'email')
            let passwordError = invalidInputs.find(i => i === 'senha')
            errorText = emailError ? passwordError ? 'Email é inválido. A senha não pode ter menos de 4 caracteres.' : 'Email é inválido.' : 'A senha não pode ter menos de 4 caracteres.'
            setToastMessage(errorText)
            setToastVisible(true)
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:5000/usuarios?q=${email}`)
            const result = await res.json()
            if (!result || result?.length < 1) {
                setToastMessage('Este email não existe!')
                setToastVisible(true)
                setLoading(false)
                return
            }
            const user = result.find((u: User) => u.email === email)
            if (!user) {
                setToastMessage('Este email não existe!')
                setToastVisible(true)
                setLoading(false)
                return
            }
            if (user.password != password) {
                setToastMessage('A senha está errada!!')
                setToastVisible(true)
                setLoading(false)
                return
            }
            await AsyncStorage.setItem('token', JSON.stringify(user))
            setLoading(false)
            props.navigation.navigate('ClientsOverview')
        } catch (err) {
            setToastMessage('Ocorreu um erro ao conectar o servidor. Por favor, verifique sua conexão à internet')
            setToastVisible(true)
            setLoading(false)
        }
    }

    const onChangeEmail = (val: string) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let errs = invalidInputs
        if (!emailRegex.test(val.toLowerCase())) {
            errs.push('email')
            const errorExist = invalidInputs.find(i => i === 'email')
            if (!errorExist) {
                setInvalidInputs([...invalidInputs, 'email'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'email'))
        }
        setEmail(val.trim())
    }
    const onChangepassword = (val: string) => {
        setPassword(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'senha'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'senha'))
        }
    }

    const toastOptions = {
        toastVisible: toastVisible,
        hideToast: (val: boolean) => setToastVisible(val),
        message: toastMessage,
        messagePosition: 'top',
        type: 'danger'
    }

    return (
        <SafeScrollView
            style={styles.screen}
            contentContainerStyle={{ flex: 1 }}
            toastOptions={toastOptions}
            onScroll={() => { }}
        >
            <Logo size={60} />
            <View style={styles.container} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={email}
                    onChangeText={onChangeEmail}
                    color={'#ccc'}
                    label='E-Mail'
                    labelColor={colors.tertiary}
                    placeholder='exemplo@exemplo.com'
                    error={invalidInputs.find(inv => inv === 'email')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='email-address'
                    maxLength={50}
                    ref={null}
                    loading={false}
                    testID='email.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={password}
                    onChangeText={onChangepassword}
                    color={'#ccc'}
                    label='Senha'
                    labelColor={colors.tertiary}
                    placeholder='****'
                    error={invalidInputs.find(inv => inv === 'senha')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    keyboardType='default'
                    maxLength={50}
                    ref={null}
                    loading={false}
                    testID='password.input'
                />
                <ButtonBox style={{}} title='Login' testID='login.button' onPress={loginHandler} color={colors.secondary} hide={false} loading={loading} />
            </View>
        </SafeScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'space-around',
    },
    container: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

        backgroundColor: colors.ivory,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5
    },
    input: {
        marginBottom: 20,
    },
})

export default AuthScreen