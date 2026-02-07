import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./test/Product";
import Login from "./test/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
