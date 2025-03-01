import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setPatientData } from "../store/slice/patient"; // Adjust path as needed
import axios from "axios";
import toast from "react-hot-toast";

const PatientPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.patient);

  // Handle Logout
  const handleLogout = async () => {
    try {
      // Example: If you have an endpoint for patient logout
      // Or you can just remove the cookie on the server side
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(setPatientData(null)); // Clear patient data in Redux
      toast.success("Logged out successfully!");
      navigate("/patient/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <div className="bg-[#DCE0D1] min-h-screen p-4 text-green-900">
      {/* Top Title */}
      <h1 className="text-green-600 text-4xl font-bold mb-8">MedVault</h1>

      {/* Main Container */}
      <div className="max-w-sm mx-auto space-y-4">
        {/* Big Card */}
        <Link to={`/patient/${data._id}/reports`}>
          <div className="relative bg-green-900 text-white p-6 rounded-xl min-h-[8rem]">
            {/* Lock Icon (top-right) */}
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-green-900 flex items-center justify-center hover:bg-gray-200 transition-colors">
              {/* Lock Icon (using an inline SVG example) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.656 0 3-1.343 3-3V7c0-1.657-1.344-3-3-3s-3 1.343-3 3v1c0 1.657 1.344 3 3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 11h14v10H5z"
                />
              </svg>
            </button>
            {/* Card Text */}
            <h2 className="text-2xl font-semibold absolute bottom-4 left-4">
              your vault
            </h2>
          </div>
        </Link>

        {/* Row with Two Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Manage Profile Card */}
          <div className="relative bg-[#EEF3E0] text-green-900 p-4 rounded-xl">
            {/* Profile/User Icon (top-right) */}
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center hover:bg-green-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A3.987 3.987 0 018 16h8a3.987 3.987 0 012.879 1.204M12 7a4 4 0 110 8 4 4 0 010-8z"
                />
              </svg>
            </button>
            {/* Text */}
            <h2 className="text-lg font-semibold mt-8">Manage your profile</h2>
          </div>

          {/* Exit Card */}
          <div className="relative bg-red-100 text-red-500 p-4 rounded-xl flex items-center justify-center">
            <button
              onClick={handleLogout}
              className="text-xl font-semibold hover:underline"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
