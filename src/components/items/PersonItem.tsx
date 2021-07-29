import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import colors from '../../constants/colors';
import ButtonIcon from '../UI/ButtonIcon';

export type Props = {
    person: any;
    onPressEdit: () => void
    onPressDelete: () => void
};

const PersonItem: React.FC<Props> = props => {
    const person = props.person

    const imageText = person.nome ? person.nome.charAt(0) : person.nome.charAt(0)


    return (
        <View style={styles.container} >
            <View style={styles.top}>
                <View style={styles.circle} >
                    <Text style={styles.text} >{imageText}</Text>
                </View>

                <View style={styles.textContainer} >
                    <Text style={styles.name} >{person.nome}</Text>
                    <Text style={styles.email} >{person.email}</Text>
                </View>
            </View>

            <View style={styles.bottom}>
                <View style={styles.columnContainer} >
                    <Text style={styles.label} >CPF: </Text>
                    <Text style={styles.desc} >{person.cpf}</Text>
                </View>
                <View style={styles.columnContainer} >
                    <Text style={styles.label} >Cidade: </Text>
                    <Text style={styles.desc} >{person.endereco.cidade}</Text>
                </View>
            </View>

            <ButtonIcon style={{ position: 'absolute', right: 0, top: 5 }} name='edit' onPress={props.onPressEdit} loading={false} />
            <ButtonIcon style={{ position: 'absolute', right: 0, top: 35 }} name='delete' onPress={props.onPressDelete} loading={false} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: '#ccc',
        marginVertical: 15,
        borderRadius: 5,

        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottom: {
        marginTop: 20,
        flexDirection: 'row'
    },
    columnContainer: {
        flexDirection: 'row',
        width: '50%',
    },
    label: {
        color: '#808080',
        fontSize: 12,
    },
    desc: {
        color: colors.sgray,
        fontSize: 12,
        fontWeight: 'bold'
    },
    textContainer: {
        marginLeft: 10
    },
    name: {
        color: colors.sgray,
        fontWeight: 'bold'
    },
    email: {
        color: '#808080',
        fontSize: 12,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
    },
})

export default PersonItem