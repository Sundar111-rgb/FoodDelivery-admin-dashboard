import { useEffect, useState } from 'react';
import { getAdminDeliveryPartners } from '../services/adminService';

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    totalPartners: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeliveryPartners = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminDeliveryPartners();
       console.log(data);
       
      setPartners(data.partners || []);
      setStats(data.stats || { totalPartners: 0 });
    } catch (err) {
      console.error('Delivery Partners Error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load delivery partners.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Delivery Partners</h1>
          <p>Manage your delivery partners and their activities.</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDeliveryPartners}
        >
          Refresh
        </button>
      </div>

      <div className="dashboard-card">
        <h3>Total Delivery Partners</h3>
        <h2>{stats.totalPartners}</h2>
      </div>

      {loading ? (
        <p>Loading delivery partners...</p>
      ) : error ? (
        <p>{error}</p>
      ) : partners.length === 0 ? (
        <p>No delivery partners found.</p>
      ) : (
        <div className="dashboard-card">
          <h3>Delivery Partner List</h3>

          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Orders</th>
                <th>Registered On</th>
                <th>Location</th>
              </tr>
            </thead>

            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id}>
                  <td>{partner.name}</td>
                  <td>{partner.email}</td>
                  <td>{partner._count?.deliveryOrders ?? 0}</td>
                  <td>
                    {new Date(partner.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {partner.latitude != null &&
                    partner.longitude != null
                      ? `${partner.latitude}, ${partner.longitude}`
                      : 'Not available'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartners;