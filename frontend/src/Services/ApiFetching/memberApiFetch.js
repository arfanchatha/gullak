import axios from "axios";

const backendHost = "http://127.0.0.1:3005/api/v1";
const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const searchMember = async function (formData) {
  try {
    const { mobile, cnic } = formData;

    const response = await axios.get(
      `${backendHost}/transactions/find-participant-with-commetti/${mobile}/${cnic}`
    );
    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};

export const addMember = async (data) => {
  try {
    const response = await axios.post(
      `${backendHost}/participants`,
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
      `${backendHost}/participants/onlyparticipants`,
      cookieResponse
    );

    return response;
  } catch (err) {
    throw new Error(err.response?.data.message);
  }
};