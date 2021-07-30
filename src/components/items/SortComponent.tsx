import React, { useState } from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'
import Colors from '../../constants/colors'
import ButtonIcon from '../UI/ButtonIcon'
import CustomIcon from '../UI/CustomIcon'

interface Props {
    onPress: (val: string) => void;
    headerHeight: number;
};

const SortComponent: React.FC<Props> = props => {
    const [modalVisible, setModalVisible] = useState(false)

    return (
        <View>
            <ButtonIcon style={{ paddingRight: 0 }} name='sort' onPress={() => { setModalVisible(true) }} loading={false} />
            <Modal visible={modalVisible} animationType='fade' transparent={true} >
                <TouchableOpacity onPress={() => { setModalVisible(false) }} activeOpacity={0} style={styles.itemsContainer} >
                    <View style={{ ...styles.container, top: props.headerHeight * 2 }} >
                        <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(false), props.onPress('nome') }} >
                            <Text style={styles.buttonText} >Nome</Text>
                            <CustomIcon name='id' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(false), props.onPress('cpf') }} >
                            <Text style={styles.buttonText} >CPF</Text>
                            <CustomIcon name='numbers' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(false), props.onPress('email') }} >
                            <Text style={styles.buttonText} >E-mail</Text>
                            <CustomIcon name='email' />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    itemsContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1,
    },
    container: {
        zIndex: 2,
        width: 200,
        position: 'absolute',
        right: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 5,

        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    buttonText: {
        color: Colors.tertiary,
        fontWeight: 'bold',
    }
})

export default SortComponent