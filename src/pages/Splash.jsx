import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function Splash({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [fired, setFired] = useState(false);

    const finish = useCallback(() => {
        if (!fired) {
            setFired(true);
            setTimeout(onComplete, 500);
        }
    }, [fired, onComplete]);

    useEffect(() => {
        let frame = 0;
        const total = 12;

        const interval = setInterval(() => {
            frame++;
            setProgress(Math.min(Math.round((frame / total) * 100), 100));
            if (frame >= total) {
                clearInterval(interval);
                finish();
            }
        }, 120);

        // Safety: force transition after 3s
        const safety = setTimeout(finish, 3000);

        return () => { clearInterval(interval); clearTimeout(safety); };
    }, [finish]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#121212]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="absolute w-80 h-80 bg-[#00E676] rounded-full blur-[100px] opacity-[0.08]"
                animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
                className="relative z-10 flex flex-col items-center px-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
            >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-3xl bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] shadow-2xl border border-[#333] flex items-center justify-center relative overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-10 bg-gradient-to-r from-transparent via-[#00E676] to-transparent opacity-20 blur-xl"
                    />
                    <Activity size={40} className="text-[#00E676] relative z-10" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">NeuroStep</h1>
                <p className="text-xs font-semibold text-gray-500 tracking-[0.25em] uppercase mb-14">Clinical Intelligence</p>

                <div className="w-56 sm:w-64 space-y-2.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Initializing</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-[#333] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#2979FF] to-[#00E676]"
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut", duration: 0.12 }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
