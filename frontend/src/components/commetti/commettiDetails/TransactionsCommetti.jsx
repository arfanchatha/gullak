import React from "react";
import { TransactionList } from "../../../UI/DisplayList";
import { transactionsSortByMonthDate } from "../../../Services/helperFunctions";

function TransactionsCommetti({ data }) {
  const sortedData = transactionsSortByMonthDate(data);
  return (
    <div className="px-5 py-2 space-y-3 h-180 overflow-y-auto">
      {sortedData?.map((data, index) => (
        <div key={index}>
          <TransactionList
            data={data}
            index={index < 9 ? `0${index + 1}` : index}
          />
        </div>
      ))}
    </div>
  );
}

export default TransactionsCommetti;
