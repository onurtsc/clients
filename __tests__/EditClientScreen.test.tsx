import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import fetch from 'jest-fetch-mock';
import { NavigationContext } from "@react-navigation/native"
import EditClientScreen from '../src/screens/EditClientScreen'
import { act } from 'react-test-renderer';

jest.useFakeTimers()

const navigationWrapper: any = {
    isFocused: () => true,
    addListener: jest.fn(() => jest.fn())
}

// All Inputs are valid
it("prooves that all inputs are valid", async () => {
    const { getByTestId } = render(
        <NavigationContext.Provider value={navigationWrapper}>
            <EditClientScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />
        </NavigationContext.Provider>
    )

    await act(async () => {
        await fireEvent.changeText(getByTestId('nome.input'), 'Jose Martinez') // name is validated
        await fireEvent.changeText(getByTestId('cpf.input'), '123.123.123-00') // cpf is validated
        await fireEvent.changeText(getByTestId('email.input'), 'user@address.com') // email is validated
        await fireEvent.changeText(getByTestId('numero.input'), '4324') // numero is validated
        await fireEvent.changeText(getByTestId('cep.input'), '33222-000') // cep is validated
        await fireEvent.changeText(getByTestId('rua.input'), 'Example Street') // rua is validated
        await fireEvent.changeText(getByTestId('bairro.input'), 'Centro') // bairro is validated
        await fireEvent.changeText(getByTestId('cidade.input'), 'Goiana') // cidade is validated
        await fireEvent.press(getByTestId('save.button'))
    })

    let errorText: any = getByTestId('errors.text')
    errorText = errorText._fiber.stateNode.props.children

    await act(async () => {
        expect(errorText.length).toBe(0)
    })
})

// E-mail, CPF and CEP are invalid
it("prooves that email, CPF and CEP inputs are invalid", async () => {
    const { getByTestId } = render(
        <NavigationContext.Provider value={navigationWrapper}>
            <EditClientScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />
        </NavigationContext.Provider>
    )

    await act(async () => {
        await fireEvent.changeText(getByTestId('nome.input'), 'Jose Martinez')
        await fireEvent.changeText(getByTestId('cpf.input'), '123.123.10') // Invalid CPF
        await fireEvent.changeText(getByTestId('email.input'), 'example_invalid_email') // invalid email
        await fireEvent.changeText(getByTestId('numero.input'), '4324')
        await fireEvent.changeText(getByTestId('cep.input'), '33-00') // invalid CEP
        await fireEvent.changeText(getByTestId('rua.input'), 'Example Street')
        await fireEvent.changeText(getByTestId('bairro.input'), 'Centro')
        await fireEvent.changeText(getByTestId('cidade.input'), 'Goiana')
        await fireEvent.press(getByTestId('save.button'))
    })

    let errorText: any = getByTestId('errors.text')
    errorText = errorText._fiber.stateNode.props.children


    await act(async () => {
        expect(errorText.search('CPF'))
        expect(errorText.search('email'))
        expect(errorText.search('CEP'))
    })
})

// Check Post Requests
it("prooves that post request works successfully when all inputs are valid", async () => {
    const { getByTestId } = render(
        <NavigationContext.Provider value={navigationWrapper}>
            <EditClientScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />
        </NavigationContext.Provider>
    )

    await act(async () => {
        const nome = await fireEvent.changeText(getByTestId('nome.input'), 'Jose Martinez')
        const cpf = await fireEvent.changeText(getByTestId('cpf.input'), '123.123.123-00')
        const email = await fireEvent.changeText(getByTestId('email.input'), 'user@address.com')
        const numero = await fireEvent.changeText(getByTestId('numero.input'), '4324')
        const cep = await fireEvent.changeText(getByTestId('cep.input'), '65444-322')
        const rua = await fireEvent.changeText(getByTestId('rua.input'), 'Example Street')
        const bairro = await fireEvent.changeText(getByTestId('bairro.input'), 'Centro')
        const cidade = await fireEvent.changeText(getByTestId('cidade.input'), 'Goiana')
        await fireEvent.press(getByTestId('save.button'))

        let errorText: any = getByTestId('errors.text')
        errorText = errorText._fiber.stateNode.props.children

        await act(async () => {
            expect(errorText.length).toBe(0)
        })

        await fetch.mockResponseOnce(JSON.stringify({
            nome: nome,
            cpf: cpf,
            email: email,
            numero: numero,
            cep: cep,
            rua: rua,
            bairro: bairro,
            cidade: cidade
        }))
    })

    await act(() => new Promise(resolve => setImmediate(resolve)))

    expect(fetch.mock.calls).toMatchSnapshot()
})