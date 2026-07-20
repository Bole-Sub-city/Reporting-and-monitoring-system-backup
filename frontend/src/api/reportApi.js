import api from "./api";

export const submitBuusaaReport = async (reportData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/reports", reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
