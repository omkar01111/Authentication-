//zustand is jsut like redux
import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE==="development"? "http://localhost:5000/api/auth":"/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message:null,
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signup",
        isLoading: false,
      });
      throw error;
    }
  },
  login:async(email,password)=>{
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email,password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error:null,
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },
  googleLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });
      // Redirect to dashboard after successful login
      window.location.href = "/";
    } catch (error) {
      set({
        error: error.response?.data?.message || "Google authentication failed",
        isLoading: false,
      });
      throw error;
    }
  },
  
  
  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data.user;
    } catch (error) {
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Set checking state
    
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        withCredentials: true,
      });
    

  
      set({
        isAuthenticated: true,
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("Error checking authentication:", error.response?.data?.message);
      set({
        isAuthenticated: false,
        user: null,
        isCheckingAuth: false,
      });
    }
  },
  
  forgotPassword:async(email)=>{
    set({ isLoading: true, error: null, });

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Sending reset password email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword:async(token,password)=>{
    set({isLoading:true,error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Resetting Password",
        isLoading: false,
      });
      throw error;
    }
  }

,
  updatePassword: async (password, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/update-password`, {
        password,
        newPassword,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Updating Password",
        isLoading: false,
      });
      throw error;
    }
  }
}));

