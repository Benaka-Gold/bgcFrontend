import { configureStore } from "@reduxjs/toolkit"
import AuthReducer from "../reducers/authReducer";
import FilterReducer from "../reducers/filterReducer";
const store = configureStore({
    reducer:{
       AuthReducer:AuthReducer,
       FilterReducer:FilterReducer
}
});

export default store;
