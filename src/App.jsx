import { useEffect, useState } from 'react';

import {

  AreaChart,

  Area,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

} from 'recharts';

import {

  LayoutDashboard,

  Users,

  Store,

  ShoppingBag,

  Bike,

  Utensils,

  ChartNoAxesCombined,

  Settings,

  Bell,

  Search,

  ChevronDown,

  ChevronLeft,

  ChevronRight,

  Menu,

  X,

} from 'lucide-react';

import Login from './components/Login';

import Register from './components/Register';
import UsersPage from './components/Users';
import Restaurants from './components/Restaurants';
import Orders from './components/Orders';
import DeliveryPartners from './components/DeliveryPartners';
import './MenuManagement.css';


import api from './services/api';

import { logoutUser } from './services/authService';

import './App.css';

import './AdminDashboard.css';
import './Restaurant.css'
import './Order.css'
import './SettingPage.css'
import SettingPage from './components/SettingPage';
import MenuManagement from './components/MenuManagement';

// ==========================================

// NAVIGATION

// ==========================================

const navigation = [

  { label: 'Dashboard', icon: LayoutDashboard },

  { label: 'Users', icon: Users },

  { label: 'Restaurants', icon: Store },

  { label: 'Orders', icon: ShoppingBag },

  { label: 'Delivery Partners', icon: Bike },

  { label: 'Menu Management', icon: Utensils },

  { label: 'Analytics', icon: ChartNoAxesCombined },

  { label: 'Settings', icon: Settings },

];

// ==========================================

// WEEKLY ANALYTICS DATA

// ==========================================

const weeklyData = [

  { day: 'Mon', orders: 120, revenue: 14500 },

  { day: 'Tue', orders: 160, revenue: 18200 },

  { day: 'Wed', orders: 140, revenue: 16900 },

  { day: 'Thu', orders: 210, revenue: 23800 },

  { day: 'Fri', orders: 185, revenue: 21500 },

  { day: 'Sat', orders: 260, revenue: 30200 },

  { day: 'Sun', orders: 230, revenue: 27600 },

];

// ==========================================

// INITIAL DASHBOARD STATISTICS

// ==========================================

const initialDashboardStats = {

  totalCustomers: 0,

  totalRestaurants: 0,

  totalOrders: 0,

  totalDeliveryPartners: 0,

  totalRevenue: 0,

};

// ==========================================

// APP COMPONENT

// ==========================================

