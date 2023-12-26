import apiClient from "../http";

const login = async (payload) => {
 
  try {
    const res = await apiClient().post('/auth/login', payload)
    return res
  } catch (error) {
    throw error
  }
}

const verifyLogin = async (payload) => {
  try {
    const res = await apiClient().post('/auth/verify-login', payload)
    return res
  } catch (error) {
    throw error
  }
}

const getUserData = async(payload)=>{
  try{
    const res = await apiClient().get('/auth/getUserData', payload)
    return res
  }catch(error){
    throw error
  }
}


export { verifyLogin, login,getUserData }



