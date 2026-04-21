"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "#events" },
  { name: "Programs", href: "#programs" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] relative overflow-hidden">
      {/* Orange glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Subtle ambient glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Corner glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-3xl font-bold tracking-tight cursor-pointer"
              >
                <span className="text-white">Next</span>
                <span className="text-primary">Gen</span>
              </motion.div>
            </Link>
            <p className="mt-4 text-gray-400 max-w-sm">
              Empowering the next generation of leaders through innovation, mentorship, and transformative experiences.
            </p>
            
            {/* Social Links with hover animation */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2, backgroundColor: "rgba(255, 107, 0, 0.2)" }}
                  transition={{ delay: index * 0.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-primary transition-all duration-300 inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:nextgenelevationcircle@gmail.com" className="hover:text-primary transition-colors">
                  nextgenelevationcircle@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary flex-shrink-0" />
                <span>Campus, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Stay Updated</h4>
              <p className="text-gray-400 text-sm mt-1">Get notified about upcoming events and programs.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <motion.input
                whileFocus={{ borderColor: "rgba(255, 107, 0, 0.5)" }}
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 w-full md:w-64 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 107, 0, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-black font-semibold transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Next Gen Development Initiative. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <motion.a 
              href="#" 
              className="text-gray-500 hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-500 hover:text-primary transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}