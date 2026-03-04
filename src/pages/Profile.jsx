import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import { Battery, Smartphone, User, Cpu } from 'lucide-react';

const anim = (i) => ({ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } } });

export default function Profile() {
    const [p, setP] = useState({ name: '...', age: '-', height: '-', weight: '-', condition: '...', doctor: '...', device_id: '-', battery: '-', firmware: '-' });

    useEffect(() => {
        const unsub = onValue(ref(database, 'neurostep/profile'), (s) => {
            const d = s.val();
            if (d) setP({
                name: d.name || 'Unknown', age: d.age || '-', height: d.height || '-', weight: d.weight || '-',
                condition: d.condition || 'Not specified', doctor: d.doctor || 'Unassigned',
                device_id: d.device_id || '-', battery: d.battery || '0', firmware: d.firmware || 'v1.0'
            });
        }, () => { });
        return () => unsub();
    }, []);

    const batt = parseInt(p.battery) || 0;
    const bc = batt > 50 ? '#00E676' : batt > 20 ? '#FFC107' : '#FF5252';

    return (
        <div className="p-4 pt-8 pb-4 max-w-md mx-auto space-y-3">
            <header className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Profile</h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">Patient & Device</p>
            </header>

            {/* Patient Card */}
            <motion.div variants={anim(0)} initial="hidden" animate="visible" className="glass-panel rounded-3xl p-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#00E676] blur-[50px] opacity-[0.08]" />
                <div className="flex items-center gap-3.5 mb-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E676] to-[#2979FF] flex items-center justify-center shadow-lg">
                        <User className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">{p.name}</h2>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider">{p.device_id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 relative z-10">
                    {[['Age', p.age, ''], ['Height', p.height, 'cm'], ['Weight', p.weight, 'kg']].map(([label, val, unit]) => (
                        <div key={label} className="bg-[#ffffff06] rounded-xl p-2.5 text-center border border-[#ffffff06]">
                            <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
                            <p className="text-base font-black text-white">{val}<span className="text-[9px] text-gray-600">{unit}</span></p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Clinical Info */}
            <motion.div variants={anim(1)} initial="hidden" animate="visible" className="glass-panel rounded-2xl p-4">
                <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Clinical Info</h3>
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Condition</span>
                        <span className="text-xs font-bold text-gray-200 text-right max-w-[60%]">{p.condition}</span>
                    </div>
                    <div className="h-px bg-[#ffffff06]" />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Physician</span>
                        <span className="text-xs font-bold text-gray-200">{p.doctor}</span>
                    </div>
                </div>
            </motion.div>

            {/* Device Status */}
            <motion.div variants={anim(2)} initial="hidden" animate="visible" className="glass-panel rounded-2xl p-4">
                <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Device Status</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#2979FF]/15 flex items-center justify-center"><Smartphone className="text-[#2979FF]" size={16} /></div>
                            <span className="text-xs text-gray-300">ESP32 Insoles</span>
                        </div>
                        <span className="text-[9px] bg-[#00E676]/15 text-[#00E676] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bc + '15' }}><Battery size={16} style={{ color: bc }} /></div>
                            <span className="text-xs text-gray-300">Battery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#ffffff06] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${batt}%`, backgroundColor: bc }} />
                            </div>
                            <span className="text-xs font-bold text-gray-300">{p.battery}%</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#ffffff08] flex items-center justify-center"><Cpu className="text-gray-500" size={16} /></div>
                            <span className="text-xs text-gray-300">Firmware</span>
                        </div>
                        <span className="text-xs text-gray-500">{p.firmware}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
