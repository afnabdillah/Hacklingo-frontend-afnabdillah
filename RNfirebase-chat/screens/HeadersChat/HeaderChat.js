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
import { SearchChat } from "../../components/SearchChat";


export function HeaderChat() {
    const navigation = useNavigation()
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: "white" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'white' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', marginRight: 10, marginLeft: 10 }}>
                            <PopMenu />
                        </View>
                        <View style={{ flex: 1, marginRight: 10, marginTop: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <SearchChat />
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
            marginRight: 10
    }
})