import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

const COLORS = ['#007AFF', '#FFC107', '#17A2B8', '#DC3545', '#28A745', '#6C757D'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className='font-bold text-xs'>
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const DataChart = ({ type, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No data to display for this chart.</p>
      </div>
    );
  }

  if (type === 'Pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value" 
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'Bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data.slice(0, 5)} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical" 
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="requests" 
            name="Total Requests" 
            fill={COLORS[0]} 
            radius={[4, 4, 0, 0]} 
            activeBar={{ fill: COLORS[5] }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="text-red-500">Invalid chart type specified.</div>
  );
};

export default DataChart;