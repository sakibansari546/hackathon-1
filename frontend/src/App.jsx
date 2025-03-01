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
import StaffLogin from "./staff/StaffLogin";
import { setStaffData } from "./store/slice/staff";
import StaffPage from "./staff/StaffPage";
import StaffPatient from "./staff/StaffPatient";
import CreateReport from "./staff/CreateReport";
import PatientPage from "./patient/PatientPage";
import PatientLogin from "./patient/patientLogin";
import { setPatientData } from "./store/slice/patient";
import PatientReports from "./patient/PatientReports";

// Protected route for Admin pages
function ProtectedRoute({ children }) {
  const { data } = useSelector((state) => state.admin);

  // If admin data is not available, redirect to admin login
  if (!data || !data._id) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

// Updated Protected route for Staff pages
function ProtectedStaffRoute({ children }) {
  const { data: staffData } = useSelector((state) => state.staff);
  // console.log("ProtectedStaffRoute - staffData:", staffData);

  // Check if staff data is not available or missing the unique identifier
  if (!staffData || !staffData._id) {
    return <Navigate to="/staff/login" />;
  }

  return children;
}

function ProtectedPatientRoute({ children }) {
  const { data } = useSelector((state) => state.patient);
  // console.log("ProtectedStaffRoute - staffData:", staffData);

  // Check if staff data is not available or missing the unique identifier
  if (!data || !data._id) {
    return <Navigate to="/patient/login" />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();

  const { data: patientData } = useSelector((state) => state.patient);
  console.log(patientData);

  const checkAdminAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/check-auth`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAdminData(res.data.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(setAdminData(null));
    }
  };

  const checkStaffAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/staff/check-auth`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setStaffData(res.data.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStaffData(null));
    }
  };

  const checkPatientAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/patient/check-auth`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Auth success fully");
        dispatch(setPatientData(res.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Auth Faild");
      dispatch(setPatientData(null));
    }
  };

  useEffect(() => {
    checkPatientAuth();
    checkStaffAuth();
    checkAdminAuth();
  }, []);

  return (
    <div>
      <Toaster />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/login" element={<Login />} />
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

        {/* Staff Routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route
          path="/staff/:staffId"
          element={
            <ProtectedStaffRoute>
              <StaffPage />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/staff/:staffId/:patientId"
          element={
            <ProtectedStaffRoute>
              <StaffPatient />
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="/staff/:staffId/:patientId/create-report"
          element={
            <ProtectedStaffRoute>
              <CreateReport />
            </ProtectedStaffRoute>
          }
        />

        {/* Patient Routes */}
        <Route path="/patient/login" element={<PatientLogin />} />

        <Route
          path="/patient/:patientId"
          element={
            <ProtectedPatientRoute>
              <PatientPage />
            </ProtectedPatientRoute>
          }
        />

        <Route
          path="/patient/:patientId/reports"
          element={
            <ProtectedPatientRoute>
              <PatientReports />
            </ProtectedPatientRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
