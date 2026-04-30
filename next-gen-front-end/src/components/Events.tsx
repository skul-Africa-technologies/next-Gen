"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiArrowRight, FiSearch, FiFilter, FiHeart, FiClock } from "react-icons/fi";
import { eventsApi, Event } from "@/lib/events-api";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getAll();
      // Handle ApiResponse wrapper {success, message, data}
      const data = response && typeof response === 'object' && 'data' in response ? response.data : response;
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Unable to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const response = await eventsApi.search(term);
        // Handle ApiResponse wrapper
        const data = response && typeof response === 'object' && 'data' in response ? response.data : response;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else {
      fetchEvents();
    }
  };

  const handleFilterChange = (filterType: string) => {
    setFilter(filterType);
    if (filterType === "upcoming") {
      const upcoming = events.filter(e => new Date(e.date) > new Date());
      setEvents(upcoming);
    } else {
      fetchEvents();
    }
  };

  const handleMarkInterest = async (eventId: string) => {
    const studentId = "demo-student-id"; 
    try {
      await eventsApi.markInterest(eventId, studentId);
      setInterestedEvents(prev => new Set(prev).add(eventId));
    } catch (err) {
      console.error("Failed to mark interest:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section id="events" className="py-24 px-6 bg-[#0A0A0A] relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Events</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Discover transformative events designed to elevate your skills, expand your network, and accelerate your growth.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 max-w-sm w-full"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black">All Events</option>
              <option value="upcoming" className="bg-black">Upcoming</option>
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">{error}</p>
            <button 
              onClick={fetchEvents}
              className="mt-4 text-primary hover:underline"
            >
              Try again
            </button>
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No events found.</p>
            <p className="text-gray-600 text-sm mt-2">Check back later for upcoming events.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden card-hover">
                  {/* Event Image */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-purple-900 relative overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNS4zNzMgMC05LjUtNC4xMjctOS41LTlkuNSA0LjEyNy05LjUgOS41IDkuNSA5LjUgNS4zNzMgMCA5LjUgNC4xMjcgOS41IDkuNS00LjEyNyA5LjUtOS41IDkuNXoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur text-sm text-white flex items-center gap-1">
                        <FiCalendar className="text-primary" />
                        {formatDate(event.date)}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMarkInterest(event._id)}
                        className={`p-2 rounded-lg backdrop-blur text-sm transition-colors ${
                          interestedEvents.has(event._id) 
                            ? 'bg-primary text-black' 
                            : 'bg-black/50 text-white hover:text-primary'
                        }`}
                      >
                        <FiHeart className={interestedEvents.has(event._id) ? 'fill-current' : ''} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <FiMapPin className="text-primary" />
                      {event.location}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all"
                    >
                      Register
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}