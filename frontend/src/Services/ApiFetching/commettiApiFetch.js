import axios from "axios";
import { backendHost } from "../helperFunctions";

const backendAPI = backendHost();

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const getAllCommettis = async function ({ queryKey }) {
  try {
    // const [, { status }] = queryKey;

    const response = await axios.get(
      `${backendAPI}api/v1/commetti`,
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
      `${backendAPI}api/v1/commetti/get-commettis-with-participants`,
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
      `${backendAPI}api/v1/commetti`,
      data,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteCommetti = (id) => {
  try {
    const response = axios.delete(
      `${backendAPI}api/v1/commetti/${id}`,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
