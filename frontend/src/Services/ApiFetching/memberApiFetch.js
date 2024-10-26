import axios from "axios";
import { backendHost } from "../helperFunctions";

const backendAPI = backendHost();

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const searchMember = async function (formData) {
  try {
    const { mobile, cnic } = formData;

    const response = await axios.get(
      `${backendAPI}api/v1/transactions/find-participant-with-commetti/${mobile}/${cnic}`
    );
    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};

export const addMember = async (data) => {
  try {
    const response = await axios.post(
      `${backendAPI}api/v1/participants`,
      data,
      cookieResponse
    );
    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};
export const getMembers = async () => {
  try {
    const response = await axios.get(
      `${backendAPI}api/v1/participants/onlyparticipants`,
      cookieResponse
    );

    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};
