"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiUserCheck, FiClock, FiExternalLink } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
};

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUpcoming: Event[] = [
        {
          _id: "1",
          title: "Tech Innovation Summit 2024",
          description: "Join industry leaders for a day of innovation and networking.",
          date: "2024-11-15",
          location: "Convention Center, Downtown",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        },
        {
          _id: "2",
          title: "Student Leadership Workshop",
          description: "Develop your leadership skills with expert facilitators.",
          date: "2024-11-22",
          location: "Campus Auditorium",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        },
      ];

      const mockApplied: Event[] = [
        {
          _id: "3",
          title: "Design Thinking Masterclass",
          description: "Learn creative problem-solving techniques from top designers.",
          date: "2024-10-30",
          location: "Innovation Lab",
          image: "https://images.unsplash.com/photo-1558655146974-5645f85d16b4?w=800&q=80",
        },
        {
          _id: "4",
          title: "Career Fair 2024",
          description: "Connect with top employers and explore internship opportunities.",
          date: "2024-10-25",
          location: "Main Campus Hall",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        },
      ];

      setUpcomingEvents(mockUpcoming);
      setAppliedEvents(mockApplied);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <SkeletonLoader />
      </div>
    );
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-neutral-400">Manage your event registrations</p>
      </motion.div>

      {/* Applied Events */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mb-12"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiUserCheck className="text-primary" />
          Applied Events
          <span className="text-sm text-neutral-400 font-normal">({appliedEvents.length})</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {appliedEvents.map((event, idx) => (
            <EventCard key={event._id} event={event} status="applied" delay={idx} />
          ))}
        </div>
      </motion.section>

      {/* Upcoming Events */}
      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiCalendar className="text-primary" />
          Upcoming Events
          <span className="text-sm text-neutral-400 font-normal">({upcomingEvents.length})</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingEvents.map((event, idx) => (
            <EventCard key={event._id} event={event} status="upcoming" delay={idx} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}

function EventCard({ event, status, delay }: { event: Event; status: "applied" | "upcoming"; delay: number }) {
  const statusColors = {
    applied: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30",
    },
    upcoming: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
    },
  };

  const statusLabel = status === "applied" ? "Applied" : "Upcoming";

  return (
    <motion.div
      custom={delay}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: i * 0.1 },
        }),
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
    >
      <div className="h-48 lg:h-56 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent" />
      </div>

      <div className="absolute top-3 right-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status].bg} ${statusColors[status].text} border ${statusColors[status].border}`}>
          {statusLabel}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{event.description}</p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <button className="absolute bottom-4 right-4 w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <FiExternalLink className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SkeletonLoader() {
  return (
    <div>
      <div className="h-12 w-48 bg-neutral-800 rounded-lg mb-6 animate-pulse" />
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="h-8 w-48 bg-neutral-800 rounded-lg mb-4 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="h-48 bg-neutral-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
