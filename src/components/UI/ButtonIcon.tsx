import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

export type Props = {
    name: string;
    onPress: () => void
    style: object
  };

const ButtonIcon: React.FC<Props> = (props) => {

    const width = 20

    return (
        <TouchableOpacity style={{paddingHorizontal: 10, ...props.style}} onPress={props.onPress} >
            <Image
                style={{
                    width: width,
                    height: width,
                    resizeMode: 'cover'
                }}
                source={icons[props.name]}
            />
        </TouchableOpacity>
    )
}

const icons = {
    menu: require('../../assets/icons/menu.png'),
    group: require('../../assets/icons/group.png'),
    add: require('../../assets/icons/add.png'),
    edit: require('../../assets/icons/edit.png'),
    delete: require('../../assets/icons/delete.png'),
    back: require('../../assets/icons/back.png'),

}

export default ButtonIcon