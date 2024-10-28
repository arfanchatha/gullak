import { getCookie } from "../Services/helperFunctions";
import { jwtDecode } from "jwt-decode";
import GlobalContext from "./GlobalContext";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userMe } from "../Services/ApiFetching/userApiFetch";
import Cookies from "js-cookie";
import {
  deleteCommetti,
  getAllCommettis,
} from "../Services/ApiFetching/commettiApiFetch";
import toast from "react-hot-toast";

function GlobalContextProvider({ children }) {
  const queryClient = useQueryClient();
  const [jwt, setJwt] = useState(Cookies.get("jwt"));
  const {
    data: user,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: userMe,
    enabled: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const currentUser = user?.data.data.user || isLoggedIn?.id;

  const loggedInUser = isLoggedIn?.id;

  useEffect(
    function () {
      if (jwt) {
        setIsLoggedIn(jwtDecode(jwt));
      }
      if (jwt && isLoggedIn) {
        refetch();
      }
    },
    [jwt]
  );

  const getUpdateCookieData = (cookieData) => {
    setIsLoggedIn(jwtDecode(cookieData));
  };

  const fetchCommApi = loggedInUser ? true : false;
  const queryAllCommettis = useQuery({
    queryKey: ["getAllCommettis"],
    queryFn: getAllCommettis,
    enabled: fetchCommApi,
  });

  const { mutate: deleteCommettiMutate } = useMutation({
    mutationFn: deleteCommetti,
    onSuccess: () => {
      toast.success("Commetti deleted");
      queryClient.invalidateQueries("getAllCommettis");
    },
  });

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        getUpdateCookieData,
        setIsLoggedIn,
        setJwt,
        userName: currentUser?.name,
        loggedInUser,
        queryAllCommettis,
        deleteCommettiMutate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
