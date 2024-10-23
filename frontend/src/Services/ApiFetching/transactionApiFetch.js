import axios from "axios";

const backendHost = "https://gullak-znz5.onrender.com/api/v1";
const cookieResponse = {
  withCredentials: true,
  credentials: "include",
};

export const postTransaction = async (data) => {
  try {
    const { commetti, ...bodyData } = data;
    console.log(commetti);

    const response = await axios.post(
      `${backendHost}/commetti/${commetti}/transactions`,
      bodyData,
      {
        withCredentials: true,
        credentials: "include",
      }
    );
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};
