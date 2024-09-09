import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages";
import AuthLayout from "./pages/auth/AuthLayout";
import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/auth/verify";
import Profile from "./pages/profile";
import ProtectedLayout from "./pages/ProtectedLayout";
import Likes from "./pages/profile/likes";
import Views from "./pages/profile/views";
import History from "./pages/profile/history";
import Connections from "./pages/connections";
import Chat from "./pages/chat";
import ChatRoom from "./pages/chat/chat-room";
import ResetPassword from "./pages/auth/resetPassword";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      let decodedToken = jwtDecode(token);
      const { exp, iat, iss, ...userData } = decodedToken;
      console.log("user: ", userData);
      var current_time = new Date().getTime() / 1000;
      if (exp && current_time > exp) {
        toast.error("Session expired. Please sign in again.");
        console.log("Token expired");
        window.localStorage.removeItem("token");
        navigate("/signin");
      } else {
        dispatch(setUser(userData as any));
        if (
          location.pathname === "/signin" || 
          location.pathname === "/resetPassword" ||
          location.pathname === "/signup"
        ) {
          navigate("/");
        }
      }
    } else if (
      location.pathname !== "/signin" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/resetPassword" &&
      location.pathname !== "/verify"
    ) {
      navigate("/signin");
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:profileId" element={<ChatRoom />} />
          <Route path="/profile/:profileId" element={<Profile />} />
          <Route path="/profile/likes" element={<Likes />} />
          <Route path="/profile/views" element={<Views />} />
          <Route path="/profile/history" element={<History />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Route>
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
}

export default App;
