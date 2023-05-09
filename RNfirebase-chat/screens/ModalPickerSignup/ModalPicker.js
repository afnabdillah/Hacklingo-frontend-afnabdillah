import React from "react";
import {
    StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView 
} from 'react-native'

const OPTION = ['English', 'Indonesia', 'Jepang']
const WIDTH = Dimensions.get('window').width 
const HEIGHT = Dimensions.get('window').height 
const ModalPicker = (props) => { 
    const onPressItem = (option ) => {
        props.changeModalVisibility(false)
        props.setData(option)
    }
    const option = OPTION.map((item, index) => {
        return (
            <TouchableOpacity
                style={Styles.option}
                key={index}
                onPress={()=> onPressItem(item)}
            >
                <Text Style={Styles.text}>
                    {item}
                </Text>

            </TouchableOpacity>
        )
    })
    return (
        <TouchableOpacity
            onPress={() => props.changeModalVisibility(false)}
            style={Styles.container}
        >
            <View style={[Styles.modal,{width: WIDTH - 150, height: HEIGHT/8}]}>
                <ScrollView>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderBottomWidth: 1,
        bottom: -150,
        // justifyContent: 'center',

    },
    option: {
        alignItems: 'center',
        margin: 8,

    }

})

export {ModalPicker}