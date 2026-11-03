
import { useState } from 'react';

const EditRestaurantModal = ({ restaurant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: restaurant.name || '',
    description: restaurant.description || '',
    address: restaurant.address || '',
    imageUrl: restaurant.imageUrl || '',
    ownerId: restaurant.ownerId || '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        ownerId: formData.ownerId || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="restaurant-modal-overlay">
      <div className="restaurant-modal">
        <div className="restaurant-modal-header">
          <div>
            <h2>Edit Restaurant</h2>
            <p>Update restaurant information.</p>
          </div>

          <button
            type="button"
            className="restaurant-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="restaurant-form-group">
            <label>Restaurant Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="restaurant-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="restaurant-form-group">
            <label>Restaurant Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="restaurant-form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/restaurant.jpg"
            />
          </div>

          <div className="restaurant-form-group">
            <label>Owner ID (optional)</label>
            <input
              type="text"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              placeholder="Enter restaurant owner ID"
            />
          </div>

          <div className="restaurant-modal-actions">
            <button
              type="button"
              className="restaurant-cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="restaurant-submit-button"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
