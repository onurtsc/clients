import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Colors from '../../constants/colors';

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export type Props = {
    toastOptions: any;
};

const ToastMessage: React.FC<Props> = ({toastOptions}) => {
    const [count, setCount] = useState(1)

    const  toastVisible  = toastOptions.toastVisible

    useEffect(() => {
        if (count >= 0) {
            let timer = setTimeout(() => { setCount(count - 1) }, 1000);
            return () => {
                clearTimeout(timer);
            };
        } else {
            setCount(1)
            toastOptions.hideToast(false)
        }
    }, [toastVisible, count])

    if (!toastOptions.toastVisible) {
        return <View />
    }

    return (
        <View style={{
            ...styles.modalCard,
            backgroundColor: toastOptions.type === 'danger' ? Colors.danger : toastOptions.type === 'warning' ? Colors.warning : toastOptions.type === 'success' ? Colors.success : 'rgb(56,60,73)',
            top: toastOptions.messagePosition  === 'bottom' ? deviceHeight*0.75 : toastOptions.messagePosition === 'center' ? deviceHeight * 0.4 : deviceHeight * 0.01,
        }} >
            <Text style={styles.text}>{toastOptions.message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    modalCard: {
        maxWidth: deviceWidth * 0.95,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 999
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

export default ToastMessage

