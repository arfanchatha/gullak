import axios from "axios";

const backendHost = "https://gullak-znz5.onrender.com/api/v1";

const cookieResponse = {
  withCredentials: true,
  // credentials: "include",
};

export const loginUser = async function (data) {
  try {
    const response = await axios.post(
      `${backendHost}/users/login`,
      data,
      cookieResponse
    );

    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err?.response?.data.message);
  }
};

export const logout = async function () {
  try {
    const response = await axios.get(
      `${backendHost}/users/logout`,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err?.response.data.message);
  }
};

export const signUpUser = async function (data) {
  try {
    const response = await axios.post(
      `${backendHost}/users/signup`,
      data,
      cookieResponse
    );

    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};

export const userMe = async function (data) {
  try {
    const response = await axios.get(`${backendHost}/users/me`, cookieResponse);

    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};

export const getAdminAssistants = async () => {
  try {
    const response = await axios.get(`${backendHost}/users`, cookieResponse);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err.response?.data.message);
  }
};
