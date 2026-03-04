import React from 'react';
import { motion } from 'framer-motion';

export default function FootPressureMap({ leftZones = [2, 1, 3, 2, 1], rightZones = [1, 2, 1, 3, 2] }) {
    const getColor = (v) => v >= 3 ? '#FF5252' : v >= 2 ? '#FFC107' : '#2979FF';

    const Foot = ({ isRight, zones }) => (
        <div className="relative w-20 sm:w-24 h-48 sm:h-56 mx-auto">
            <svg viewBox="0 0 100 240" className="w-full h-full" style={{ transform: isRight ? 'scaleX(-1)' : '', filter: 'drop-shadow(0 0 8px rgba(41,121,255,0.12))' }}>
                <path d="M30,10 C50,0 80,10 90,40 C100,70 85,130 80,160 C75,190 85,220 60,235 C35,250 10,220 15,180 C20,140 10,80 15,40 C20,10 30,10 30,10 Z"
                    fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <ellipse cx="50" cy="35" rx="28" ry="18" fill={getColor(zones[0])} opacity="0.65" />
                <ellipse cx="55" cy="80" rx="32" ry="22" fill={getColor(zones[1])} opacity="0.65" />
                <ellipse cx="68" cy="130" rx="14" ry="28" fill={getColor(zones[2])} opacity="0.55" />
                <ellipse cx="32" cy="130" rx="12" ry="22" fill={getColor(zones[3])} opacity="0.4" />
                <ellipse cx="45" cy="200" rx="24" ry="24" fill={getColor(zones[4])} opacity="0.65" />
            </svg>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="glass-panel rounded-3xl p-5 mb-4">
            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-5">Plantar Pressure</h3>
            <div className="flex justify-around items-center">
                <div>
                    <Foot isRight={false} zones={leftZones} />
                    <p className="text-center text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Left</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    {[['#FF5252', 'High'], ['#FFC107', 'Med'], ['#2979FF', 'Low']].map(([c, l]) => (
                        <div key={l} className="flex flex-col items-center">
                            <div className="w-2 h-5 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}` }} />
                            <span className="text-[7px] text-gray-600 uppercase mt-0.5">{l}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <Foot isRight={true} zones={rightZones} />
                    <p className="text-center text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Right</p>
                </div>
            </div>
        </motion.div>
    );
}
