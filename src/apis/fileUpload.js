import apiClient from "./http";

async function uploadfiles(file){
    try {
        const formData = new FormData()
        formData.append('file',file)
        const res =  await apiClient().post('/upload', formData)
        return res.data
    }
    catch(error) {
        return error
    }
}

async function deleteFile (id) {
    try {
        return await apiClient().delete(`/file/${id}`)
    }
    catch(error){
        return error    
    }
}

async function getFile(id){
    try{
        return await apiClient().get(`/download/${id}`)
    }
    catch (error){
        return error
    }
}

export {uploadfiles,deleteFile,getFile}