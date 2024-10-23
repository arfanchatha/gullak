import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { signUpUser } from "../Services/ApiFetching/userApiFetch";

import ErrorInForm from "../UI/ErrorInForm";
import toast from "react-hot-toast";
import { useGlobalContextProps } from "../hooks/useGlobalContextProps";
import {
  FormSubmitButton,
  InputFieldPassword,
  InputFieldSingle,
} from "../UI/FormComponents";

function SignUp({ handleLoginModal, handleClose, autoCloseModal }) {
  const queryClient = useQueryClient();
  const { loggedInUser } = useGlobalContextProps();
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("Account successfuly created");
      loggedInUser && queryClient.invalidateQueries("getAdminAssistants");
      reset();
      loggedInUser ? autoCloseModal && handleClose() : handleLoginModal();
    },
  });

  const { errors } = formState;

  const [passwordShow, setPasswordShow] = useState(false);
  const handlePasswordShow = () => {
    setPasswordShow((open) => !open);
  };

  const onSubmit = (data) => {
    if (loggedInUser.role === "admin") {
      mutate({ ...data, admin: loggedInUser.id });
    } else {
      mutate(data);
    }
  };

  const onError = (errors) => {
    // console.log(errors);
  };

  return (
    <div className="w-80 md:w-180 mt-3 mx-auto">
      <form
        action=""
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="flex justify-between space-y-3 md:space-y-0 md:space-x-3 w-full flex-col md:flex-row">
          <div className="md:w-1/2">
            <InputFieldSingle
              label={"Name"}
              field={"name"}
              type={"text"}
              register={register}
              required="This field is required"
            />
          </div>
          <div className="md:w-1/2">
            <InputFieldSingle
              label="Email"
              field="email"
              type="email"
              placeholder="name@company.com"
              register={register}
              required="This field is required"
            />
          </div>
        </div>
        <div className="flex justify-between space-y-3 md:space-y-0 md:space-x-3 w-full flex-col md:flex-row">
          <div className="md:w-1/2">
            <InputFieldPassword
              label="Password"
              field="password"
              type="password"
              placeholder={""}
              register={register}
              handlePasswordShow={handlePasswordShow}
              passwordShow={passwordShow}
              validation={{
                required: "Confirm password is required",
                minLength: 4 || "Password must be more than 4 characters",
              }}
            />
          </div>
          <div className="md:w-1/2">
            <InputFieldPassword
              label={"Password confirm"}
              field="passwordConfirm"
              type="password"
              placeholder="Re-enter password"
              register={register}
              required="This field is required"
              handlePasswordShow={handlePasswordShow}
              passwordShow={passwordShow}
              validation={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              }}
            />
          </div>
        </div>

        {loggedInUser && (
          <InputFieldSingle
            label="Role"
            field="role"
            type="text"
            placeholder="user role"
            register={register}
            required="This field is required"
            value="assistant"
          />
        )}

        <FormSubmitButton
          label="Submit"
          pendingLabel="Submitting"
          isPending={isPending}
          type="submit"
        />

        {loggedInUser ? (
          ""
        ) : (
          <div className=" text-gray-600 text-md space-x-2">
            <span>Already registered?</span>
            <button
              className="  border-b border-opacity-0 hover:border-opacity-100 text-blue-600 border-blue-600 text-md"
              onClick={handleLoginModal}
              disabled={isPending}
            >
              Login here
            </button>
          </div>
        )}
      </form>
      {error?.message && <ErrorInForm message={error?.message} />}
    </div>
  );
}

export default SignUp;
