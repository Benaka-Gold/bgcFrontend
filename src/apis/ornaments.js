import apiClient from "./http";

async function createOrnament(payload) {
    try {
        const res = await apiClient().post('/ornaments', payload);
        return res;
    } catch (error) {
        return error;
    }
}

async function getOrnamentsList(id) {
    try {
        const res = await apiClient().get(`/ornaments/customer/${id}`);
        return res;
    } catch (error) {
        return error;
    }
}

async function deleteOrnament(id) {
    try {
        const res = await apiClient().delete(`/ornaments/${id}`);
        return res;
    } catch (error) {
        return error;
    }
}

export {createOrnament, getOrnamentsList, deleteOrnament}