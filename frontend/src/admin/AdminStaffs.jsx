import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdminData } from "../store/slice/admin";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const AdminStaffs = () => {
  const { data } = useSelector((state) => state.admin);
  const { departmentId } = useParams();
  const dispatch = useDispatch();
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  console.log(departmentId);

  // Flatten staffs from each department
  const allStaffs = data?.departments?.flatMap((dept) => dept.staffs) || [];
  const filteredStaffs = allStaffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) {
      toast.error("Both staff name and email are required");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/${
          data._id
        }/${departmentId}/create-staff`,
        { name: staffName, email: staffEmail },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Staff added successfully!");
        setStaffName("");
        setStaffEmail("");
        dispatch(setAdminData(res.data.data));
        setShowAddStaff(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add staff");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-green-900 mb-6 text-center">
          Staffs
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="search staffs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Staffs List */}
        <div className="space-y-2 mb-6 h-[65vh] overflow-y-auto">
          {filteredStaffs.map((staff) => (
            <button
              key={staff._id}
              className="w-full py-3 my-1 px-4 bg-green-800 text-white rounded-md text-left hover:bg-green-700 transition-colors"
            >
              {staff.name}
            </button>
          ))}
        </div>

        {/* Add Staff Button */}
        <button
          onClick={() => setShowAddStaff(true)}
          className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center mx-auto hover:bg-green-700 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Add Staff Popup */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 mx-4 relative">
            <h2 className="text-center text-xl font-medium mb-6">Add Staff</h2>

            <form onSubmit={handleAddStaff}>
              <div className="mb-4">
                <label htmlFor="staffName" className="block text-sm mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  id="staffName"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="staffEmail" className="block text-sm mb-1">
                  Staff Email
                </label>
                <input
                  type="email"
                  id="staffEmail"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-full mt-2"
              >
                Add Staff
              </button>
            </form>

            <button
              onClick={() => setShowAddStaff(false)}
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

export default AdminStaffs;
