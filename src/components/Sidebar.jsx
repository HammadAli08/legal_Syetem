import React from 'react';
import { Scale, Home, FileText, AlertCircle, MessageSquare } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate, onClearChat }) => {
    const menuItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'classification', label: 'Case Classification', icon: FileText },
        { id: 'prioritization', label: 'Case Prioritization', icon: AlertCircle },
        { id: 'chat', label: 'Legal Assistant', icon: MessageSquare },
    ];

    return (
        <div className="w-64 bg-primary min-h-screen text-white p-6 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <Scale className="w-8 h-8 text-gold" />
                <h1 className="text-xl font-serif font-bold">Legal AI</h1>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-gold text-primary font-semibold'
                                    : 'hover:bg-primary-light'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Clear Chat Button */}
            <button
                onClick={onClearChat}
                className="w-full mt-auto px-4 py-3 bg-accent hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
                🗑️ Clear Chat History
            </button>
        </div>
    );
};

export default Sidebar;
