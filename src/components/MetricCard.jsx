import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, unit, icon: Icon, color = "text-white", index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className="glass-panel rounded-2xl p-3.5 flex flex-col justify-between min-h-[90px] relative overflow-hidden group cursor-pointer"
        >
            <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
                {Icon && <Icon className="text-gray-600 group-hover:text-gray-400 transition-colors" size={14} />}
            </div>
            <div className="flex items-baseline space-x-0.5 relative z-10">
                <span className={`text-2xl font-black tracking-tight ${color}`}>{value}</span>
                {unit && <span className="text-[10px] font-bold text-gray-600 ml-0.5">{unit}</span>}
            </div>
        </motion.div>
    );
}
