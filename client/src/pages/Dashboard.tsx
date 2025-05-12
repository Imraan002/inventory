import { useState } from 'react';
import { Col, Row, Table, Tag, Modal, Button, Spin, Card } from 'antd';
import { 
  AiOutlineStock, 
  AiOutlineShopping, 
  AiOutlineMessage,
  AiOutlineTeam
} from 'react-icons/ai';
import { 
  BsCashStack, 
  BsBoxSeam
} from 'react-icons/bs';
import { 
  MdOutlineSell
} from 'react-icons/md';
import { 
  FiRefreshCw
} from 'react-icons/fi';
import { Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale,
  Title
} from 'chart.js';
import styled from 'styled-components';

// Redux imports
import { 
  useCountProductsQuery,
  useGetAllProductsQuery,
} from '../redux/features/management/productApi';
import { 
  useYearlySaleQuery,
  useDailySaleQuery,
  useMonthlySaleQuery
} from '../redux/features/management/saleApi';
import { useGetAllSellerQuery } from '../redux/features/management/sellerApi';
import { useGetAllBrandsQuery } from '../redux/features/management/brandApi';
import { useGetAllPurchasesQuery } from '../redux/features/management/purchaseApi';

// Register Chart.js
ChartJS.register(
  ArcElement, Tooltip, Legend, LineElement, 
  PointElement, LinearScale, CategoryScale, Title
);

// Type Definitions
interface Purchase {
  _id: string;
  referenceNumber?: string;
  createdAt: string;
  status?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  category: string;
  brand: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  status: string;
}

interface InventoryStatus {
  id: string;
  category: string;
  stock: number;
  total: number;
  color: string;
}

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;

interface StatCardProps {
  color?: string;
}

const StatCard = styled(Card)<StatCardProps>`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-top: 4px solid ${props => props.color || '#8b5cf6'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 16px;
    text-align: center;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const IconWrapper = styled.div<{ color: string }>`
  font-size: 24px;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

// Mock categories data
const mockCategories: Category[] = [
  { _id: '1', name: 'Electronics' },
  { _id: '2', name: 'Clothing' },
  { _id: '3', name: 'Home Goods' },
  { _id: '4', name: 'Sports' },
  { _id: '5', name: 'Beauty' },
];

