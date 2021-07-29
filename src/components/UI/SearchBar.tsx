import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TextInput, Dimensions, Platform } from 'react-native'
import Colors from '../../constants/colors'
import Client from '../../models/Client'
import CustomIcon from './CustomIcon'

const deviceWidth = Dimensions.get('window').width

interface Props {
    data: Client[]
    setFixedData: (data: Client[]) => void
    showLoading: (isLoading: boolean) => void
}

const SearchBar: React.FC<Props> = props => {
    const [input, setInput] = useState('')

    const searchHandler = async (value: string) => {
        setInput(value)
        props.showLoading(true)
        try {
            const res = await fetch(`http://localhost:5000/clientes?q=${value}`)
            const customers = await res.json()
            props.setFixedData(customers)
            props.showLoading(false)
        } catch (err) {
            console.log(err)
            props.showLoading(false)
        }
    }

    return (
        <View style={styles.searchBar} >
            <CustomIcon name='search' />
            <TextInput style={styles.input}
                value={input}
                placeholderTextColor='#707070'
                placeholder='Pesquisar'
                onChangeText={(value) => searchHandler(value)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        width: deviceWidth * 0.8,
        height: Platform.OS === 'ios' ? 35 : 40,
        // backgroundColor: '#F8F8FF',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: deviceWidth * 0.4,
        marginHorizontal: 10,
        // borderWidth: 0.5,
        borderColor: '#ccc',
        paddingHorizontal: 20,

        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: '#808080'
    }
})

export default SearchBar