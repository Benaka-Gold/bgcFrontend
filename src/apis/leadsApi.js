import apiClient from "./http";

async function getLeads() {
  try {
    const response = await apiClient().get('/lead/getLeads');
    // console.log(response.data);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function getLeadByUser(payload) {
  try {
    const response = await apiClient().post('/lead/getLeadByUser', payload);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function getTeams() {
  try {
    const response = await apiClient().get(`/teams`);
    // console.log(response);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function getTeamsById(payload) {
  try {
    const response = await apiClient().get(`/users/${payload}`);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function assignLead(id,userId) {
  try {
    const response = await apiClient().put(`/lead/update/${id}`,{"assignedTo" : userId});
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function updatedLeadApi(id,payload) {
  console.log(id, payload);
  try {
    const response = await apiClient().put(`/lead/update/${id}`, payload);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function freshLeads(id) {
  try {
    const response = await apiClient().get(`/lead/getFreshLeads/${id}`);
    return response.data 
  }
  catch (err) {
    return err;
  }
}

async function getMoveLeads(){
  try {
    const response = await apiClient().get('/lead/getMoveLeads');
    return response.data;
  }
  catch (err) { 
    return err
  }
}

export {getLeads, getLeadByUser, getTeams, getTeamsById, assignLead ,updatedLeadApi, freshLeads,getMoveLeads}
