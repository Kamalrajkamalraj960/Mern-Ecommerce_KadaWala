import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { FiDollarSign, FiShoppingBag, FiTruck, FiUsers } from 'react-icons/fi';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders/stats/dashboard');
        setDashboardData(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
        showToast(err.response?.data?.message || err.message || 'Failed to load stats', 'error');
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white border border-gray-200 rounded p-6" />
            ))}
          </div>
          <div className="h-96 bg-white border border-gray-200 rounded" />
        </div>
      </AdminLayout>
    );
  }

  const { stats, categoryStats, statusStats, recentOrders } = dashboardData || {};

  const statCards = [
    {
      name: 'Total Revenue',
      value: `₹${stats?.totalSales?.toLocaleString() || '0.00'}`,
      icon: <FiDollarSign className="h-6 w-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <FiTruck className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Catalog',
      value: stats?.totalProducts || 0,
      icon: <FiShoppingBag className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
    {
      name: 'Registered Users',
      value: stats?.totalUsers || 0,
      icon: <FiUsers className="h-6 w-6 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="flex items-center justify-between p-6 bg-white rounded border border-gray-200 shadow-premium"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.name}</p>
                <p className="text-2xl font-black text-brand-charcoal">{card.value}</p>
              </div>
              <div className={`p-4 rounded-full ${card.bgColor}`}>{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Category distribution chart replacement */}
          <div className="lg:col-span-4 bg-white p-6 rounded border border-gray-200 shadow-premium space-y-6">
            <div>
              <h3 className="font-playfair text-lg font-bold text-brand-charcoal">Categories Distribution</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Product count per category</p>
            </div>
            
            <div className="space-y-4">
              {categoryStats?.map((cat) => {
                const percentage = stats?.totalProducts > 0 
                  ? Math.round((cat.count / stats.totalProducts) * 100) 
                  : 0;

                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-brand-charcoal">{cat._id}</span>
                      <span className="text-gray-400">{cat.count} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded overflow-hidden">
                      <div
                        className="bg-brand-green-500 h-full rounded"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders Table (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white p-6 rounded border border-gray-200 shadow-premium space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-playfair text-lg font-bold text-brand-charcoal">Recent Transactions</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Latest store customer checkout events</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      let badgeColor = 'bg-gray-100 text-gray-600';
                      if (order.orderStatus === 'Delivered') badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
                      else if (order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') badgeColor = 'bg-blue-50 text-blue-600 border border-blue-200/50';
                      else if (order.orderStatus === 'Cancelled') badgeColor = 'bg-red-50 text-red-600 border border-red-200/50';

                      return (
                        <tr key={order._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-mono text-xs text-brand-charcoal">{order._id.substring(18)}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-brand-charcoal">{order.user?.name || 'Guest User'}</p>
                            <p className="text-[10px] text-gray-400">{order.user?.email || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-brand-charcoal">₹{order.totalPrice.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400 font-light">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
