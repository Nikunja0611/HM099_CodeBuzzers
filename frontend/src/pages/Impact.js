import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { TrendingUp, Users, Globe, Target, Loader2 } from 'lucide-react';

const Impact = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={40}/></div>;

  // Prepare chart data if stats exists
  const chartData = stats && stats.sdg_dist 
    ? stats.sdg_dist.map(item => ({ name: `SDG ${item._id}`, value: item.count }))
    : [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
        <p className="text-gray-500 mt-1">Live data from all projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Projects', value: stats.total, icon: <Target size={24}/>, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Active', value: stats.active, icon: <TrendingUp size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Partner Orgs', value: stats.partners, icon: <Users size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50' },
          { title: 'SDGs Covered', value: stats.sdg_dist.length, icon: <Globe size={24}/>, color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
         <h3 className="text-lg font-bold text-gray-900 mb-6">SDG Impact Distribution</h3>
         <div className="h-64">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" fill="#8884d8">
                    {chartData.map((entry, index) => <Cell key={index} fill={['#0ea5e9', '#f97316', '#10b981', '#f59e0b'][index % 4]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                    No data available yet. Create a project to see charts.
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Impact;