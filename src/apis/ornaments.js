import apiClient from "./http";

async function createOrnament(payload) {
    try {
        const res = await apiClient().post('/ornaments', payload);
        return res;
    } catch (error) {
        throw error;
    }
}

async function getOrnamentsList(customerId,businessId) {
    try {
        const res = await apiClient().post(`/ornaments/customer`,{customerId : customerId,businessId : businessId});
        return res;
    } catch (error) {
        throw error;
    }
}



async function deleteOrnament(id) {
    try {
        const res = await apiClient().delete(`/ornaments/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
}

export {createOrnament, getOrnamentsList, deleteOrnament}