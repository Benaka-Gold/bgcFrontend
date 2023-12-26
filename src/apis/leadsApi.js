import apiClient from "./http";

async function getLeads() {
  try {
    const response = await apiClient().get("/lead/getLeads");
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getLeadsByTeam(team) {
  try {
    const response = await apiClient().post("/lead/getTeamLeads", {
      teamId: team,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getLeadByUser(payload) {
  try {
    const response = await apiClient().post("/lead/getLeadByUser", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function assignLead(id, userId) {
  try {
    const response = await apiClient().put(`/lead/update/${id}`, {
      assignedTo: userId,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function updatedLeadApi(id, payload) {
  try {
    const response = await apiClient().put(`/lead/update/${id}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function freshLeads(id) {
  try {
    const response = await apiClient().get(`/lead/getFreshLeads/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getMoveLeads() {
  try {
    const response = await apiClient().get("/lead/getMoveLeads");
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function createLead(data) {
  try {
    const response = await apiClient().post("/lead/create", data);
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getLeadsByStatus(status) {
  try {
    const response = await apiClient().get(`/lead/bystatus/${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export {
  getLeads,
  getLeadByUser,
  assignLead,
  updatedLeadApi,
  freshLeads,
  getMoveLeads,
  createLead,
  getLeadsByTeam,
  getLeadsByStatus,
};
