import api from "./api";

export const generateSchedule = async (week) => {
  const { data } = await api.get(`/schedule/generate/${week}`);
  return data;
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
