import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import SignUp from "../../components/SignUp";
import { CreateButton, SelectFilter } from "../../UI/UISmallComponents";
import { AssistanList } from "../../UI/DisplayList";
import { useQuery } from "@tanstack/react-query";
import { getAdminAssistants } from "../../Services/ApiFetching/userApiFetch";

function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseModal, setAutoCloseModal] = useState(true);
  const [filterUser, setFilterUser] = useState("active");
  const selectData = [
    { select: "Active", value: "active" },
    { select: "In active", value: "inActive" },
    { select: "All", value: "all" },
  ];

  const { data, error, isPending } = useQuery({
    queryKey: ["getAdminAssistants"],
    queryFn: getAdminAssistants,
  });

  const usersData = data?.data?.data.users;

  const filterUserData = (data) => {
    if (!data) return [];

    return data.filter((user) => {
      if (filterUser === "active") return user.active !== false;
      if (filterUser === "inActive") return user.active !== true;
      return true;
    });
  };

  let filteredUsersData;
  filteredUsersData = filterUserData(usersData);

  const onChangeCheckBox = () => {
    setAutoCloseModal((open) => !open);
  };
  const handleModal = () => {
    setIsOpen((open) => !open);
  };

  return (
    <>
      <div className=" flex flex-col  mx-3 md:mx-0">
        <div className="flex justify-center md:justify-start space-x-10">
          <button className="px-5 py-3 bg-cyan rounded-full hover:bg-opacity-80">
            Assistants
          </button>

          <CreateButton title="Add assistant" handleModal={handleModal} />
        </div>
        <div className="pt-5">
          <div className="flex flex-col space-y-3">
            <div className="place-self-end">
              <SelectFilter
                data={selectData}
                handleChange={(e) => setFilterUser(e.target.value)}
                label={"Filter by user status"}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              {filteredUsersData?.map((user, index) => (
                <div key={index}>
                  <AssistanList
                    data={user}
                    index={index < 10 ? `0${index + 1}` : index + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={handleModal}
        title="Please enter the details to create assistant"
        onChangeCheckBox={onChangeCheckBox}
        checked={autoCloseModal}
      >
        <SignUp handleClose={handleModal} autoCloseModal={autoCloseModal} />
      </Modal>
    </>
  );
}

export default Assistant;
