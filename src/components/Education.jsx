import React from 'react';
import Section from './Section';
import { GraduationCap } from 'lucide-react';

export default function Education() {
  return (
    <Section id="education" className="group relative glass-panel rounded-3xl my-20 max-w-4xl mx-auto overflow-hidden hover:border-blue-500/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <GraduationCap size={32} />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">Education</h2>
      </div>

      <div className="space-y-6 border-l-2 border-blue-500/30 pl-8 ml-4 relative">
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold text-white">Information Security – General Program</h3>
          <p className="text-blue-300">University of Information Technology, VNU-HCM</p>
          <p className="text-sm text-gray-400 font-mono">2023 – 2027</p>
          
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2 marker:text-blue-500">
            <li>Last Semester GPA: <span className="text-white font-bold">8.57 / 10</span></li>
            <li>Executive Member, Faculty Networks and Communications Young Union <span className="text-gray-500 italic">(May 2024 – Present)</span></li>
          </ul>
        </div>
      </div>
      </div>
    </Section>
  );
}
