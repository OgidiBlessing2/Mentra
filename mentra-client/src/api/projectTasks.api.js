
import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

export const getProjectTasks = async (projectId, token) => {
  const response = await axios.get(
    `${API_URL}/${projectId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createProjectTask = async (
  projectId,
  data,
  token
) => {
  const response = await axios.post(
    `${API_URL}/${projectId}/tasks`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProjectTask = async (
  projectId,
  taskId,
  data,
  token
) => {
  const response = await axios.patch(
    `${API_URL}/${projectId}/tasks/${taskId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteProjectTask = async (
  projectId,
  taskId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${projectId}/tasks/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

