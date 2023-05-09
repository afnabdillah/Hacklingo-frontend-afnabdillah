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
// import GlobalContext from "../context/Context";
// import { pickImage, askForPermission, uploadImage } from "../utils";
// import { auth, db } from "../firebase";
// import { updateProfile } from "@firebase/auth";
// import { doc, setDoc } from "@firebase/firestore";
import { fetchUserDetails } from "../stores/usersSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
    // const selectImage = async () => {
    //     try {
    //         let result = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.All,
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             quality: 1,
    //         });
    //         if (!result.canceled) {
    //             const formData = new FormData();
    //             formData.append('file', {
    //                 uri: Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri,
    //                 type: 'image/jpeg',
    //                 name: 'photo.jpg',
    //             });
    //             const response = await fetch('https://example.com/upload-image', {
    //                 method: 'POST',
    //                 body: formData,
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             });
    //             console.log(response);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    // const [displayName, setDisplayName] = useState("");
    // const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch()
    const userDetail = useSelector(state => state.usersReducer.userDetails)
    useEffect(() => {
        dispatch(fetchUserDetails())
            .unwrap()
            .catch((err) => console.log(err))
    }, [])

    console.log(userDetail.username, ">>>>>>>>>>>>>>>>>>>>");
    // const [permissionStatus, setPermissionStatus] = useState(null);
    // const navigation = useNavigation();
    // useEffect(() => {
    //     (async () => {
    //         const status = await askForPermission();
    //         setPermissionStatus(status);
    //     })();
    // }, []);

    // const {
    //     theme: { colors },
    // } = useContext(GlobalContext);

    // async function handlePress() {
    //     const user = auth.currentUser;
    //     let photoURL;
    //     if (selectedImage) {
    //         const { url } = await uploadImage(
    //             selectedImage,
    //             `images/${user.uid}`,
    //             "profilePicture"
    //         );
    //         photoURL = url;
    //     }
    //     const userData = {
    //         displayName,
    //         email: user.email,
    //     };
    //     if (photoURL) {
    //         userData.photoURL = photoURL;
    //     }

    //     await Promise.all([
    //         updateProfile(user, userData),
    //         setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
    //     ]);
    //     navigation.navigate("home");
    // }

    // async function handleProfilePicture() {
    //     const result = await pickImage();
    //     if (!result.cancelled) {
    //         setSelectedImage(result.uri);
    //     }
    // }

    // if (!permissionStatus) {
    //     return <Text>Loading</Text>;
    // }
    // if (permissionStatus !== "granted") {
    //     return <Text>You need to allow this permission</Text>;
    // }
    return (
        <React.Fragment>
            <StatusBar style="auto" />
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    paddingTop: Constants.statusBarHeight + 20,
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
                    //   onPress={handleProfilePicture}
                    // onPress={selectImage}
                    style={{
                        marginTop: 30,
                        borderRadius: 120,
                        width: 120,
                        height: 120,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >


                    <MaterialCommunityIcons
                        name="camera-plus"
                        size={45}
                    />



                </TouchableOpacity>
                <TextInput
                    placeholder="Type your name"
                    // value={displayName}
                    // onChangeText={setDisplayName}
                    style={{
                        borderBottomColor: 'red',
                        marginTop: 40,
                        borderBottomWidth: 2,
                        width: "100%",
                    }}
                />
                <View style={{ marginTop: "auto", width: 80 }}>
                    <Button
                        title="Next"
                    // color={colors.secondary}
                    // onPress={handlePress}
                    // disabled={!displayName}
                    />
                </View>
            </View>
        </React.Fragment>
    );
}