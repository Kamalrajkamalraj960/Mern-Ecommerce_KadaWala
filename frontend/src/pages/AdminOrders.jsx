import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import API from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { FiSearch, FiEdit2, FiInfo, FiTruck } from 'react-icons/fi';

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to load system orders', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to "${newStatus}"`);
      // Update local state instead of re-fetching completely
      setOrders((prevOrders) =>
        prevOrders.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
      );
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Status update failed', 'error');
    }
  };

  // Filter orders based on status select and search (customer name/email or order ID)
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      (order.user?.name || '').toLowerCase().includes(searchLower) ||
      (order.user?.email || '').toLowerCase().includes(searchLower) ||
      (order.shippingAddress?.city || '').toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-5">
          <h2 className="font-playfair text-2xl font-black text-brand-charcoal">Fulfillment Center</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Manage customer orders and ship statuses</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search by ID, name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded py-2.5 pl-4 pr-10 text-sm font-sans focus:outline-none focus:border-brand-green-500 transition-colors"
            />
            <FiSearch className="absolute right-3.5 top-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-brand-green-500 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded border border-gray-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Total Cost</th>
                  <th className="px-6 py-3">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm font-light text-gray-400 animate-pulse">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const { street, city, state, zipCode, country } = order.shippingAddress || {};
                    
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50">
                        {/* ID */}
                        <td className="px-6 py-4 font-mono text-xs text-brand-charcoal">
                          {order._id.substring(18)}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-charcoal">{order.user?.name || 'Guest User'}</p>
                          <p className="text-[10px] text-gray-400">{order.user?.email || 'N/A'}</p>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <div className="max-w-[200px] space-y-1">
                            {order.products.map((item, idx) => (
                              <p key={idx} className="text-xs text-brand-charcoal/80 font-medium">
                                • {item.product?.title || 'Unknown Item'} 
                                <span className="text-gray-400 font-bold ml-1">x{item.quantity}</span>
                                {item.selectedSize && <span className="text-[10px] text-brand-gold-600 font-bold ml-1 uppercase">({item.selectedSize})</span>}
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Address */}
                        <td className="px-6 py-4 text-xs font-light max-w-[180px]">
                          <p className="font-bold text-brand-charcoal">{street}</p>
                          <p>{city}, {state} - {zipCode}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{country}</p>
                        </td>

                        {/* Total Cost */}
                        <td className="px-6 py-4 font-bold text-brand-charcoal">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>

                        {/* Status update dropdown selector */}
                        <td className="px-6 py-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded py-1.5 px-2.5 text-xs font-semibold focus:outline-none focus:border-brand-green-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm font-light text-gray-400">
                      No matching order records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
