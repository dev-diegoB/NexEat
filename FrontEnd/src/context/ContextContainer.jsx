import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";

function ContextContainer({ children }) {
  return (
    <AuthProvider>
      <CategoryProvider>{children}</CategoryProvider>
    </AuthProvider>
  );
}

export default ContextContainer;
