import React from "react";
import PageNav from "./PageNav";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

export function Header() {
    const navigate = useNavigate();

    const handleClick = function () {
        navigate("/");
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-8 h-16">
                    {/* Logo */}
                    <Logo onClick={handleClick} />
                    <PageNav />
                </div>
            </div>
        </header>
    );
}
