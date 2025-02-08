import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings,
  BarChart,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const dashboardPath = `/${user?.role?.toLowerCase()}-dashboard`;
    
    const baseItems = [
      { name: 'Dashboard', icon: Home, path: dashboardPath },
      { name: 'Projects', icon: FileText, path: '/projects' },
      { name: 'Grievances', icon: MessageSquare, path: '/grievances' },
      { name: 'Community', icon: Users, path: '/community' },
    ];

    const roleSpecificItems = {
      admin: [
        { name: 'Analytics', icon: BarChart, path: '/analytics' },
        { name: 'Settings', icon: Settings, path: '/settings' }
      ],
      'panchayat-official': [
        { name: 'Reports', icon: BarChart, path: '/reports' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user?.role?.toLowerCase()] || [])];
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* User Profile Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img
            src="public/icon.png"
            alt="Profile"
            className="h-10 w-10 rounded-full ring-2 ring-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize truncate">
              {user?.role?.replace('-', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {getNavigationItems().map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <item.icon className={`flex-shrink-0 w-5 h-5 mr-3 ${
                  isActivePath(item.path)
                    ? 'text-white'
                    : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Help & Support Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Link
          to="/help"
          className="group flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
        >
          <HelpCircle className="flex-shrink-0 w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
          <span className="truncate">Help & Support</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;