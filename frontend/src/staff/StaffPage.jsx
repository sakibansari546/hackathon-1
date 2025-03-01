import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { setStaffData } from "../store/slice/staff";

const StaffPage = () => {
  // Redux & URL Params
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.staff);
  const { staffId } = useParams();
  // Ensure your route is something like "/staff/:staffId"

  // If your staff has a single department ID stored in data.departmentId:
  const departmentId = data?.departmentId;

  // State for searching & adding patients
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  // Patients from Redux
  const patients = data?.patients || [];

  // Filtered patients
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add Patient Submission
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim()) {
      toast.error("Please enter both Name and Email");
      return;
    }
    if (!staffId || !departmentId) {
      toast.error("Missing staffId or departmentId!");
      return;
    }
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/staff/${staffId}/${departmentId}/create-patient`,
        { name: patientName, email: patientEmail },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Updated staff (including new patient)
        dispatch(setStaffData(res.data.data));
        toast.success(res.data.message);

        // Reset form & close popup
        setPatientName("");
        setPatientEmail("");
        setShowAddPatient(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create patient.");
    }
  };
  console.log(data);

  return (
    <div className="bg-[#DCE0D1] min-h-screen p-4 text-green-600">
      <h1 className="text-4xl font-bold mb-6">MedVault</h1>

      {/* Container */}
      <div className="max-w-sm mx-auto bg-[#EEF3E0] p-6 rounded-xl shadow-md">
        {/* Search Bar */}
        <div className="relative mb-4">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m0 0A8 8 0 119 3a8 8 0 016 13z"
            />
          </svg>
          <input
            type="text"
            placeholder="search patients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Patients List */}
        <div className="space-y-2 mb-6 h-[45vh] overflow-y-auto">
          {filteredPatients.map((patient) => (
            <Link to={`/staff/${data._id}/${patient._id}`} key={patient._id}>
              <div className="flex my-2 justify-between items-center bg-green-800 text-white px-4 py-2 rounded-md">
                <span>{patient.name}</span>
                <span>{patient.loginId || patient._id}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Add Patient Button */}
        <button
          onClick={() => setShowAddPatient(true)}
          className="w-full py-3 rounded-full bg-green-800 text-white font-medium hover:bg-green-700 transition-colors"
        >
          + add patient
        </button>
      </div>

      {/* Add Patient Popup */}
      {showAddPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 mx-4 relative">
            <h2 className="text-center text-xl font-medium mb-6">
              Add Patient
            </h2>

            <form onSubmit={handleAddPatient}>
              <div className="mb-4">
                <label htmlFor="patientName" className="block text-sm mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="patientEmail" className="block text-sm mb-1">
                  Patient Email
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-full mt-2"
              >
                Add Patient
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setShowAddPatient(false)}
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

export default StaffPage;
