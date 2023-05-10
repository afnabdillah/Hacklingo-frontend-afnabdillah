import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Button,
} from "react-native";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { fetchUserDetails, updateUserDetails } from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import pickImage from "../helper/imagePicker";
import * as FileSystem from 'expo-file-system';

export default function Profile() {
    const [displayName, setDisplayName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageData, setSelectedImageData] = useState({})
    const dispatch = useDispatch()
    const userDetail = useSelector(state => state.usersReducer.userDetails)
    const navigation = useNavigation()

    function handlePress() {
        const formData = new FormData();
        formData.append("file", selectedImageData);
        formData.append("username", displayName);
        dispatch(updateUserDetails(formData));
        navigation.navigate('Home');
    }
    useEffect(() => {
        dispatch(fetchUserDetails())
            .unwrap()
            .then((data) => {
                setDisplayName(data.username)
                setSelectedImage(data.profileImageUrl)
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <React.Fragment>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    padding: 20,
                }}
            >
                <Text style={{ fontSize: 22 }}>
                    Profile Info
                </Text>
                <Text style={{ fontSize: 14, marginTop: 20 }}>
                    Please provide your name and an optional profile photo
                </Text>
                <TouchableOpacity
                    onPress={() => pickImage().then((imagedata) => {
                        setSelectedImage(imagedata.uri)
                        setSelectedImageData(imagedata)
                    })}
                    style={{
                        marginTop: 30,
                        borderRadius: 120,
                        width: 120,
                        height: 120,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >


                    {!userDetail.profileImageUrl ? (
                        <MaterialCommunityIcons
                            name="camera-plus"
                            color={'grey'}
                            size={45}
                        />
                    ) : (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: "100%", height: "100%", borderRadius: 120 }}
                        />
                    )}



                </TouchableOpacity>
                <TextInput
                    placeholder="Type your name"
                    value={displayName}
                    onChangeText={text => setDisplayName(text)}
                    style={{
                        borderBottomColor: 'red',
                        marginTop: 40,
                        borderBottomWidth: 2,
                        width: "100%",
                    }}
                />
                <View style={{ marginTop: 50, width: 80 }}>
                    <Button
                        title="Update"
                        // color={colors.secondary}
                        onPress={handlePress}
                    // disabled={!displayName}
                    />
                </View>
            </View>
        </React.Fragment >
    );
}