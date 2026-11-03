
import { useEffect, useMemo, useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
  Bike,
  Truck,
  XCircle,
  Search,
  RefreshCw,
} from 'lucide-react';

import { getAdminOrders } from '../services/adminService';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    preparingOrders: 0,
    readyForPickupOrders: 0,
    pickedUpOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getAdminOrders();

      setOrders(data.orders || []);
      setStats(data.stats || {});
      setError('');
    } catch (err) {
      console.error('Fetch orders error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      className: 'orders-blue',
    },
    {
      title: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      className: 'orders-orange',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedOrders,
      icon: CheckCircle,
      className: 'orders-green',
    },
    {
      title: 'Preparing',
      value: stats.preparingOrders,
      icon: ChefHat,
      className: 'orders-purple',
    },
    {
      title: 'Ready for Pickup',
      value: stats.readyForPickupOrders,
      icon: PackageCheck,
      className: 'orders-teal',
    },
    {
      title: 'Picked Up',
      value: stats.pickedUpOrders,
      icon: Bike,
      className: 'orders-indigo',
    },
    {
      title: 'Out for Delivery',
      value: stats.outForDeliveryOrders,
      icon: Truck,
      className: 'orders-cyan',
    },
    {
      title: 'Delivered',
      value: stats.deliveredOrders,
      icon: CheckCircle,
      className: 'orders-green',
    },
    {
      title: 'Cancelled',
      value: stats.cancelledOrders,
      icon: XCircle,
      className: 'orders-red',
    },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.customer?.name?.toLowerCase().includes(search) ||
        order.customer?.email?.toLowerCase().includes(search) ||
        order.restaurant?.name?.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === 'ALL' ||
        order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusClass = (status) => {
    const classes = {
      PENDING: 'order-status-pending',
      CONFIRMED: 'order-status-confirmed',
      PREPARING: 'order-status-preparing',
      READY_FOR_PICKUP: 'order-status-ready',
      PICKED_UP: 'order-status-picked',
      OUT_FOR_DELIVERY: 'order-status-delivery',
      DELIVERED: 'order-status-delivered',
      CANCELLED: 'order-status-cancelled',
    };

    return classes[status] || '';
  };

  const formatStatus = (status) => {
    return status.replaceAll('_', ' ');
  };

  return (
    <div className="orders-page">

      <div className="orders-page-header">
        <div>
          <h1>Orders Management</h1>
          <p>Monitor and manage all FoodDash orders.</p>
        </div>

        <button
          className="orders-refresh-button"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="orders-stats-grid">
        {statusCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div className="orders-stat-card" key={index}>
              <div className={`orders-stat-icon ${stat.className}`}>
                <Icon size={21} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value ?? 0}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p>Loading orders...</p>}

      {error && (
        <div className="orders-error">
          {error}
          <button onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="orders-table-card">

          <div className="orders-table-header">
            <div>
              <h2>All Orders</h2>
              <span>{filteredOrders.length} orders found</span>
            </div>

            <div className="orders-table-controls">
              <div className="orders-search-box">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search order, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Delivery Partner</th>
                  <th>Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <strong>
                        {order.customer?.name || 'Unknown'}
                      </strong>
                      <small>
                        {order.customer?.email || '—'}
                      </small>
                    </td>

                    <td>
                      {order.restaurant?.name || 'Unknown'}
                    </td>

                    <td className="order-amount">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>

                    <td>
                      {order.deliveryPartner?.name || 'Not assigned'}
                    </td>

                    <td>
                      <span
                        className={`order-status-badge ${getStatusClass(order.status)}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="orders-empty">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
