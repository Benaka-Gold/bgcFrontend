import apiClient from "../http";


const login = async (payload) => {
 
  try {
    console.log("Login Sent")
    const res = await apiClient().post('/auth/login', payload)
    return res
  } catch (error) {
    return error
  }
}



const verifyLogin = async (payload) => {
  try {
    const res = await apiClient().post('/auth/verify-login', payload)
    return res
  } catch (error) {
    return error
  }
}


export { verifyLogin, login }



