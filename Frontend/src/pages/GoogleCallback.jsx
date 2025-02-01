import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const GoogleCallback = () => {
  const { setAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Fetch user info from the backend (token already stored in cookies)
        const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
          withCredentials: true,
        });

        setAuthenticated(true);
        setUser(response.data.user);
        navigate("/"); // Redirect to dashboard
      } catch (error) {
        console.error("Google Callback Error:", error.response?.data?.message);
        navigate("/login"); // Redirect to login on failure
      }
    };

    handleGoogleCallback();
  }, [navigate, setAuthenticated, setUser]);

  return <div>Loading...</div>; // Show loading during the callback process
};

export default GoogleCallback;
