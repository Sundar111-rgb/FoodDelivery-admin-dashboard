import { useEffect, useState } from 'react';

import {
    Store,
    CheckCircle,
    Clock,
    XCircle,
} from 'lucide-react';

import AddRestaurantModal from './AddRestaurantModal';
import EditRestaurantModal from './EditRestaurantModal';

import {
    getAdminRestaurants,
    updateRestaurantStatus,
    createAdminRestaurant,
    updateAdminRestaurant,

} from '../services/adminService';


const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const [stats, setStats] = useState({
        totalRestaurants: 0,
        activeRestaurants: 0,
        inactiveRestaurants: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleToggleRestaurant = async (restaurant) => {
        try {
            await updateRestaurantStatus(
                restaurant.id,
                !restaurant.isOpen
            );

            const data = await getAdminRestaurants();

            setRestaurants(data.restaurants);
            setStats(data.stats);
        } catch (err) {
            console.error('Restaurant status update failed:', err);

            alert(
                err.response?.data?.message ||
                'Failed to update restaurant status.'
            );
        }
    };

    const handleAddRestaurant = async (restaurantData) => {
        try {
            await createAdminRestaurant(restaurantData);

            const data = await getAdminRestaurants();

            setRestaurants(data.restaurants);
            setStats(data.stats);
            setShowAddModal(false);

            alert('Restaurant created successfully!');
        } catch (err) {
            console.error('Create restaurant failed:', err);

            alert(
                err.response?.data?.message ||
                'Failed to create restaurant.'
            );

            throw err;
        }
    };

    const handleEditRestaurant = async (restaurantData) => {
        try {
            await updateAdminRestaurant(
                selectedRestaurant.id,
                restaurantData
            );

            const data = await getAdminRestaurants();

            setRestaurants(data.restaurants);
            setStats(data.stats);
            setSelectedRestaurant(null);

            alert('Restaurant updated successfully!');
        } catch (err) {
            console.error('Update restaurant failed:', err);

            alert(
                err.response?.data?.message ||
                'Failed to update restaurant.'
            );

            throw err;
        }
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);

                const data = await getAdminRestaurants();

                setRestaurants(data.restaurants);
                setStats(data.stats);
                setError('');
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Failed to load restaurants.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesSearch =
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === 'ALL' ||
            (selectedStatus === 'OPEN' && restaurant.isOpen) ||
            (selectedStatus === 'CLOSED' && !restaurant.isOpen);

        return matchesSearch && matchesStatus;
    });

    const statsCards = [
        {
            title: 'Total Restaurants',
            value: stats.totalRestaurants,
            icon: Store,
            className: 'restaurants-orange',
        },
        {
            title: 'Active Restaurants',
            value: stats.activeRestaurants,
            icon: CheckCircle,
            className: 'restaurants-green',
        },
        {
            title: 'Pending Approval',
            value: '—',
            icon: Clock,
            className: 'restaurants-purple',
        },
        {
            title: 'Inactive Restaurants',
            value: stats.inactiveRestaurants,
            icon: XCircle,
            className: 'restaurants-red',
        },
    ];

    return (
        <div className="restaurants-page">

            <div className="restaurants-page-header">
                <div>
                    <h1>Restaurants</h1>
                    <p>Manage restaurants registered on FoodDash.</p>
                </div>

                <button
                    className="restaurants-add-button"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Restaurant
                </button>
            </div>

            <div className="restaurants-stats-grid">

                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <div className="restaurants-stat-card" key={index}>
                            <div className={`restaurants-stat-icon ${stat.className}`}>
                                <Icon size={22} />
                            </div>

                            <div>
                                <p>{stat.title}</p>
                                <h2>{stat.value}</h2>
                            </div>
                        </div>
                    );
                })}

            </div>

            {loading && (
                <p>Loading restaurants...</p>
            )}

            {error && (
                <p className="restaurants-error">{error}</p>
            )}
            {!loading && !error && (
                <div className="restaurants-table-card">
                    <div className="restaurants-table-header">
                        <div>
                            <h2>All Restaurants</h2>
                            <span>{filteredRestaurants.length} Restaurants</span>
                        </div>

                        <div className="restaurants-table-controls">
                            <input
                                type="text"
                                placeholder="Search restaurants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="restaurants-table-wrapper">
                        <table className="restaurants-table">
                            <thead>
                                <tr>
                                    <th>Restaurant</th>
                                    <th>Owner</th>
                                    <th>Menu Items</th>
                                    <th>Orders</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRestaurants.map((restaurant) => (
                                    <tr key={restaurant.id}>
                                        <td>
                                            <strong>{restaurant.name}</strong>
                                            <small>{restaurant.address}</small>
                                        </td>

                                        <td>
                                            {restaurant.owner?.name || 'Not assigned'}
                                            <small>
                                                {restaurant.owner?.email || '—'}
                                            </small>
                                        </td>

                                        <td>{restaurant._count.menuItems}</td>

                                        <td>{restaurant._count.orders}</td>

                                        <td>
                                            <button
                                                className={
                                                    restaurant.isOpen
                                                        ? 'restaurant-action-close'
                                                        : 'restaurant-action-open'
                                                }
                                                onClick={() => handleToggleRestaurant(restaurant)}
                                            >
                                                {restaurant.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                                            </button>
                                             </td>

                                        <td>
                                            <button
                                                className="restaurant-action-edit"
                                                onClick={() => setSelectedRestaurant(restaurant)}
                                            >
                                                Edit
                                            </button>
                                        </td>

                                        <td>
                                            {new Date(restaurant.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}

                                {restaurants.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="restaurants-empty">
                                            No restaurants found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showAddModal && (
                <AddRestaurantModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddRestaurant}
                />
            )}
            {selectedRestaurant && (
                <EditRestaurantModal
                    restaurant={selectedRestaurant}
                    onClose={() => setSelectedRestaurant(null)}
                    onSubmit={handleEditRestaurant}
                />
            )}
        </div>
    );
};

export default Restaurants;
