import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import Section from './Section';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is a dummy login for now, or just a UI demo
    console.log('Login attempt:', username, password);
    alert('Access Denied: This area is restricted.');
  };

  return (
    <Section id="login" className="min-h-screen flex items-center justify-center pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-12 glass-panel rounded-3xl border border-white/10"
      >
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-blue-500/10 rounded-full mb-6 text-blue-400">
            <Lock size={48} />
          </div>
          <h2 className="text-4xl font-bold text-white">Restricted Access</h2>
          <p className="text-gray-400 mt-3 text-lg">Please identify yourself to proceed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-lg text-gray-400 font-medium ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors duration-300 placeholder:text-gray-600"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-3">
            <label className="text-lg text-gray-400 font-medium ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors duration-300 placeholder:text-gray-600"
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
          >
            <span>Authenticate</span>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 font-mono">
          System ID: 25VN506270HOAB028A <br/>
          Secure Connection Encrypted
        </div>
      </motion.div>
    </Section>
  );
}
