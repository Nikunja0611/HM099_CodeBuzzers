import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  // Mock data mimicking your screenshot
  const distributionData = [
    { name: 'SDG 6', value: 3, color: '#0ea5e9' }, // Blue
    { name: 'SDG 4', value: 1, color: '#ef4444' }, // Red
    { name: 'SDG 13', value: 1, color: '#22c55e' }, // Green
    { name: 'SDG 7', value: 1, color: '#eab308' }, // Yellow
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Green Future Foundation</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {['Active Projects', 'Partners', 'Avg Impact Score', 'Pending Requests'].map((title, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <span className="text-gray-500 text-sm font-medium">{title}</span>
            <span className="text-3xl font-bold text-gray-800">
              {['2', '5', '71%', '0'][i]}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SDG Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold mb-6">SDG Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold mb-6">Project Status Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Active</span><span>65%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-green-500 h-3 rounded-full" style={{width: '65%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>At Risk</span><span>20%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{width: '20%'}}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;