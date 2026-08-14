import api from "./api";

export const getBranches = async () => {
  const response = await api.get("/branches");
  return response.data;
};

export const updateBranch = async (
  branchId,
  data
) => {
  const response = await api.put(
    `/branches/${branchId}`,
    data
  );

  return response.data;
};