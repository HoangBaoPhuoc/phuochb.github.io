import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Facebook, Linkedin, Github, ChevronRight, ArrowUp, Instagram, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

// Assets
import Portrait1 from '../assets/Portrait-1.JPG';
import EventImg from '../assets/Event.png';
import Portrait2 from '../assets/Portrait-2.JPG';

const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-500 text-white backdrop-blur-sm border border-transparent hover:border-white/20"
  >
    {icon}
  </a>
);

export default function Hero() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
    <div id="home" className="min-h-screen relative overflow-hidden">
      
      {/* Intro Section */}
      <section className="min-h-screen relative px-6 md:px-20 flex flex-col justify-center">
          <div className="max-w-7xl z-10 mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-[1px] w-12 bg-blue-200"></div>
                 <span className="text-blue-200 font-bold tracking-widest uppercase text-sm font-raleway">Portfolio</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold font-raleway text-white leading-tight mb-4 drop-shadow-2xl">
                Hoang Bao <br className="hidden md:block" /> Phuoc
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-bold font-gilroy mb-8 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
                Cloud & DevOps
              </h2>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Link 
                  to="/portfolio"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold font-gilroy tracking-wide hover:scale-105 transition-all duration-500 flex items-center gap-2 group border border-white/10 shadow-lg"
                >
                  LEARN MORE
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
                
                <div className="flex gap-4">
                  <SocialLink href="mailto:phuocab191@gmail.com" icon={<Mail size={20} />} />
                  <SocialLink href="https://www.facebook.com/UGFuZG9yYQ/" icon={<Facebook size={20} />} />
                  <SocialLink href="https://www.linkedin.com/in/phuoc-hoang-bao-9b4b63368/" icon={<Linkedin size={20} />} />
                  <SocialLink href="https://github.com/HoangBaoPhuoc" icon={<Github size={20} />} />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500 hidden md:block">
              <span className="text-sm">Scroll for Bio</span>
          </div>
      </section>

      {/* Bio Section */}
      <section className="relative px-6 md:px-20 pb-20 space-y-32">
          
          {/* Row 1: Intro Text + Portrait 1 */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideInLeft} 
               className="text-gray-300 space-y-6 text-xl leading-relaxed font-light text-justify"
            >
               <p>
                  I am a third-year Information Security student at the University of Information Technology (VNU-HCM) with a strong interest in DevOps and Cloud Engineering. I am passionate about building practical systems that are reliable, scalable, and secure, and that deliver real value to users.
                </p>
                <p>
                  I enjoy working on hands-on projects involving Linux, Docker, Kubernetes, Terraform, and cloud platforms such as AWS and GCP. Through personal labs, academic projects, and self-initiated workshops, I continuously strengthen my understanding of infrastructure automation, CI/CD pipelines, and multi-cloud environments, while applying a security-first mindset in system design.
                </p>
                <p>
                  Although my academic background is in Information Security, I am actively expanding my career path toward DevOps and Cloud Engineering, where I can combine security principles with modern engineering practices. My goal is to gain real-world experience in a professional environment, contribute meaningful value to products and users, and grow into a reliable and well-rounded Cloud/DevOps engineer.
                </p>
            </motion.div>
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideInRight} 
               className="relative group md:w-3/4 mx-auto"
            >
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img src={Portrait1} alt="Portrait 1" className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 border border-white/10" />
            </motion.div>
          </div>

          {/* Row 2: Event Image + Activity Text */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
             <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideInLeft} 
                className="order-2 md:order-1 relative group"
             >
                <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img src={EventImg} alt="Event Activity" className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 border border-white/10" />
            </motion.div>
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideInRight} 
               className="order-1 md:order-2 text-gray-300 space-y-6 text-xl leading-relaxed font-light text-justify"
            >
               <p>
                  Beyond academics, I have been actively involved in student and community activities since high school. I began as a Youth Union collaborator at the high school level, where I developed a strong interest in event organization and teamwork.
                </p>
                <p>
                   At university, I continued contributing as a Faculty Youth Union collaborator, later advancing to a member of the Executive Committee, where I currently serve as Head of the Design Team. In this role, I leverage AI-assisted workflows and am proficient in Adobe Photoshop to support event branding and communications.
                </p>
                
                <a 
                  href="https://www.facebook.com/uit.nc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium mt-4 group"
                >
                  <Facebook size={20} />
                  <span>Visit Organization Fanpage</span>
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                </a>
            </motion.div>
          </div>

          {/* Row 3: Personal Text + Portrait 2 */}
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideInLeft} 
               className="text-gray-300 space-y-6 text-xl leading-relaxed font-light text-justify"
            >
               <p>
                  I was born and raised in Da Nang, a coastal city that shaped my adaptability and open mindset.
                </p>
                <p>
                   Outside of work and study, I enjoy traveling and film photography, which help me cultivate patience, attention to detail, and a creative perspective—qualities that I also bring into my technical and collaborative work.
                </p>
                
                <a 
                  href="https://www.instagram.com/pandoraaik_19/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors font-medium mt-4 group"
                >
                  <Instagram size={20} />
                  <span>View more photos & life on Instagram</span>
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                </a>
            </motion.div>
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideInRight} 
               className="relative group"
            >
                <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img src={Portrait2} alt="Portrait 2" className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 border border-white/10" />
            </motion.div>
          </div>

      </section>

      <Footer />

    </div>
    </>
  );
}
