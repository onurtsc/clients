import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native'
import Colors from '../../constants/colors'

const deviceWidth = Dimensions.get('window').width

export type Props = {
    hide: boolean;
    loading: boolean;
    color: string;
    style: object;
    onPress: () => void;
    title: string;
    testID: string;
};

const ButtonBox: React.FC<Props> = props => {

    const largeCustomFontSize = deviceWidth < 400 ? 14 : 16

    if(props.hide) {
        return <View/>
    }

    if(props.loading) {
        return (
            <View style={{ ...styles.container, ...props.style }} >
                <ActivityIndicator color={props.color ? props.color : Colors.secondary} size='small' />
            </View>
        )
    }

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{ ...styles.container, ...props.style, backgroundColor: props.color ? props.color : Colors.secondary, }}
            testID={props.testID}
        >
            <Text
                style={{
                    ...styles.title,
                    fontSize: largeCustomFontSize,
                }} >
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginVertical: 10
    },
    title: {
        color: 'white',
        fontSize: deviceWidth < 500 ? 14 : 16,
        fontWeight: 'bold'
    },
})

export default ButtonBox