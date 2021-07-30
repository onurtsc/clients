import React from 'react'
import {render} from '@testing-library/react-native'

import ClientsOverviewScreen from '../src/screens/ClientsOverviewScreen'

it("renders auth screen elements", () => {
    const {getAllByText} = render(<ClientsOverviewScreen/>)

    expect(getAllByText('Senha').length).toBe(1)
})

