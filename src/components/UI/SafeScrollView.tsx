import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, Keyboard, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native'
import ToastMessage from './ToastMessage'

export type Props = {
    toastOptions: any,
    style: object | null
};

const SafeScrollView: React.FC<Props> = props => {
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const scrollRef = useRef(null)

    const keyboarOpenHandler = (e: any) => {
        setKeyboardHeight(e.endCoordinates.height)
        console.log(e.endCoordinates.height)
    }
    const keyboarCloseHandler = (e: any) => {
        setKeyboardHeight(0)
    }


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", keyboarOpenHandler);
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", keyboarCloseHandler);
        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        };
    }, []);

    return (
        <View style={{
            ...styles.screen,
            paddingBottom: Platform.OS === 'android' ? 0 : keyboardHeight ? keyboardHeight : 0,
        }} >
            {props.toastOptions && <ToastMessage {...props} />}
            <ScrollView
                style={styles.scrollStyle}
                contentContainerStyle={{ ...styles.contentContainerStyle }}
                keyboardShouldPersistTaps="handled"
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
            >

                <KeyboardAvoidingView style={{...styles.view, ...props.style}} >
                    {props.children}
                </KeyboardAvoidingView>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollStyle: {
        paddingVertical: 20,
        flex: 1,
        height: "100%"
    },
    contentContainerStyle: {},
    view: { 
        flex: 1,
        paddingHorizontal: 10,
    }
})

export default SafeScrollView