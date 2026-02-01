import React from 'react';
import Section from './Section';
import { GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <Section id="about" className="min-h-screen flex items-center pt-0">
      <div className="grid lg:grid-cols-2 gap-20 items-start w-full">
        
        {/* Left Column: About Text */}
        <div className="space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200 text-left">
            About Me
          </h2>
          <div className="text-xl text-gray-300 leading-relaxed space-y-6">
            <p className="text-justify">
              I am an aspiring <strong className="text-white">Cloud Security and DevSecOps Engineer</strong> with a strong foundation in cloud infrastructure, DevOps automation, and security engineering, focused on building systems that are scalable, resilient, and secure by design. With an academic background in Information Security, I bring a practical security-first mindset—not aiming for perfect protection, but designing for early defense, resilience, and effective incident response across cloud and DevOps workflows.
            </p>
            <p className="text-justify">
              I am particularly interested in <strong className="text-white">Cloud Security, DevSecOps practices, Zero Trust Architecture, and Infrastructure as Code (IaC)</strong>, where security and incident response considerations are embedded into CI/CD pipelines and cloud-native environments from the early design stages. Through hands-on projects and personal labs, I have gained experience with OpenStack, Kubernetes, and public cloud platforms, applying policy-as-code, identity-driven security, and automated infrastructure provisioning to real-world scenarios.
            </p>
          </div>
        </div>

        {/* Right Column: Education Card */}
        <div className="group relative glass-panel rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">Education</h2>
            </div>

          <div className="space-y-10 border-l-2 border-blue-500/30 ml-3">
            
            {/* University */}
            <div className="relative pl-8">
               <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white leading-tight">Information Security – General Program</h3>
                <p className="text-cyan-400">University of Information Technology, VNU-HCM</p>
                <p className="text-sm text-gray-400 font-mono">2023 – 2027</p>
                
                <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2 marker:text-blue-500 text-base">
                  <li>GPA: <span className="text-white font-bold">8.57 / 10</span></li>
                  <li>Executive Member, Faculty Networks and Communications Young Union <span className="text-gray-500 italic">(May 2024 – Present)</span></li>
                                    <li>Actively involved in organizing most faculty activities and events, with significant responsibility for event planning, coordination, and design.</li>
                </ul>
              </div>
            </div>

            {/* High School */}
            <div className="relative pl-8">
               <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
               <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white leading-tight">High School Diploma</h3>
                <p className="text-purple-300">Phan Chau Trinh High School of Danang</p>
                <p className="text-sm text-gray-400 font-mono">2020 – 2023</p>
                
                <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2 marker:text-purple-500 text-base">
                  <li>GPA: <span className="text-white font-bold">8.6 / 10</span></li>
                  <li>Collaborator, School Youth Union <span className="text-gray-500 italic">(2021 – 2023)</span></li>
                  <li>Actively participated in annual school activities and supported event organization.</li>
                </ul>
              </div>
            </div>

          </div>
          </div>
        </div>

      </div>
    </Section>
  );
}
