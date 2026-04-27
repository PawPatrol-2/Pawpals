import React from "react";
import AdminUserList from "../components/AdminUserList/AdminUserList";

const AdminPage = () => {
  const adminToken = localStorage.getItem("token") || "";

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Adminpanel</h1>
      <AdminUserList adminToken={adminToken} />
    </div>
  );
};

export default AdminPage;
