import { createContext, useContext, useState, useEffect } from "react";
import {
  getProducts,
  getProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

export const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct debe usarse dentro de un ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      handleApiError(error, "Error cargando productos", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsAdmin = async () => {
    try {
      const res = await getProductsAdmin();
      setProducts(res.data);
    } catch (error) {
      handleApiError(error, "Error cargando productos", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await getProductById(id);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error obteniendo producto", setErrors);
      return null;
    }
  };

  const addProduct = async (data) => {
    try {
      const res = await createProduct(data);
      setProducts((prev) => [...prev, res.data]);
    } catch (error) {
      handleApiError(error, "Error creando producto", setErrors);
    }
  };

  const editProduct = async (id, data) => {
    try {
      const res = await updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    } catch (error) {
      handleApiError(error, "Error actualizando producto", setErrors);
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      handleApiError(error, "Error eliminando producto", setErrors);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useAutoClearErrors(errors, setErrors);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        errors,
        loadProducts,
        loadProductsAdmin,
        getProduct,
        addProduct,
        editProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
