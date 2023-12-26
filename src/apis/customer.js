import { da } from "date-fns/locale";
import apiClient from "./http";

// Create a new customer
async function createCustomer(data) {
    try {
        const res = await apiClient().post('/customers', data);
        return res;
    } catch (error) {
        return error;
    }
}

// Retrieve a list of customers
async function getCustomers() {
    try {
        const res = await apiClient().get('/customers');
        return res;
    } catch (error) {
        throw error;
    }
}

// Get a customer by ID
async function getCustomerById(id) {
    try {
        const res = await apiClient().get(`/customers/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
}

// Update a customer by ID
async function updateCustomer(id, data) {
    try {
        const res = await apiClient().put(`/customers/${id}`, data);
        return res;
    } catch (error) {
        throw error;
    }
}

// Delete a customer by ID
async function deleteCustomer(id) {
    try {
        const res = await apiClient().delete(`/customers/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
}

// Search for customers by query
async function searchCustomers(queryParams) {
    try {
        const res = await apiClient().get('/customers/search', { params: queryParams });
        return res;
    } catch (error) {
        throw error;
    }
}

async function customerVerify (id){
    try {
        const res = await apiClient().get(`/customer/verify-otp/${id}`)
        return res
    } catch (error) {
        throw error
    }
}

async function customerOtpVerify (payload){
    try {
        const res = await apiClient().post(`/customer/verify-otp`, payload)
        return res
    } catch (error) {
        throw error
    }
}

export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    customerVerify,
    customerOtpVerify
};
