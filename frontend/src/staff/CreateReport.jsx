import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // If you're using react-router-dom
import axios from "axios";
import toast from "react-hot-toast";
import { setStaffData } from "../store/slice/staff";

const CreateReport = () => {
  // 1) Pull IDs from URL and departmentId from Redux
  const { staffId, patientId } = useParams();
  const { data } = useSelector((state) => state.staff);
  const dispatch = useDispatch();

  // Example: staff might have a single department ID stored in Redux
  const departmentId = data?.departmentId;

  // 2) Local state for form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [medicines, setMedicines] = useState([
    { medicineName: "", dosage: "", instruction: "" },
  ]);

  // 3) Handlers for adding/removing medicines
  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { medicineName: "", dosage: "", instruction: "" },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // 4) Submit handler - sends data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!staffId || !departmentId) {
      toast.error("Missing staffId or departmentId!");
      return;
    }
    if (!name.trim() || !age.trim() || !sex.trim()) {
      toast.error("Please fill out name, age, and sex.");
      return;
    }

    const reportData = {
      name,
      age,
      sex,
      medicines,
      patientId, // so the backend can link the PDF to the patient if needed
    };

    try {
      // Example: call your PDF creation route
      const res = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/staff/${staffId}/${patientId}/create-pdf-report`,
        reportData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setStaffData(res.data.data));
        toast.success("PDF created & uploaded successfully!");
        // res.data.data might contain the newly created report
        console.log("New Report:", res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create PDF.");
    }
  };

  return (
    <div className="bg-[#DCE0D1] min-h-screen p-4 text-green-900">
      <h1 className="text-green-600 text-4xl font-bold mb-6">MedVault</h1>

      <div className="max-w-sm mx-auto bg-[#EEF3E0] p-6 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="age" className="block mb-1 text-sm font-medium">
                age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block mb-1 text-sm font-medium">
              sex
            </label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Select sex</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>

          {/* Medicines Section */}
          <div className="bg-green-900 text-white p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Medicines
            </h2>

            {medicines.map((med, index) => (
              <div
                key={index}
                className="bg-white text-green-900 p-4 rounded-md mb-4 relative"
              >
                {/* Medicine Name */}
                <div className="mb-3">
                  <label
                    htmlFor={`medicineName-${index}`}
                    className="block text-sm mb-1 font-medium"
                  >
                    medicine name
                  </label>
                  <input
                    id={`medicineName-${index}`}
                    type="text"
                    value={med.medicineName}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "medicineName",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Dosage */}
                <div className="mb-3">
                  <label
                    htmlFor={`dosage-${index}`}
                    className="block text-sm mb-1 font-medium"
                  >
                    dosage
                  </label>
                  <input
                    id={`dosage-${index}`}
                    type="text"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicineChange(index, "dosage", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Instruction */}
                <div className="mb-3">
                  <label
                    htmlFor={`instruction-${index}`}
                    className="block text-sm mb-1 font-medium"
                  >
                    instruction
                  </label>
                  <input
                    id={`instruction-${index}`}
                    type="text"
                    value={med.instruction}
                    onChange={(e) =>
                      handleMedicineChange(index, "instruction", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(index)}
                  className="text-red-500 text-sm absolute top-3 right-3 hover:underline"
                >
                  remove
                </button>
              </div>
            ))}

            {/* Add Medicine Button */}
            <button
              type="button"
              onClick={handleAddMedicine}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors mx-auto"
            >
              <span>+ Add medicine</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-green-800 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Send medicine report
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
