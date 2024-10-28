import { useEffect, useState } from "react";

import CommettiList from "../../components/commetti/CommettiList";
import { useGlobalContextProps } from "../../hooks/useGlobalContextProps";
import Modal from "../../components/Modal";
import CreateCommetti from "../../components/commetti/CreateCommetti";
import { CreateButton, MenuNavButton } from "../../UI/UISmallComponents";

const btnsInitialState = { btn1: "active", btn2: "inActive" };

function Commetti() {
  const { loggedInUser, queryAllCommettis } = useGlobalContextProps();

  const [activeTab, setActiveTab] = useState(
    JSON.parse(sessionStorage.getItem("activeTab")) || btnsInitialState
  );

  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseModal, setAutoCloseModal] = useState(true);
  const onChangeCheckBox = () => {
    setAutoCloseModal((open) => !open);
  };
  const { data } = queryAllCommettis;
  const commettiData = data ? data?.data?.data.commettis : [];

  const commettiInprogress = [];
  const commettiCompleted = [];

  commettiData.map((commetti) => {
    if (commetti.status === "inProgress") {
      commettiInprogress.push(commetti);
    } else if (commetti.status === "completed") {
      commettiCompleted.push(commetti);
    }
  });

  const handleModal = () => {
    setIsOpen((open) => !open);
  };

  const handleTabClick = (activeButton) => {
    const newActiveTab = {
      btn1: activeButton === "btn1" ? "active" : "inActive",
      btn2: activeButton === "btn2" ? "active" : "inActive",
    };
    setActiveTab(newActiveTab);
    sessionStorage.setItem("activeTab", JSON.stringify(newActiveTab));
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Tab navigation */}
        <div className="flex justify-center md:justify-start space-x-10">
          <MenuNavButton
            title="In progress"
            activeTab={activeTab.btn1 === "active"}
            handleTabClick={() => handleTabClick("btn1")}
          />
          {loggedInUser?.role === "admin" && (
            <>
              <MenuNavButton
                title="Completed"
                activeTab={activeTab.btn2 === "active"}
                handleTabClick={() => handleTabClick("btn2")}
              />

              <CreateButton title="Create commetti" handleModal={handleModal} />
            </>
          )}
        </div>

        <div>
          {activeTab.btn1 === "active" && (
            <CommettiList commettiData={commettiInprogress} />
          )}
          {activeTab.btn2 === "active" && (
            <CommettiList commettiData={commettiCompleted} />
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        handleClose={handleModal}
        title="Please enter the commetti details"
        checked={autoCloseModal}
        onChangeCheckBox={onChangeCheckBox}
      >
        <CreateCommetti
          handleClose={handleModal}
          isOpen={isOpen}
          autoCloseModal={autoCloseModal}
        />
      </Modal>
    </>
  );
}

export default Commetti;
