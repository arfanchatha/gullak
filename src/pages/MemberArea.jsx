import { useMutation } from "@tanstack/react-query";
import { searchMember } from "../Services/ApiFetching/memberApiFetch";
import { useEffect, useState } from "react";
import { formatDates } from "../helper/formats";
import Modal from "../components/Modal";
import { HiMagnifyingGlass } from "react-icons/hi2";
import ErrorInForm from "../UI/ErrorInForm";

function MemberArea() {
  const {
    mutate,
    data,
    isPending,
    isError,
    error: queryError,
  } = useMutation({
    mutationFn: (form) => searchMember(form),
    onSuccess: (data) => {
      setMemberData(data?.data.data);
      setFormData({
        mobile: "",
        cnic: "",
      });
      handleModalOpen();
    },
    onError: (err) => {},
  });

  const [formData, setFormData] = useState({
    mobile: "",
    cnic: "",
  });

  const [memberData, setMemberData] = useState({});
  const [selectedCommetti, setSelectedCommetti] = useState({});
  const [memberTransactions, setMemberTransactions] = useState([]);
  const [commettiStats, setCommettiStats] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [error, setError] = useState("");

  useEffect(
    function () {
      setError(queryError?.message);
    },
    [queryError]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.mobile) {
      return;
    }
    setMemberData({});
    setSelectedCommetti({});
    mutate(formData);
  };

  const handleGoButton = (id) => {
    const commetti = memberData?.commetti?.filter((item) => item._id === id);
    const transactions = commetti[0]?.transaction
      .filter((item) => item.participant === memberData.member._id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setSelectedCommetti(...commetti);

    setMemberTransactions(transactions);

    const paidByMember = transactions?.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const receivedByMember = transactions
      ?.filter((item) => item.paidAmount !== undefined)
      .reduce((sum, item) => sum + item.paidAmount, 0);

    const amount = commetti[0].amount - paidByMember;

    const remainingAmount = paidByMember - receivedByMember;
    const commettisPaid = transactions?.length;
    const commettisRemaining =
      commetti[0].durationMonths - transactions?.length;

    setCommettiStats({
      paidByMember,
      receivedByMember,
      remainingAmount,
      commettisPaid,
      commettisRemaining,
      toBePaid: amount,
    });
  };
  const handleModalOpen = function () {
    setFormData({
      mobile: "",
      cnic: "",
    });
    setError("");
    setIsOpenModal((open) => !open);
  };

  return (
    <div className=" mx-auto justify-center h-screen items-center px-10 lg:max-w-[1300px]">
      <h2 className="text-center font-semibold text-2xl">Member Data</h2>
      <div className="flex  flex-col md:flex-row p-6 justify-center md:space-x-5 space-y-6 md:space-y-0">
        <div className="flex flex-col  mt-6 space-y-6 md:w-1/2">
          <div className="  py-6 px-10 border rounded-xl shadow-lg shadow-gray-500 ">
            <h2 className="pb-6 text-center text-lg font-semibold">
              Please enter the member details
            </h2>

            <Modal
              isOpen={isOpenModal}
              handleClose={handleModalOpen}
              title="Please enter the member details"
              displayCheck={false}
            >
              <form
                className="flex flex-col space-y-4 w-[400px]"
                onSubmit={handleSubmitForm}
              >
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className=" p-3 border-2 rounded-lg placeholder-yellow-500 focus:outline-none"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={isPending}
                />
                <input
                  type="text"
                  placeholder="CNIC Number"
                  className=" p-3 border-2 rounded-lg placeholder-yellow-500 focus:outline-none caret-cyan"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  disabled={isPending}
                />
                <button
                  className="text-white px-8 py-3 bg-cyan rounded hover:rounded-full hover:opacity-70 transi duration-200"
                  type="submit"
                  disabled={isPending}
                  // onClick={handleModalOpen}
                >
                  {isPending ? "Loading..." : "Search Member"}
                </button>
              </form>
              {error && <ErrorInForm message={error} />}
            </Modal>
            <div className="flex items-center border rounded-lg pl-2 group">
              <span className="">
                <HiMagnifyingGlass size={25} />
              </span>
              <input
                type="text"
                // value=""
                placeholder="Please click here to search member"
                onClick={handleModalOpen}
                className={`py-3 px-2 focus:outline-none w-full rounded-lg group-hover:cursor-pointer caret-white`}
              />
            </div>
          </div>
          {memberData?.member && (
            <>
              <div className=" border rounded-lg shadow shadow-gray-500 px-6 py-3">
                <div className="">
                  Member Name:{" "}
                  <span className="font-semibold">
                    {memberData?.member.name}
                  </span>
                </div>
                <div className="border my-2"></div>
                <div className="flex justify-between flex-col md:flex-row space-y-3 md:space-y-0">
                  <div>Phone: {memberData?.member.mobile}</div>
                  <div>CNIC: {memberData?.member.cnic}</div>
                </div>
              </div>

              <div className="border rounded-lg shadow shadow-gray-500  px-6 py-5 mt-10 md:mt-6 space-y-3 ">
                <div className="text-center font-semibold">
                  Following is the list of committis of which you are a member
                  now!
                </div>
                <div className="border my-2"></div>

                <div className="flex justify-between flex-col space-y-3  ">
                  {memberData?.commetti?.map((item) => (
                    <div
                      className="list-item-trans border-cyan  justify-between items-center  "
                      key={item.name}
                    >
                      <div className="flex flex-col" key={item.name}>
                        <span>Name: {item.name}</span>
                        <span>No of Commettis: {item.durationMonths}</span>
                      </div>

                      <a
                        className="rounded-full bg-cyan px-3 py-1 hover:bg-opacity-70"
                        onClick={() => handleGoButton(item._id)}
                        href="#commetti"
                      >
                        Go
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {selectedCommetti.name && (
            <div
              className="border rounded-lg shadow shadow-gray-500  py-5 px-7   space-y-3 "
              id="commetti"
            >
              <div className="font-semibold">
                Cemmetti Title: {selectedCommetti.name}
              </div>
              <div className="border my-2"></div>

              <div className="flex justify-between flex-col lg:flex-row space-y-3 lg:space-y-0  lg:space-x-10">
                <div>Amount: {selectedCommetti.amount}</div>
                <div>Durantion Months: {selectedCommetti.durationMonths}</div>
              </div>
              <div className="flex justify-between flex-col lg:flex-row space-y-3 lg:space-y-0 ">
                <div>
                  Starting Month:{" "}
                  {formatDates(selectedCommetti.startDate, "mm-yyyy")}
                </div>
                <div>
                  Ending Month:{" "}
                  {formatDates(selectedCommetti.endDate, "mm-yyyy")}
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedCommetti.name && (
          <div className=" space-y-6 md:w-1/2">
            <div className="border rounded-lg shadow shadow-gray-500  py-5 px-7  space-y-3 md:mt-6">
              <div className="font-semibold">Commetti Statistics</div>
              <div className="border my-2"></div>

              <div className="flex justify-between flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-10">
                <div>Total paid by member: {commettiStats.paidByMember}</div>
                <div>Amount to be paid: {commettiStats.toBePaid}</div>
              </div>
              <div className="flex justify-between flex-col lg:flex-row space-y-3 lg:space-y-0 ">
                <div>Received by member: {commettiStats.receivedByMember}</div>
                <div>No. of commettis paid: {commettiStats.commettisPaid}</div>
              </div>
              <div className="flex justify-between flex-col lg:flex-row space-y-3 lg:space-y-0 ">
                <div>
                  {commettiStats.remainingAmount < 0
                    ? `You owes: ${commettiStats.remainingAmount}`
                    : `Your saving is: ${commettiStats.remainingAmount}`}
                </div>
                <div>
                  No. of commettis remaining: {commettiStats.commettisRemaining}
                </div>
              </div>
            </div>
            <div className="border rounded-xl shadow shadow-gray-500 space-y-3 px-7 py-5  max-h-180 mt-10 overflow-y-auto mb-10 ">
              <h2 className="font-semibold">Transaction Details</h2>
              <div className="border my-2"></div>

              {memberTransactions.length < 1 && (
                <div className="font-bold text-center">
                  You have not paid any amount to this commetti
                </div>
              )}
              {memberTransactions.map((item, index) => (
                <div
                  className={` ${
                    item.paidAmount
                      ? "list-item-trans flex-col border-green-600"
                      : "list-item-trans flex-col border-cyan"
                  }`}
                  key={index}
                >
                  <div className="flex flex-col lg:flex-row justify-between lg:space-x-5">
                    <span>Date: {formatDates(item.date)}</span>
                    <span>Payment: {item.amount}</span>
                  </div>
                  <span>Payment Month: {item.month}</span>
                  {item.paidAmount && (
                    <div className="flex flex-col lg:flex-row justify-between">
                      <span>Received by Member: {item.paidAmount}</span>
                      <span>
                        Receiving Date: {formatDates(item.paymentDate)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberArea;
