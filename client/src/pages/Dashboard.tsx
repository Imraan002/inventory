import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Row, Col, Button, Tag, Card, Statistic } from "antd";
import {
  FiRefreshCw,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Type definitions
type TimeRange = "daily" | "weekly" | "monthly";
type SalesData = {
  date: string;
  totalSales: number;
  orders: number;
};
type InventoryItem = {
  category: string;
  stock: number;
  total: number;
  color: string;
};
type BrandItem = {
  name: string;
  productCount: number;
  marketShare: number;
};

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const ChartCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;

  .ant-card-head {
    border-bottom: none;
  }

  .ant-card-body {
    padding-top: 0;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .ant-statistic-title {
    color: #6b7280;
  }

  .ant-statistic-content {
    font-size: 24px;
    font-weight: 600;
  }
`;

const TimeRangeTag = styled(Tag)<{ active: boolean }>`
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 16px;
  background: ${(props) => (props.active ? "#1890ff" : "#f3f4f6")} !important;
  color: ${(props) => (props.active ? "white" : "#4b5563")} !important;
  border: none !important;
`;

// Dashboard Component
const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [isLoading, setIsLoading] = useState(false);

  // Mock Data
  const salesData: Record<TimeRange, SalesData[]> = {
    daily: [
      { date: "2025-05-10", totalSales: 1200, orders: 24 },
      { date: "2025-05-11", totalSales: 1800, orders: 32 },
      { date: "2025-05-12", totalSales: 1500, orders: 28 },
      { date: "2025-05-13", totalSales: 2100, orders: 38 },
      { date: "2025-05-14", totalSales: 2400, orders: 42 },
    ],
    weekly: [
      { date: "Week 18", totalSales: 8500, orders: 150 },
      { date: "Week 19", totalSales: 9200, orders: 170 },
      { date: "Week 20", totalSales: 10500, orders: 190 },
      { date: "Week 21", totalSales: 9800, orders: 180 },
      { date: "Week 22", totalSales: 11200, orders: 210 },
    ],
    monthly: [
      { date: "January", totalSales: 38500, orders: 720 },
      { date: "February", totalSales: 41200, orders: 780 },
      { date: "March", totalSales: 45300, orders: 850 },
      { date: "April", totalSales: 48700, orders: 920 },
      { date: "May", totalSales: 52000, orders: 980 },
    ],
  };

  const inventoryStatus: InventoryItem[] = [
    { category: "Electronics", stock: 120, total: 500, color: "#6366f1" },
    { category: "Clothing", stock: 80, total: 200, color: "#ec4899" },
    { category: "Home Goods", stock: 50, total: 150, color: "#f59e0b" },
    { category: "Sports", stock: 70, total: 180, color: "#10b981" },
    { category: "Beauty", stock: 40, total: 100, color: "#3b82f6" },
  ];

  const brands: BrandItem[] = [
    { name: "Brand A", productCount: 150, marketShare: 30 },
    { name: "Brand B", productCount: 120, marketShare: 24 },
    { name: "Brand C", productCount: 80, marketShare: 16 },
    { name: "Brand D", productCount: 200, marketShare: 40 },
    { name: "Brand E", productCount: 50, marketShare: 10 },
  ];

  // Stats data
  const totalSales = salesData[timeRange].reduce(
    (sum, item) => sum + item.totalSales,
    0
  );
  const totalOrders = salesData[timeRange].reduce(
    (sum, item) => sum + item.orders,
    0
  );
  const inventoryValue = inventoryStatus.reduce(
    (sum, item) => sum + item.stock * 50,
    0
  );
  const activeCustomers = 1242;

  // Chart data generators
  const getSalesChartData = () => ({
    labels: salesData[timeRange].map((item) => item.date),
    datasets: [
      {
        label: "Total Sales",
        data: salesData[timeRange].map((item) => item.totalSales),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Orders",
        data: salesData[timeRange].map((item) => item.orders * 50),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  });

  const getInventoryChartData = () => ({
    labels: inventoryStatus.map((item) => item.category),
    datasets: [
      {
        data: inventoryStatus.map((item) => item.stock),
        backgroundColor: inventoryStatus.map((item) => item.color),
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  });

  const getBrandChartData = () => ({
    labels: brands.map((brand) => brand.name),
    datasets: [
      {
        data: brands.map((brand) => brand.productCount),
        backgroundColor: [
          "#6366f1",
          "#ec4899",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  });

  // Chart options with proper TypeScript types
  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
          weight: "bold",
        } as const,
        bodyFont: {
          size: 12,
        } as const,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label.includes("Orders")) {
              return `${label}: ${context.raw / 50}`;
            }
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Sales ($)",
          font: {
            weight: "bold",
          } as const,
        },
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Orders",
          font: {
            weight: "bold",
          } as const,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
          weight: "bold",
        } as const,
        bodyFont: {
          size: 12,
        } as const,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 600, margin: 0 }}>
          Dashboard Overview
        </h1>
        <Button
          icon={<FiRefreshCw />}
          loading={isLoading}
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsContainer>
        <StatCard>
          <Statistic
            title="Total Sales"
            value={totalSales}
            prefix={<span style={{ marginRight: 4 }}>₹</span>}
            valueStyle={{ color: "#4f46e5" }}
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
        </StatCard>
        <StatCard>
          <Statistic
            title="Total Orders"
            value={totalOrders}
            prefix={<FiPackage />}
            valueStyle={{ color: "#10b981" }}
          />
        </StatCard>
        <StatCard>
          <Statistic
            title="Inventory Value"
            value={inventoryValue}
            prefix={<FiTrendingUp />}
            valueStyle={{ color: "#f59e0b" }}
            formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
          />
        </StatCard>
        <StatCard>
          <Statistic
            title="Active Customers"
            value={activeCustomers}
            prefix={<FiUsers />}
            valueStyle={{ color: "#ec4899" }}
          />
        </StatCard>
      </StatsContainer>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ChartCard
            title="Sales Analytics"
            extra={
              <div>
                <TimeRangeTag
                  active={timeRange === "daily"}
                  onClick={() => setTimeRange("daily")}
                >
                  Daily
                </TimeRangeTag>
                <TimeRangeTag
                  active={timeRange === "weekly"}
                  onClick={() => setTimeRange("weekly")}
                >
                  Weekly
                </TimeRangeTag>
                <TimeRangeTag
                  active={timeRange === "monthly"}
                  onClick={() => setTimeRange("monthly")}
                >
                  Monthly
                </TimeRangeTag>
              </div>
            }
          >
            <div style={{ height: 300 }}>
              <Line data={getSalesChartData()} options={salesChartOptions} />
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={8}>
          <ChartCard title="Brand Distribution">
            <div style={{ height: 300 }}>
              <Pie data={getBrandChartData()} options={pieChartOptions} />
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="Inventory by Category">
            <div style={{ height: 300 }}>
              <Pie data={getInventoryChartData()} options={pieChartOptions} />
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="Inventory Status">
            <div style={{ height: 300, overflowY: "auto" }}>
              {inventoryStatus.map((item) => (
                <div key={item.category} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{item.category}</span>
                    <span>
                      {item.stock} / {item.total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      backgroundColor: "#e5e7eb",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(item.stock / item.total) * 100}%`,
                        height: "100%",
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
