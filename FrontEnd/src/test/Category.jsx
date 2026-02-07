import { useEffect, useState } from "react";
import { useCategory } from "../context/CategoryContext";

function Category() {
  const {
    categories,
    loading,
    errors,
    addCategory,
    editCategory,
    loadCategoriesAdmin,
  } = useCategory();

  const [name, setName] = useState("");

  useEffect(() => {
    loadCategoriesAdmin();
  }, []);

  const handleAdd = () => {
    if (!name) return;
    addCategory({ name });
    setName("");
  };

  const handleEdit = (cat) => {
    const newName = prompt("Nuevo nombre", cat.name);
    if (!newName || newName === cat.name) return;
    editCategory(cat._id, { name: newName });
  };

  const handleToggleVisibility = (cat) => {
    editCategory(cat._id, { isActive: !cat.isActive });
  };

  const publicCategories = categories.filter((c) => c.isActive);

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin · Todas las categorías</h2>

      {loading && <p className="mb-2">Cargando...</p>}
      {errors?.map((err, i) => (
        <p key={i} className="mb-2">
          {err}
        </p>
      ))}

      <div className="mb-4">
        <input
          className="mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva categoría"
        />
        <button onClick={handleAdd}>Agregar</button>
      </div>

      <ul className="space-y-2">
        {categories.map((cat, index) => (
          <li key={cat._id}>
            {cat.name} {!cat.isActive && "(oculta)"}
            <div className="mt-1 space-x-2">
              <button onClick={() => handleEdit(cat)}>Editar</button>
              <button onClick={() => handleToggleVisibility(cat)}>
                {cat.isActive ? "Ocultar" : "Mostrar"}
              </button>
              <button onClick={() => editCategory(cat._id, { order: index })}>
                Guardar orden
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr className="my-6" />

      <h2 className="mb-2">Público · Categorías visibles</h2>

      <ul className="space-y-1">
        {publicCategories.map((cat) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
