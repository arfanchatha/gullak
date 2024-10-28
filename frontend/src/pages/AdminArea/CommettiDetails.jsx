import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { HiArrowLongLeft, HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { getCommettiTransactionsStats } from "../../Services/ApiFetching/transactionApiFetch";
import { useGlobalContextProps } from "../../hooks/useGlobalContextProps";
import {
  addMissingParticipantInTransStats,
  mergArrayOfObjects,
} from "../../Services/helperFunctions";
import {
  AssistanList,
  CommettiPaymentStatus,
  CommettiStats,
} from "../../UI/DisplayList";
import MemberStats from "../../components/commetti/commettiDetails/MemberStats";
import { MenuNavButton } from "../../UI/UISmallComponents";
import AssistantCommetti from "../../components/commetti/commettiDetails/AssistantCommetti";
import TransactionsCommetti from "../../components/commetti/commettiDetails/TransactionsCommetti";

const btns = ["Members", "Transactions", "Assistants"];

function CommettiDetails() {
  const [activeTab, setActiveTab] = useState("Members");
  const [accordionStatus, setAccordionStatus] = useState({
    stats: false,
    status: false,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { queryAllCommettis } = useGlobalContextProps();

  const { data, error, isPending } = queryAllCommettis;
  const commettis = data?.data?.data.commettis;

  const { data: stats } = useQuery({
    queryKey: ["getCommettiTransactionsStats", { id }],
    queryFn: getCommettiTransactionsStats,
  });
  const transStats = stats?.data.data.stats;

  const transStatsTotals =
    transStats?.reduce(
      (acc, transaction) => {
        acc.totalReceived += transaction.totalReceived;
        acc.totalPaid += transaction.totalPaid;
        acc.balance += transaction.balance;
        return acc;
      },
      { totalReceived: 0, totalPaid: 0, balance: 0 }
    ) || {};

  const commettiData = commettis?.find((item) => item.id === id);
  const memberStats = mergArrayOfObjects(commettiData?.participant, transStats);

  const handleTabClick = (btnName) => {
    setActiveTab(btnName);
  };

  const result = commettiData?.transaction.reduce((acc, transaction) => {
    const { id, name } = transaction.participant;

    // Check if the participant is already in the result
    if (!acc[id]) {
      // Initialize with commettiPaid as "no"
      acc[id] = {
        id,
        name,
        commettiPaid: transaction.paidAmount ? "yes" : "no",
        month: transaction.paidAmount ? transaction.month : undefined,
      };
    } else if (transaction.paidAmount) {
      // Update commettiPaid to "yes" and set the latest month if paidAmount exists
      acc[id].commettiPaid = "yes";
      acc[id].month = transaction.month;
    }

    return acc;
  }, {});

  // Convert the result back to an array

  const commettiPaidStats = result ? Object.values(result) : [];

  const commettiPaidStatsAll = addMissingParticipantInTransStats(
    commettiData?.participant,
    commettiPaidStats
  );

  const sorted = commettiPaidStatsAll.sort((a, b) => {
    // First, sort by commettiPaid status
    if (a.commettiPaid === "yes" && b.commettiPaid === "no") {
      return -1; // a comes before b
    }
    if (a.commettiPaid === "no" && b.commettiPaid === "yes") {
      return 1; // b comes before a
    }

    // If both have the same commettiPaid status, sort by month
    return new Date(a.month) - new Date(b.month); // Sort by month
  });

  const commettiPaidLength = commettiPaidStatsAll?.reduce(
    (acc, participant) => {
      if (participant.commettiPaid === "yes") {
        acc.yes += 1;
      } else {
        acc.no += 1;
      }
      return acc;
    },
    { yes: 0, no: 0 }
  );

  useEffect(() => {
    const handleResize = () => {
      setAccordionStatus((prevStatus) => ({
        stats: window.innerWidth >= 1024 ? true : prevStatus.stats,
        status: window.innerWidth >= 1024 ? true : prevStatus.status,
      }));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAccordion = (accordion) => {
    setAccordionStatus((prevStatus) => ({
      ...prevStatus,
      [accordion]: !prevStatus[accordion],
    }));
  };

  return (
    <div className=" flex flex-col space-y-5 ">
      <div className="justify-between flex ">
        <div
          onClick={() => navigate(-1)}
          className="p-2 flex cursor-pointer space-x-3 group hover:text-rose-600 hover:scale-x-105 hover:font-semibold transition duration-300"
        >
          <HiArrowLongLeft size={25} className="" />
          <span>Back</span>
        </div>
        <div className="flex space-x-5 px-5">
          {btns.map((btnName) => (
            <div key={btnName} className="hover:cursor-pointer">
              <MenuNavButton
                title={btnName}
                activeTab={activeTab === btnName}
                handleTabClick={() => handleTabClick(btnName)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row space-y-5 ">
        <div className=" space-y-5 lg:w-2/5 lg:mt-2 px-5 lg:pt-5">
          <div className="border rounded">
            <div
              className="flex  p-2 items-end hover:cursor-pointer"
              onClick={() => toggleAccordion("stats")}
            >
              <h2 className=" font-bold w-full text-center ">
                Commetti stats totals
              </h2>
              <div className="place-content-end ">
                {accordionStatus.stats ? (
                  <HiChevronUp size={23} />
                ) : (
                  <HiChevronDown size={23} />
                )}
              </div>
            </div>
            {accordionStatus.stats && (
              <CommettiStats
                data={transStatsTotals}
                commettiPaidLength={commettiPaidLength}
                participantLength={commettiData?.participant.length}
              />
            )}
          </div>

          <div className="border rounded">
            <div
              className="flex  p-2 items-end hover:cursor-pointer"
              onClick={() => toggleAccordion("status")}
            >
              <h2 className=" font-bold w-full text-center">
                Commetti payment status
              </h2>
              <div className="place-content-end">
                {accordionStatus.status ? (
                  <HiChevronUp size={23} />
                ) : (
                  <HiChevronDown size={23} />
                )}
              </div>
            </div>
            {accordionStatus.status && (
              <div className="text-lg py-2">
                {sorted?.map((data, index) => (
                  <div key={index} className="">
                    <CommettiPaymentStatus data={data} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-3/5">
          {activeTab === "Members" && <MemberStats memberStats={memberStats} />}
          {activeTab === "Transactions" && (
            <TransactionsCommetti data={commettiData?.transaction} />
          )}
          {activeTab === "Assistants" && (
            <AssistantCommetti data={commettiData?.user} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommettiDetails;
