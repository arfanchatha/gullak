import axios from "axios";

import { backendHost } from "../helperFunctions";

const backendAPI = backendHost();
const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const postTransaction = async (data) => {
  try {
    const { commetti, ...bodyData } = data;

    const response = await axios.post(
      `${backendAPI}api/v1/commetti/${commetti}/transactions`,
      bodyData,
      cookieResponse
    );
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};

export const getTransactionsInProgress = async () => {
  try {
    const response = await axios.get(
      `${backendAPI}api/v1/transactions`,
      cookieResponse
    );
    return response;
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};

export const getCommettiTransactionsStats = async ({ queryKey }) => {
  try {
    const [, { id }] = queryKey;
    const response = await axios(
      `${backendAPI}api/v1/transactions/stats/${id}`,
      cookieResponse
    );

    return response;
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};
