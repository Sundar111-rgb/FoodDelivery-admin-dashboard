import { useEffect, useState } from 'react';
import { getAdminDeliveryPartners } from '../services/adminService';

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);

  const [stats, setStats] = useState({
    totalPartners: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // FETCH DELIVERY PARTNERS
  const fetchDeliveryPartners = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getAdminDeliveryPartners();

      console.log('DELIVERY PARTNERS RESPONSE:', response);

      if (!response?.success) {
        throw new Error('Unable to fetch delivery partners.');
      }

      setPartners(response.partners || []);

      setStats(
        response.stats || {
          totalPartners: 0,
        }
      );
    } catch (err) {
      console.error('Delivery Partners Error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load delivery partners.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  // SEARCH DELIVERY PARTNERS
  const filteredPartners = partners.filter((partner) => {
    const query = search.toLowerCase();

    return (
      partner.name?.toLowerCase().includes(query) ||
      partner.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Delivery Partners</h1>
          <p>
            Manage your delivery partners and their activities.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDeliveryPartners}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* STATISTICS */}
      <div className="dashboard-card">
        <h3>Total Delivery Partners</h3>
        <h2>{stats.totalPartners}</h2>
      </div>

      {/* SEARCH */}
      <div className="dashboard-card">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="dashboard-card">
          <p>Loading delivery partners...</p>
        </div>
      ) : error ? (
        <div className="dashboard-card">
          <p>{error}</p>

          <button
            className="refresh-button"
            onClick={fetchDeliveryPartners}
          >
            Try Again
          </button>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="dashboard-card">
          <h3>No Delivery Partners Found</h3>
          <p>
            {partners.length === 0
              ? 'No delivery partners have registered yet.'
              : 'No partners match your search.'}
          </p>
        </div>
      ) : (

        /* DELIVERY PARTNERS TABLE */
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
              {filteredPartners.map((partner) => (

                <tr key={partner.id}>

                  <td>{partner.name}</td>

                  <td>{partner.email}</td>

                  <td>
                    {partner._count?.deliveryOrders ?? 0}
                  </td>

                  <td>
                    {partner.createdAt
                      ? new Date(partner.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  <td>
                    {partner.latitude != null &&
                    partner.longitude != null
                      ? `${partner.latitude}, ${partner.longitude}`
                      : 'Location unavailable'}
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