import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./auth/signin";
import SingUp from "./auth/singup";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="login" element={<Login />} />
        <Route path="singup" element={<SingUp />} /> */}
      </Routes>
    </>
  );
}

export default App;
