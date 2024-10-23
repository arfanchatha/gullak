import { HiEye, HiEyeSlash } from "react-icons/hi2";

function InputFieldSingle({
  label,
  type,
  field,
  register,
  placeholder,
  value,
  validation,
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder || field}
        id={field}
        value={value}
        {...register(field, validation)}
        className="px-3 py-2 border rounded-lg placeholder:pl-1"
      />
    </div>
  );
}
function InputSelectFields({
  label,
  field,
  register,
  data,
  optionLabel,
  validation,
}) {
  return (
    <>
      <label htmlFor="commetti">{label}</label>
      <select id="commetti" onChange={handleCommettiChange}>
        <option value="">{optionLabel}</option>
        {data?.map((data, index) => (
          <option key={index} value={data.id} {...register(field, validation)}>
            {data.name} | {data.amount}
          </option>
        ))}
      </select>
    </>
  );
}

function InputFieldPassword({
  label,
  type,
  field,
  register,
  placeholder,
  handlePasswordShow,
  passwordShow,
  validation,
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <div className="flex items-center justify-between relative">
        <input
          type={passwordShow ? "text" : "password"}
          placeholder={placeholder || type}
          id={field}
          {...register(field, validation)}
          className="px-3 py-2 border rounded-lg w-full placeholder:pl-1"
        />
        <span
          className="hover:cursor-pointer absolute right-2 hover:text-blue-600"
          onClick={handlePasswordShow}
        >
          {passwordShow ? <HiEye size={20} /> : <HiEyeSlash size={20} />}
        </span>
      </div>
    </div>
  );
}
function FormSubmitButton({ label, pendingLabel, type, isPending }) {
  return (
    <button
      className="py-2 border rounded-lg px-5 bg-blue-500 text-white text-center hover:scale-105 transition duration-200 w-full"
      type={type}
      disabled={isPending}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}

export {
  InputFieldSingle,
  InputFieldPassword,
  FormSubmitButton,
  InputSelectFields,
};
