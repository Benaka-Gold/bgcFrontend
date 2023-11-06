import apiClient from "./http";

const getTeams = async () => {
    try {
        return await apiClient().get('/teams');
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

export {getTeams,getTeamByType}