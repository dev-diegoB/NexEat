import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./test/Category";
import Login from "./test/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
