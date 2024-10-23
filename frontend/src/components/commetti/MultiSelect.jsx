import React, { useEffect, useState } from "react";

const MultiSelect = ({ data, onSelectionChange, fieldPlaceholder }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [pendingSelection, setPendingSelection] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (item) => {
    setPendingSelection(item);
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.id === item.id
      );
      return isSelected
        ? prevSelected.filter((selected) => selected.id !== item.id)
        : [...prevSelected, item];
    });
  };

  useEffect(() => {
    if (pendingSelection) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems]);

  const handleOutsideClick = (event) => {
    if (event.target.closest(".multi-select")) return;
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative multi-select">
      <div className="flex border border-gray-300 rounded-md group">
        <input
          type="text"
          placeholder={fieldPlaceholder || "Select items"}
          className="w-full rounded-md p-2 cursor-pointer focus:outline-none"
          value={selectedItems.map((item) => item.name).join(", ")}
          onClick={toggleDropdown}
          readOnly
        />
        <button
          className="px-3 border-l hover:bg-red hover:opacity-80 bg-gray-300 text-sm font-semibold rounded-r-md"
          type="reset"
          onClick={() => setSelectedItems([])}
        >
          Clear
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg grid grid-cols-2 ">
          {data?.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-2 cursor-pointer mb-1 hover:bg-cyan border rounded mx-1 ${
                selectedItems.some((selected) => selected.id === item.id)
                  ? "bg-gray-200"
                  : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              <input
                type="checkbox"
                checked={selectedItems.some(
                  (selected) => selected.id === item.id
                )}
                onChange={() => handleSelect(item)}
                className="mr-2"
              />
              <span>
                {item.name} {item.mobile && `(${item.mobile})`}{" "}
                {item.email && `(${item.email})`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
