import axios from "axios";
import Cookies from "js-cookie";

import { backendHost } from "../helperFunctions";

const backendAPI = backendHost();

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

let cookieOptions;

if (import.meta.env.VITE_NODE_ENV === "development") {
  cookieOptions = {
    expires: 5,
    secure: false,
    path: "/",
  };
} else if (import.meta.env.VITE_NODE_ENV === "production") {
  cookieOptions = {
    expires: 5,
    secure: true,
    sameSite: "None",
    path: "/",
    domain: import.meta.env.VITE_DOMAIN,
  };
}

export const loginUser = async function (data) {
  try {
    const response = await axios.post(
      `${backendAPI}api/v1/users/login`,
      data,
      cookieResponse
    );

    Cookies.set("jwt", response?.data.token, cookieOptions);

    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err?.response?.data.message);
  }
};

export const signUpUser = async function (data) {
  try {
    const response = await axios.post(
      `${backendAPI}api/v1/users/signup`,
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
    const response = await axios.get(`${backendAPI}/users/me`, cookieResponse);

    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};

export const getAdminAssistants = async () => {
  try {
    const response = await axios.get(
      `${backendAPI}api/v1/users`,
      cookieResponse
    );
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err.response?.data.message);
  }
};
