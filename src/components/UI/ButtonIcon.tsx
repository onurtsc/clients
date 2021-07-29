import React from 'react'
import { TouchableOpacity, Image, View, ActivityIndicator } from 'react-native'
import colors from '../../constants/colors';

export type Props = {
    name: string;
    onPress: () => void
    style: object
    loading: boolean
  };

const ButtonIcon: React.FC<Props> = (props) => {

    const width = 20

    const iconObject = icons.find(ic => ic.name === props.name)

    if(props.loading) {
        <View style={{paddingHorizontal: 10, ...props.style}}>
            <ActivityIndicator size='small' color={colors.primary} />
        </View>
    }

    return (
        <TouchableOpacity style={{paddingHorizontal: 10, ...props.style}} onPress={props.onPress} >
            <Image
                style={{
                    width: width,
                    height: width,
                    resizeMode: 'cover'
                }}
                // source={icons[props.name]}
                source={iconObject?.link}
            />
        </TouchableOpacity>
    )
}

const icons = [
    { name: 'menu', link: require('../../assets/icons/menu.png') },
    { name: 'group', link: require('../../assets/icons/group.png') },
    { name: 'add', link: require('../../assets/icons/add.png'), },
    { name: 'edit', link: require('../../assets/icons/edit.png') },
    { name: 'delete', link: require('../../assets/icons/delete.png') },
    { name: 'back', link: require('../../assets/icons/back.png') },
    { name: 'logout', link: require('../../assets/icons/logout.png') },
    { name: 'check', link: require('../../assets/icons/check.png') },

]

export default ButtonIcon