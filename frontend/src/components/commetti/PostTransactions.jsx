import { useMutation, useQuery } from "@tanstack/react-query";
import { postTransaction } from "../../Services/ApiFetching/transactionApiFetch";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ErrorInForm from "../../UI/ErrorInForm";
import toast from "react-hot-toast";

import { FormSubmitButton, InputFieldSingle } from "../../UI/FormComponents";
import { removeNullFromObject } from "../../Services/helperFunctions";

function PostTransactions({ handleClose, autoCloseModal, commettisData }) {
  const [paymentAmount, setPaymentAmount] = useState("no");

  const [selectedCommetti, setSelectedCommetti] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const {
    mutate: createTransaction,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: postTransaction,
    onSuccess: (data) => {
      toast.success(`Transaction posted successfuly`);
      reset();
      autoCloseModal && handleClose();
    },
    onError: (err) => {},
  });

  const handleCommettiChange = (e) => {
    setSelectedCommetti(e.target.value);
  };
  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const members = commettisData
    ?.map((commetti) => {
      if (commetti.id === selectedCommetti) {
        return commetti.participant;
      }
      return null;
    })
    .filter((participant) => participant !== null);

  const onSubmit = (data) => {
    const filteredData = removeNullFromObject({
      ...data,
      commetti: selectedCommetti,
      participant: selectedMember,
    });
    if (!filteredData.commetti || !filteredData.participant) return;

    createTransaction(filteredData);
  };

  const handleRadio = (e) => {
    setPaymentAmount(e.target.value);
  };

  return (
    <div className="w-96 md:w-180 mt-5 ">
      <div className="flex flex-col md:flex-row overflow-hidden w-full space-y-4 md:space-y-0 md:space-x-3">
        <div className="flex flex-col md:w-1/2 space-y-2">
          <label
            htmlFor="commetti"
            className="text-sm font-semibold text-gray-600"
          >
            Choose a commetti:
          </label>
          <select
            id="commetti"
            onChange={handleCommettiChange}
            // {...register("commetti", {
            //   required: "This field is required",
            // })}
            className="text-sm text-gray-600 font-semibold p-2 border rounded-md focus:outline-none bg-inherit"
          >
            <option value="">Select the commetti</option>
            {commettisData?.map((commetti) => (
              <option key={commetti.id} value={commetti.id}>
                {commetti.name} | {commetti.monthlyAmount}
              </option>
            ))}
          </select>
        </div>
        {selectedCommetti && (
          <div className="flex flex-col md:w-1/2 space-y-2">
            <label
              htmlFor="member"
              className="text-sm font-semibold text-gray-600"
            >
              Choose a member:
            </label>
            <select
              id="member"
              onChange={handleMemberChange}
              className="text-sm text-gray-600 font-semibold p-2 border  rounded-md focus:outline-none bg-inherit "
              // {...register("participant", {
              //   required: "This field is required",
              // })}
            >
              <option value="">select the member</option>
              {members &&
                members[0]?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} | {member.mobile}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
      <form
        action=""
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputFieldSingle
          label="Received amount"
          type="number"
          field="amount"
          register={register}
          validation={{
            required: "Confirm password is required",
          }}
          placeholder="received amount"
        />
        <div className="flex justify-between space-x-3 w-full">
          <div className="w-1/2">
            <InputFieldSingle
              label="Receiving date"
              type="date"
              field="date"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
            />
          </div>
          <div className="w-1/2">
            <InputFieldSingle
              label="Commetti month"
              type="month"
              field="month"
              register={register}
              validation={{
                required: "Confirm password is required",
              }}
            />
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-600 space-y-2">
          <div>Have you paid the commetti to this member?</div>
          <div className="flex space-x-5">
            <label>
              <input
                type="radio"
                name="option"
                value="no"
                checked={paymentAmount === "no"}
                onChange={handleRadio}
              />{" "}
              No
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="option"
                value="yes"
                checked={paymentAmount === "yes"}
                onChange={handleRadio}
              />{" "}
              yes
            </label>
          </div>
        </div>

        {paymentAmount === "yes" && (
          <div className="flex justify-between space-x-3 w-full">
            <div className="w-1/2">
              <InputFieldSingle
                label="Paid amount"
                type="number"
                field="paidAmount"
                register={register}
                placeholder="paid amount"
              />
            </div>
            <div className="w-1/2">
              <InputFieldSingle
                label="Payment date"
                type="date"
                field="paymentDate"
                register={register}
              />
            </div>
          </div>
        )}
        <FormSubmitButton
          label="Submit"
          type="submit"
          pendingLabel="Submitting..."
          isPending={isPending}
        />
      </form>
      {error && <ErrorInForm message={error?.message} />}
    </div>
  );
}

export default PostTransactions;
