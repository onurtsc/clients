import React from 'react'
import { View, Image } from 'react-native'

export type Props = {
    name: string;
};

const CustomIcon: React.FC<Props> = (props) => {

    const width = 20

    const iconObject = icons.find(ic => ic.name === props.name)

    return (
        <View style={{ paddingHorizontal: 10 }} >
            <Image
                style={{
                    width: width,
                    height: width,
                    resizeMode: 'cover',
                }}
                source={iconObject?.link}
            />
        </View>
    )
}

const icons = [
    { name: 'menu', link: require('../../assets/icons/menu.png')},
    { name: 'group', link: require('../../assets/icons/group.png')},
    { name: 'add', link: require('../../assets/icons/add.png')},
    { name: 'logout', link: require('../../assets/icons/logout.png')},
    { name: 'search', link: require('../../assets/icons/search.png')},

]

export default CustomIcon