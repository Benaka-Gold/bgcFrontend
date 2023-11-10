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

export {uploadfiles}