import { createContext, useContext, useState, useEffect } from "react";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesAdmin,
} from "../api/categories";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

export const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory debe usarse dentro de un CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      handleApiError(error, "Error cargando categorías", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesAdmin = async () => {
    try {
      const res = await getCategoriesAdmin();
      setCategories(res.data);
    } catch (error) {
      handleApiError(error, "Error cargando categorías", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async (id) => {
    try {
      const res = await getCategoryById(id);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error obteniendo categoría", setErrors);
      return null;
    }
  };

  const addCategory = async (data) => {
    try {
      const res = await createCategory(data);
      setCategories((prev) => [...prev, res.data]);
    } catch (error) {
      handleApiError(error, "Error creando categoría", setErrors);
    }
  };

  const editCategory = async (id, data) => {
    try {
      const res = await updateCategory(id, data);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? res.data : cat)),
      );
    } catch (error) {
      handleApiError(error, "Error actualizando categoría", setErrors);
    }
  };

  const removeCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      handleApiError(error, "Error eliminando categoría", setErrors);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useAutoClearErrors(errors, setErrors);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        errors,
        loadCategories,
        loadCategoriesAdmin,
        getCategory,
        addCategory,
        editCategory,
        removeCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
