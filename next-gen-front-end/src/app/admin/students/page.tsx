"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiSearch, FiMail, FiMapPin, FiLoader, FiUser, FiChevronLeft, FiChevronRight, FiBook } from "react-icons/fi";

interface Student {
  _id: string;
  name: string;
  email: string;
  school?: string;
  level?: string;
  username?: string;
  role?: string;
  createdAt?: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "admin-secret-key-2024";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/students`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.school?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Students Management</h1>
        <p className="text-gray-400 mt-1">View and manage all registered students</p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or school..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
          <FiUsers className="text-primary" />
          <span className="text-white font-medium">{students.length}</span>
          <span className="text-gray-400">total students</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-primary text-4xl" />
        </div>
      ) : filteredStudents.length > 0 ? (
        <>
          {/* Table */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Student</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden md:table-cell">School</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden lg:table-cell">Level</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {student.name ? (
                              <span className="text-primary font-semibold">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            ) : (
                              <FiUser className="text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{student.name || "N/A"}</p>
                            <p className="text-gray-500 text-sm">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FiMapPin size={14} />
                          {student.school || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FiBook size={14} />
                          {student.level ? `${student.level} Level` : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-primary text-black"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-[#0A0A0A] rounded-2xl border border-white/10">
          <FiUsers className="text-5xl mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? "No Students Found" : "No Students Yet"}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? "Try adjusting your search query" : "Students will appear here once they register"}
          </p>
        </div>
      )}

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setSelectedStudent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Student Details</h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-2xl font-bold">
                        {selectedStudent.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">{selectedStudent.name}</p>
                      <p className="text-gray-400">{selectedStudent.username || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <FiMail size={18} />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <FiMapPin size={18} />
                      <span>{selectedStudent.school || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <FiBook size={18} />
                      <span>{selectedStudent.level ? `${selectedStudent.level} Level` : "N/A"}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full mt-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}