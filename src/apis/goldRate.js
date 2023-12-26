import apiClient from "./http";

const updateGoldRate = async(id,data) => {
    try{
        const res = await apiClient().put(`/gold-rate/${id}`,data)
        return res
    } catch (error) {
        throw error;
    }
}

const getGoldRate = async() => {
    try{
        const res = await apiClient().get('/gold-rate');
        return res;
    } catch(error) {
        throw error;;
    }
}

const createGoldRate = async(data) => {
    try{
        const res = await apiClient().post('/gold-rate',data);
        return res;
    } catch (error) {
        throw error;
    }
}

const update24kRate = async(data) => {
    try {
        const res = await apiClient().put('/gold-rate-update24k',data)
        return res;
    } catch(error) {
        throw error;
    }
}

export {updateGoldRate,getGoldRate,createGoldRate,update24kRate}