import apiClient from "./http";

const createBusiness = async (data) => {
    try {
        const res = await apiClient().post('/business',data);
        return res;
    } catch (error) {throw error;}
}

const updateBusiness = async (id,data) => {
    console.log(id, data);
    try{
        const res= await apiClient().put(`/business/${id}`,data);
        return res;
    } catch(error) {throw error;}
}

const getBussiness = async (id)=>{
    try {
        const res = await apiClient().get(`business/${id}`)
        return res
    } catch(error) {throw error;}
}

const getBusinessByPeriod = async(from = Date(),to = Date()) => {
    try {
        const res = await apiClient().post('/business/period',{from : from,to : to});
        return res;
    } catch(error) {
        throw error;
    }
}

const generateBill = async (id) => {
    try {
        const res = await apiClient().get(`/business/bill/${id}`);
        return res;
    } catch (error) { throw error;}
}

export {createBusiness,updateBusiness, getBussiness,getBusinessByPeriod,generateBill}
