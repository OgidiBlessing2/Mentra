import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";


// -----------------------------------------
// Get Projects
// -----------------------------------------

export async function getProjects(token) {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


// -----------------------------------------
// Get Single Project
// -----------------------------------------

export async function getProject(token, id) {
  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// -----------------------------------------
// Create Project
// -----------------------------------------

export async function createProject(
  token,
  project
) {
  const response = await axios.post(
    API_URL,
    project,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// -----------------------------------------
// Update Project
// -----------------------------------------

export async function updateProject(
  token,
  id,
  project
) {
  const response = await axios.put(
    `${API_URL}/${id}`,
    project,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}


// -----------------------------------------
// Delete Project
// -----------------------------------------

export async function deleteProject(
  token,
  id
) {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}