import axios from "axios";

const base_url = "https://ac2d-103-171-161-131.ngrok-free.app";

async function login(input) {
  try {
    const {data} = await axios({
      method: "POST",
      url: `${base_url}/users/login`,
      data: input
    });
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

export default login;