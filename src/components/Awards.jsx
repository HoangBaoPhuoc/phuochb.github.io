import React from 'react';
import Section from './Section';
import ScrollReveal from './ScrollReveal';
import { Trophy, ExternalLink } from 'lucide-react';

const AwardItem = ({ title, organization, date, link }) => (
  <div className="group relative glass-panel p-6 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col justify-between">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg shrink-0">
                <Trophy size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-700">{title}</h3>
                <p className="text-blue-400 text-sm mt-1">{organization}</p>
                <p className="text-gray-400 text-xs mt-1 font-mono">{date}</p>
            </div>
        </div>
    </div>

    {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-10 flex items-center justify-between mt-4 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group-hover:border-blue-500/30"
        >
            <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">View Certificate / Result</span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
        </a>
    )}
  </div>
);

export default function Awards() {
  const awards = [
    {
      title: "NET Challenge 2025",
      organization: "Faculty Contest",
      date: "2025",
      link: "https://nc.uit.edu.vn/hoat-dong/ket-qua-cuoc-thi-hoc-thuat-net-challenge-2025.html"
    },
    {
      title: "VNPT AI Hackathon 2025",
      organization: "VNPT AI",
      date: "2025",
      link: "https://vnptai.io/certificates/hackathon/2025AI1767005240"
    },
    {
      title: "VPBank Hackathon 2025",
      organization: "VPBank",
      date: "2025",
      link: "https://drive.google.com/file/d/1ihe17fquUsPippTBitXWyzi5MXQpIGpY/view?usp=drive_link"
    }
  ];

  return (
    <Section id="awards">
      <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">
        Honors & Awards
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {awards.map((award, index) => (
          <ScrollReveal key={index} direction="up" className="h-full">
            <AwardItem {...award} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
