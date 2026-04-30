"use client";

import { motion } from "framer-motion";
import { FiUser, FiMail, FiMapPin, FiBook, FiEdit, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    school: "",
    level: "",
  });
  const [originalData, setOriginalData] = useState<{
    name: string;
    email: string;
    school: string;
    level: string;
  }>({ name: "", email: "", school: "", level: "" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const data = {
        name: user.name || "",
        email: user.email || "",
        school: user.school || "",
        level: user.level || "Freshman",
      };
      setUserData(data);
      setOriginalData(data);
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/users/${storedUser._id || storedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: userData.name,
            school: userData.school,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = { ...storedUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
    }),
  };

  if (isLoading && !userData.name) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-neutral-400">Manage your account information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-4 lg:p-8"
      >
        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary/30 to-orange-500/30 flex items-center justify-center mb-4"
            >
              <span className="text-3xl lg:text-4xl font-bold text-primary">
                {getInitials(userData.name)}
              </span>
            </motion.div>
            <h2 className="text-xl lg:text-2xl font-bold">{userData.name}</h2>
            <p className="text-neutral-400">{userData.email}</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <InputField
              icon={FiUser}
              label="Full Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />

            <InputField
              icon={FiMail}
              label="Email Address"
              name="email"
              type="email"
              value={userData.email}
              disabled={true}
              placeholder="your@email.com"
            />

            <InputField
              icon={FiMapPin}
              label="School"
              name="school"
              value={userData.school}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your school"
            />

            <InputField
              icon={FiBook}
              label="Level"
              name="level"
              type="select"
              value={userData.level}
              onChange={handleChange}
              disabled={!isEditing}
              options={["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]}
            />
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-neutral-800"
          >
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  placeholder,
  options = [],
}: {
  icon: any;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 ${disabled ? "text-neutral-500 cursor-not-allowed" : "text-white"}`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-neutral-900">
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 ${disabled ? "text-neutral-500 cursor-not-allowed" : "text-white"}`}
        />
      )}
    </div>
  );
}
