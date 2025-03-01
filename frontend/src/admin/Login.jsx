import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setAdminData } from "../store/slice/admin";
import { Navigate, useNavigate } from "react-router";
import Patient from "./Patient";

const Login = () => {
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    role: "user", // Default role
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAdminData(res.data.data));
        toast.success(res.data.message);
        navigate(`/admin/${res.data.data._id}`);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      navigate(`/admin/${data._id}`);
    }
  }, [data, navigate]);

  return (
   <div>
     <div className="flex flex-col h-screen bg-green-50">
  <div className="h-[30%] w-full flex justify-center items-center">
    <h1 className="text-green-500 text-4xl text-center font-bold">MedVault</h1>
  </div>
  <div className="bg-green-900 p-8 rounded-tl-[8rem] shadow-md w-full flex-grow">
    <h1 className="text-5xl text-green-50 font-bold mb-6 text-center">Login</h1>
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg outline-none focus:ring-0"
      >
        <option value="user" className="p-2">I am a Patient</option>
        <option value="admin" className="p-2">I am a Staff</option>
      </select>
      <input
        onChange={handleChange}
        type="email"
        name="email"
        placeholder="What's your username?"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        onChange={handleChange}
        type="password"
        name="password"
        placeholder="And what about password?"
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


      <div className="h-[30%] w-full flex justify-center items-center">
        <h1 className="text-green-500 text-4xl text-center font-bold">
          MedVault
        </h1>
      </div>
      <div className="bg-green-900 p-8 rounded-tl-[8rem] shadow-md w-full flex-grow">
        <h1 className="text-5xl text-green-50 font-bold mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <select
            name="role"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg outline-none focus:ring-0"
          >
            <option value="user" className="p-2">
              I am a Patient
            </option>
            <option value="admin" className="p-2">
              I am a Staff
            </option>
          </select>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="What's your username?"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="And what about password?"
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

export default Login;