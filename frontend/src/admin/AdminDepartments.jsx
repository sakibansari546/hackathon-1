"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdminData } from "../store/slice/admin";
import toast from "react-hot-toast";

const AdminDepartments = () => {
  const { data } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments =
    data?.departments?.filter((dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-green-900 mb-6 text-center">
          Departments
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="search departments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Departments List */}
        <div className="space-y-2 mb-6">
          {filteredDepartments.map((department) => (
            <button
              key={department._id}
              className="w-full py-3 px-4 bg-green-800 text-white rounded-md text-left hover:bg-green-700 transition-colors"
            >
              {department.name}
            </button>
          ))}
        </div>

        {/* Add Department Button */}
        <button
          onClick={() => setShowAddDepartment(true)}
          className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center mx-auto hover:bg-green-700 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Add Department Popup */}
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
    </div>
  );
};

export default AdminDepartments;
