import apiClient from "../http";


const login = async (payload) => {
  console.log("login",payload)
  try {
    const res = await apiClient().post('/auth/login', payload)
    console.log(res.data);
    return res
  } catch (error) {
    return error
  }
}



const verifyLogin = async (payload) => {
  try {
    const res = await apiClient().post('/auth/verify-login', payload)
    console.log(res);
    return res
  } catch (error) {
    return error
  }
}


export { verifyLogin, login }



