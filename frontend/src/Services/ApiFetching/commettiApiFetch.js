import axios from "axios";

const backendHost = "http://127.0.0.1:3005/api/v1";
const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const getAllCommettis = function () {
  try {
    const response = axios.get(
      `${backendHost}/commetti?status=inProgress`,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err?.message);
  }
};
export const getCommettiWithMembers = function () {
  try {
    const response = axios.get(
      `${backendHost}/commetti/get-commettis-with-participants`,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err?.message);
  }
};
export const createCommetti = function (data) {
  try {
    const response = axios.post(
      `${backendHost}/commetti`,
      data,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
