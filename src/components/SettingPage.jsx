
import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  ShoppingBag,
  Bike,
  Bell,
  ShieldCheck,
  UserRound,
  Save,
} from 'lucide-react';

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'orders', label: 'Order Settings', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery Settings', icon: Bike },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'profile', label: 'Admin Profile', icon: UserRound },
  ];

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your food delivery platform configuration.</p>
        </div>

        <button className="save-settings-btn">
          <Save size={17} />
          Save Changes
        </button>
      </div>

      <div className="settings-layout">

        <aside className="settings-sidebar">
          <div className="settings-sidebar-title">
            SETTINGS MENU
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                className={`settings-tab ${
                  activeTab === tab.id ? 'active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="settings-content">
          <div className="settings-content-header">
            <h2>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            <p>Configure your platform preferences.</p>
          </div>

          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>Platform Information</h3>
              <p>Basic information about your food delivery platform.</p>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Platform Name</label>
                  <input defaultValue="FoodExpress" />
                </div>

                <div className="settings-field">
                  <label>Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@foodexpress.com"
                  />
                </div>

                <div className="settings-field">
                  <label>Contact Number</label>
                  <input defaultValue="+91 9876543210" />
                </div>

                <div className="settings-field">
                  <label>Currency</label>
                  <select defaultValue="INR">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="settings-section">
              <h3>Order Configuration</h3>
              <p>Manage how customer orders are processed.</p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="settings-section">
              <h3>Delivery Configuration</h3>
              <p>Configure delivery charges and delivery rules.</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <p>Manage platform notification preferences.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security & Permissions</h3>
              <p>Manage administrator security and access permissions.</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Administrator Profile</h3>
              <p>Manage your administrator account information.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SettingPage;
