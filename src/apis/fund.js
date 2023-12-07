import apiClient from "./http";

async function createFund(data) {
  try {
    const res = await apiClient().post("/fund", data);
    return res;
  } catch (error) {
    throw error;
  }
}

async function updateFund(id, data) {
  try {
    const res = await apiClient().put(`/fund/${id}`, data);
    return res;
  } catch (error) {
    throw error;
  }
}

async function deleteFund(id) {
  try {
    const res = await apiClient().delete(`/fund/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

async function getFunds() {
  try {
    const res = await apiClient().get("/funds");
    return res;
  } catch (error) {
    throw error;
  }
}

async function getFund(id) {
  try {
    const res = await apiClient().get(`/fund/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export { getFund, getFunds, createFund, deleteFund, updateFund };
