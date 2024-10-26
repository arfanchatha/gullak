import { useState } from "react";
import DarkMode from "../UI/DarkMode";
import Modal from "./Modal";
import Login from "./Login";
import SignUp from "./SignUp";
import { NavLink, useNavigate } from "react-router-dom";
import { useGlobalContextProps } from "../hooks/useGlobalContextProps";
import Cookies from "js-cookie";

import toast from "react-hot-toast";

const modalInitialState = {
  signin: false,
  signup: false,
};

function NavBar() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setJwt } = useGlobalContextProps();

  const { isLoggedIn, userName } = useGlobalContextProps();

  const cookieNotExp =
    isLoggedIn?.exp > Math.round(new Date().getTime() / 1000);

  const [modals, setModals] = useState(modalInitialState);

  const handleModal = (type) => {
    setModals({ ...modalInitialState, [type]: true });
  };

  const handleClose = () => {
    setModals({
      signin: false,
      signup: false,
    });
  };

  const logoutUser = () => {
    Cookies.remove("jwt");
    setIsLoggedIn(null);
    setJwt(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <div className="relative container mx-auto p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-14 md:space-y-0">
          <NavLink className="group" to="/">
            <img
              src="./logo-1.png"
              alt=" gullak logo"
              className="h-12 hover:scale-105 hover:pointer transition duration-300"
            />
          </NavLink>
          <div className=" flex space-x-8 md:space-x-12 font-bold items-center">
            {isLoggedIn && cookieNotExp ? (
              <>
                <NavLink
                  to="/adminarea"
                  className="text-grayishViolet hover:text-veryDarkViolet hover:cursor-pointer"
                >
                  Admin Dashboard
                </NavLink>
                <a className="text-cyan hover:text-cyanLight">
                  Welcome! {userName}
                </a>
                <NavLink
                  onClick={() => logoutUser()}
                  to="/"
                  className="btn-home hover:cursor-pointer"
                >
                  Log Out
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  onClick={() => handleModal("signin")}
                  className="text-grayishViolet hover:text-veryDarkViolet hover:cursor-pointer"
                >
                  Sign In
                </NavLink>
                <NavLink
                  onClick={() => handleModal("signup")}
                  className="btn-home hover:cursor-pointer"
                >
                  Sign Up
                </NavLink>
              </>
            )}
            <DarkMode />
          </div>
        </div>
      </div>
      <Modal
        isOpen={modals.signin}
        handleClose={handleClose}
        title="Please enter the details to login"
        displayCheck={false}
      >
        <Login
          handleSignUpModal={() => handleModal("signup")}
          handleClose={handleClose}
        />
      </Modal>
      <Modal
        isOpen={modals.signup}
        handleClose={handleClose}
        title="Please enter the details to signup"
        displayCheck={false}
      >
        <SignUp
          handleLoginModal={() => handleModal("signin")}
          handleClose={handleClose}
        />
      </Modal>
    </>
  );
}

export default NavBar;
