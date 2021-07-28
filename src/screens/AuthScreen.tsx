import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import ButtonBox from '../components/UI/ButtonBox'
import InputBox from '../components/UI/InputBox'
import SafeScrollView from '../components/UI/SafeScrollView'
import colors from '../constants/colors'
import User from '../models/User'

const AuthScreen: React.FC = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [invalidInputs, setInvalidInputs] = useState<any[]>(['email', 'password'])


    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Login',
            headerTitleStyle: {},
            headerTintColor: colors.primary,
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
        setLoading(true)
        try {
            const res = await fetch("http://localhost:5000/clientes")
            const users: User[] = await res.json()
            const currentUser = users.find(u => u.email === email)
            if(!currentUser) {
                setToastMessage('Este email não existe!')
                setToastVisible(true)
                setLoading(false)
                return
            }
            if(currentUser.password !== password) {
                setToastMessage('A senha está errada!!')
                setToastVisible(true)
                setLoading(false)
                return
            }
            props.navigatio
            setLoading(false)
        } catch (err) {
            setToastMessage('Ocorreu um erro ao buscar os clientes')
            setToastVisible(true)
            setLoading(false)
            console.log(err);
        }
    }

    const onChangeEmail = (val: string) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let errs = invalidInputs
        if (!emailRegex.test(val.toLowerCase())) {
            errs.push('email')
            setInvalidInputs([...invalidInputs, 'email'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'email'))
        }
        setEmail(val.trim())
    }
    const onChangepassword = (val: string) => {
        setPassword(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'password'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'password'))
        }
    }

    const toastOptions = {
        toastVisible: toastVisible,
        hideToast: (val: boolean) => setToastVisible(val),
        message: toastMessage,
        messagePosition: 'top',
        type: 'warning'
    }

    return (
        <SafeScrollView style={{justifyContent: 'center'}} toastOptions={toastOptions}>
            <View style={styles.container} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={email}
                    onChangeText={onChangeEmail}
                    color={Colors.sgray}
                    label='E-Mail'
                    labelColor={Colors.secondary}
                    placeholder='E-Mail'
                    error={invalidInputs.find(inv => inv === 'email')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='email-address'
                    maxLength={50}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={password}
                    onChangeText={onChangepassword}
                    color={Colors.sgray}
                    label='Password'
                    labelColor={Colors.secondary}
                    placeholder='Password'
                    error={invalidInputs.find(inv => inv === 'password')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={true}
                    keyboardType='default'
                    maxLength={50}
                />
                <ButtonBox style={{ marginBottom: 50 }} title='Login' onPress={loginHandler} color={colors.success} hide={false} loading={loading} />
            </View>
        </SafeScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginVertical: 20,
        marginHorizontal: 20,
    },
    container: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,

        backgroundColor: colors.backgroundColor,
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