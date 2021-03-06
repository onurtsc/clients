import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, BackHandler, Alert, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
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

interface Props {
    navigation: {
        navigate: (param: string) => void
        setOptions: (params: object) => void
    };
}

const EditClientScreen: React.FC<Props> = (props: any) => {
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

    const person= props.route?.params?.person

    const refEmail = useRef<RefObject>(null)
    const refNumber = useRef<RefObject>(null)

    useEffect(() => {
        props.navigation?.setOptions({
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
            'Aten????o',
            'Suas altera????es n??o ser??o salvas!',
            [
                { text: 'Volte', onPress: () => props.navigation.navigate('ClientsOverview', { success: false }), style: 'destructive' },
                { text: 'Fique', onPress: () => { }, style: 'cancel' }
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
            if (invalidInputs?.filter(inv => inv === 'nome')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'nome'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'nome'))
        }
    }

    const onChangeCPF = (val: string) => {
        let newVal = formatCPF(val)
        setCpf(newVal)
        if (newVal.length !== 14) {
            if (invalidInputs?.filter(inv => inv === 'CPF')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'CPF'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'CPF'))
        }
        if (newVal.length >= 14) {
            refEmail.current?.focus()
        }
    }

    const onChangeEmail = (val: string) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(val.toLowerCase())) {
            if (invalidInputs?.filter(inv => inv === 'email')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'email'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'email'))
        }
        setEmail(val.trim())
    }

    const onChangeCep = async (val: string) => {
        let newVal = formatCEP(val)
        setCep(newVal)
        if (newVal.length !== 9) {
            if (invalidInputs?.filter(inv => inv === 'CEP')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'CEP'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'CEP'))
        }
        if (newVal.length >= 9) {
            setAddressIndicator(true)
            try {
                const res = await fetch(`https://viacep.com.br/ws/${val}/json/`)
                const result = await res.json()
                if (result.erro) {
                    setToastMessage('N??o h?? informa????es de endere??o relacionadas a este CEP!')
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
                setToastMessage('Ocorreu um erro ao obter as informa????es do endere??o.Certifique-se de que voc?? est?? conectado ?? Internet.')
                setToastType('danger')
                setToastVisible(true)
            }
        }
    }

    const onChangerua = (val: string) => {
        setRua(val)
        if (val.length < 4) {
            if (invalidInputs?.filter(inv => inv === 'rua')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'rua'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'rua'))
        }
    }

    const onChangeNumber = (val: string) => {
        let newVal = formatNumero(val)
        setNumero(newVal)
        if (val.length < 1) {
            if (invalidInputs?.filter(inv => inv === 'numero')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'numero'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'numero'))
        }
    }

    const onChangeBairro = (val: string) => {
        setBairro(val)
        if (val.length < 4) {
            if (invalidInputs?.filter(inv => inv === 'bairro')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'bairro'])
            }
        } else {
            setInvalidInputs(invalidInputs.filter(inv => inv !== 'bairro'))
        }
    }

    const onChangecidade = (val: string) => {
        setCidade(val)
        if (val.length < 4) {
            if (invalidInputs?.filter(inv => inv === 'cidade')?.length < 1) {
                setInvalidInputs([...invalidInputs, 'cidade'])
            }
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
            setToastMessage(`Por favor corrija os erros abaixo: \n\n${invalidInputs?.toString()?.replace(/,/g, ', ')}`)
            setToastType('danger')
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
            setToastType('danger')
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
            onScroll={() => { }}
        >
            <Text style={styles.title}>INFORMA????O PESSOAL</Text>
            <View style={styles.inputContainer} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={nome}
                    onChangeText={onChangeName}
                    color={colors.sgray}
                    label='Nome'
                    labelColor={colors.tertiary}
                    placeholder='Nome Sobrenome'
                    error={invalidInputs.find(inv => inv === 'nome')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={50}
                    ref={null}
                    loading={false}
                    testID='nome.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cpf}
                    onChangeText={onChangeCPF}
                    color={colors.sgray}
                    label='CPF'
                    labelColor={colors.tertiary}
                    placeholder='000.000.000-00'
                    error={invalidInputs.find(inv => inv === 'CPF')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={14}
                    ref={null}
                    loading={false}
                    testID='cpf.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={email}
                    onChangeText={onChangeEmail}
                    color={colors.sgray}
                    label='E-Mail'
                    labelColor={colors.tertiary}
                    placeholder='examplo@examplo.com'
                    error={invalidInputs.find(inv => inv === 'email')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='email-address'
                    maxLength={50}
                    ref={refEmail}
                    loading={false}
                    testID='email.input'
                />
            </View>
            <Text style={styles.title}>INFORMA????O DE ENDERE??O</Text>
            <View style={styles.inputContainer} >
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cep}
                    onChangeText={onChangeCep}
                    color={colors.sgray}
                    label='CEP'
                    labelColor={colors.tertiary}
                    placeholder='00000-000'
                    error={invalidInputs.find(inv => inv === 'CEP')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={9}
                    ref={null}
                    loading={addressIndicator}
                    testID='cep.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={rua}
                    onChangeText={onChangerua}
                    color={colors.sgray}
                    label='Rua'
                    labelColor={colors.tertiary}
                    placeholder='Entre na rua por favor'
                    error={invalidInputs.find(inv => inv === 'rua')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={100}
                    ref={null}
                    loading={addressIndicator}
                    testID='rua.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={numero}
                    onChangeText={onChangeNumber}
                    color={colors.sgray}
                    label='N??mero'
                    labelColor={colors.tertiary}
                    placeholder='Digite o n??mero por favor'
                    error={invalidInputs.find(inv => inv === 'numero')}
                    errorMessage={errorMessage}
                    autoCapitalize='none'
                    secureTextEntry={false}
                    keyboardType='decimal-pad'
                    maxLength={5}
                    ref={refNumber}
                    loading={false}
                    testID='numero.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={bairro}
                    onChangeText={onChangeBairro}
                    color={colors.sgray}
                    label='Bairro'
                    labelColor={colors.tertiary}
                    placeholder='Entre no bairro por favor'
                    error={invalidInputs.find(inv => inv === 'bairro')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={100}
                    ref={null}
                    loading={addressIndicator}
                    testID='bairro.input'
                />
                <InputBox
                    style={styles.input}
                    hide={false}
                    value={cidade}
                    onChangeText={onChangecidade}
                    color={colors.sgray}
                    label='Cidade'
                    labelColor={colors.tertiary}
                    placeholder='Entre na cidade por favor'
                    error={invalidInputs.find(inv => inv === 'cidade')}
                    errorMessage={errorMessage}
                    autoCapitalize='words'
                    secureTextEntry={false}
                    keyboardType='default'
                    maxLength={20}
                    ref={null}
                    loading={addressIndicator}
                    testID='cidade.input'
                />
            </View>
            <Text testID='errors.text' style={styles.errorText} >{invalidInputs?.toString()?.replace(/,/g, ', ')}</Text>
            <ButtonBox style={{ marginBottom: 50 }} testID='save.button' title='Salvar' onPress={saveClientHandler} color={colors.primary} hide={false} loading={loading} />
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
    errorText: {
        color: 'transparent',
        textAlign: 'center'
    },
})

export default EditClientScreen