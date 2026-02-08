import { BrowserRouter, Routes, Route } from "react-router-dom";
import Table from "./test/Table";
import Login from "./test/login";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Table />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
