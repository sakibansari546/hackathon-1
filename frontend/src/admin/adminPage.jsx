"use client";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { createDepartment, setAdminData } from "../store/slice/admin";
import toast from "react-hot-toast";
import { useState } from "react";

const AdminPage = () => {
  const { data } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  console.log(data);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/logout`
      );
      if (res.data.success) {
        dispatch(setAdminData(null));
        toast.success("Logout success fully!");
        navigate("/admin/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/${data._id}/create-department`,
        { name: departmentName },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Department added successfully!");
        setDepartmentName("");
        dispatch(setAdminData(res.data.data));
        setShowAddDepartment(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add department");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold text-green-500">MedVault</h1>
        </div>
      </header>

      <div className="container mx-auto flex-1 p-4">
        <div className="max-w-md mx-auto border border-slate-200 h-[100%] rounded-lg p-4 bg-slate-50 shadow-sm">
          <div className="space-y-3">
            <button className="w-full h-[160px] py-3 relative px-4 bg-green-900 text-white rounded-md text-left">
              <div
                onClick={() => setShowAddDepartment(true)}
                className="flex justify-between items-center"
              >
                <span className="text-3xl w-[50px] leading-7 absolute bottom-[10%] font-semibold ">Add Departments</span>
                <span className="rounded-full bg-white absolute top-[10%] right-[5%] w-6 h-6 flex items-center justify-center text-green-700">
                  +
                </span>
              </div>
            </button>

            <button
              className="w-full py-3 px-4 bg-red-50 text-red-600 border border-red-500 rounded-md text-left"
              onClick={handleLogout}
            >
              <span className="text-2xl font-semibold ">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Department Popup */}``
      {showAddDepartment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 mx-4">
            <h2 className="text-center text-xl font-medium mb-6">
              add department
            </h2>

            <form onSubmit={handleAddDepartment}>
              <div className="mb-4">
                <label htmlFor="departmentName" className="block text-sm mb-1">
                  department name
                </label>
                <input
                  type="text"
                  id="departmentName"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-full mt-2"
              >
                add department
              </button>
            </form>

            <button
              onClick={() => setShowAddDepartment(false)}
              className="absolute text-2xl top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default AdminPage;
