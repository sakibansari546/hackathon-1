import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

const AdminPage = () => {
  const { data } = useSelector((state) => state.admin);
  console.log(data);
  return (
    <>
      <div>
        <h1 className="text-5xl">{data.name}</h1>
        <h1 className="text-5xl">{data.email}</h1>
      </div>
      <Outlet />
    </>
  );
};

export default AdminPage;
