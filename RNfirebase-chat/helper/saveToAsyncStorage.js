import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveToAsyncStorage(data) {
  try {
    const storageItems = [
      ["username", data.username],
      ["email", data.email],
      ["userid", data._id],
      ["profileimageurl", data.profileImageUrl || ""],
      ["nativelanguage", data.nativeLanguage],
      ["targetlanguage", JSON.stringify(data.targetLanguage)],
      ["role", data.role],
      ["devicetoken", data.deviceToken]
    ] 
    await AsyncStorage.multiSet(storageItems);
  } catch(err) {
    console.log(err, "<<< ini eror async storage");
  }
}

export default saveToAsyncStorage;