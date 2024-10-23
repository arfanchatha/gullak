import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalContextProps } from "../../hooks/useGlobalContextProps";
import { addMember } from "../../Services/ApiFetching/memberApiFetch";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorInForm from "../../UI/ErrorInForm";
import toast from "react-hot-toast";
import { FormSubmitButton, InputFieldSingle } from "../../UI/FormComponents";

function AddMember({ handleClose, autoCloseModal }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: addMember,
    onSuccess: (data) => {
      toast.success(`Member created successfuly`);
      queryClient.invalidateQueries("getMembersList");
      reset();
      autoCloseModal && handleClose();
    },
    onError: () => {},
  });

  const [passwordShow, setPasswordShow] = useState(false);

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="w-80 md:w-180 mt-5 mx-auto">
      <form
        action=""
        className="flex flex-col space-y-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputFieldSingle
          label="Name"
          type="text"
          field="name"
          register={register}
          validation={{
            required: "Confirm password is required",
          }}
        />
        <InputFieldSingle
          label="Mobile"
          type="text"
          field="mobile"
          register={register}
          validation={{
            required: "Confirm password is required",
          }}
        />
        <InputFieldSingle
          label="CNIC"
          type="text"
          field="cnic"
          register={register}
          validation={{
            required: "Confirm password is required",
          }}
        />

        <FormSubmitButton
          label="Submit"
          pendingLabel="Submitting..."
          isPending={isPending}
        />
      </form>
      {error && <ErrorInForm message={error?.message} />}
    </div>
  );
}

export default AddMember;
