import axios from "axios";
import Cookies from "js-cookie";

const backendHost = "https://gullak-znz5.onrender.com/api/v1";

const api = axios.create({
  baseURL: { backendHost },
  headers: {
    "Content-Type": "application/json",
  },
});

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const loginUser = async function (data) {
  try {
    const response = await axios.post(`${backendHost}/users/login`, data);

    Cookies.set("access_token", response.token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (err) {
    throw new Error(err?.response?.data.message);
  }
};

export const logout = async function () {
  try {
    const response = await axios.get(`${backendHost}/users/logout`);

    Cookies.set("access_token", response.token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    });
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
