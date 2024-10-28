export const backendHost = () => {
  let backendAPI;
  if (import.meta.env.VITE_NODE_ENV === "development") {
    backendAPI = import.meta.env.VITE_BACKEND_HOST_DEV;
  } else if (import.meta.env.VITE_NODE_ENV === "production") {
    backendAPI = import.meta.env.VITE_BACKEND_HOST_PROD;
  }
  return backendAPI;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const removeNullFromObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== "" && value !== null)
  );
};

export const mergArrayOfObjects = (arr1, arr2) => {
  return arr1?.map((item1) => {
    const item2 = arr2?.find((item) => item._id === item1._id);
    return { ...item1, ...item2 };
  });
};

export const addMissingParticipantInTransStats = (arr1, arr2) => {
  // Create a copy of arr2 to avoid mutating the original array
  const result = [...arr2];

  // Iterate through each item in arr1
  arr1?.forEach((item1) => {
    // Check if the item from arr1 exists in arr2
    const existsInArr2 = result.some((item2) => item2.id === item1.id);

    // If it doesn't exist, push the modified item into the result array
    if (!existsInArr2) {
      result.push({ ...item1, commettiPaid: "no" });
    }
  });

  return result;
};

export const transactionsSortByMonthDate = (data) => {
  return data
    .sort((a, b) => {
      return new Date(b.month) - new Date(a.month);
    })
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
};
