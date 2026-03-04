import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import { Calendar, TrendingDown, TrendingUp, Activity } from 'lucide-react';

export default function History() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onValue(ref(database, 'neurostep/history'), (s) => {
            const d = s.val();
            if (d) {
                setSessions(Object.keys(d).map(k => ({ id: k, ...d[k] })).reverse());
            }
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, []);

    const color = (s) => { const n = Number(s); return n >= 2 ? '#FF5252' : n >= 1 ? '#FFC107' : '#00E676'; };

    return (
        <div className="p-4 pt-8 pb-4 max-w-md mx-auto">
            <header className="mb-5 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">History</h1>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">Past Sessions</p>
                </div>
                <div className="glass p-2 rounded-xl"><Calendar size={18} className="text-gray-500" /></div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-52">
                    <div className="w-8 h-8 border-2 border-[#333] border-t-[#00E676] rounded-full animate-spin mb-3" />
                    <p className="text-gray-600 text-xs">Loading sessions...</p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52">
                    <Activity size={32} className="text-[#333] mb-3" />
                    <p className="text-gray-600 text-xs">No sessions recorded yet.</p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {sessions.map((s, i) => {
                        const c = color(s.score);
                        return (
                            <motion.div key={s.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.35 }}
                                whileTap={{ scale: 0.98 }}
                                className="glass-panel rounded-2xl p-3.5 flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c + '15', border: `1px solid ${c}30` }}>
                                        {Number(s.score) >= 2 ? <TrendingUp size={18} style={{ color: c }} /> : <TrendingDown size={18} style={{ color: c }} />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-200">{s.date || 'Unknown'}</h3>
                                        <p className="text-[10px] text-gray-600">{s.time || '—'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">Score</p>
                                    <p className="text-lg font-black leading-none" style={{ color: c }}>{s.score ? Number(s.score).toFixed(1) : '—'}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
