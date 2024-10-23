import React, { useEffect, useState } from "react";
import PostTransactions from "../../components/commetti/PostTransactions";
import Modal from "../../components/Modal";
import { CreateButton } from "../../UI/UISmallComponents";
import { getAllCommettis } from "../../Services/ApiFetching/commettiApiFetch";
import { useQuery } from "@tanstack/react-query";
import { TransactionList } from "../../UI/DisplayList";

function Transactions() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseModal, setAutoCloseModal] = useState(true);
  const [searchTransaction, setSearchTransaction] = useState("");

  const {
    data,
    error: commettisError,
    isPending: commettisLoading,
  } = useQuery({
    queryKey: ["getAllCommettis"],
    queryFn: getAllCommettis,
  });

  const commettisData = data?.data?.data.commettis;

  const transactions = commettisData?.flatMap((item) => item.transaction);

  const onChangeCheckBox = () => {
    setAutoCloseModal((open) => !open);
  };

  const handleModal = () => {
    setIsOpen((open) => !open);
  };

  // function searchByValue(value) {
  //   return transactions.filter((obj) => {
  //     return Object.values(obj).some((val) => val == value);
  //   });
  // }

  function searchByValue(value) {
    return transactions?.filter((obj) => {
      return Object.values(obj).some(
        (val) => typeof val === "string" && val.includes(value) // Check if value partially matches a string
      );
    });
  }

  const searched = searchByValue(searchTransaction) || transactions;
  console.log(searchByValue(searchTransaction));

  return (
    <>
      <div className=" flex flex-col mx-3 md:mx-0">
        <div className="flex justify-center md:justify-start space-x-10">
          <button className="px-5 py-3 bg-cyan rounded-full hover:bg-opacity-80">
            Transactions
          </button>

          <CreateButton title="Post transaction" handleModal={handleModal} />
        </div>
        <div className=" flex flex-col lg:flex-row justify-between ">
          <div className="p-5 lg:w-2/5">
            <div className="border-2 rounded-full border-gray-600">
              <input
                placeholder="Search"
                className="p-2 rounded-full focus:outline-none placeholder:pl-1"
                value={searchTransaction}
                onChange={(e) => setSearchTransaction(e.target.value)}
              />
            </div>
            <div>filter</div>
          </div>
          <div className="lg:w-3/5 p-5 overflow-y-scroll h-180">
            <div className="flex flex-col space-y-3 ">
              {searched?.map((data, index) => (
                <div key={index}>
                  <TransactionList
                    data={data}
                    index={index < 9 ? `0${index + 1}` : index + 1}
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
        title="Please enter the transaction details"
        onChangeCheckBox={onChangeCheckBox}
        checked={autoCloseModal}
      >
        <PostTransactions
          handleClose={handleModal}
          commettisData={commettisData}
          autoCloseModal={autoCloseModal}
        />
      </Modal>
    </>
  );
}

export default Transactions;
