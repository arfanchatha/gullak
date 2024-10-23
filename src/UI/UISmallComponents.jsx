function MenuNavButton({ activeTab, handleTabClick, title }) {
  const active = "rounded-full bg-cyan  hover:bg-opacity-80";
  return (
    <button
      className={`px-6 py-3 rounded-full  ${
        activeTab === "active" ? active : "  border-gray-400 border-b-4"
      }`}
      onClick={handleTabClick}
    >
      {title}
    </button>
  );
}

function CreateButton({ handleModal, title }) {
  return (
    <button
      className="px-5 py-3 border rounded-full hover:bg-cyan transition duration-200 hover:bg-opacity-80"
      onClick={handleModal}
    >
      {title}
    </button>
  );
}
function CheckBox({ checked, onChangeCheckBox, title }) {
  return (
    <div className="flex items-center  space-x-3 text-sm font-semibold text-gray-600">
      <span className="ml-2 ">{title}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChangeCheckBox}
        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200 cursor-pointer"
      />
    </div>
  );
}
function SelectFilter({ data, handleChange, label }) {
  return (
    <div className="space-x-3 border rounded px-3  group bg-gray-100 shadow shadow-gray-400">
      <label htmlFor="filter">{label}</label>
      <select
        className="rounded-lg bg-inherit focus:outline-none group-hover:cursor-pointer p-2 border-l "
        onChange={handleChange}
      >
        {data.map((elem) => (
          <option value={elem.value} key={elem.value}>
            {elem.select}
          </option>
        ))}
      </select>
    </div>
  );
}

export { MenuNavButton, CreateButton, CheckBox, SelectFilter };
