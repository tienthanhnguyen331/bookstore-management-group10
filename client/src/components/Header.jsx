import { Menu } from 'lucide-react';
import React from "react";
import PageNav from "./PageNav";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import UserProfile from './UserProfile';
import MobileSidebar from './MobileSidebar';


export function Header() {
    const navigate = useNavigate();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    const handleClick = function () {
        navigate("/");
    };

    return (
       <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Only visible on mobile */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {/* Logo */}
              <Logo onClick={handleClick} />
            </div>

            {/* Center: Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:block">
              <PageNav />
            </div>

            {/* Right: User Profile */}
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </>
    );
}
