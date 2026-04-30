"use client";

import { motion } from "framer-motion";
import { FiUser, FiMapPin, FiMail, FiBook, FiSave, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
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
  const [hasChanges, setHasChanges] = useState(false);

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
      setFormData(data);
      setOriginalData(data);
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Check if any field has changed
    const isChanged = Object.keys(newData).some(
      (key) => newData[key as keyof typeof newData] !== (originalData as any)[key]
    );
    setHasChanges(isChanged);
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser._id || storedUser.id;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, this would be a PATCH request
      console.log("Updating user:", userId, "with data:", {
        name: formData.name,
        school: formData.school,
      });

      // Update local storage
      const updatedUser = { ...storedUser, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setOriginalData(formData);
      setHasChanges(false);
      setSaveStatus("success");
      toast.success("Settings saved successfully!");
    } catch (error) {
      setSaveStatus("error");
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setHasChanges(false);
    setSaveStatus("idle");
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
    }),
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Update your profile information</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Profile Picture Section */}
        <motion.div
          custom={0}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-orange-500/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {formData.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Profile Avatar</h3>
              <p className="text-sm text-neutral-400">Your avatar is generated from your initials</p>
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          custom={1}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiUser className="text-primary" />
            Account Information
          </h2>

          <div className="grid grid-cols-1 gap-5">
            <FormField
              icon={FiUser}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            <FormField
              icon={FiMail}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled
              placeholder="your@email.com"
            />

            <FormField
              icon={FiMapPin}
              label="School"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter your school"
            />

            <FormField
              icon={FiBook}
              label="Level"
              name="level"
              type="select"
              value={formData.level}
              onChange={handleChange}
              options={["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          custom={2}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              hasChanges && !isSaving
                ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              hasChanges
                ? "bg-transparent border border-neutral-700 hover:border-neutral-600 text-neutral-300"
                : "bg-transparent border border-transparent text-neutral-600 cursor-not-allowed"
            }`}
          >
            Reset
          </button>
        </motion.div>

        {/* Save Status Message */}
        {saveStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              saveStatus === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {saveStatus === "success" ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiXCircle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {saveStatus === "success" ? "Settings saved successfully!" : "Error saving settings. Please try again."}
            </span>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
}

function FormField({
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
          className={`w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 ${disabled ? "text-neutral-500 cursor-not-allowed" : "text-white"}`}
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
          className={`w-full px-4 py-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 ${disabled ? "text-neutral-500 cursor-not-allowed" : "text-white"}`}
        />
      )}
    </div>
  );
}
