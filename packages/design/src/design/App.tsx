import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { isAuthenicated } from "./utils/user";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const path = window.location.pathname;
  if (!path.startsWith("/auth") && !isAuthenicated()) window.location.href = "/auth/login?redirect=" + encodeURIComponent(path);
  return (
    <Routes>
      {!isAuthenicated() && <>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
      </>}
    </Routes>
  )
}

export default App
