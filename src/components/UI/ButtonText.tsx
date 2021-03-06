import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import Colors from '../../constants/colors'

export type Props = {
    hide: boolean;
    onPress: () => void,
    style: object,
    color: string,
    title: string
};

const ButtonText: React.FC<Props> = (props) => {

    if (props.hide) {
        return <View />
    }

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{
                ...styles.container,
                ...props.style,
            }}
        >
            <View style={{
                borderColor: props.color ? props.color : Colors.secondary
            }}
            >
                <Text style={{
                    ...styles.title,
                    color: props.color ? props.color : Colors.secondary,
                }}
                >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
})

export default ButtonText