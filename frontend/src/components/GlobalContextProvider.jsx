import { jwtDecode } from "jwt-decode";
import GlobalContext from "./GlobalContext";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userMe } from "../Services/ApiFetching/userApiFetch";
import Cookies from "js-cookie";

const backendHost = "https://gullak-znz5.onrender.com/api/v1";

function GlobalContextProvider({ children }) {
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

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        getUpdateCookieData,
        setIsLoggedIn,
        setJwt,
        userName: currentUser?.name,
        loggedInUser,
        backendHost,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
