import apiClient from "./http";

const getTeams = async () => {
    try {
        let data = await apiClient().get('/teams');
        console.log(data);
    }
    catch (error) {
        return error;
    }
}

const getTeamByType = async(teamType) =>{
    try {
        return await apiClient().get(`/teams/by-type/${teamType}`)
    }
    catch (error) {
        return error;
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

export {getTeams,getTeamByType,getTeamsById}