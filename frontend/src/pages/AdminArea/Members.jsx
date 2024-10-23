import React, { useState } from "react";
import Modal from "../../components/Modal";
import AddMember from "../../components/commetti/AddMember";
import { CreateButton, SelectFilter } from "../../UI/UISmallComponents";
import { MemberList } from "../../UI/DisplayList";
import { getMembers } from "../../Services/ApiFetching/memberApiFetch";
import { useQuery } from "@tanstack/react-query";

function Members() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseModal, setAutoCloseModal] = useState(true);
  const [filterUser, setFilterUser] = useState("active");
  const selectData = [
    { select: "Active", value: "active" },
    { select: "In active", value: "inActive" },
    { select: "All", value: "all" },
  ];

  const { data, error, isPending } = useQuery({
    queryKey: ["getMembersList"],
    queryFn: getMembers,
  });

  const membersData = data?.data?.data.participants;

  const filterMembersData = (data) => {
    if (!data) return [];

    return data.filter((member) => {
      if (filterUser === "active") return member.active !== false;
      if (filterUser === "inActive") return member.active !== true;
      return true;
    });
  };

  let filteredMembersData;
  filteredMembersData = filterMembersData(membersData);

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
            Members
          </button>

          <CreateButton title="Add member" handleModal={handleModal} />
        </div>
        <div className="pt-5">
          <div className="flex flex-col space-y-3">
            <div className="place-self-end">
              <SelectFilter
                data={selectData}
                handleChange={(e) => setFilterUser(e.target.value)}
                label={"Filter by member status"}
              />
            </div>
            <div
              className={`grid grid-rows-4 lg:grid-flow-col gap-4 ${
                filteredMembersData.length > 4 ? "" : " lg:w-1/2"
              }`}
            >
              {filteredMembersData?.map((user, index) => (
                <div key={index} className="">
                  {filterMembersData?.length > 0 ? (
                    <MemberList
                      data={user}
                      index={index < 10 ? `0${index + 1}` : index + 1}
                    />
                  ) : (
                    <div className="font-bold text-3xl items-center justify-center">
                      There is no member please add first
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={handleModal}
        title="Please enter the details to create commetti member"
        onChangeCheckBox={onChangeCheckBox}
        checked={autoCloseModal}
      >
        <AddMember handleClose={handleModal} autoCloseModal={autoCloseModal} />
      </Modal>
    </>
  );
}

export default Members;
