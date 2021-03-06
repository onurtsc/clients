import React, { useState } from 'react'
import { StyleSheet, View, TextInput, Text, Platform, ActivityIndicator } from 'react-native'
import Colors from '../../constants/colors'

interface Props {
    errorMessage: string;
    error: boolean;
    placeholder: string;
    color: string;
    labelColor: string;
    hide: boolean;
    label: string;
    value: string;
    style: object;
    onChangeText: (val: string) => void;
    autoCapitalize: any;
    secureTextEntry: boolean;
    keyboardType: any;
    maxLength: number;
    ref: any;
    loading: boolean;
    testID: string;
};

const InputBox: React.FC<Props> = React.forwardRef<TextInput, Props>((props, ref) => {
    const [editing, setEditing] = useState(false)
    const [watchError, setWatchError] = useState(false)

    const errorMessage = props.errorMessage ? props.errorMessage : 'Por favor insira um texto válido!'
    const placeholder = editing ? '' : (watchError && props.error ? errorMessage : props.placeholder)

    const labelColor = props.labelColor ? props.labelColor : Colors.tertiary

    if (props.hide) {
        return <View />
    }

    return (
        <View style={{ ...styles.container, ...props.style }}>
            {props.label &&
                <Text
                    style={{
                        ...styles.label,
                        color: labelColor
                    }}
                >{props.label}
                </Text>
            }
            <View style={{ ...styles.inputContainer }} >
                <TextInput
                    style={{
                        ...styles.input,
                        borderWidth: editing ? 1.5 : 1,
                        borderColor: editing ? !props.error ? Colors.success : Colors.secondary : (watchError && props.error) ? Colors.danger : '#ccc',
                        color: Colors.sgray,
                    }}
                    placeholderTextColor={watchError && props.error ? Colors.danger : '#ccc'}
                    onChangeText={(val: string) => { props.onChangeText(val) }}
                    placeholder={placeholder}
                    onTouchStart={() => setEditing(true)}
                    onBlur={() => { setEditing(false); setWatchError(true) }}
                    value={props.value}
                    autoCorrect={false}
                    autoCapitalize={props.autoCapitalize}
                    multiline={false}
                    secureTextEntry={props.secureTextEntry}
                    keyboardType={props.keyboardType}
                    maxLength={props.maxLength}
                    ref={ref}
                    testID={props.testID}
                />
                {props.loading && <ActivityIndicator style={{ position: 'absolute', right: 10, top: 5 }} size='small' color={labelColor} />}
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
    },
    label: {
        marginBottom: Platform.OS === 'ios' ? 10 : 5
    },
    input: {
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 12,
        borderRadius: 5
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
})

export default InputBox