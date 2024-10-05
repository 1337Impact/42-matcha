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
import UpdatePassword from "./pages/auth/resetPassword/[token]";
import Settings from "./pages/settings";
import Map from "./pages/map";
import ScheduleDate from "./pages/connections/schedule_date";
import VideoCall from "./pages/chat/video-call";
import RespondToScheduleRequest from "./pages/connections/schedule_date/eventId";
import Dates from "./pages/connections/dates";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      let decodedToken = jwtDecode(token);
      const { exp, iat, iss, ...userData } = decodedToken;
      var current_time = new Date().getTime() / 1000;

      if (exp && current_time > exp) {
        toast.error("Session expired. Please sign in again.");
        window.localStorage.removeItem("token");
        navigate("/signin");
      } else {
        dispatch(setUser(userData as any));
        if (
          location.pathname === "/signin" ||
          location.pathname.startsWith("/resetPassword") ||
          location.pathname === "/signup"
        ) {
          navigate("/");
        }
      }
    } else if (
      location.pathname !== "/signin" &&
      location.pathname !== "/signup" &&
      !location.pathname.startsWith("/resetPassword") &&
      location.pathname !== "/verify"
    ) {
      navigate("/signin");
    }
  }, [navigate, location.pathname, token]);

  if (
    !token &&
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    !location.pathname.startsWith("/resetPassword") &&
    location.pathname !== "/verify"
  ) {
    navigate("/signin");
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/connections/schedule_date" element={<ScheduleDate />} />
          <Route path="/connections/schedule_date/:eventId" element={<RespondToScheduleRequest />} />
          <Route path="/connections/schedule_date/:eventId" element={<RespondToScheduleRequest />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:profileId" element={<ChatRoom />} />
          <Route path="/chat/:profileId/video-call" element={<VideoCall />} />
          <Route path="/profile/:profileId" element={<Profile />} />
          <Route path="/profile/likes" element={<Likes />} />
          <Route path="/profile/views" element={<Views />} />
          <Route path="/profile/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/map" element={<Map />} />
          <Route path="/connections/dates" element={<Dates />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword/" element={<ResetPassword />} />
          <Route path="/resetPassword/:token" element={<UpdatePassword />} />
        </Route>
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
}

export default App;
