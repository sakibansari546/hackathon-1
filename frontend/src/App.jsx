import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Signup from "./admin/Signup";
import { setAdminData } from "./store/slice/admin";
import AdminPage from "./admin/adminPage";
import Login from "./admin/Login";
import AdminDepartments from "./admin/AdminDepartments";
import AdminStaffs from "./admin/AdminStaffs";

function ProtectedRoute({ children }) {
  const { data } = useSelector((state) => state.admin);
  console.log(data);

  // If data is null or undefined, user is NOT logged in
  if (!data || data.length == 0) {
    return <Navigate to="/admin/login" />;
  }

  // If adminData exists, allow access
  return children;
}

function App() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.admin);
  console.log(data);
  const checkAdminAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/check-auth`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAdminData(res.data.data));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(setAdminData(null));
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    checkAdminAuth();
  }, []);

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected routes */}

        <Route
          path="/admin/:adminId"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:adminId/departments"
          element={
            <ProtectedRoute>
              <AdminDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:adminId/:departmentId/staffs"
          element={
            <ProtectedRoute>
              <AdminStaffs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
