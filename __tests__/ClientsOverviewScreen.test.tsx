import React, { useEffect } from 'react'
import { View, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native'
import fetch from 'jest-fetch-mock';
import { create } from 'react-test-renderer'

import ClientsOverviewScreen from '../src/screens/ClientsOverviewScreen'
import { act } from 'react-test-renderer';

export const ComponentUnderTest = () => {
    useEffect(() => { }, [])

    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
}

// Fetch request  is successfull
it("prooves that clients are fetched from json-server successfully", async () => {

    render(
        <ClientsOverviewScreen
            navigation={{
                navigate: () => { },
                setOptions: () => { },
                addListener: () => { }
            }}
            route={{
                params: { success: true }
            }}
        />)

    await fetch.mockResponseOnce('GET')

    await act(() => new Promise(resolve => setImmediate(resolve)))

    expect(fetch.mock.calls).toMatchSnapshot()
})