import React from 'react';
import Section from './Section';
import ScrollReveal from './ScrollReveal';
import { Code, Cloud, Shield, Languages } from 'lucide-react';

const SkillCategory = ({ title, icon, skills }) => (
  <div className="group relative glass-panel p-6 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4 text-blue-400">
        {icon}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-700">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
            <span 
            key={skill} 
            className="px-3 py-1 bg-blue-500/10 text-blue-200 rounded-full text-sm border border-blue-500/20"
            >
            {skill}
            </span>
        ))}
        </div>
    </div>
  </div>
);

export default function Skills() {
  return (
    <Section id="skills">
      <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">
        Skills
      </h2>
      
      <div className="grid md:grid-cols-2 gap-20">
        <ScrollReveal direction="left" className="h-full">
          <SkillCategory 
            title="Programming & Scripting" 
            icon={<Code />} 
            skills={["C++", "C#", "Python", "Bash", "Go", "Java", "SQL", "Rego"]} 
          />
        </ScrollReveal>
        <ScrollReveal direction="right" className="h-full">
          <SkillCategory 
            title="DevOps & Cloud" 
            icon={<Cloud />} 
            skills={["Docker", "Kubernetes (K3s)", "Terraform", "Ansible", "OpenStack", "AWS", "GCP"]} 
          />
        </ScrollReveal>
        <ScrollReveal direction="left" className="h-full">
          <SkillCategory 
            title="Security & Networking" 
            icon={<Shield />} 
            skills={["SPIRE", "Istio", "Keycloak", "OPA (Rego)", "ModSecurity", "OpenSSL", "Nmap"]} 
          />
        </ScrollReveal>
        <ScrollReveal direction="right" className="h-full">
          <SkillCategory 
            title="Languages" 
            icon={<Languages />} 
            skills={["IELTS 6.0 (Valid until 06/2027)", "ID: 25VN506270HOAB028A"]} 
          />
        </ScrollReveal>
      </div>
    </Section>
  );
}
