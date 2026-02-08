import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";
import { TableProvider } from "./TableContext";

function ContextContainer({ children }) {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <TableProvider>
            {children}
          </TableProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default ContextContainer;
