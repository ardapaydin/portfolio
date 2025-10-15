import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { useUser } from "../utils/api/queries";
import Loading from "./components/loading";
import Dashboard from "./pages/dashboard/main";

function App() {
  const path = window.location.pathname;
  const user = useUser();
  const nav = useNavigate();
  if (user.isLoading) return <Loading />;
  if (!user.data?.user && !path.startsWith("/auth")) nav(`/auth/login?redirect=${encodeURIComponent(path)}`);
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user?.data?.user ? "/dashboard" : "/auth/login"} replace={true} />} />
      <Route path="/dashboard" element={user?.data?.user ? <Dashboard /> : <Navigate to="/auth/login" replace={true} />} />
      <Route path="/auth/register" element={user?.data?.user ? <Navigate to="/" replace={true} /> : <Register />} />
      <Route path="/auth/login" element={user?.data?.user ? <Navigate to="/" replace={true} /> : <Login />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App
