import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { isAuthenicated } from "./utils/user";

function App() {
  const path = window.location.pathname;
  if (!path.startsWith("/auth") && !isAuthenicated()) window.location.href = "/auth/login?redirect=" + encodeURIComponent(path);
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  )
}

export default App
