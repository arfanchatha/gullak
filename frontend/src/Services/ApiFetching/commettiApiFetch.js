import axios from "axios";

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};
const backendHost = "https://api.gullak.mildcoders.com/api/v1";

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
