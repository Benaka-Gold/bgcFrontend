import apiClient from "./http";

async function getUsersByRole(role){
    try {
        const res = await apiClient().get(`/user/${role}`)
        return res.data
    } catch (error) {
        return error
    }
}


export {getUsersByRole}