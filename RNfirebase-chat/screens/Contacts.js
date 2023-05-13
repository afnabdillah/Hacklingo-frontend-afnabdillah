import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByNativeLanguage } from "../stores/usersSlice";
import showToast from "../helper/showToast";

function Contacts({ navigation }) {
  const dispatch = useDispatch();

  const usersBySearch = useSelector(
    (state) => state.usersReducer.usersBySearch
  );
  const usersByNativeLanguage = useSelector(
    (state) => state.usersReducer.users
  );
  const userId = useSelector((state) => state.authReducer.userId);
  const userEmail = useSelector((state) => state.authReducer.email);
  const targetLanguage = useSelector(
    (state) => state.authReducer.targetLanguage
  );
  const contactsList = usersBySearch.filter((user) => user._id !== userId);
  const contactsListByNativeLanguage = usersByNativeLanguage.filter(
    (user) => user._id !== userId
  );

  useEffect(() => {
    dispatch(fetchUsersByNativeLanguage(targetLanguage))
    .unwrap()
    .catch((err) => showToast("error", "Fetch Data Error", err.message));
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: "white" }}
    >
      {/* Kalau merge ambil yang ini guys */}
      {contactsList.length !== 0 && (
        <View>
          <Text style={styles.sectionTitle}>Users By Search</Text>
        </View>
      )}
      {contactsList.length !== 0 &&
        contactsList.map((contact) => {
          return (
            <View key={contact._id}>
              <TouchableOpacity
                style={styles.container}
                onPress={async () => {
                  navigation.navigate("Chat", {
                    recipientEmail: contact.email,
                    recipientName: contact.username,
                    senderEmail: userEmail,
                  });
                }}
              >
                <Image
                  source={{
                    uri: contact.profileImageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
                  }}
                  style={styles.image}
                />
                <View style={styles.content}>
                  <Text numberOfLines={1} style={styles.name}>
                    {contact.username}
                  </Text>
                  <Text numberOfLines={2} style={styles.subTitle}>
                    {contact.email}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      <View>
        <Text style={styles.sectionTitle}>
          Users You Might Be Interested In
        </Text>
      </View>
      {contactsListByNativeLanguage.map((contact) => {
        return (
          <View key={contact._id}>
            <TouchableOpacity
              style={styles.container}
              onPress={async () => {
                navigation.navigate("Chat", {
                  recipientEmail: contact.email,
                  recipientName: contact.username,
                  senderEmail: userEmail,
                });
              }}
            >
              <Image
                source={{
                  uri: contact.profileImageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLfl1C7sB_LM02ks6yyeDPX5hrIKlTBHpQA",
                }}
                style={styles.image}
              />
              <Text>{contactsList.profileImageUrl}</Text>
              <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>
                  {contact.username}
                </Text>
                <Text numberOfLines={2} style={styles.subTitle}>
                  {contact.email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 20,
    fontStyle: "italic",
  },

  content: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
    paddingBottom: 5,
  },

  subTitle: {
    color: "gray",
    fontStyle: "italic",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
  },
});

export default Contacts;
