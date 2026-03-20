import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, History, User, Settings, Globe, ChevronDown, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Contract Updated',
      message: 'The contract "Influencer Agreement" has been modified. Please review and re-sign.',
      time: '10 minutes ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 2,
      title: 'New Comment',
      message: 'Alice left a comment on "Service Agreement".',
      time: '1 hour ago',
      unread: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Settlement Completed',
      message: 'Settlement for "Q3 Marketing Campaign" has been executed successfully.',
      time: '1 day ago',
      unread: false,
      type: 'success'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/revenue', label: t('nav.revenue') },
    { path: '/settlement', label: t('nav.settlement') },
    { path: '/reporting', label: t('nav.reporting') },
    { path: '/chat', label: 'Chat' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 relative">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">GoSign X</span>
            </div>

            {/* Centered Navigation */}
            <nav className="hidden sm:flex sm:items-center sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center h-full px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
                className="p-2 text-gray-400 hover:text-gray-500 flex items-center space-x-1"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-900">Notifications</p>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-indigo-50/30' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                            {notification.type === 'warning' && (
                              <button className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                                Review & Re-sign
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <History className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 text-gray-400 hover:text-gray-500 flex items-center"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
