import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
    </Routes>
  )
}

export default App
