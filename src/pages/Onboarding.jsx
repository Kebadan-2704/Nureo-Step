import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, ChevronRight, Ruler, Weight, ShieldCheck } from 'lucide-react';

export default function Onboarding({ onComplete }) {
    const [formData, setFormData] = useState({ name: '', age: '', height: '', weight: '', condition: '' });
    const [step, setStep] = useState(1);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else onComplete(formData);
    };

    const slide = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
        exit: { opacity: 0, x: -40, transition: { duration: 0.25 } }
    };
    const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

    const inputClass = (focusColor) =>
        `w-full bg-[#1A1A1A] text-white rounded-2xl py-4 pl-12 pr-4 border border-[#2A2A2A] focus:border-[${focusColor}] focus:outline-none focus:ring-1 focus:ring-[${focusColor}] transition-all text-sm placeholder-gray-600`;

    return (
        <div className="fixed inset-0 z-50 bg-[#121212] overflow-auto flex flex-col justify-between px-6 py-8">
            <div className="flex-1 mt-6 sm:mt-10 max-w-sm mx-auto w-full">
                <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] shadow-xl border border-[#333] flex items-center justify-center mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                >
                    <Activity size={28} className="text-[#00E676]" />
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" variants={slide} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                            <motion.h1 variants={item} className="text-2xl sm:text-3xl font-black text-white">
                                Welcome to <span className="text-[#00E676]">NeuroStep</span>
                            </motion.h1>
                            <motion.p variants={item} className="text-gray-500 text-sm leading-relaxed">
                                Let's calibrate your profile for personalized gait intelligence.
                            </motion.p>
                            <motion.div variants={item} className="space-y-3 pt-2">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
                                        className={inputClass('#00E676')} />
                                </div>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange}
                                        className={inputClass('#00E676')} />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="s2" variants={slide} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                            <motion.h1 variants={item} className="text-2xl sm:text-3xl font-black text-white">
                                Physical <span className="text-[#2979FF]">Metrics</span>
                            </motion.h1>
                            <motion.p variants={item} className="text-gray-500 text-sm leading-relaxed">
                                Helps the AI interpret your pressure and instability models.
                            </motion.p>
                            <motion.div variants={item} className="space-y-3 pt-2">
                                <div className="relative">
                                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange}
                                        className={inputClass('#2979FF')} />
                                </div>
                                <div className="relative">
                                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange}
                                        className={inputClass('#2979FF')} />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="s3" variants={slide} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                            <motion.h1 variants={item} className="text-2xl sm:text-3xl font-black text-white">
                                Clinical <span className="text-[#FFC107]">Context</span>
                            </motion.h1>
                            <motion.p variants={item} className="text-gray-500 text-sm leading-relaxed">
                                What is the primary condition for your gait monitoring?
                            </motion.p>
                            <motion.div variants={item} className="space-y-3 pt-2">
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-4 text-gray-600" size={18} />
                                    <textarea name="condition" placeholder="E.g., Post-Stroke Recovery, Parkinson's, Athletic Rehab..."
                                        value={formData.condition} onChange={handleChange} rows={3}
                                        className="w-full bg-[#1A1A1A] text-white rounded-2xl py-4 pl-12 pr-4 border border-[#2A2A2A] focus:border-[#FFC107] focus:outline-none focus:ring-1 focus:ring-[#FFC107] transition-all resize-none text-sm placeholder-gray-600" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div className="max-w-sm mx-auto w-full pb-safe mt-6"
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}
            >
                <div className="flex justify-between items-center mb-4 px-1">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${step === i ? 'w-7 bg-white' : step > i ? 'w-3 bg-[#00E676]' : 'w-2 bg-[#333]'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Step {step}/3</span>
                </div>

                <button onClick={handleNext}
                    className="w-full bg-white text-[#121212] font-bold text-base py-3.5 rounded-2xl flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:bg-gray-100 active:scale-[0.97] transition-all"
                >
                    {step === 3 ? 'Complete Setup' : 'Continue'}
                    <ChevronRight size={18} className="ml-1.5" />
                </button>
            </motion.div>
        </div>
    );
}
