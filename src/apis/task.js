import apiClient from "./http";

async function assignTask(data){
   try { 
    const res = await apiClient().post('/task',data);
    return res;
} catch(error){
        return error
    }
}

async function getAllTasks(){
    try{
        const res = await apiClient().get('/tasks');
        return res;
    } catch (error) {
        throw error;;
    }
}

async function executiveTask(){
    try { 
     const res = await apiClient().get('/executive-tasks');
     return res;
 } catch(error){
         throw error;
     }
 }

 async function getAssignedTasks(payload){
    try { 
     const res = await apiClient().get(`/task/${payload}`);
     return res;
 } catch(error){
         throw error;
     }
 }

 async function updateTask(id, payload){
    try { 
     const res = await apiClient().put(`/task/${id}`, payload);
     return res;
 } catch(error){
         throw error;
     }
 }

 async function getTasksByStatus(data){
    try {
        const res = await apiClient().post('/task/by-status',data);
        return res;
    } catch (error){
        throw error;
    }
 }

 async function getTasksByDivision(){
    try{
        const res = await apiClient().get('/task/by-division');
        return res;
    } catch(error) {
        throw error;
    }
 }

 async function getComplianceVerifyTasks(){
    try{
        const res = await apiClient().get('/tasks/compliance-verification')
        return res;
    } catch (error) {
        throw error;
    }
 }
 async function getComplianceVerifyTaskData(id){
    try{
        const res = await apiClient().get(`tasks/compliance-verification/${id}`)
        return res;
    } catch(error) {
        throw error;
    }
}


export {assignTask,
        executiveTask,
        getAssignedTasks,
        updateTask,
        getAllTasks,
        getTasksByStatus,
        getTasksByDivision,
        getComplianceVerifyTasks,
        getComplianceVerifyTaskData}