import { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";

function Product() {
  const {
    products,
    loading,
    errors,
    addProduct,
    editProduct,
    loadProductsAdmin,
  } = useProduct();

  const [form, setForm] = useState({
    name: "",
    basePrice: "",
    category: "",
  });

  useEffect(() => {
    loadProductsAdmin();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    if (!form.name || !form.basePrice || !form.category) return;

    addProduct({
      ...form,
      basePrice: Number(form.basePrice),
    });

    setForm({
      name: "",
      basePrice: "",
      category: "",
    });
  };

  const handleEdit = (product) => {
    const newName = prompt("Nuevo nombre", product.name);
    if (!newName || newName === product.name) return;

    editProduct(product._id, { name: newName });
  };

  const handleToggleVisibility = (product) => {
    editProduct(product._id, { isAvailable: !product.isAvailable });
  };

  const publicProducts = products.filter((p) => p.isAvailable);

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin · Todos los productos</h2>

      {loading && <p className="mb-2">Cargando...</p>}

      {errors?.map((err, i) => (
        <p key={i} className="mb-2">
          {err}
        </p>
      ))}

      <div className="mb-4">
        <input
          className="mr-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          className="mr-2"
          name="basePrice"
          value={form.basePrice}
          onChange={handleChange}
          placeholder="Precio"
        />

        <input
          className="mr-2"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="ID Categoría"
        />

        <button onClick={handleAdd}>Agregar</button>
      </div>

      <ul className="space-y-2">
        {products.map((p, index) => (
          <li key={p._id}>
            {p.name} - {p.basePrice} {!p.isAvailable && "(no disponible)"}
            <div className="mt-1 space-x-2">
              <button onClick={() => handleEdit(p)}>Editar</button>

              <button onClick={() => handleToggleVisibility(p)}>
                {p.isAvailable ? "Ocultar" : "Mostrar"}
              </button>

              <button onClick={() => editProduct(p._id, { order: index })}>
                Guardar orden
              </button>
            </div>
            {p.options?.length > 0 && (
              <div className="mt-1">
                Opciones:
                {p.options.map((opt, i) => (
                  <div key={i}>
                    - {opt.name} {opt.required && "(requerido)"}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <hr className="my-6" />

      <h2 className="mb-2">Público · Productos visibles</h2>

      <ul className="space-y-1">
        {publicProducts.map((p) => (
          <li key={p._id}>
            {p.name} - {p.basePrice}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product;
