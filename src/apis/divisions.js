import apiClient from "./http";

async function createDivision (data) {
    try {
        const res = await apiClient().post('/division',data)
        return res
    } catch (error) {
        throw error
    }
}

async function updateDivision (id,data) {
    try{
        const res = await apiClient().put(`/division/${id}`,data)
        return res;
    } catch (error) { throw error;}
}

async function getAllDivision(){
    try{
        const res = await apiClient().get('/divisions')
        return res;
    } catch(error) {
        throw error;
    }
}

async function getDivision(id){
    try{
        const res = await apiClient().get(`/division/${id}`)
        return res;
    }
    catch (error){throw error;}

}

async function deleteDivision(id){
    try{
        const res = await apiClient().delete(`/division/${id}`)
        
        return res;
    } catch(error) { throw error;}
}

export {createDivision,getAllDivision,updateDivision,getDivision,deleteDivision}