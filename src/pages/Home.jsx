import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import GaugeCard from '../components/GaugeCard';
import MetricCard from '../components/MetricCard';
import { Footprints, Clock, ActivitySquare, AlertCircle } from 'lucide-react';

const safe = (v, d = 2) => { const n = Number(v); return isNaN(n) ? '—' : n.toFixed(d); };

export default function Home() {
    const [live, setLive] = useState({ instability: 0, step_left: 0, step_right: 0, cop_left: 0, cop_right: 0, symmetry: 0, vibration: 'Off' });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const unsub = onValue(ref(database, 'neurostep/live'), (snap) => {
            const d = snap.val();
            if (d) {
                setLive({
                    instability: Number(d.instability) || 0,
                    step_left: Number(d.step_left) || 0,
                    step_right: Number(d.step_right) || 0,
                    cop_left: Number(d.cop_left) || 0,
                    cop_right: Number(d.cop_right) || 0,
                    symmetry: Number(d.symmetry) || 0,
                    vibration: d.vibration === 1 || d.vibration === '1' || d.vibration === 'Active' ? 'Active' : 'Off'
                });
                setConnected(true);
            }
        }, () => { });
        return () => unsub();
    }, []);

    const status = (s) => s < 1 ? 'Stable' : s < 2 ? 'Mild Instability' : s < 3 ? 'Moderate Risk' : 'High Fall Risk';

    return (
        <div className="p-4 pt-8 pb-4 max-w-md mx-auto">
            <header className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-[10px] text-[#00E676] font-bold tracking-widest uppercase mt-0.5">Live Monitoring</p>
                </div>
                <div className="flex glass rounded-full px-3 py-1.5 items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-[#00E676] shadow-[0_0_6px_#00E676] animate-pulse' : 'bg-[#FF5252]'}`} />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{connected ? 'Live' : 'Offline'}</span>
                </div>
            </header>

            <GaugeCard score={live.instability} status={status(live.instability)} systemStatus={connected ? 'Active' : 'Connecting'} />

            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-0.5">Gait Metrics</h3>

            <div className="grid grid-cols-2 gap-2.5">
                <MetricCard index={0} title="L Step" value={safe(live.step_left)} unit="s" icon={Clock} />
                <MetricCard index={1} title="R Step" value={safe(live.step_right)} unit="s" icon={Clock} />
                <MetricCard index={2} title="Symmetry" value={safe(live.symmetry)} icon={ActivitySquare}
                    color={live.symmetry > 0.2 ? 'text-[#FFC107]' : 'text-[#00E676]'} />
                <MetricCard index={3} title="Vibration" value={live.vibration} icon={AlertCircle}
                    color={live.vibration === 'Active' ? 'text-[#2979FF]' : 'text-gray-500'} />
                <MetricCard index={4} title="L COP" value={safe(live.cop_left, 1)} unit="%" icon={Footprints} />
                <MetricCard index={5} title="R COP" value={safe(live.cop_right, 1)} unit="%" icon={Footprints} />
            </div>
        </div>
    );
}
