import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, BackHandler, Alert, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen'
import ButtonBox from '../components/UI/ButtonBox'
import InputBox from '../components/UI/InputBox'
import SafeScrollView from '../components/UI/SafeScrollView'
import colors from '../constants/colors'
import { formatCEP, formatCPF, formatNumero } from '../utils/masks'
import ButtonIcon from '../components/UI/ButtonIcon';
import Client from '../models/Client';

interface RefObject {
    focus: () => void
}

const EditClientScreen: React.FC = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [addressIndicator, setAddressIndicator] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')
    const [toastType, setToastType] = useState<string>('default')

    const [personId, setPersonId] = useState<number>(0)
    const [nome, setNome] = useState<string>('')
    const [cpf, setCpf] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [rua, setRua] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [bairro, setBairro] = useState<string>('')
    const [cidade, setCidade] = useState<string>('')

    const [invalidInputs, setInvalidInputs] = useState<any[]>(['nome', 'CPF', 'email', 'CEP', 'rua', 'numero', 'bairro', 'cidade'])

    const { person } = props.route.params

    const refEmail = useRef<RefObject>(null)
    const refNumber = useRef<RefObject>(null)

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: person ? 'Editar Cliente' : 'Adicionar Cliente',
            headerLeft: () => <ButtonIcon style={{}} name='back' onPress={cancelHandler} loading={false} />,
        })
    }, [personId, nome, cpf, email, cep, rua, numero, bairro, cidade, invalidInputs, person, loading])

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', cancelHandler);
            return () => BackHandler.removeEventListener('hardwareBackPress', cancelHandler);
        }, [])
    )
    const cancelHandler = () => {
        Alert.alert(
            'Atenção',
            'Suas alterações não serão salvas!',
            [
                { text: 'Volte', onPress: () => props.navigation.navigate('ClientsOverview', { success: false }), style: 'destructive' },
                { text: 'Fique', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
            ],
            { cancelable: true }
        );
        return true
    }

    useEffect(() => {
        if (person) {
            setInvalidInputs([])
            setPersonId(person.id)
            setNome(person.nome)
            setCpf(person.cpf)
            setEmail(person.email)
            setCep(person.endereco.cep)
            setRua(person.endereco.rua)
            setNumero(person.endereco.numero)
            setBairro(person.endereco.bairro)
            setCidade(person.endereco.cidade)
        }
    }, [])

    // Clear address errors when the address is fetched by cep
    useEffect(() => {
        if (rua.length >= 4) {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'rua'))
        }
        if (bairro.length >= 4) {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'bairro'))
        }
        if (cidade.length >= 4) {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'cidade'))
        }
    }, [rua, bairro, cidade])

    const onChangeName = (val: string) => {
        setNome(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'nome'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'nome'))
        }
    }

    const onChangeCPF = (val: string) => {
        let newVal = formatCPF(val)
        setCpf(newVal)
        if (newVal.length !== 14) {
            setInvalidInputs([...invalidInputs, 'CPF'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'CPF'))
        }
        if (newVal.length >= 14) {
            refEmail.current?.focus()
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

    const onChangeCep = async (val: string) => {
        let newVal = formatCEP(val)
        setCep(newVal)
        if (newVal.length !== 9) {
            setInvalidInputs([...invalidInputs, 'CEP'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'CEP'))
        }
        if (newVal.length >= 9) {
            setAddressIndicator(true)
            try {
                const res = await fetch(`https://viacep.com.br/ws/${val}/json/`)
                const result = await res.json()
                if (result.erro) {
                    setToastMessage('Não há informações de endereço relacionadas a este CEP!')
                    setToastType('default')
                    setToastVisible(true)
                    setAddressIndicator(false)
                    return
                }
                setRua(result.logradouro)
                setBairro(result.bairro)
                setCidade(result.localidade)
                refNumber.current?.focus()
                setAddressIndicator(false)
            } catch (error) {
                setAddressIndicator(true)
                setToastMessage('Ocorreu um erro ao obter as informações do endereço.Certifique-se de que você está conectado à Internet.')
                setToastType('warning')
                setToastVisible(true)
            }
        }
    }

    const onChangerua = (val: string) => {
        setRua(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'rua'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'rua'))
        }
    }

    const onChangeNumber = (val: string) => {
        let newVal = formatNumero(val)
        setNumero(newVal)
        if (val.length < 1) {
            setInvalidInputs([...invalidInputs, 'numero'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'numero'))
        }
    }

    const onChangeBairro = (val: string) => {
        setBairro(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'bairro'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'bairro'))
        }
    }

    const onChangecidade = (val: string) => {
        setCidade(val)
        if (val.length < 4) {
            setInvalidInputs([...invalidInputs, 'cidade'])
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'cidade'))
        }
    }

    const saveClientHandler = async () => {
        const data: Client = {
            id: 0,
            nome: nome,
            cpf: cpf,
            email: email,
            endereco: {
                cep: cep,
                rua: rua,
                numero: numero,
                bairro: bairro,
                cidade: cidade
            }
        }
        let hasError = invalidInputs.length === 0 ? false : true
        if (hasError) {
            setToastMessage('Por favor, corrija os campos que contêm erros!')
            setToastType('warning')
            setToastVisible(true)
            return
        }
        setLoading(true)
        try {
            await fetch(`http://localhost:5000/clientes${personId !== 0 ? "/" + personId.toString() : ''}`, {
                method: personId !== 0 ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            setLoading(false)
            props.navigation.navigate('ClientsOverview', { success: true })
        } catch (err) {
            setToastMessage('Ocorreu um erro com o servidor!')
            setToastType('warning')
            setToastVisible(true)
            setLoading(false)
        }
    }

    const toastOptions = {
        toastVisible: toastVisible,
        hideToast: (val: boolean) => setToastVisible(val),
        message: toastMessage,
        messagePosition: 'top',
        type: toastType
    }

    return (
        <SafeScrollView
            style={null}
            contentContainerStyle={{}}
            toastOptions={toastOptions}
            onScroll={() => {}}
        >
            <Text style={styles.title}>INFORMAÇÃO PESSOAL</Text>
            <View style={styles.inputContainer} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={nome}
                    onChangeText={onChangeName}
                    color={Colors.sgray}
                    label='Nome'
                    labelColor={Colors.secondary}
                    placeholder='Nome'
                    error={invalidInputs.find(inv => inv === 'nome')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={50}
                    ref={null}
                    loading={false}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cpf}
                    onChangeText={onChangeCPF}
                    color={Colors.sgray}
                    label='CPF'
                    labelColor={Colors.secondary}
                    placeholder='CPF'
                    error={invalidInputs.find(inv => inv === 'CPF')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={14}
                    ref={null}
                    loading={false}
                />
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
                    ref={refEmail}
                    loading={false}
                />
            </View>
            <Text style={styles.title}>INFORMAÇÃO DE ENDEREÇO</Text>
            <View style={styles.inputContainer} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cep}
                    onChangeText={onChangeCep}
                    color={Colors.sgray}
                    label='CEP'
                    labelColor={Colors.secondary}
                    placeholder='CEP'
                    error={invalidInputs.find(inv => inv === 'CEP')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={9}
                    ref={null}
                    loading={addressIndicator}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={rua}
                    onChangeText={onChangerua}
                    color={Colors.sgray}
                    label='Rua'
                    labelColor={Colors.secondary}
                    placeholder='Rua'
                    error={invalidInputs.find(inv => inv === 'rua')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={100}
                    ref={null}
                    loading={addressIndicator}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={numero}
                    onChangeText={onChangeNumber}
                    color={Colors.sgray}
                    label='Número'
                    labelColor={Colors.secondary}
                    placeholder='Número'
                    error={invalidInputs.find(inv => inv === 'numero')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={5}
                    ref={refNumber}
                    loading={false}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={bairro}
                    onChangeText={onChangeBairro}
                    color={Colors.sgray}
                    label='Bairro'
                    labelColor={Colors.secondary}
                    placeholder='Bairro'
                    error={invalidInputs.find(inv => inv === 'bairro')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={100}
                    ref={null}
                    loading={addressIndicator}
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cidade}
                    onChangeText={onChangecidade}
                    color={Colors.sgray}
                    label='Cidade'
                    labelColor={Colors.secondary}
                    placeholder='Cidade'
                    error={invalidInputs.find(inv => inv === 'cidade')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={20}
                    ref={null}
                    loading={addressIndicator}
                />
            </View>
            <ButtonBox style={{ marginBottom: 50 }} title='Salvar' onPress={saveClientHandler} color={colors.primary} hide={false} loading={loading} />
        </SafeScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginVertical: 20,
        marginHorizontal: 20,
    },
    title: {
        color: '#808080',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center'
    },
    inputContainer: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,

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

export default EditClientScreen