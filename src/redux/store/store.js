import { configureStore } from "@reduxjs/toolkit"
import AuthReducer from "../reducers/authReducer";
const store = configureStore({
    reducer:{
       AuthReducer:AuthReducer,
}
});

export default store;
