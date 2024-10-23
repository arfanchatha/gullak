import { formatDates } from "../helper/formats";

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

function TransactionList({ data, index }) {
  return (
    <div className="border rounded-xl flex flex-col p-4 relative space-y-2">
      <div className="flex justify-between">
        <span>Date: {formatDates(data.date)}</span>
        <span>Month: {formatDates(data.month, "mm-yyyy")}</span>
      </div>
      <div className="flex justify-between">
        <span>Amount: {data.amount}</span>
        <span>Posted by: {data.postedBy?.name} </span>
      </div>
      <div className="flex justify-between">
        <span>Received from: {data.participant.name}</span>
        <span>Commetti: {data.commetti.name} </span>
      </div>
      {data?.paidAmount && (
        <div className="flex justify-between   ">
          <span>Payment date: {formatDates(data.paymentDate)}</span>
          <span>Paid amount: {data.paidAmount}</span>
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

export { AssistanList, MemberList, TransactionList };
