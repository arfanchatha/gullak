import axios from "axios";

const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};
const backendHost = "https://api.gullak.mildcoders.com/api/v1";

export const postTransaction = async (data) => {
  try {
    const { commetti, ...bodyData } = data;
    console.log(commetti);

    const response = await axios.post(
      `${backendHost}/commetti/${commetti}/transactions`,
      bodyData,
      cookieResponse
    );
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};
