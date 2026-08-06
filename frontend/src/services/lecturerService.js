import api from "./api";

export const getLecturers = async () => {
  const { data } = await api.get("/lecturers");
  return data;
};

export const getLecturersByCourse = async (courseId) => {
  const { data } = await api.get(
    `/lecturers/course/${courseId}`
  );

  return data;
};