import { HiXMark } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { CheckBox } from "../UI/UISmallComponents";

function Modal({
  isOpen,
  handleClose,
  children,
  title,
  checked,
  onChangeCheckBox,
  displayCheck = true,
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);

      document.body.classList.add("overflow-hidden");
    } else {
      const timeout = setTimeout(() => {
        setShowModal(false);

        document.body.classList.remove("overflow-hidden");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !showModal) return null;

  return (
    // Overlay
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className={`flex flex-col relative mx-5 transition-all duration-500 ease-out 
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-70"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-2xl bg-red hover:scale-105 place-self-end p-2 rounded-full bg-red-500 absolute -right-3 -top-3"
          onClick={handleClose}
        >
          <HiXMark />
        </button>
        <div className="pt-5  bg-white rounded-lg">
          <div className=" font-semibold text-center text-xl px-10">
            {title}
          </div>
          <div className="border my-5 "></div>
          <div className="px-10 ">{children}</div>
          <div className="border my-5 "></div>
          {displayCheck && (
            <div className="px-10 pb-5">
              <CheckBox
                title="Auto close on sumbit"
                checked={checked}
                onChangeCheckBox={onChangeCheckBox}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
