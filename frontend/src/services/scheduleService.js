import api from "./api";

export const generateSchedule = async (week, month, year) => {
  const response = await api.get(
    `/schedule/generate/${week}?month=${month}&year=${year}`,
  );

  return response.data;
};

export const getSchedules = async () => {
  const { data } = await api.get("/schedule");
  return data;
};

export const updateSchedule = async (id, schedule) => {
  const { data } = await api.put(
    `/schedule/${id}`,

    schedule,
  );

  return data;
};

export const approveWeek = async (week, month, year) => {
  const response = await api.put(
    `/schedule/approve/week/${week}?month=${month}&year=${year}`,
  );

  return response.data;
};

export const approveAll = async (month, year) => {
  const response = await api.put(
    `/schedule/approve/all?month=${month}&year=${year}`,
  );

  return response.data;
};

export const completeWeek = async (week, month, year) => {
  const response = await api.put(
    `/schedule/complete/week/${week}?month=${month}&year=${year}`,
  );

  return response.data;
};

export const completeMonth = async (month, year) => {
  const response = await api.put(
    `/schedule/complete/month/${month}?year=${year}`,
  );

  return response.data;
};
