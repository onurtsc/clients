import React from 'react'
import { TouchableOpacity, View, Image } from 'react-native'

export type Props = {
    name: string;
};

const CustomIcon: React.FC<Props> = (props) => {

    const width = 20

    return (
        <View style={{ paddingHorizontal: 10 }} >
            <Image
                style={{
                    width: width,
                    height: width,
                    resizeMode: 'cover',
                }}
                source={icons[props.name]}
            />
        </View>
    )
}

const icons = {
    menu: require('../../assets/icons/menu.png'),
    group: require('../../assets/icons/group.png'),
    add: require('../../assets/icons/add.png'),
    logout: require('../../assets/icons/logout.png'),
    search: require('../../assets/icons/search.png'),

}

export default CustomIcon