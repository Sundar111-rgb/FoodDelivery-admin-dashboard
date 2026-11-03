
import { useState } from 'react';

const AddRestaurantModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    imageUrl: '',
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
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="restaurant-modal-overlay">
      <div className="restaurant-modal">
        <div className="restaurant-modal-header">
          <div>
            <h2>Add Restaurant</h2>
            <p>Enter the restaurant details below.</p>
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
              placeholder="Enter restaurant name"
              required
            />
          </div>

          <div className="restaurant-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter restaurant description"
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
              placeholder="Enter restaurant address"
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
              {submitting ? 'Creating...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
