import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, Keyboard, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native'
import ToastMessage from './ToastMessage'

export type Props = {
    toastOptions: any
    style: object | null
    contentContainerStyle: object | null
    onScroll: (element: any) => void
};

const SafeScrollView: React.FC<Props> = props => {
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const scrollRef = useRef(null)

    const keyboarOpenHandler = (e: any) => {
        setKeyboardHeight(e.endCoordinates.height)
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
                contentContainerStyle={{ ...styles.contentContainerStyle, ...props.contentContainerStyle }}
                keyboardShouldPersistTaps="handled"
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                onScroll={props.onScroll}
                scrollEventThrottle={400}
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
        flex: 1,
        paddingVertical: 20,
    },
    contentContainerStyle: {
        // flex: 1,
    },
    view: { 
        flex: 1,
        paddingHorizontal: 10,
    }
})

export default SafeScrollView