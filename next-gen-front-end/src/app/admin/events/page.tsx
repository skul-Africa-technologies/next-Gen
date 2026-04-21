"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit2, FiCalendar, FiMapPin, FiImage, FiLoader, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  attendees?: number[];
}

interface FormData {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "admin-secret-key-2024";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "admin-secret-key-2024";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create event");

      await fetchEvents();
      setShowModal(false);
      setFormData({ title: "", description: "", date: "", location: "", imageUrl: "" });
      showToast("success", "Event created successfully!");
    } catch (error) {
      showToast("error", "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "admin-secret-key-2024";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEvents(events.filter(e => e._id !== id));
      setDeleteConfirm(null);
      showToast("success", "Event deleted successfully!");
    } catch (error) {
      showToast("error", "Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-gray-400 mt-1">Create and manage platform events</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-all"
        >
          <FiPlus size={20} />
          Create Event
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl flex items-center gap-3 ${
              toast.type === "success" 
                ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <FiCheck size={20} /> : <FiAlertCircle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-primary text-4xl" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-2xl bg-[#0A0A0A] border border-white/10 overflow-hidden hover:border-primary/30 transition-all"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-black/50 relative">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage className="text-4xl text-white/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setDeleteConfirm(event._id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={16} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={16} />
                    {event.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0A0A0A] rounded-2xl border border-white/10">
          <FiCalendar className="text-5xl mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
          <p className="text-gray-400 mb-6">Create your first event to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Create Event
          </button>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            >
              <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Create New Event</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Event title"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Describe the event..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="Venue"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50"
            >
              <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FiAlertCircle className="text-red-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
                <p className="text-gray-400 mb-6">This action cannot be undone. The event will be permanently removed.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}