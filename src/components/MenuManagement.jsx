
import { useState } from 'react';
import {
  Search,
  Plus,
  Utensils,
  CheckCircle,
  Ban,
  Tags,
  Pencil,
  Trash2,
  Filter,
  ImagePlus,
} from 'lucide-react';


const MenuManagement = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Paneer Butter Masala',
      category: 'Main Course',
      price: 249,
      restaurant: 'Spice Garden',
      available: true,
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      category: 'Biryani',
      price: 299,
      restaurant: 'Spice Garden',
      available: true,
    },
    {
      id: 3,
      name: 'Veg Spring Rolls',
      category: 'Starters',
      price: 149,
      restaurant: 'Spice Garden',
      available: false,
    },
    {
      id: 4,
      name: 'Masala Dosa',
      category: 'South Indian',
      price: 120,
      restaurant: 'South Kitchen',
      available: true,
    },
  ]);

  const categories = [
    'All',
    'Main Course',
    'Biryani',
    'Starters',
    'South Indian',
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this menu item?'
    );

    if (confirmed) {
      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== id)
      );
    }
  };

  const totalItems = items.length;
  const availableItems = items.filter(
    (item) => item.available
  ).length;
  const unavailableItems = totalItems - availableItems;

  return (
    <div className="menu-management">

      {/* Header */}
      <div className="menu-header">
        <div>
          <h1>Menu Management</h1>
          <p>Manage restaurant food items, prices and availability.</p>
        </div>

        <button className="add-menu-btn">
          <Plus size={18} />
          Add Menu Item
        </button>
      </div>

      {/* Statistics */}
      <div className="menu-stats-grid">

        <div className="menu-stat-card">
          <div className="menu-stat-icon purple">
            <Utensils size={21} />
          </div>
          <div>
            <h3>{totalItems}</h3>
            <p>Total Menu Items</p>
          </div>
        </div>

        <div className="menu-stat-card">
          <div className="menu-stat-icon green">
            <CheckCircle size={21} />
          </div>
          <div>
            <h3>{availableItems}</h3>
            <p>Available Items</p>
          </div>
        </div>

        <div className="menu-stat-card">
          <div className="menu-stat-icon red">
            <Ban size={21} />
          </div>
          <div>
            <h3>{unavailableItems}</h3>
            <p>Unavailable Items</p>
          </div>
        </div>

        <div className="menu-stat-card">
          <div className="menu-stat-icon orange">
            <Tags size={21} />
          </div>
          <div>
            <h3>{categories.length - 1}</h3>
            <p>Categories</p>
          </div>
        </div>

      </div>

      {/* Menu Table Card */}
      <div className="menu-table-card">

        <div className="menu-table-header">
          <div>
            <h2>Restaurant Menu Items</h2>
            <p>View and manage all restaurant menu items.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="menu-toolbar">

          <div className="menu-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search menu or restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="menu-filter">
            <Filter size={17} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Categories' : item}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Table */}
        <div className="menu-table-wrapper">
          <table className="menu-table">

            <thead>
              <tr>
                <th>FOOD ITEM</th>
                <th>CATEGORY</th>
                <th>RESTAURANT</th>
                <th>PRICE</th>
                <th>AVAILABILITY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>

                  <td>
                    <div className="menu-item-info">
                      <div className="menu-item-image">
                        <ImagePlus size={19} />
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td>
                    <span className="menu-category">
                      {item.category}
                    </span>
                  </td>

                  <td>{item.restaurant}</td>

                  <td className="menu-price">
                    ₹{item.price}
                  </td>

                  <td>
                    <button
                      className={`availability-badge ${
                        item.available ? 'available' : 'unavailable'
                      }`}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>

                  <td>
                    <div className="menu-actions">
                      <button
                        className="menu-edit-btn"
                        title="Edit item"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="menu-delete-btn"
                        title="Delete item"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="menu-empty">
                    No menu items found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <div className="menu-table-footer">
          Showing {filteredItems.length} of {totalItems} menu items
        </div>

      </div>
    </div>
  );
};

export default MenuManagement;
