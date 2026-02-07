import axios from "./axios";

export const getProducts = () => axios.get("/products");

export const getProductsAdmin = () => axios.get("/products/admin");

export const getProductById = (id) => axios.get(`/products/${id}`);

export const createProduct = (data) => axios.post("/products", data);

export const updateProduct = (id, data) => axios.put(`/products/${id}`, data);

export const deleteProduct = (id) => axios.delete(`/products/${id}`);
