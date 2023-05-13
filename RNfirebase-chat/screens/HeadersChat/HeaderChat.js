import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Image } from "react-native";
import logo from '../../assets/HACKLINGO.png'
import { StyleSheet } from "react-native";
import { PopMenu } from "./PopMenu";
import { SearchChat } from "../../components/SearchChat";


export function HeaderChat() {
    const navigation = useNavigation()
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: "#0097b2" }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', marginRight: 10, marginLeft: 10 }}>
                        <PopMenu />
                    </View>
                    <View style={{ flex: 1, marginRight: 10, marginTop: 5, marginBottom: 5, flexDirection: 'row' }}>
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