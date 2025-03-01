import React from "react";
import { useSelector } from "react-redux";

// Helper to format date as "1 Oct" or similar
const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Example format: "1 Oct"
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

const PatientReports = () => {
  const { data } = useSelector((state) => state.patient);
  // Suppose each report is stored in data.reports
  // e.g. data = { _id, name, email, reports: [{ _id, name, createdAt }, ...] }

  const reports = data?.reports || [];

  return (
    <div className="bg-[#DCE0D1] min-h-screen p-4 text-green-900">
      {/* Page Title */}
      <h1 className="text-green-600 text-4xl font-bold mb-6">MedVault</h1>

      {/* Container */}
      <div className="max-w-sm mx-auto bg-[#EEF3E0] p-4 rounded-xl shadow-md">
        {/* Reports List */}
        <h1 className="text-center text-xl mb-4 font-semibold">Your reports</h1>
        <div className=" h-[50vh] grid grid-cols-2  gap-5  overflow-y-auto">
          {reports.length === 0 ? (
            <p className="text-center text-gray-600">No reports found.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="flex justify-between items-center flex-col h-[150px] bg-green-900 text-white px-4 py-2 rounded-md"
              >
                    {/* Left: Report name */}
                <span>{report.name || "Unnamed Report"}</span>
                {/* Right: Formatted date */}
                <span>{formatDate(report.createdAt)}</span>
                

                <a href={report.link} className="bg-white px-3 py-1 text-green-900 font-semibold rounded-lg">
                  View Pdf
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReports;
