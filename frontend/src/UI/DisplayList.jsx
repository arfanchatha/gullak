import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { formatDates } from "../helper/formats";
import { useGlobalContextProps } from "../hooks/useGlobalContextProps";
import { IoMdOptions } from "react-icons/io";

function AssistanList({ data, index }) {
  return (
    <div className="border  p-5 relative text-lg w-content  bg-teal-50 rounded-2xl">
      <div className="grid grid-cols-2">
        <h2 className=" mr-2">
          Name: <span className="font-bold capitalize">{data?.name}</span>
        </h2>

        <span className="text-end">
          Role: <span className="capitalize">{data?.role}</span>
        </span>
        <span className=" mt-2">
          Email: <span>{data?.email}</span>
        </span>
      </div>
      {index && (
        <>
          <span className="absolute rounded-full bg-green-300 bg-opacity-60 p-1 text-sm -left-2 -top-2">
            {index}
          </span>
          <span
            className={`absolute rounded-full  bg-opacity-60 p-1 text-sm -right-2 -bottom-2 ${
              data?.active ? " bg-blue-200" : " bg-red"
            }`}
          >
            {data?.active ? "Active" : "In active"}
          </span>
        </>
      )}
    </div>
  );
}
function MemberList({ data, index }) {
  return (
    <div className="border  p-5 relative text-lg w-content  bg-teal-50 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="space-y-2 flex flex-col">
          <div>
            Name: <span className="font-bold capitalize">{data?.name}</span>
          </div>
          <span>CNIC: {data.cnic}</span>
        </div>
        <span>
          Mobile: <span className="capitalize">{data.mobile}</span>
        </span>
      </div>
      <span className="absolute rounded-full bg-green-300 bg-opacity-60 p-1 text-sm -left-2 -top-2">
        {index}
      </span>
      <span
        className={`absolute rounded-full  bg-opacity-60 p-1 text-sm -right-2 -bottom-2 ${
          data?.active ? " bg-blue-200" : " bg-red"
        }`}
      >
        {data?.active ? "Active" : "In active"}
      </span>
    </div>
  );
}
function MemberStatsList({ data, index }) {
  const status = data.numCommettiReceived
    ? data.balance >= 0
      ? " bg-green-300"
      : " bg-red"
    : " bg-green-300";
  return (
    <div className="border  p-5 relative text-lg w-content  bg-teal-50 rounded-2xl">
      <div className="flex flex-col ">
        <div className="member-stats-item ">
          <div>
            Name: <span className="font-bold capitalize">{data?.name}</span>
          </div>
          <div className="flex flex-col">
            <span>Mobile: {data.mobile}</span>
            <span>CNIC: {data.cnic}</span>
          </div>
        </div>
        {data.numCommettiReceived ? (
          <>
            <div className="member-stats-item ">
              <span>
                Amount received: <span className="">{data.totalReceived}</span>
              </span>
              <span>
                Amount paid:{" "}
                <span className="font-semibold">{data.totalPaid}</span>
              </span>
            </div>
            <div className="member-stats-item ">
              <span>
                {data.balance > 0 ? "Payable:" : "Receivable:"} {data.balance}
              </span>
              <span>No. of commetti received: {data.numCommettiReceived}</span>
            </div>
          </>
        ) : (
          <span className="text-center">No transaction</span>
        )}
      </div>
      <span
        className={`absolute rounded-full ${status} bg-opacity-60 p-1 text-sm -left-2 -top-2`}
      >
        {index}
      </span>
    </div>
  );
}
function CommettiStats({ data, commettiPaidLength, participantLength }) {
  return (
    <div className="px-2 pb-2 flex flex-col text-lg">
      <div>Total amount received: {data.totalReceived}</div>
      <div>Total amount paid: {data.totalPaid}</div>
      <div>
        {data.balance == 0
          ? "No balance:"
          : data.balance > 0
          ? "Payable balance:"
          : "Receivable balance:"}{" "}
        {data.balance}
      </div>

      <div>commetti members: {participantLength} </div>
      <div>Commetti paid to {commettiPaidLength.yes} members</div>
      <div>{commettiPaidLength.no} members to be paid</div>
    </div>
  );
}
function CommettiPaymentStatus({ data }) {
  const paid = " line-through text-stone-500";
  return (
    <ul className="flex space-y-1 hover:shadow-md shadow-gray-500 hover:border-y px-2">
      <li className={`${data.commettiPaid === "yes" ? paid : ""}`}>
        {data.name} |{" "}
        {data.commettiPaid === "yes"
          ? `Payment month: ${formatDates(data.month, "mm-yyyy")}`
          : "Commetti to be paid"}
      </li>
    </ul>
  );
}

function TransactionList({ data, index }) {
  if (!data) {
    return <div>Currently there is no transaction</div>;
  }
  return (
    <div className="border rounded-xl flex flex-col p-4 relative space-y-2">
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Date: {formatDates(data.date)}</span>
        <span>Month: {formatDates(data.month, "mm-yyyy")}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Amount: {data.amount}</span>
        <span>Posted by: {data.postedBy?.name} </span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Received from: {data.participant.name}</span>
        <span>Commetti: {data.commetti.name} </span>
      </div>
      {data?.paidAmount && (
        <div className="flex flex-col sm:flex-row justify-between   ">
          <span>Paid amount: {data.paidAmount}</span>
          <span>Payment date: {formatDates(data.paymentDate)}</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 "></span>
          </span>
        </div>
      )}
      <span className="rounded-full p-1 bg-gray-400 absolute -top-4 -left-2 text-xs">
        {index}
      </span>
    </div>
  );
}
function DisplayCommettiList({ data, index }) {
  const { loggedInUser } = useGlobalContextProps();

  return (
    <div className="border rounded-xl flex flex-col p-4 relative space-y-2">
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Name: {data.name}</span>
        <span>Total amount: {data.totalAmount}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Monthly amount: {data.monthlyAmount}</span>
        <span>Duration: {data.durationMonths} months </span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <span>Start month: {formatDates(data.startMonth, "mm-yyyy")}</span>
        <span>End Month: {formatDates(data.endMonth, "mm-yyyy")} </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between   ">
        <span>Members: {data.participant.length}</span>
      </div>

      <span className="rounded-full p-1 bg-gray-400 absolute -top-4 -left-2 text-xs">
        {index}
      </span>
      {loggedInUser.role === "admin" && (
        <span
          className="hover:text-cyan absolute -right-3 -top-5 p-1"
          id="commetti-list-options"
          // onClick={(e) => handleOptions(e, data.id)}
        >
          <IoMdOptions size={25} />
        </span>
      )}
    </div>
  );
}

export {
  AssistanList,
  MemberList,
  TransactionList,
  DisplayCommettiList,
  MemberStatsList,
  CommettiStats,
  CommettiPaymentStatus,
};
