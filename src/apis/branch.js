import apiClient from "./http";

// Get all branches
async function getBranches() {
  try {
    const branches = await apiClient().get("/branches");
    return branches.data;
  } catch (error) {
    throw error;
  }
}

// Get a branch by ID
async function getBranchById(id) {
  try {
    const branch = await apiClient().get(`/branch/${id}`);
    return branch.data;
  } catch (error) {
    throw error;
  }
}

// Create a new branch
async function createBranch(payload) {
  try {
    const res = await apiClient().post("/branch", payload);
    return res;
  } catch (error) {
    throw error;
  }
}

// Update an existing branch
async function updateBranch(id, payload) {
  try {
    const res = await apiClient().put(`/branch/${id}`, payload);
    return res;
  } catch (error) {
    throw error;
  }
}

// Delete a branch
async function deleteBranch(id) {
  try {
    const res = await apiClient().delete(`/branch/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export { getBranches, getBranchById, createBranch, updateBranch, deleteBranch };
