import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";

function ContextContainer({ children }) {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>{children}</ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default ContextContainer;
