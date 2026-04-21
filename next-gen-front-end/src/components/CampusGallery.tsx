"use client";

import { motion } from "framer-motion";

const galleryItems = [
  { title: "Student Summit", color: "from-primary/30 to-primary/5" },
  { title: "Hackathon", color: "from-secondary-800 to-secondary-900" },
  { title: "Mentorship", color: "from-primary/20 to-primary/5" },
  { title: "Tech Bootcamp", color: "from-secondary-800 to-secondary-900" },
  { title: "Networking", color: "from-primary/30 to-primary/5" },
  { title: "Awards", color: "from-secondary-800 to-secondary-900" },
];

export default function CampusGallery() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Campus Life
          </h2>
          <p className="mt-4 text-gray-400">
            Discover the vibrant community and transformative experiences.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{item.title}</span>
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}