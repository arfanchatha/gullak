function ErrorInForm({ message }) {
  return (
    <div className="flex items-center hover:shadow rounded hover:shadow-black px-2 space-x-2">
      <span className="text-md font-semibold">Error: </span>
      <div className="text-red font-semibold text-sm justify-center max-w-[450px] py-2 mx-auto w-full">
        {message}
      </div>
    </div>
  );
}

export default ErrorInForm;