function App() {

  // Navigation state

  const [activePage, setActivePage] = useState('Dashboard');

  // Sidebar state

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dashboard state

  const [dashboardStats, setDashboardStats] = useState(

    initialDashboardStats

  );

  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [apiStatus, setApiStatus] = useState('Checking...');

  // Authentication state

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [showRegister, setShowRegister] = useState(false);

  // ==========================================

  // SIDEBAR RESPONSIVE BEHAVIOR

  // ==========================================

  useEffect(() => {

    const handleResize = () => {

      // Close the mobile sidebar when returning to desktop.

      if (window.innerWidth > 900) {

        setSidebarOpen(false);

      }

    };

    window.addEventListener('resize', handleResize);

    return () => {

      window.removeEventListener('resize', handleResize);

    };

  }, []);

  // Prevent background scrolling while the mobile sidebar is open.

  useEffect(() => {

    if (window.innerWidth > 900 || !sidebarOpen) {

      return;

    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {

      if (event.key === 'Escape') {

        setSidebarOpen(false);

      }

    };

    window.addEventListener('keydown', handleEscape);

    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener('keydown', handleEscape);

    };

  }, [sidebarOpen]);

  // ==========================================

  // VERIFY EXISTING ADMIN SESSION

  // ==========================================

  useEffect(() => {

    let cancelled = false;

    const verifySession = async () => {

      const token = localStorage.getItem('adminToken');

      if (!token) {

        if (!cancelled) {

          setAuthLoading(false);

          setDashboardLoading(false);

          setApiStatus('Disconnected');

        }

        return;

      }

      try {

        const response = await api.get('/admin/dashboard');

        const savedUser = JSON.parse(

          localStorage.getItem('adminUser') || 'null'

        );

        if (savedUser?.role !== 'ADMIN') {

          throw new Error('Administrator session not found');

        }

        if (cancelled) {

          return;

        }

        setDashboardStats(

          response.data?.stats || initialDashboardStats

        );

        setAuthenticatedUser(savedUser);

        setApiStatus('Connected');

      } catch (error) {

        console.error(

          'Session verification failed:',

          error.response?.data || error.message

        );

        if (cancelled) {

          return;

        }

        logoutUser();

        setAuthenticatedUser(null);

        setApiStatus('Disconnected');

      } finally {

        if (!cancelled) {

          setAuthLoading(false);

          setDashboardLoading(false);

        }

      }

    };

    verifySession();

    return () => {

      cancelled = true;

    };

  }, []);

  // ==========================================

  // LOGIN SUCCESS

  // ==========================================

  const handleLoginSuccess = async (user) => {

    setDashboardLoading(true);

    try {

      const response = await api.get('/admin/dashboard');

      const loggedInUser =

        user ||

        JSON.parse(localStorage.getItem('adminUser') || 'null');

      if (loggedInUser?.role !== 'ADMIN') {

        throw new Error('Administrator access is required');

      }

      setDashboardStats(

        response.data?.stats || initialDashboardStats

      );

      setAuthenticatedUser(loggedInUser);

      setApiStatus('Connected');

      setActivePage('Dashboard');

      setSidebarOpen(false);

    } catch (error) {

      console.error(

        'Dashboard loading failed:',

        error.response?.data || error.message

      );

      logoutUser();

      setAuthenticatedUser(null);

      setApiStatus('Disconnected');

    } finally {

      setDashboardLoading(false);

    }

  };

  // ==========================================

  // LOGOUT

  // ==========================================

  const handleLogout = () => {

    logoutUser();

    setAuthenticatedUser(null);

    setApiStatus('Disconnected');

    setActivePage('Dashboard');

    setSidebarOpen(false);

    setDashboardStats(initialDashboardStats);

    setShowRegister(false);

  };

  // ==========================================

  // LOADING SCREEN

  // ==========================================

  if (authLoading) {

    return (

      <div className="auth-loading">

        Checking admin session...

      </div>

    );

  }

  // ==========================================

  // LOGIN AND REGISTRATION

  // ==========================================

  if (!authenticatedUser) {

    return showRegister ? (

      <Register

        onShowLogin={() => setShowRegister(false)}

      />

    ) : (

      <Login

        onLoginSuccess={handleLoginSuccess}

        onShowRegister={() => setShowRegister(true)}

      />

    );

  }

  // ==========================================

  // ADMIN DASHBOARD

  // ==========================================

  return (

    <div className="admin-layout">

      {/* ======================================

          MOBILE SIDEBAR BACKDROP

      ====================================== */}

      {sidebarOpen && (

        <button

          type="button"

          className="sidebar-backdrop"

          aria-label="Close navigation"

          onClick={() => setSidebarOpen(false)}

        />

      )}

      {/* ======================================

          SIDEBAR

      ====================================== */}

      <aside

        id="admin-sidebar"

        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''
          } ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}

        aria-label="Main navigation"

      >

        {/* Brand */}

        <div className="brand">
          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={() => setSidebarCollapsed((previous) => !previous)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <div className="brand-icon">

            <Utensils size={23} />

          </div>

          <div className="brand-text">

            <h2>FoodDash</h2>

            <span>ADMIN CONSOLE</span>

          </div>

          {/* Mobile close button */}

          <button

            type="button"

            className="mobile-close"

            aria-label="Close navigation"

            onClick={() => setSidebarOpen(false)}

          >

            <X size={21} />

          </button>

        </div>

        {/* Navigation heading */}

        <div className="nav-heading">

          MAIN MENU

        </div>

        {/* Navigation items */}

        <nav className="navigation">

          {navigation.map(({ label, icon: Icon }) => (

            <button

              key={label}

              type="button"

              className={`nav-item ${activePage === label ? 'nav-item-active' : ''

                }`}

              aria-current={

                activePage === label ? 'page' : undefined

              }

              onClick={() => {

                setActivePage(label);

                setSidebarOpen(false);

              }}

            >

              <Icon size={19} strokeWidth={1.9} />

              <span>{label}</span>

            </button>

          ))}

        </nav>

        {/* Sidebar footer */}

        <div className="sidebar-footer">

          <div className="support-icon">

            <Settings size={20} />

          </div>

          <div>

            <strong>Admin Workspace</strong>

            <span>Food delivery platform</span>

          </div>

        </div>

      </aside>

      {/* ======================================

          MAIN CONTENT

      ====================================== */}

      <main
        className={`main-content ${sidebarCollapsed ? 'main-content-sidebar-collapsed' : ''}`}
        style={{ '--sidebar-current-width': sidebarCollapsed ? '76px' : '255px' }}
      >

        {/* ====================================

            TOPBAR

        ==================================== */}

        <header className="topbar">

          {/* Mobile menu toggle */}

          <button

            type="button"

            className="mobile-menu"

            aria-label={

              sidebarOpen

                ? 'Close navigation'

                : 'Open navigation'

            }

            aria-controls="admin-sidebar"

            aria-expanded={sidebarOpen}

            onClick={() => {

              setSidebarOpen((previous) => !previous);

            }}

          >

            {sidebarOpen ? (

              <X size={23} />

            ) : (

              <Menu size={23} />

            )}

          </button>

          {/* Breadcrumb */}

          <div className="breadcrumb">

            <span>FoodDash</span>

            <span className="breadcrumb-separator">

              /

            </span>

            <strong>{activePage}</strong>

          </div>

          {/* Topbar actions */}

          <div className="topbar-actions">

            {/* Backend status */}

            <span className="backend-status">

              Backend: {apiStatus}

            </span>

            {/* Search */}

            <label className="search-box">

              <Search size={18} />

              <input

                type="search"

                placeholder="Search anything..."

                aria-label="Search anything"

              />

              <span className="search-shortcut">

                ⌘ K

              </span>

            </label>

            {/* Notifications */}

            <button

              type="button"

              className="icon-button notification-button"

              aria-label="Notifications"

            >

              <Bell size={20} />

              <span className="notification-dot" />

            </button>

            <div className="profile-divider" />

            {/* Administrator profile / logout */}

            <button

              type="button"

              className="profile-button"

              onClick={handleLogout}

              title="Click to logout"

              aria-label="Log out of administrator account"

            >

              <div className="avatar">

                {(authenticatedUser?.name || 'AD')

                  .slice(0, 2)

                  .toUpperCase()}

              </div>

              <div className="profile-details">

                <strong>

                  {authenticatedUser?.name || 'Administrator'}

                </strong>

                <span>

                  Super Admin · Logout

                </span>

              </div>

              <ChevronDown size={17} />

            </button>

          </div>

        </header>

        {/* ====================================

            PAGE CONTENT

        ==================================== */}

        <section className="page-content">

          {/* Page heading */}

          <div className="page-heading">

            <div>

              <p className="eyebrow">

                OVERVIEW

              </p>

              <h1>{activePage}</h1>

              <p className="page-description">

                {activePage === 'Dashboard'

                  ? "Here's what's happening with your food delivery business."

                  : `Manage your ${activePage.toLowerCase()} from one place.`}

              </p>

            </div>

            <div className="date-label">

              <span className="status-dot" />

              Admin workspace

            </div>

          </div>

          {/* ==================================

              DASHBOARD PAGE

          ================================== */}

          {activePage === 'Dashboard' ? (

            <>

              {/* Welcome panel */}

              <div className="welcome-panel">

                <div>

                  <span className="welcome-label">

                    WELCOME BACK

                  </span>

                  <h2>

                    Your business, at a glance.

                  </h2>

                  <p>

                    Monitor orders, restaurants, customers and delivery

                    operations from your admin workspace.

                  </p>

                </div>

                <div className="welcome-art">

                  <Utensils

                    size={58}

                    strokeWidth={1.2}

                  />

                </div>

              </div>

              {/* Dashboard statistics */}

              <div className="stats-grid">

                {/* Total Orders */}

                <div className="stat-card">

                  <div className="stat-card-top">

                    <span>Total Orders</span>

                    <div className="stat-icon orange">

                      <ShoppingBag size={21} />

                    </div>

                  </div>

                  <h3>

                    {dashboardLoading

                      ? '...'

                      : (

                        dashboardStats.totalOrders || 0

                      ).toLocaleString('en-IN')}

                  </h3>

                  <div className="stat-footer">

                    <span className="stat-trend">

                      ↗ 12.8%

                    </span>

                    <span>vs. last month</span>

                  </div>

                  <div className="stat-progress">

                    <span className="progress-orange" />

                  </div>

                </div>

                {/* Total Revenue */}

                <div className="stat-card">

                  <div className="stat-card-top">

                    <span>Total Revenue</span>

                    <div className="stat-icon green">

                      <ChartNoAxesCombined size={21} />

                    </div>

                  </div>

                  <h3>

                    {dashboardLoading

                      ? '...'

                      : `₹${(

                        dashboardStats.totalRevenue || 0

                      ).toLocaleString('en-IN')}`}

                  </h3>

                  <div className="stat-footer">

                    <span className="stat-trend">

                      ↗ 8.4%

                    </span>

                    <span>vs. last month</span>

                  </div>

                  <div className="stat-progress">

                    <span className="progress-green" />

                  </div>

                </div>

                {/* Total Customers */}

                <div className="stat-card">

                  <div className="stat-card-top">

                    <span>Total Customers</span>

                    <div className="stat-icon purple">

                      <Users size={21} />

                    </div>

                  </div>

                  <h3>

                    {dashboardLoading

                      ? '...'

                      : (

                        dashboardStats.totalCustomers || 0

                      ).toLocaleString('en-IN')}

                  </h3>

                  <div className="stat-footer">

                    <span className="stat-trend">

                      ↗ 15.2%

                    </span>

                    <span>vs. last month</span>

                  </div>

                  <div className="stat-progress">

                    <span className="progress-purple" />

                  </div>

                </div>

                {/* Total Restaurants */}

                <div className="stat-card">

                  <div className="stat-card-top">

                    <span>Restaurants</span>

                    <div className="stat-icon blue">

                      <Store size={21} />

                    </div>

                  </div>

                  <h3>

                    {dashboardLoading

                      ? '...'

                      : (

                        dashboardStats.totalRestaurants || 0

                      ).toLocaleString('en-IN')}

                  </h3>

                  <div className="stat-footer">

                    <span className="stat-trend">

                      ↗ 6.7%

                    </span>

                    <span>vs. last month</span>

                  </div>

                  <div className="stat-progress">

                    <span className="progress-blue" />

                  </div>

                </div>

              </div>

              {/* ==================================

                  ANALYTICS

              ================================== */}

              <div className="analytics-grid">

                {/* Order analytics chart */}

                <section className="dashboard-card chart-card">

                  <div className="card-heading">

                    <div>

                      <h2>Order Analytics</h2>

                      <p>Weekly order performance</p>

                    </div>

                    <select

                      className="period-select"

                      aria-label="Analytics period"

                      defaultValue="week"

                    >

                      <option value="week">

                        This week

                      </option>

                      <option value="month">

                        This month

                      </option>

                    </select>

                  </div>

                  <div className="chart-summary">

                    <div>

                      <span>Total orders</span>

                      <strong>1,305</strong>

                    </div>

                    <div>

                      <span>Average per day</span>

                      <strong>186</strong>

                    </div>

                  </div>

                  <div className="chart-container">

                    <ResponsiveContainer

                      width="100%"

                      height="100%"

                    >

                      <AreaChart

                        data={weeklyData}

                        margin={{

                          top: 12,

                          right: 8,

                          left: -18,

                          bottom: 0,

                        }}

                      >

                        <defs>

                          <linearGradient

                            id="ordersGradient"

                            x1="0"

                            y1="0"

                            x2="0"

                            y2="1"

                          >

                            <stop

                              offset="0%"

                              stopColor="#f97316"

                              stopOpacity={0.25}

                            />

                            <stop

                              offset="95%"

                              stopColor="#f97316"

                              stopOpacity={0.01}

                            />

                          </linearGradient>

                        </defs>

                        <CartesianGrid

                          stroke="#edf0f5"

                          strokeDasharray="4 4"

                          vertical={false}

                        />

                        <XAxis

                          dataKey="day"

                          axisLine={false}

                          tickLine={false}

                          tick={{

                            fill: '#8994a7',

                            fontSize: 11,

                          }}

                          dy={10}

                        />

                        <YAxis

                          axisLine={false}

                          tickLine={false}

                          tick={{

                            fill: '#8994a7',

                            fontSize: 10,

                          }}

                        />

                        <Tooltip

                          contentStyle={{

                            borderRadius: 10,

                            border: '1px solid #e8ebf1',

                            fontSize: 12,

                          }}

                        />

                        <Area

                          type="monotone"

                          dataKey="orders"

                          name="Orders"

                          stroke="#f97316"

                          strokeWidth={3}

                          fill="url(#ordersGradient)"

                          activeDot={{ r: 5 }}

                        />

                      </AreaChart>

                    </ResponsiveContainer>

                  </div>

                </section>

                {/* Revenue overview */}

                <section className="dashboard-card revenue-card">

                  <div className="card-heading">

                    <div>

                      <h2>Revenue Overview</h2>

                      <p>Weekly revenue summary</p>

                    </div>

                    <div className="revenue-icon">

                      <ChartNoAxesCombined size={20} />

                    </div>

                  </div>

                  <span className="revenue-label">

                    TOTAL REVENUE

                  </span>

                  <h3>₹1,62,700</h3>

                  <p className="revenue-growth">

                    ↗ 12.5%

                    <span>

                      {' '}compared to last week

                    </span>

                  </p>

                  <div className="revenue-breakdown">

                    <div>

                      <span className="breakdown-dot orange-dot" />

                      <span>Food orders</span>

                      <strong>₹1,38,295</strong>

                    </div>

                    <div>

                      <span className="breakdown-dot purple-dot" />

                      <span>Delivery fees</span>

                      <strong>₹24,405</strong>

                    </div>

                  </div>

                </section>

              </div>

            </>

          ) : activePage === 'Users' ? ( <UsersPage />
          ) : activePage === 'Restaurants' ? (<Restaurants />
          ) : activePage === 'Orders' ?  ( <Orders /> 
          ) : activePage === 'Delivery Partners' ?  ( <DeliveryPartners /> 
          ) : activePage === 'Settings' ?  ( <SettingPage /> 
          ) : activePage === 'Menu Management' ?  ( <MenuManagement /> 

          ) :  (

            /* Other dashboard sections */

            <div className="placeholder-panel">

              <div className="placeholder-icon">

                {(() => {

                  const Icon =

                    navigation.find(

                      (item) => item.label === activePage

                    )?.icon ?? LayoutDashboard;

                  return <Icon size={30} />;

                })()}

              </div>

              <h2>{activePage}</h2>

              <p>

                This section's interface will be built in a later step.

                API integration comes after the UI is ready.

              </p>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}

export default App;
