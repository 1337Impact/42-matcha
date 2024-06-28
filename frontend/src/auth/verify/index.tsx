import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

export default function Verify() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        token: token,
      })
      .then((res) => {
        navigate("/signin");
      })
        .catch((err) => {
            setLoading(false);
            setError(err.response.data.error);
        })
  }, [searchParams]);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center h-[100px]">
          <ImSpinner3 className="animate-spin w-12 h-12" />
        </div>
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
}
