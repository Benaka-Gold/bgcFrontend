import apiClient from "./http";

const getTeam = async (payload) => {
    try {
        let data = await apiClient().get(`/team/${payload}`);
        return data
    }
    catch (error) {
        throw error;
    }
}

const getTeamByType = async(teamType) =>{
    try {
        return await apiClient().get(`/teams/by-type/${teamType}`)
    }
    catch (error) {
        throw error;
    }
}

  async function getTeamsById(payload) {
    try {
      const response = await apiClient().get(`/users/${payload}`);
      return response.data 
    }
    catch (err) {
      throw err;
    }
  }


  async function getDepartment() {
    try {
      const response = await apiClient().get(`/team-types`);
      return response
    }
    catch (err) {
      throw err;
    }
  }
export {getTeam,getTeamByType,getTeamsById , getDepartment}