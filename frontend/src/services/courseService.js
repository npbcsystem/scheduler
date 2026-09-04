import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/courses");

  return response.data;
};

export const createCourse = async (data) => {
  const response = await api.post(
    "/courses",
    data
  );

  return response.data;
};

export const updateCourse = async (
  courseId,
  data
) => {
  const response = await api.put(
    `/courses/${courseId}`,
    data
  );

  return response.data;
};

export const deleteCourse = async (
  courseId
) => {
  const response = await api.delete(
    `/courses/${courseId}`
  );

  return response.data;
};