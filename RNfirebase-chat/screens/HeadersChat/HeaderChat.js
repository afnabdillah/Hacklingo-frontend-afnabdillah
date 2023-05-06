import { Searchbar } from "react-native-paper";
import { signOut } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { MaterialIcons, AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { Image } from "react-native";
import logo from '../../assets/HACKLINGO.png'
import { StyleSheet } from "react-native";
import { PopMenu } from "./PopMenu";

export function HeaderChat() {
    const navigation = useNavigation()
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', marginRight: 10, marginLeft: 10 }}>
                        <PopMenu />
                    </View>
                    <View style={{ flex: 1, marginRight: 10, marginTop: 5, marginBottom: 5, flexDirection: 'row' }}>
                        <Searchbar placeholder="Search" style={{ flex: 1, width: 70 }} />
                    </View>
                    <Image source={logo} style={styles.image} />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 10
    }
})