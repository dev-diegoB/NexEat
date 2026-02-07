import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      category,
      pointsValue,
      options,
      image,
      order,
      isAvailable,
    } = req.body;

    if (!name || basePrice === undefined || !category) {
      return res.status(400).json({
        message: "Nombre, precio base y categoría son obligatorios",
      });
    }

    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(400).json({ message: "El producto ya existe" });
    }

    const product = await Product.create({
      name,
      basePrice,
      category,
      pointsValue: pointsValue || 0,
      options: options || [],
      image: image || "",
      order: order || 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isAvailable: true,
    })
      .populate("category")
      .sort({ order: 1, createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

export const getProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ order: 1, createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "ID inválido" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      category,
      pointsValue,
      options,
      image,
      order,
      isAvailable,
      isActive,
    } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        basePrice,
        category,
        pointsValue,
        options,
        image,
        order,
        isAvailable,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("category");

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto desactivado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando producto" });
  }
};
