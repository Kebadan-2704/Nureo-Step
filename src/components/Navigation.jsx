import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BarChart2, MessageCircle, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation() {
    const links = [
        { to: '/home', icon: Activity, label: 'Home' },
        { to: '/analytics', icon: BarChart2, label: 'Analytics' },
        { to: '/rehab', icon: MessageCircle, label: 'AI Chat' },
        { to: '/history', icon: Clock, label: 'History' },
        { to: '/profile', icon: User, label: 'Profile' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-[#ffffff08] z-50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center max-w-md mx-auto h-16 px-4">
                {links.map((link) => (
                    <NavLink key={link.to} to={link.to} className="relative flex flex-col items-center justify-center flex-1 h-full">
                        {({ isActive }) => (
                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? 'text-[#00E676]' : 'text-gray-600'}`}
                            >
                                <div className="relative">
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-dot"
                                            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] shadow-[0_0_6px_#00E676]"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-0 absolute'}`}>
                                    {link.label}
                                </span>
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
