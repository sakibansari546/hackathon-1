import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const StaffPatient = () => {
  const { data } = useSelector((state) => state.staff);
  const { staffId, patientId } = useParams();

  // 1) Find the specific patient in the staff data
  //    (assuming 'data' is your staff object with an array 'patients')
  const patient = data?.patients?.find((p) => p._id === patientId);

  // 2) Extract the patient's reports array
  const reports = patient?.reports || [];

  return (
    <div className="bg-[#DCE0D1] min-h-screen p-4 text-green-900">
      {/* Page Title */}
      <h1 className="text-green-600 text-4xl font-bold mb-12">MedVault</h1>

      {/* Container for Cards */}
      <div className="max-w-sm border border-neutral-600 p-3 h-[80vh]  overflow-auto rounded-xl mx-auto space-y-4">
        {/* Large Card */}
        <Link to={`/staff/${staffId}/${patientId}/create-report`}>
          <div className="bg-green-900 h-[150px]  text-white rounded-xl relative p-6 min-h-[8rem]">
            {/* Arrow Button */}
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-green-900 flex items-center justify-center hover:bg-gray-200 transition-colors">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            {/* Card Text */}
            <h2 className="text-2xl absolute bottom-[10%] left-[5%] font-semibold mt-4">
              Create a Medical report
            </h2>
          </div>
        </Link>

        {/* Smaller Card */}
        <div className="border border-gray-600 text-green-900 rounded-xl relative p-4 min-h-[6rem]">
          {/* Arrow Button */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-green-900 flex items-center justify-center hover:bg-gray-200 transition-colors">
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {/* Card Text */}
          <h2 className="text-lg w-[100px] leading-5 absolute bottom-[10%] left-[5%] font-semibold mt-2">
            Upload Test reports
          </h2>
        </div>
        {/* Show all reports */}
        <div className="max-w-sm mx-auto mt-6 pt-5 border-t border-gray-400/80 ">
          <h2 className="text-xl font-semibold mb-4">created reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {reports.map((report, index) => (
                <div
                  key={report._id}
                  className="bg-green-900 text-white rounded-xl p-4 flex  flex-col gap-3 text-left"
                >
                  {/* Label */}
                  <div className="min-h-[30px] text-sm ">{report.name}</div>
                  {/* Optional: If you want to link to the PDF: */}
                  <a
                    href={report.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline mt-2"
                  >
                    View PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPatient;
