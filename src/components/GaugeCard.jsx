import React from 'react';
import { motion } from 'framer-motion';

export default function GaugeCard({ score = 0, status, systemStatus }) {
    const safeScore = Math.min(Math.max(Number(score) || 0, 0), 4);
    const percentage = (safeScore / 4) * 100;

    let color = '#00E676';
    if (safeScore >= 1 && safeScore < 2) color = '#FFC107';
    if (safeScore >= 2) color = '#FF5252';

    const radius = 55;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const arcLength = circumference * 0.75;
    const dashoffset = arcLength - (percentage / 100) * arcLength;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.1 }}
            className="glass-panel rounded-3xl p-5 mb-5 flex items-center justify-between relative overflow-hidden"
        >
            <div className="absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-[0.12]" style={{ backgroundColor: color }} />

            <div className="flex-1 pr-3 z-10">
                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Stability Score</h2>
                <div className="flex items-end space-x-1.5 mb-3">
                    <span className="text-[2.8rem] font-black tracking-tighter leading-none" style={{ color, textShadow: `0 0 16px ${color}30` }}>
                        {safeScore.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-gray-600 mb-1.5">/ 4.0</span>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center bg-[#ffffff06] p-2 rounded-xl border border-[#ffffff08]">
                        <span className="text-[10px] text-gray-500 font-medium">Risk</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{status}</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#ffffff06] p-2 rounded-xl border border-[#ffffff08]">
                        <span className="text-[10px] text-gray-500 font-medium">System</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E676]">{systemStatus}</span>
                    </div>
                </div>
            </div>

            <div className="relative flex justify-center items-center z-10">
                <svg height={radius * 2} width={radius * 2} className="transform rotate-[135deg]">
                    <circle stroke="rgba(255,255,255,0.04)" fill="transparent" strokeWidth={stroke}
                        strokeDasharray={`${arcLength} ${circumference}`} r={normalizedRadius} cx={radius} cy={radius} strokeLinecap="round" />
                    <motion.circle
                        initial={{ strokeDashoffset: arcLength }}
                        animate={{ strokeDashoffset: dashoffset }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        stroke={color} fill="transparent" strokeWidth={stroke}
                        strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round"
                        r={normalizedRadius} cx={radius} cy={radius}
                        style={{ filter: `drop-shadow(0 0 5px ${color}60)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black" style={{ color }}>{safeScore.toFixed(1)}</span>
                </div>
            </div>
        </motion.div>
    );
}
