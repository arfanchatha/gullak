import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { loginUser } from "../Services/ApiFetching/userApiFetch";
import ErrorInForm from "../UI/ErrorInForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGlobalContextProps } from "../hooks/useGlobalContextProps";
import { getCookie } from "../Services/helperFunctions";
import {
  FormSubmitButton,
  InputFieldPassword,
  InputFieldSingle,
} from "../UI/FormComponents";
import Cookies from "js-cookie";

function Login({ handleSignUpModal, handleClose }) {
  const navigate = useNavigate();

  const { getUpdateCookieData } = useGlobalContextProps();
  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Cookies.set("jwt", data?.data.token, {
        // httpOnly: true,
        secure: true,
        sameSite: "None",
        // path: "/",
        expires: 5,
      });

      if (data?.status === 200) {
        getUpdateCookieData(Cookies.get("jwt"));
        toast.success(`Logged in successfuly`);
        navigate("/adminarea");
        handleClose();
      }
    },
    onError: () => {},
  });

  const { register, handleSubmit } = useForm();

  const [passwordShow, setPasswordShow] = useState(false);

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="w-80 md:w-180 mt-5 space-y-5">
      <form
        action=""
        className="flex flex-col space-y-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputFieldSingle
          label="Email"
          field="email"
          type="email"
          placeholder="name@company.com"
          register={register}
          required="This field is required"
          validation={{
            required: "Confirm password is required",
          }}
        />

        <InputFieldPassword
          register={register}
          required="This field is required"
          label="Password"
          field="password"
          type="password"
        />

        <FormSubmitButton
          label="Log in to your account"
          pendingLabel="Loging in..."
        />
      </form>

      <div className="items-center flex flex-row-reverse justify-between text-sm">
        <a
          href="#"
          className="  border-b border-opacity-0 hover:border-opacity-100 text-blue-600 border-blue-600 "
        >
          Forgot Password
        </a>
        <div className=" text-gray-600 ">
          <span>Not registered? </span>
          <button
            className=" border-b border-opacity-0 hover:border-opacity-100 text-blue-600 border-blue-600 "
            onClick={handleSignUpModal}
          >
            Create account
          </button>
        </div>
      </div>
      {error && <ErrorInForm message={error?.message} />}
    </div>
  );
}

export default Login;
