
import { useState } from 'react';
import { X } from 'lucide-react';

const AddUserModal = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      await onUserCreated(formData);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create user.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-overlay">
      <div className="add-user-modal">
        <div className="add-user-header">
          <div>
            <h2>Add New User</h2>
            <p>Create a new FoodDash account</p>
          </div>

          <button
            type="button"
            className="add-user-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="add-user-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-user-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <div className="add-user-field">
            <label>User Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">
                Restaurant Owner
              </option>
              <option value="DELIVERY_PARTNER">
                Delivery Partner
              </option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <p className="add-user-error">{error}</p>
          )}

          <div className="add-user-actions">
            <button
              type="button"
              className="add-user-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-user-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
