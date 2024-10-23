import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ErrorInForm from "../../UI/ErrorInForm";
import toast from "react-hot-toast";

import { FormSubmitButton, InputFieldSingle } from "../../UI/FormComponents";
import { createCommetti } from "../../Services/ApiFetching/commettiApiFetch";

import { getMembers } from "../../Services/ApiFetching/memberApiFetch";
import MultiSelect from "./MultiSelect";
import { getAdminAssistants } from "../../Services/ApiFetching/userApiFetch";

function CreateCommetti({ handleClose, isOpen, autoCloseModal }) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedAssistans, setSelectedAssistans] = useState([]);

  const { register, handleSubmit, reset } = useForm();
  const {
    mutate: createNewCommetti,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createCommetti,
    onSuccess: (data) => {
      toast.success(`Commetti successfuly created`);
      reset();
      autoCloseModal && handleClose();
    },
    onError: (err) => {},
  });

  // memmbers fetch

  const {
    data,
    error: getMemmbersError,
    isPending: membersLoading,
    refetch,
  } = useQuery({
    queryKey: ["getMember"],
    queryFn: getMembers,
    enabled: false,
  });

  // assistant fetch

  const {
    data: assistants,
    error: AssistantError,
    isPending: assistantPending,
    refetch: refetchAssistant,
  } = useQuery({
    queryKey: ["assistants"],
    queryFn: getAdminAssistants,
    enabled: false,
  });

  useEffect(
    function () {
      if (isOpen) {
        refetch();
        refetchAssistant();
      }
    },
    [isOpen]
  );

  const members = data?.data?.data.participants;
  const assistantsData = assistants?.data?.data.users;

  const handleMembersSelectionChange = (selectedItems) => {
    setSelectedMembers(
      selectedItems.map((item) => {
        return item.id;
      })
    );
  };
  const handleAssistantsSelectionChange = (selectedItems) => {
    setSelectedAssistans(
      selectedItems.map((item) => {
        return item.id;
      })
    );
  };

  const onSubmit = (data) => {
    createNewCommetti({
      ...data,
      participant: selectedMembers,
      user: selectedAssistans,
    });
  };

  return (
    <div className="w-96 md:w-180 mt-5 mx-auto">
      <div className="space-y-5 mb-5">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">
            Please select the members of the commetti
          </label>
          <div className="">
            <MultiSelect
              data={members}
              onSelectionChange={handleMembersSelectionChange}
              fieldPlaceholder="click here to select members"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-600">
            Please select assistant of the admin if any
          </label>
          <div className="">
            <MultiSelect
              data={assistantsData}
              onSelectionChange={handleAssistantsSelectionChange}
              fieldPlaceholder="admin assistant"
            />
          </div>
        </div>
      </div>
      <form
        action=""
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between md:space-x-3 w-full">
          <div className="w-1/2">
            <InputFieldSingle
              label="Commetti name"
              type="text"
              field="name"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
            />
          </div>
          <div className="w-1/2">
            <InputFieldSingle
              label="Monthly amount"
              type="number"
              field="monthlyAmount"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
              placeholder="amount"
            />
          </div>
        </div>
        <div className="flex justify-between md:space-x-3 w-full">
          <div className="w-1/2">
            <InputFieldSingle
              label="No. of commettis"
              type="number"
              field="durationMonths"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
              placeholder="number of commettis"
            />
          </div>
          <div className="w-1/2">
            <InputFieldSingle
              label="Starting month"
              type="month"
              field="startMonth"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
            />
          </div>
        </div>

        <FormSubmitButton
          label="Submit"
          type="submit"
          pendingLabel="Submitting..."
          isPending={isPending}
        />
      </form>
      {error && <ErrorInForm message={error?.response?.data.message} />}
    </div>
  );
}

export default CreateCommetti;
