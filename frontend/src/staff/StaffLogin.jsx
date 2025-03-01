import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setStaffData } from "../store/slice/staff";
import { useNavigate } from "react-router";

const StaffLogin = () => {
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.staff);
  const dispatch = useDispatch();
  console.log(data);

  const [formData, setFormData] = useState({
    email: "",
    loginId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.loginId) {
      toast.error("Email and Login ID are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/staff/login`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setStaffData(res.data.data));
        toast.success(res.data.message);
        navigate("/staff/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  // console.log(data);

  useEffect(() => {
    if (data) {
      navigate(`/staff/${data._id}`);
    }
  }, [data, navigate]);

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* Logo/Title */}
      <div className="h-[30%] w-full flex justify-center items-center">
        <h1 className="text-green-500 text-4xl text-center font-bold">
          MedVault
        </h1>
      </div>
      {/* Login Form */}
      <div className="bg-green-900 p-8 rounded-tl-[5rem] pt-12 shadow-md w-full flex-grow">
        <h1 className="text-4xl text-green-50 font-bold mb-6 text-center">
          Staff Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={handleChange}
            type="text"
            name="loginId"
            placeholder="Enter your Login ID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-10 py-3 bg-blue-50 text-green-900 rounded-lg shadow-[5px_5px_0px_rgba(34,197,94,1)]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
