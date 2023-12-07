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
        return error;
    }
}

// Get a customer by ID
async function getCustomerById(id) {
    try {
        const res = await apiClient().get(`/customers/${id}`);
        return res;
    } catch (error) {
        return error;
    }
}

// Update a customer by ID
async function updateCustomer(id, data) {
    console.log(id, data);
    try {
        const res = await apiClient().put(`/customers/${id}`, data);
        return res;
    } catch (error) {
        return error;
    }
}

// Delete a customer by ID
async function deleteCustomer(id) {
    try {
        const res = await apiClient().delete(`/customers/${id}`);
        return res;
    } catch (error) {
        return error;
    }
}

// Search for customers by query
async function searchCustomers(queryParams) {
    try {
        const res = await apiClient().get('/customers/search', { params: queryParams });
        return res;
    } catch (error) {
        return error;
    }
}





export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    
};
