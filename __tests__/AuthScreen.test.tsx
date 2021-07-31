import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import fetch from 'jest-fetch-mock';

import AuthScreen from '../src/screens/AuthScreen'
import { act } from 'react-test-renderer';

// Both Inputs are invalid
it("prooves that both inputs are invalid", () => {
    const { getByTestId, getByText } = render(<AuthScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />)

    fireEvent.press(getByTestId('login.button'))
    getByText('Email é inválido. A senha não pode ter menos de 4 caracteres.')
})

// Only email is invalid
it("prooves that only the email address is invalid", () => {
    const { getByTestId, getByText, queryAllByText } = render(<AuthScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />)

    fireEvent.changeText(getByTestId('password.input'), '1234') // password is validated
    fireEvent.press(getByTestId('login.button'))

    getByText('Email é inválido.')
    expect(queryAllByText('Email é inválido. A senha não pode ter menos de 4 caracteres.').length).toBe(0)
})

// Only password is invalid
it("prooves that only the pasword is invalid", () => {
    const { getByTestId, getByText, queryAllByText } = render(<AuthScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />)

    fireEvent.changeText(getByTestId('email.input'), 'exemplo@exemplo.com') // email is validated
    fireEvent.press(getByTestId('login.button'))

    getByText('A senha não pode ter menos de 4 caracteres.')
    expect(queryAllByText('Email é inválido. A senha não pode ter menos de 4 caracteres.').length).toBe(0)
})

// Both Inputs are valid
it("prooves that both inputs are valid", async () => {
    const { getByTestId, queryAllByText } = render(<AuthScreen navigation={{ navigate: () => { }, setOptions: () => { } }} />)

    fireEvent.changeText(getByTestId('email.input'), 'exemplo@exemplo.com') // email is validated
    fireEvent.changeText(getByTestId('password.input'), '1234') // password is validated
    fireEvent.press(getByTestId('login.button'))

    await act(async () => {
        expect(queryAllByText('Email é inválido.').length).toBe(0)
        expect(queryAllByText('A senha não pode ter menos de 4 caracteres.').length).toBe(0)
        expect(queryAllByText('Email é inválido. A senha não pode ter menos de 4 caracteres.').length).toBe(0)
    })
})

// Fetch request is successfull
it("prooves that the user is successfully autenticated", async () => {

    await fetch.mockResponseOnce(JSON.stringify({ email: 'test@test.com', password: '11111111' }))

    const navigateMock = jest.fn()
    const { getByTestId } = render(
        <AuthScreen
            navigation={{
                navigate: navigateMock('ClientsOverview'),
                setOptions: () => { }
            }}
        />
    )

    await act(async () => {
        await fireEvent.changeText(getByTestId('email.input'), 'test@test.com') // email is validated
        await fireEvent.changeText(getByTestId('password.input'), '11111111') // password is validated
        await fireEvent.press(getByTestId('login.button'))
    })

    await act(() => new Promise(resolve => setImmediate(resolve)))

    expect(fetch.mock.calls).toMatchSnapshot()
})