import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { TbBrandNodejs } from "react-icons/tb";
import "../App.css"; // Ensure styles apply correctly

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();

  // Define the menu items array, including Employee Management and Masters with potential submenus
  const menuItems = [
    {
      key: "employee_management",
      label: "Employee Management",
      icon: <UserOutlined />,
      path: "/",
    },
    {
      key: "masters",
      label: "Masters",
      icon: <AppstoreOutlined />,
      children: [
        { key: "country_master", label: "Countries", path: "/countries" },
        { key: "state_master", label: "States", path: "/states" },
        { key: "city_master", label: "Cities", path: "/cities" },
        {
          key: "designation_master",
          label: "Designations",
          path: "/designations",
        },
        { key: "skill_master", label: "Skills", path: "/skills" },
      ],
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: "#ddd4d0",
        borderRight: "2px solid black",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Sidebar Logo */}
      <div className="logo">
        {collapsed ? <TbBrandNodejs /> : <b>NodeJS / React</b>}
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["employee_management"]}
        style={{
          backgroundColor: "#b8b3b0",
          color: "black",
          borderRight: "2px solid black",
        }}
      >
        {menuItems.map((item) =>
          item.children ? (
            // SubMenu for Masters
            <Menu.SubMenu
              key={item.key}
              icon={item.icon}
              title={<b>{item.label}</b>}
              popupClassName="submenu-dark-bg" // Background color when expanded
            >
              {item.children.map((subItem) => (
                <Menu.Item
                  key={subItem.key}
                  onClick={() => navigate(subItem.path)}
                >
                  {subItem.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            // Regular Menu.Item for Employee Management
            <Menu.Item
              key={item.key}
              icon={item.icon}
              style={{ color: "black" }}
              onClick={() => navigate(item.path)}
            >
              <b>{item.label}</b>
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
