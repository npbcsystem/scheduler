import api from "./api";

export const getProgress = async () => {
  const response = await api.get("/progress");
  return response.data;
};

export const getRemainingCourses = async (branchId, level) => {
  const response = await api.get(
    `/progress/${branchId}/${level}/remaining`
  );

  return response.data;
};

export const getBranchProgress = async (branchId) => {
  const response = await api.get(
    `/progress/branch/${branchId}`
  );

  return response.data;
};

export const addCompletedCourse = async (
  progressId,
  data
) => {
  const response = await api.put(
    `/progress/${progressId}/add-course`,
    data
  );

  return response.data;
};