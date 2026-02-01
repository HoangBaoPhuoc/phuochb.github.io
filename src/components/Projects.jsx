import React from 'react';
import Section from './Section';
import ScrollReveal from './ScrollReveal';
import { Github, ExternalLink, Globe } from 'lucide-react';

const ProjectCard = ({ title, role, period, description, results, stack, link }) => (
  <div className="group relative glass-panel p-8 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-700">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{role} | {period}</p>
        </div>
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-white/10 rounded-full hover:bg-blue-500 hover:text-white transition-all"
          >
            {link.includes('github') ? <Github size={20} /> : <Globe size={20} />}
          </a>
        )}
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed text-lg">{description}</p>

      {results && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">Key Results</h4>
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
            {results.map((res, i) => (
              <li key={i}>{res}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
        {stack.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-1 text-xs bg-black/30 text-gray-400 rounded border border-white/5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function Projects() {
  const projects = [
    {
      title: "Zero Trust Architecture in Hybrid Cloud Environments",
      role: "University of Information Technology",
      period: "Oct 2025 – Present",
      description: "Designed and implemented a Zero Trust Architecture for a Hybrid Cloud environment using a Hub-and-Spoke model on OpenStack, enforcing identity-based access for both users and workloads.",
      results: [
        "Passed 40/40 security test cases",
        "Achieved 5-minute certificate rotation",
        "Reduced authentication latency to 12ms",
        "Designed dual-layer identity architecture (User & Workload Identity) using SPIRE"
      ],
      stack: ["OpenStack", "Kubernetes (K3s)", "Terraform", "Ansible", "SPIRE", "OPA (Rego)", "Envoy", "Keycloak", "Prometheus", "Grafana", "Jaeger"],
      link: "https://github.com/HoangBaoPhuoc/ZTA-MULTICLOUD"
    },
    {
      title: "Defense-in-Depth Security System Implementation",
      role: "University of Information Technology",
      period: "Oct 2025 – Jan 2026",
      description: "Designed a multi-layer defense-in-depth security architecture and performed a black-box Red Team assessment to evaluate real-world attack resilience.",
      results: [
        "Compromised admin account via ARP Spoofing / MITM",
        "Bypassed file upload filters using Magic Bytes",
        "Validated WAF effectiveness, blocking approximately 80% of external exploits"
      ],
      stack: ["pfSense", "ModSecurity", "Apache", "Burp Suite", "Nmap", "Bettercap", "OpenSSL", "Wireshark"],
      link: null
    },
    {
      title: "VulnHunt-GPT – Smart Contract Vulnerability Detection System",
      role: "University of Information Technology",
      period: "Oct 2025 – Dec 2025",
      description: "Developed an AI-assisted vulnerability detection system for Solidity smart contracts by combining Deep Learning, Retrieval-Augmented Generation (RAG), and GPT-based reasoning.",
      results: [
        "Reduced false positives by 30–40% compared to traditional static analysis tools",
        "Supported real-time analysis with line-level vulnerability reporting",
        "Generated contextual security explanations to assist developers in remediation"
      ],
      stack: ["Python", "Solidity", "Deep Learning", "RAG", "GPT", "Smart Contract Security"],
      link: "https://github.com/HoangBaoPhuoc/VulnHunt-GPT"
    },
    {
      title: "System Automation & IaC for Scalable Hybrid Cloud Infrastructure",
      role: "VPBank Hackathon – Senior Track",
      period: "Oct 2025 – Nov 2025",
      description: "Built an intelligent Infrastructure-as-Code (IaC) platform to automate deployment and management of a hybrid cloud environment connecting OpenStack and AWS via SD-WAN.",
      results: [
        "Reduced infrastructure provisioning time to under 15 minutes",
        "Improved cloud cost efficiency using AI-driven predictive auto-scaling",
        "Automated end-to-end deployment and scaling workflows"
      ],
      stack: ["Python (FastAPI)", "Terraform", "Ansible", "AWS (Transit Gateway)", "Google Gemini AI", "Grafana", "StrongSwan"],
      link: "https://github.com/HoangBaoPhuoc/Automation-IaC-deploy-and-scaling-on-hybrid-cloud"
    },
    {
      title: "FraudGNN-RL – Adaptive Financial Fraud Detection",
      role: "University of Information Technology",
      period: "Feb 2025 – Jun 2025",
      description: "Developed an adaptive financial fraud detection system combining Graph Neural Networks (GNN) and Reinforcement Learning on large-scale transaction data.",
      results: [
        "Processed 550k+ transactions",
        "Achieved F1-score: 0.8957",
        "Achieved AUC-ROC: 0.9774",
        "Reached Recall@5%: 91.51%"
      ],
      stack: ["Python", "GNN", "Reinforcement Learning", "Machine Learning", "Deep Learning"],
      link: "https://github.com/HoangBaoPhuoc/Adaptive-Financial-Fraud-Detection-using-GNN-and-Reinforcement-Learning"
    },
    {
        title: "Post-Quantum Lightweight Authentication Scheme for IoT",
        role: "University of Information Technology",
        period: "Feb 2025 – Jun 2025",
        description: "Designed a post-quantum secure RFID authentication system to protect IoT environments against future quantum computing threats.",
        results: [
          "Implemented lightweight mutual authentication using AES-128 and Dilithium2",
          "Deployed on ESP32 devices",
          "Prevented Replay and MITM attacks",
          "Aligned with NIST SP 800-204 standards"
        ],
        stack: ["ESP32", "RFID", "MQTT", "Post-Quantum Cryptography (Dilithium2)", "AES-128", "SHA-256"],
        link: "https://github.com/HoangBaoPhuoc/Post-Quantum-Lightweight-Authentication-Scheme-for-IoT"
    },
    {
        title: "Youth Union Introduction Website",
        role: "Faculty of Computer Networks and Communications",
        period: "", 
        description: "Developed a full-stack website supporting Youth Union activities for the faculty.",
        results: [
            "Designed database schema",
            "Implemented admin logic and UI",
            "Ensured secure, maintainable, and scalable codebase"
        ],
        stack: ["Fullstack Development", "Database Design", "Web Security"],
        link: "https://suctremmt.com"
    }
  ];

  return (
    <Section id="projects">
      <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
        Featured Projects
      </h2>
      <div className="grid lg:grid-cols-2 gap-20">
        {projects.map((project, index) => (
          <ScrollReveal 
            key={index} 
            direction={index % 2 === 0 ? 'left' : 'right'} 
            className="h-full"
          >
            <ProjectCard {...project} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
