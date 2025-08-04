import instance from "./axiosInstance";

// Fetch all
async function getAll(endpoint: string) {
  try {
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching all data", error);
    throw error;
  }
}

// Fetch one by ID
async function getOne(endpoint: string, id: string) {
  try {
    const response = await instance.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data with ID ${id}`, error);
    throw error;
  }
}

// Delete by ID
async function deleteOne(endpoint: string, id: string) {
  try {
    const response = await instance.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data with ID ${id}`, error);
    throw error;
  }
}

// Update data by ID
async function update(endpoint: string, id: string, data: any) {
  try {
    const response = await instance.patch(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data with ID ${id}`, error);
    throw error;
  }
}

// Create a new data
async function post(endpoint: string, data: any, headers?: object) {
  try {
    const response = await instance.post(endpoint, data, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating data", error);
    throw error;
  }
}

const controller = {
  getAll,
  getOne,
  deleteOne,
  update,
  post,
};

export default controller;
