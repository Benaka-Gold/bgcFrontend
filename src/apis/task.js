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

async function executiveTask(){
    try { 
     const res = await apiClient().get('/executive-tasks')
     return res
 } catch(error){
         return error
     }
 }

export {assignTask, executiveTask}