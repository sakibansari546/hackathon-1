import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPatientData } from "../store/slice/patient"; // Adjust path to your slice
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PatientLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.patient);
  console.log(data);

  const [formData, setFormData] = useState({
    email: "",
    loginId: "",
  });
  const [loading, setLoading] = useState(false);

  // If patient data is already in Redux, redirect to patient page
  useEffect(() => {
    if (data && data._id) {
      navigate(`/patient/${data._id}`);
    }
  }, [data, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.loginId) {
      toast.error("Please enter both Email and Login ID");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/login`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPatientData(res.data.data));
        navigate(`/patient/${res.data.data._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Header */}
      <div className="h-[30%] w-full flex justify-center items-center">
        <h1 className="text-green-500 text-4xl text-center font-bold">
          MedVault
        </h1>
      </div>

      {/* Login Form */}
      <div className="bg-green-900 p-8 rounded-tl-[8rem] shadow-md w-full flex-grow">
        <h1 className="text-5xl text-green-50 font-bold mb-6 text-center">
          Patient Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            onChange={handleChange}
            type="text"
            name="loginId"
            placeholder="Enter your Login ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-50 text-green-900 rounded-lg shadow-[5px_5px_0px_rgba(34,197,94,1)] hover:bg-blue-100 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
