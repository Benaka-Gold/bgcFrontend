import apiClient from "./http";

async function getEmployees(){
    try {
        const res =  await apiClient().get('/employees')
        return res.data
    }
    catch(error) {
        throw error
    }
}

async function createEmployee(payload){
    try {
        const res = await apiClient().post('/employee',payload)
        return res
    }
    catch(error){
        throw error
    }
}

async function getEmployeeById(id){
    try {
        const res = await apiClient().get(`/employee/${id}`)
        return res.data
    }
    catch (error){
        throw error
    }
}

async function updateEmployee(id,data){
    try {
        const res = await apiClient().put(`/employee/${id}`,data)
        return res
    }
    catch (error){
        throw error
    }
}

async function deleteEmployee(id){
    try {
        const res = await apiClient().delete(`/employee/${id}`)
        return res
    }
    catch (error) {
        throw error
    }
}

export {getEmployees,createEmployee,getEmployeeById,updateEmployee,deleteEmployee}