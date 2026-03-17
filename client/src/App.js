import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
// import EmployeDetailsList from "./list/employeDetailsList";
import AddEmployeeDetailsForm from "./employeeManagement/components/addEmployeeDetailsForm";
// import Sidebar from "./components/Sidebar"; // Import Sidebar component
import "./App.css";
import Sidebar from "./sidebar";
import EmployeDetailsList from "./employeeManagement/list/employeDetailsList";
import EditableTable from "./masters/city";
import DesignationEditableTable from "./masters/designation";
import DepartmentEditableTable from "./masters/department";

const { Header, Content } = Layout;

function App() {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const renderHeader = () => {
    switch (pathname) {
      case "/":
        return "Employee Management";
      case "/designations":
        return "Designation";
      case "/departments":
        return "Department";
      default:
        return;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar Component */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header
          style={{
            background: "#ddd4d0",
            borderBottom: "2px solid black",
            display: "flex",
            alignItems: "center",
            position: "fixed",
            width: "calc(100% - 30px)",
            left: collapsed ? 80 : 250,
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="menu-toggle"
          />
          <h2 style={{ marginLeft: 20 }}>{renderHeader()}</h2>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            padding: "80px 20px 20px",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: "#f5f5f5",
            marginLeft: 30,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<EmployeDetailsList />} />
            <Route
              path="/add-employee-details"
              element={<AddEmployeeDetailsForm />}
            />
            <Route
              path="/edit-employee-details"
              element={<AddEmployeeDetailsForm />}
            />
            <Route
              path="/view-employee-details"
              element={<AddEmployeeDetailsForm />}
            />
            {/* <Route path="/cities" element={<EditableTable />} />{" "} */}
            <Route
              path="/designations"
              element={<DesignationEditableTable />}
            />
            <Route
              path="/departments"
              element={<DepartmentEditableTable />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
