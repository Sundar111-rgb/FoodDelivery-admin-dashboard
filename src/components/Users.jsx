import { Search, Users as UsersIcon, UserRound, Store, Bike } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAdminUsers } from '../services/adminService';
function Users() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCustomers: 0,
        totalRestaurantOwners: 0,
        totalDeliveryPartners: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getAdminUsers();

                setUsers(data.users);
                setStats(data.stats);
            } catch (err) {
                console.error('Failed to fetch users:', err);

                setError(
                    err.response?.data?.message || 'Failed to load users'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search);

        const matchesRole =
            selectedRole === 'ALL' || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });


    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'orange',
        },
        {
            title: 'Customers',
            value: stats.totalCustomers,
            icon: UserRound,
            color: 'blue',
        },
        {
            title: 'Restaurant Owners',
            value: stats.totalRestaurantOwners,
            icon: Store,
            color: 'purple',
        },
        {
            title: 'Delivery Partners',
            value: stats.totalDeliveryPartners,
            icon: Bike,
            color: 'green',
        },
    ];

    return (
        <div className="users-page">
            <div className="users-page-header">
                <div>
                    <h2>Users Management</h2>
                    <p>View and manage all registered users on FoodDash.</p>
                </div>

                <button className="users-add-button" type="button">
                    + Add User
                </button>
            </div>

            <div className="users-stats-grid">
                {statsCards.map(({ title:label, value, icon: Icon, color }) => (
                    <div className="users-stat-card" key={label}>
                        <div>
                            <p>{label}</p>
                            <h3>{value}</h3>
                        </div>

                        <div className={`users-stat-icon ${color}`}>
                            <Icon size={22} />
                        </div>
                    </div>
                ))}
            </div>

            <section className="users-table-card">
                <div className="users-table-header">
                    <div>
                        <h3>All Users</h3>
                        <p>Manage your platform's registered accounts.</p>
                    </div>

                    <label className="users-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>

                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="users-role-filter"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="CUSTOMER">Customers</option>
                        <option value="RESTAURANT_OWNER">Restaurant Owners</option>
                        <option value="DELIVERY_PARTNER">Delivery Partners</option>
                        <option value="ADMIN">Admins</option>
                    </select>

                </div>


                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Account Status</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="users-empty-state">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="users-empty-state">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="users-empty-state">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <strong>{user.name}</strong>
                                                <span>{user.email}</span>
                                            </div>
                                        </td>

                                        <td>{user.role.replaceAll('_', ' ')}</td>

                                        <td>
                                            <span className="status-badge">Registered</span>
                                        </td>

                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>

                                        <td>—</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Users;