const Dashboard = () => {
  // State
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // API Hooks
  const { 
    data: products, 
    isLoading: isLoadingProducts, 
    refetch: refetchProducts
  } = useCountProductsQuery(undefined);
  
  const { 
    data: yearlyData, 
    isLoading: isLoadingSales, 
    refetch: refetchSales
  } = useYearlySaleQuery(undefined);
  
  const { 
    data: allProductsResponse, 
    isLoading: isLoadingAllProducts 
  } = useGetAllProductsQuery(undefined);
  
  const { 
    data: sellersResponse, 
    isLoading: isLoadingSellers 
  } = useGetAllSellerQuery(undefined);
  
  const { 
    data: brandsResponse, 
    isLoading: isLoadingBrands 
  } = useGetAllBrandsQuery(undefined);
  
  const { 
    data: purchasesResponse, 
    isLoading: isLoadingPurchases 
  } = useGetAllPurchasesQuery(undefined);

  // Chart data hooks
  const { data: dailyData } = useDailySaleQuery(undefined);
  const { data: monthlyData } = useMonthlySaleQuery(undefined);

  // Use mock categories
  const categories = mockCategories;

  // Safely handle API responses
  const allProducts = Array.isArray(allProductsResponse?.data) 
    ? allProductsResponse.data 
    : Array.isArray(allProductsResponse)
    ? allProductsResponse
    : [];
    
  const purchases = Array.isArray(purchasesResponse?.data) 
    ? purchasesResponse.data 
    : Array.isArray(purchasesResponse)
    ? purchasesResponse
    : [];

  const brands = Array.isArray(brandsResponse?.data)
    ? brandsResponse.data
    : Array.isArray(brandsResponse)
    ? brandsResponse
    : [];

  const sellers = Array.isArray(sellersResponse?.data)
    ? sellersResponse.data
    : Array.isArray(sellersResponse)
    ? sellersResponse
    : [];

  // Calculate metrics
  const totalSold = yearlyData?.data?.reduce(
    (acc: number, cur: { totalQuantity?: number }) => acc + (cur.totalQuantity || 0), 0
  ) || 0;

  const totalRevenue = yearlyData?.data?.reduce(
    (acc: number, cur: { totalRevenue?: number }) => acc + (cur.totalRevenue || 0), 0
  ) || 0;

  // Prepare data for visualizations
  const recentActivities: RecentActivity[] = purchases
    .slice(0, 5)
    .map((purchase: Purchase) => ({
      id: purchase._id,
      action: `Purchase #${purchase.referenceNumber || purchase._id.slice(0, 6)}`,
      time: new Date(purchase.createdAt).toLocaleDateString(),
      status: purchase.status || 'completed'
    }));

  const inventoryStatus: InventoryStatus[] = categories.map((category: Category) => ({
    id: category._id,
    category: category.name,
    stock: allProducts.filter((product: Product) => product.category === category._id).length,
    total: allProducts.length,
    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
  }));

  const brandDistribution = {
    labels: brands.map((brand: Brand) => brand.name),
    datasets: [{
      data: brands.map((brand: Brand) => 
        allProducts.filter((product: Product) => product.brand === brand._id).length
      ),
      backgroundColor: brands.map(() => 
        `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
      ),
      borderWidth: 1,
    }]
  };

  const salesTrendData = {
    labels: dailyData?.data?.map((item: { day: string }) => item.day) || [],
    datasets: [{
      label: 'Daily Sales',
      data: dailyData?.data?.map((item: { totalSales: number }) => item.totalSales) || [],
      fill: false,
      borderColor: '#1890ff',
      tension: 0.4,
    }]
  };

  // Loading state
  const isLoading = isLoadingProducts || isLoadingSales || 
                   isLoadingAllProducts || isLoadingSellers || isLoadingBrands || 
                   isLoadingPurchases;

  if (isLoading) return <Spin size="large" style={{ width: '100%', marginTop: '100px' }} />;

  return (
    <DashboardContainer>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
          Dashboard Overview
        </h1>
        <Button 
          icon={<FiRefreshCw />} 
          onClick={() => {
            refetchProducts();
            refetchSales();
          }}
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard color="#8b5cf6">
            <IconWrapper color="#8b5cf6">
              <AiOutlineStock />
            </IconWrapper>
            <StatValue>{(products?.data?.totalQuantity || 0).toLocaleString()}</StatValue>
            <StatLabel>Total Inventory</StatLabel>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatCard color="#10b981">
            <IconWrapper color="#10b981">
              <MdOutlineSell />
            </IconWrapper>
            <StatValue>{totalSold.toLocaleString()}</StatValue>
            <StatLabel>Total Sold</StatLabel>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatCard color="#3b82f6">
            <IconWrapper color="#3b82f6">
              <BsCashStack />
            </IconWrapper>
            <StatValue>${totalRevenue.toLocaleString()}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatCard color="#f59e0b">
            <IconWrapper color="#f59e0b">
              <AiOutlineTeam />
            </IconWrapper>
            <StatValue>{sellers.length.toLocaleString()}</StatValue>
            <StatLabel>Active Sellers</StatLabel>
          </StatCard>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
          <ChartContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Sales Analytics</h3>
              <div>
                <Tag 
                  color={activeTab === 'daily' ? '#1890ff' : 'default'} 
                  onClick={() => setActiveTab('daily')}
                  style={{ cursor: 'pointer' }}
                >
                  Daily
                </Tag>
                <Tag 
                  color={activeTab === 'monthly' ? '#1890ff' : 'default'} 
                  onClick={() => setActiveTab('monthly')}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                >
                  Monthly
                </Tag>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line 
                data={activeTab === 'daily' ? salesTrendData : {
                  labels: monthlyData?.data?.map((item: { month: string }) => item.month) || [],
                  datasets: [{
                    label: 'Monthly Sales',
                    data: monthlyData?.data?.map((item: { totalSales: number }) => item.totalSales) || [],
                    fill: false,
                    borderColor: '#1890ff',
                    tension: 0.4,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </ChartContainer>

          <ChartContainer>
            <h3 style={{ marginBottom: '16px' }}>Inventory by Category</h3>
            <div style={{ height: '300px' }}>
              <Pie 
                data={{
                  labels: inventoryStatus.map(item => item.category),
                  datasets: [{
                    data: inventoryStatus.map(item => (item.stock / item.total) * 100),
                    backgroundColor: inventoryStatus.map(item => item.color),
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'bottom',
                      labels: {
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </ChartContainer>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={12}>
          <ChartContainer>
            <h3 style={{ marginBottom: '16px' }}>Recent Purchases</h3>
            <Table 
              dataSource={recentActivities}
              columns={[
                {
                  title: 'Purchase',
                  dataIndex: 'action',
                  key: 'action'
                },
                {
                  title: 'Date',
                  dataIndex: 'time',
                  key: 'time'
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={status === 'completed' ? 'green' : 'blue'}>
                      {status.toUpperCase()}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </ChartContainer>

          <ChartContainer>
            <h3 style={{ marginBottom: '16px' }}>Brand Distribution</h3>
            <div style={{ height: '300px' }}>
              <Pie 
                data={brandDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'bottom',
                      labels: {
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </ChartContainer>

          <ChartContainer>
            <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <Button 
                  type="primary" 
                  icon={<AiOutlineShopping />}
                  block
                  onClick={() => setShowOrderModal(true)}
                >
                  New Order
                </Button>
              </Col>
              <Col xs={12} sm={8}>
                <Button 
                  icon={<BsBoxSeam />}
                  block
                >
                  Add Product
                </Button>
              </Col>
              <Col xs={12} sm={8}>
                <Button 
                  icon={<AiOutlineMessage />}
                  block
                >
                  Messages
                </Button>
              </Col>
            </Row>
          </ChartContainer>
        </Col>
      </Row>

      {/* Order Modal */}
      <Modal
        title="Create New Order"
        open={showOrderModal}
        onCancel={() => setShowOrderModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowOrderModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Create Order
          </Button>,
        ]}
        width={800}
      >
        <Spin spinning={isLoadingAllProducts || isLoadingSellers}>
          <p>Order form would be implemented here using your saleApi</p>
          <p>Available products: {allProducts.length}</p>
          <p>Available sellers: {sellers.length}</p>
        </Spin>
      </Modal>
    </DashboardContainer>
  );
};

export default Dashboard;