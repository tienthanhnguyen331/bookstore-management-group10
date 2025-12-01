// client/src/components/Header.jsx
import { BookOpen } from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Quản lí sách', path: '/books' },
    { name: 'Nhập kho', path: '/inventory' },
    { name: 'Bán hàng', path: '/sales' },
    { name: 'Tài chính', path: '/finance' },
    { name: 'Khách hàng', path: '/customers' },
    { name: 'Báo cáo', path: '/reports' },
    { name: 'Cài đặt', path: '/settings' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo - Bấm vào thì về trang chủ */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-blue-500 tracking-wide">BOOKSTORE</span>
          </Link>

          {/* Menu Items */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => {
              // Kiểm tra xem trang hiện tại có khớp với item này không
              const isActive = location.pathname === item.path;
                
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-400 text-white' // Nếu đang ở trang này -> Màu xanh
                      : 'text-gray-600 hover:bg-gray-100' // Nếu không -> Màu xám
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;