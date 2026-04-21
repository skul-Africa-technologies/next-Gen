"use client";

import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiAward, FiBookOpen, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const features = [
  {
    title: "Skill Development",
    description: "Learn real-world skills through structured tracks from beginner to advanced. Master technologies that matter in today's digital landscape.",
    icon: FiBookOpen,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    stats: "50+ Skills",
  },
  {
    title: "Mentorship",
    description: "Connect with mentors, book sessions, and grow with expert guidance. Get personalized feedback from industry professionals.",
    icon: FiUsers,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    stats: "200+ Mentors",
  },
  {
    title: "Events & Workshops",
    description: "Participate in bootcamps, hackathons, and campus programs. Hands-on learning experiences that transform your career.",
    icon: FiCalendar,
    image: "https://images.unsplash.com/photo-1544531696-f6d1d0fcf9aa?w=800&q=80",
    stats: "100+ Events",
  },
  {
    title: "Certifications",
    description: "Earn verified certificates for skills and events completed. Stand out with credentials that matter to employers.",
    icon: FiAward,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    stats: "10K+ Certified",
  },
];

export default function Features() {
  return (
    <section id="programs" className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything Students Need to Grow
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            From skills to certifications, we provide all the tools you need to succeed in your academic journey.
          </p>
        </motion.div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-3xl group ${
                index % 2 === 0 ? "md:flex" : "md:flex-row-reverse"
              }`}
            >
              {/* Image Section */}
              <div className="relative h-64 md:h-80 md:w-1/2 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${feature.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-sm"
                >
                  <span className="text-primary font-semibold">{feature.stats}</span>
                </motion.div>

                {/* Orange Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content Section */}
              <div className="relative p-8 md:p-12 md:w-1/2 bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="text-primary w-7 h-7" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>

                <Link 
                  href="#events"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Learn more <FiArrowRight className="w-4 h-4" />
                </Link>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
