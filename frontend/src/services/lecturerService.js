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

export const createLecturer = async (
  data
) => {
  const response = await api.post(
    "/lecturers",
    data
  );

  return response.data;
};

export const updateLecturer = async (
  lecturerId,
  data
) => {
  const response = await api.put(
    `/lecturers/${lecturerId}`,
    data
  );

  return response.data;
};