export const formatDates = (data, format) => {
  const date = new Date(data);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (format === "mm-yyyy") {
    return `${month}-${year}`;
  }

  return `${day}-${month}-${year}`;
};
