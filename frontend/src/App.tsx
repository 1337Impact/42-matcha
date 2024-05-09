import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages";
import AuthLayout from "./auth/AuthLayout";
import SignIn from "./auth/signin";
import SignUp from "./auth/signup";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      if (location.pathname === "/signin" || location.pathname === "/signup") {
        navigate("/");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
