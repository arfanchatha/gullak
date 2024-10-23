function ModalWindow({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div
        className="fixed inset-0 bg-black opacity-80"
        onClick={onClose}
      ></div> 
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 ">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="border mx-3"></div>
        <div className="mt-2">{children}</div>
        <button
          className=" absolute mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 top-0"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ModalWindow;
