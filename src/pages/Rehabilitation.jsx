import React, { useState, useEffect, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export default function Rehabilitation() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const init = async () => {
            setTyping(true);
            try {
                const [liveSnap, profSnap] = await Promise.all([
                    get(ref(database, 'neurostep/live')).catch(() => null),
                    get(ref(database, 'neurostep/profile')).catch(() => null)
                ]);
                const l = liveSnap?.val() || {};
                const p = profSnap?.val() || {};

                const prompt = `You are NeuroStep AI, a gait analysis assistant. Patient: ${p.name || 'Unknown'}, Condition: ${p.condition || 'Unknown'}. Live: Instability=${l.instability || 0}/4, L Step=${l.step_left || 0}s, R Step=${l.step_right || 0}s, Symmetry=${l.symmetry || 0}, L COP=${l.cop_left || 0}%, R COP=${l.cop_right || 0}%. Give a 2-3 sentence clinical summary and recommendation.`;
                await fetchAI(prompt);
            } catch {
                setMessages([{ role: 'ai', text: 'Welcome! I\'m your NeuroStep AI assistant. Ask me about your gait data.' }]);
                setTyping(false);
            }
        };
        init();
    }, []);

    const fetchAI = async (prompt) => {
        try {
            const res = await fetch(`https://chatbot.codexapi.workers.dev/?prompt=${encodeURIComponent(prompt)}&model=gpt-5.1`);
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Unable to analyze right now.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'Connection issue. Please try again.' }]);
        } finally { setTyping(false); }
    };

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim() || typing) return;
        const msg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInput('');
        setTyping(true);
        await fetchAI(`As NeuroStep Clinical AI for gait analysis, answer: "${msg}"`);
    };

    return (
        <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
            <header className="shrink-0 p-4 pt-8 pb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Insights</h1>
                <p className="text-[10px] text-[#00E676] font-bold tracking-widest uppercase mt-0.5 flex items-center">
                    <Sparkles size={10} className="mr-1" />Clinical Intelligence
                </p>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-2.5 scrollbar-hide">
                {messages.length === 0 && !typing && (
                    <div className="h-full flex flex-col items-center justify-center">
                        <Bot size={28} className="text-[#333] mb-3" />
                        <p className="text-gray-600 text-xs">Initializing AI engine...</p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] flex items-end gap-1.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`shrink-0 p-1 rounded-lg ${m.role === 'user' ? 'bg-[#2979FF]/15' : 'bg-[#00E676]/15'}`}>
                                    {m.role === 'user' ? <User size={12} className="text-[#2979FF]" /> : <Bot size={12} className="text-[#00E676]" />}
                                </div>
                                <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user'
                                    ? 'bg-[#2979FF] text-white rounded-br-sm'
                                    : 'glass-panel text-gray-200 rounded-bl-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {typing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex items-end gap-1.5">
                            <div className="shrink-0 p-1 rounded-lg bg-[#00E676]/15"><Bot size={12} className="text-[#00E676]" /></div>
                            <div className="glass-panel px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin text-[#00E676]" />
                                <span className="text-[11px] text-gray-500">Analyzing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={endRef} />
            </div>

            <div className="shrink-0 p-4 pb-20">
                <form onSubmit={send} className="glass rounded-2xl p-1 flex items-center">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your gait data..." disabled={typing}
                        className="flex-1 bg-transparent text-white text-sm px-3.5 py-2.5 focus:outline-none placeholder-gray-600" />
                    <button type="submit" disabled={!input.trim() || typing}
                        className={`p-2.5 rounded-xl transition-all ${!input.trim() || typing ? 'bg-[#333] text-gray-600' : 'bg-[#00E676] text-[#121212] active:scale-95'}`}>
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
