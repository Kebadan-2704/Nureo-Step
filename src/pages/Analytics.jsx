import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import FootPressureMap from '../components/FootPressureMap';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const anim = (i) => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } } });

export default function Analytics() {
    const [history, setHistory] = useState([]);
    const [live, setLive] = useState(null);

    useEffect(() => {
        const u1 = onValue(ref(database, 'neurostep/history'), (s) => {
            const d = s.val();
            if (d) {
                const arr = Object.values(d).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
                setHistory(arr.slice(-6));
            }
        }, () => { });
        const u2 = onValue(ref(database, 'neurostep/live'), (s) => { if (s.val()) setLive(s.val()); }, () => { });
        return () => { u1(); u2(); };
    }, []);

    const opts = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#666', font: { size: 9 }, boxWidth: 6, usePointStyle: true, pointStyle: 'circle' } },
            tooltip: { backgroundColor: 'rgba(18,18,18,0.95)', titleColor: '#fff', bodyColor: '#aaa', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 10, padding: 10 }
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#444', font: { size: 9 } }, border: { display: false } },
            x: { grid: { display: false }, ticks: { color: '#444', font: { size: 9 } }, border: { display: false } }
        },
        elements: { line: { tension: 0.4, borderWidth: 2 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4 } }
    };

    const labels = history.length > 0 ? history.map(s => s.date ? s.date.split(',')[0].substring(0, 6) : '—') : ['—'];

    const charts = [
        {
            title: 'Bilateral Step Timing', datasets: [
                { label: 'Left (s)', data: history.map(s => s.step_left || 0), borderColor: '#2979FF', backgroundColor: 'rgba(41,121,255,0.06)', fill: true },
                { label: 'Right (s)', data: history.map(s => s.step_right || 0), borderColor: '#FFC107', backgroundColor: 'rgba(255,193,7,0.06)', fill: true }
            ]
        },
        {
            title: 'Instability Trend', datasets: [
                { label: 'Score', data: history.map(s => s.score || 0), borderColor: '#FF5252', backgroundColor: 'rgba(255,82,82,0.06)', fill: true }
            ]
        },
        {
            title: 'Symmetry Trend', datasets: [
                { label: 'Index', data: history.map(s => s.symmetry || 0), borderColor: '#00E676', backgroundColor: 'rgba(0,230,118,0.06)', fill: true }
            ]
        }
    ];

    return (
        <div className="p-4 pt-8 pb-4 max-w-md mx-auto">
            <header className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Analytics</h1>
                <p className="text-[10px] text-[#2979FF] font-bold tracking-widest uppercase mt-0.5">Gait Visualization</p>
            </header>

            <motion.div variants={anim(0)} initial="hidden" animate="visible">
                <FootPressureMap leftZones={live?.footprint_left || [2, 1, 3, 2, 1]} rightZones={live?.footprint_right || [1, 2, 1, 3, 2]} />
            </motion.div>

            <div className="space-y-3">
                {charts.map((ch, i) => (
                    <motion.div key={ch.title} variants={anim(i + 1)} initial="hidden" animate="visible" className="glass-panel rounded-2xl p-4">
                        <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">{ch.title}</h3>
                        <div className="h-44"><Line options={opts} data={{ labels, datasets: ch.datasets }} /></div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
