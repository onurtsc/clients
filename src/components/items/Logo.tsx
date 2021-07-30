import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Colors from '../../constants/colors';


const Logo: React.FC<{size: number}> = ({size}) => {

    const fSize = size

    return (
        <View style={styles.logo} >
            <Text style={{...styles.text1, fontSize: fSize}}>Folk</Text>
            <Text style={{...styles.text2, fontSize: fSize, color: fSize > 16 ? Colors.primary : 'white'}}>&</Text>
            <Text style={{...styles.text3, fontSize: fSize}}>Us</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    text1: {
        fontWeight: 'bold',
        color: Colors.tertiary,
    },
    text2: {
        fontWeight: 'bold',
    },
    text3: {
        fontWeight: 'bold',
        color: Colors.secondary,
    }
});

export default Logo

