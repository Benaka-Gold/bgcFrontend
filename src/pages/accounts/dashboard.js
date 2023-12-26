import React from "react";
import { getBusinessByPeriod } from "../../apis/business";
import { Grid, Card, CardContent, Typography, Paper} from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, } from "recharts";

const dashboardMetrics = [
  { title: "Total Customers Today", value: "123" },
  { title: "Total Business Finished", value: "45" },
  { title: "Approval Required", value: "10" },
  { title: "Total Net Weight Today", value: "150 kg" },
  { title: "Total Transaction Amount", value: "$20,000" },
  { title: "Average Transaction Value", value: "$440" },
  { title: "Pending Transactions", value: "7" },
  { title: "Revenue Trends", value: "See Chart" },
  { title: "Top Performing Executives", value: "See Table" },
];

const tableData = [
  { name: "John Doe", transactions: 36, revenue: "$12,000" },
  { name: "Jane Smith", transactions: 24, revenue: "$8,500" },
  { name: "Alice Johnson", transactions: 18, revenue: "$6,300" },
  { name: "Bob Brown", transactions: 15, revenue: "$5,000" },
  // ... additional executives
];

const chartData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 3800 },
  { name: "Jul", revenue: 4300 },
  { name: "Aug", revenue: 4100 },
  { name: "Sep", revenue: 5000 },
  { name: "Oct", revenue: 4800 },
  { name: "Nov", revenue: 5200 },
  { name: "Dec", revenue: 5500 },
  // ... additional months or other relevant time periods
];


export default function Dashboard() {
  async function getB() {
    const res = await getBusinessByPeriod(new Date("18/12/2023"), new Date());
    console.log(res);
  }

  React.useEffect(() => {
    getB();
  });

  return (
    <Grid container spacing={3} 
    sx={{ 
    width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" },
    height : '90vh',
    ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
    p: 3,
    fontFamily: "Poppins, sans-serif", 
    backgroundColor: "#f7f7f8" 
    }}>
      {dashboardMetrics.map((metric) => (
        <Grid item xs={12} sm={6} md={4} key={metric.title}>
          <DashboardMetricCard title={metric.title} value={metric.value} />
        </Grid>
      ))}
      
      <Grid item xs={12}>
      <Paper >
          <RevenueTrendChart data={chartData} />
        </Paper>
      </Grid>
    </Grid>
  );
}


const RevenueTrendChart = ({ data }) => (
  <LineChart
    width={600}
    height={300}
    data={data}
    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  >
    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart>
);

const DashboardMetricCard = ({ title, value }) => (
  <Card >
    <CardContent>
      <Typography  color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography  variant="h5" component="h2">
        {value}
      </Typography>
    </CardContent>
  </Card>
);
