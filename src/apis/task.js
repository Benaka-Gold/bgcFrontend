import apiClient from "./http";

async function assignTask(data){
   try { 
    console.log("Data : ",data)

    const res = await apiClient().post('/task',data)
    console.log(res)
    return res
} catch(error){
        return error
    }
}

async function getAllTasks(){
    try{
        const res = await apiClient().get('/tasks')
        return res;
    } catch (error) {
        return error;
    }
}

async function executiveTask(){
    try { 
     const res = await apiClient().get('/executive-tasks')
     return res
 } catch(error){
         return error
     }
 }

 async function getAssignedTasks(payload){
    try { 
     const res = await apiClient().get(`/task/${payload}`)
     return res
 } catch(error){
         return error
     }
 }

 async function updateTask(id, payload){
    try { 
     const res = await apiClient().put(`/task/${id}`, payload)
     return res;
 } catch(error){
         return error;
     }
 }

 async function getTasksByStatus(status){
    try {
        const res = await apiClient().post('/task/by-status',{'status' : status})
        return res
    } catch (error){
        return error
    }
 }

export {assignTask, executiveTask, getAssignedTasks, updateTask,getAllTasks,getTasksByStatus}