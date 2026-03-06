import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle } from "lucide-react";
import Section from "./Section";

export default function RestrictedPage() {
  return (
    <Section
      id="restricted"
      className="min-h-screen flex items-center justify-center pt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl px-6"
      >
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-6 bg-green-500/10 rounded-full mb-6"
          >
            <CheckCircle size={64} className="text-green-400" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">Access Granted</h1>
          <p className="text-xl text-gray-400">
            Welcome to the restricted area. You have successfully authenticated.
          </p>
        </div>

        {/* Content Area - Customizable */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Shield size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Protected Content
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              This is a restricted page that requires authentication. Only users
              with valid credentials can access this content.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Lock size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Secure Area</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your session is protected with JWT tokens. The token will expire
              after 24 hours for security.
            </p>
          </motion.div>
        </div>

        {/* Customizable Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-12 rounded-3xl border border-white/10 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Customize This Page
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            This is your restricted page template. You can customize it with any
            content you want.
          </p>
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl">
            Edit: src/components/RestrictedPage.jsx
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Only authenticated users can see this page</p>
          <p className="mt-2">
            All other pages (Home, Portfolio) remain public
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
