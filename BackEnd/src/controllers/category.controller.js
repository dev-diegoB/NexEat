import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, order } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const category = await Category.create({
      name,
      order,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creando categoría" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo categorías" });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo categorías" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo categoría" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, isActive, order } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, isActive, order },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando categoría" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría desactivada" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando categoría" });
  }
};
