import { useState } from "react";
import CompletedCommetti from "../../components/commetti/CompletedCommetti";
import InprogressCommettiList from "../../components/commetti/InprogressCommettiList";
import { useGlobalContextProps } from "../../hooks/useGlobalContextProps";
import Modal from "../../components/Modal";
import CreateCommetti from "../../components/commetti/CreateCommetti";
import { CreateButton, MenuNavButton } from "../../UI/UISmallComponents";

const btnsInitialState = { btn1: "active", btn2: "inActive" };

function Commetti() {
  const { loggedInUser } = useGlobalContextProps();
  const [activeTab, setActiveTab] = useState(btnsInitialState);
  const [isOpen, setIsOpen] = useState(false);
  const [autoCloseModal, setAutoCloseModal] = useState(true);
  const onChangeCheckBox = () => {
    setAutoCloseModal((open) => !open);
  };

  const handleModal = () => {
    setIsOpen((open) => !open);
  };

  const handleTabClick = (activeButton) => {
    setActiveTab((prevState) => ({
      btn1: activeButton === "btn1" ? "active" : "inActive",
      btn2: activeButton === "btn2" ? "active" : "inActive",
    }));
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Tab navigation */}
        <div className="flex justify-center md:justify-start space-x-10">
          <MenuNavButton
            title="In progress"
            activeTab={activeTab.btn1}
            handleTabClick={() => handleTabClick("btn1")}
          />
          {loggedInUser?.role === "admin" && (
            <>
              <MenuNavButton
                title="Completed"
                activeTab={activeTab.btn2}
                handleTabClick={() => handleTabClick("btn2")}
              />

              <CreateButton title="Create commetti" handleModal={handleModal} />
            </>
          )}
        </div>

        <div>
          {activeTab.btn1 === "active" && <InprogressCommettiList />}
          {activeTab.btn2 === "active" && <CompletedCommetti />}
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
