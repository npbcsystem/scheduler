import api from "./api";

export const getPendingAssignments = async () => {
  const response = await api.get("/pending-assignments");

  return response.data;
};

export const assignPendingAssignment = async (id, data) => {
  const response = await api.post(`/pending-assignments/${id}/assign`, data);

  return response.data;
};
