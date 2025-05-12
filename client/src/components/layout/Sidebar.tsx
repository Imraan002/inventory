import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Layout, Menu, theme, Space, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { sidebarItems } from "../../constant/sidebarItems";
import { useAppDispatch } from "../../redux/hooks";
import { logoutUser } from "../../redux/services/authSlice";
//import Logo from "../../assets/logo.svg"; // Replace with your logo

const { Content, Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  // Find the selected key based on current route
  const selectedKey = sidebarItems.find(item => 
    item?.key && location.pathname.includes(item.key.toString().toLowerCase())
  )?.key?.toString() || "dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={240}
        style={{
          background: colorBgContainer,
          boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
        breakpoint="lg"
        collapsedWidth={80}
      >
        <Space 
          direction="vertical" 
          style={{ 
            width: "100%", 
            padding: collapsed ? "16px 8px" : "16px 24px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            marginBottom: 8
          }}
        >
          {collapsed ? (
            <img 
          //    src={Logo} 
              alt="Logo" 
              style={{ width: 32, height: 32, margin: "0 auto" }} 
            />
          ) : (
            <>
          {/* <img src={Logo} alt="Logo" style={{ width: 32, height: 32 }} /> */}
              <Text strong style={{ fontSize: 16, marginLeft: 8 }}>
                WELCOME
              </Text>
            </>
          )}
        </Space>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={sidebarItems}
          style={{ 
            borderRight: 0,
            padding: "0 8px"
          }}
        />

        <div style={{ 
          padding: collapsed ? "16px 8px" : "16px 24px", 
          position: "absolute", 
          bottom: 0, 
          width: "100%",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)"
        }}>
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            style={{
              height: 40,
              display: "flex",
              marginBottom:"50px",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content style={{ 
          padding: 24, 
          background: "#f5f7fa",
          minHeight: "calc(100vh - 48px)"
        }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 1px 2px 0 rgba(29, 35, 41, 0.05)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;