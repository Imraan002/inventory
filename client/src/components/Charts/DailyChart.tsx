import { Flex } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useDailySaleQuery } from '../../redux/features/management/saleApi';
import Loader from '../Loader';

// Month names for formatting
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function DailyChart() {
  const { data: dailyData, isLoading } = useDailySaleQuery(undefined);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: 300 }}>
        <Loader />
      </Flex>
    );
  }

  // Format data with fallback for empty state
  const data = dailyData?.data?.map(
    (item: {
      day: number;
      month: number;
      year: number;
      totalRevenue: number;
      totalQuantity: number;
    }) => ({
      name: `${item.day} ${months[item.month - 1]}, ${item.year}`,
      revenue: item.totalRevenue,
      quantity: item.totalQuantity,
    })
  ) || [];

  // If no data available after loading
  if (!data || data.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ height: 300 }}>
        <p>No sales data available</p>
      </Flex>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={Math.floor(data.length / 5)} // Show fewer labels if many data points
        />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'revenue' ? `₹${value}` : value,
            name === 'revenue' ? 'Revenue' : 'Quantity'
          ]}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          name="Revenue"
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.4}
        />
        <Area 
          type="monotone" 
          dataKey="quantity" 
          name="Quantity"
          stroke="#82ca9d" 
          fill="#82ca9d" 
          fillOpacity={0.4}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}