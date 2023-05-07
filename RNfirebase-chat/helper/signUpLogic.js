import axios from "axios";

const base_url = "https://ac2d-103-171-161-131.ngrok-free.app";

const nativeLanguage = "Indonesian/Bahasa Indonesia";
const targetLanguage = ["Indonesian/Bahasa Indonesia", "English"];
const role = "regular";

async function signUp(input) {
  try {
    const {data} = await axios({
      method: "POST",
      url: `${base_url}/users/register`,
      data: {
        ...input,
        nativeLanguage,
        targetLanguage,
        role
      }
    });
    console.log(data);
    return {
      data,
      isSuccess: true 
    }
  } catch(err) {
    return {
      errMessage: err.response.data.message,
      isSuccess: false
    }
  }
}

export default signUp;