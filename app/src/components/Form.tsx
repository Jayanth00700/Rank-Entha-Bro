"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Award, School, MapPin, BookOpen, Search, ChevronDown, Check, ListFilter } from "lucide-react";

interface FormProps {
  districts: string[];
  courses: { code: string; name: string }[];
  onCategoryChange?: (cat: string) => void;
  onSubmit: (data: FormValues) => void;
}

export interface FormValues {
  name: string;
  rank: string;
  category: string;
  gender: 'Male' | 'Female';
  collegeType: 'Any' | 'Government' | 'Private' | 'Autonomous' | 'University';
  district: string; // 'Any' or code
  course: string; // 'Any' or code
  preferenceMode: 'College First' | 'Branch First';
}

const DISTRICT_NAMES: Record<string, string> = {
  'HYD': "Hyderabad",
  'RR': "Ranga Reddy",
  'MDL': "Medchal-Malkajgiri",
  'MED': "Medak",
  'WGL': "Warangal",
  'HNK': "Hanamkonda",
  'KRM': "Karimnagar",
  'NLG': "Nalgonda",
  'NZB': "Nizamabad",
  'KHM': "Khammam",
  'MBN': "Mahabubnagar",
  'KGM': "Bhadradri Kothagudem",
  'SRP': "Suryapet",
  'SDP': "Siddipet",
  'JTL': "Jagtial",
  'KMR': "Kamareddy",
  'PDL': "Peddapalli",
  'SRD': "Sangareddy",
  'WNP': "Wanaparthy",
  'YBG': "Yadadri Bhuvanagiri",
  'MHB': "Mahabubabad",
  'NPT': "Narayanpet",
  'SRC': "Rajanna Sircilla"
};

export default function Form({ districts, courses, onCategoryChange, onSubmit }: FormProps) {
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OC");
  const [gender, setGender] = useState<'Male' | 'Female'>("Male");
  const [collegeType, setCollegeType] = useState<'Any' | 'Government' | 'Private' | 'Autonomous' | 'University'>("Any");
  const [district, setDistrict] = useState("Any");
  const [course, setCourse] = useState("Any"); // branchCode or "Any"
  const [preferenceMode, setPreferenceMode] = useState<'College First' | 'Branch First'>("College First");
  const [errors, setErrors] = useState<{ rank?: string }>({});

  // Searchable course dropdown states
  const [courseSearch, setCourseSearch] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses;
    const query = courseSearch.toLowerCase();
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query)
    );
  }, [courses, courseSearch]);

  const selectedCourseLabel = useMemo(() => {
    if (course === "Any") return "Any course";
    const found = courses.find((c) => c.code === course);
    return found ? `${found.code} - ${found.name.split(" (")[0]}` : course;
  }, [course, courses]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (onCategoryChange) {
      onCategoryChange(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank);
    if (!rank || isNaN(rankNum) || rankNum <= 0) {
      setErrors({ rank: "Please enter a valid rank (positive number)." });
      return;
    }
    setErrors({});
    onSubmit({
      name: name.trim() || "Kane Williamson",
      rank,
      category,
      gender,
      collegeType,
      district,
      course,
      preferenceMode
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-10 border border-white/8 shadow-2xl relative overflow-hidden">
        {/* Subtle white/gray light blur glow inside card */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Customized card header with green bullet */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-5">
          <span className="h-2 w-2 rounded-full bg-[#84CC16] animate-pulse" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Counselling Preferences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white flex items-center gap-1.5">
              <User className="h-4 w-4 text-subtext" /> Student name <span className="text-subtext font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kane Williamson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full h-11 bg-white/5 border ${
                name.trim() !== "" ? "border-accent/40 bg-accent/[0.02]" : "border-white/8"
              } rounded-xl px-4 text-white placeholder-subtext focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/10 transition-all text-sm font-medium`}
            />
          </div>

          {/* Rank Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white flex items-center gap-1.5">
              <Award className="h-4 w-4 text-subtext" /> EAPCET rank <span className="text-[#84CC16]">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="Enter your rank"
              value={rank}
              onChange={(e) => {
                setRank(e.target.value);
                if (errors.rank) setErrors({});
              }}
              className={`w-full h-11 bg-white/5 border ${
                errors.rank
                  ? "border-red-500/40"
                  : rank !== ""
                  ? "border-accent/40 bg-accent/[0.02]"
                  : "border-white/8"
              } rounded-xl px-4 text-white placeholder-subtext focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/10 transition-all text-sm font-medium`}
            />
            {errors.rank && (
              <span className="text-xs text-red-400 mt-1 font-semibold">{errors.rank}</span>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full h-11 bg-white/5 border ${
                  category !== "OC" ? "border-accent/40 bg-accent/[0.02]" : "border-white/8"
                } rounded-xl px-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm cursor-pointer appearance-none font-medium`}
              >
                {["OC", "EWS", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST"].map((cat) => (
                  <option key={cat} value={cat} className="bg-bg-dark text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext pointer-events-none" />
            </div>
          </div>

          {/* Gender Segmented Control */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Gender
            </label>
            <div className="flex bg-white/5 border border-white/8 rounded-xl p-0.5 h-11">
              {(["Male", "Female"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer border ${
                    gender === g
                      ? "bg-accent/10 border-accent/40 text-accent shadow-sm"
                      : "border-transparent text-subtext hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* College Type Selector */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-sm font-medium text-white">
            College type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(["Any", "Government", "Private", "Autonomous", "University"] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setCollegeType(type)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  collegeType === type
                    ? "bg-accent/10 border-accent/40 text-accent font-bold"
                    : "bg-white/5 border-white/8 text-subtext hover:border-white/15 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Preferred District */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-subtext" /> Preferred district
            </label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full h-11 bg-white/5 border ${
                  district !== "Any" ? "border-accent/40 bg-accent/[0.02]" : "border-white/8"
                } rounded-xl px-4 text-white focus:outline-none focus:border-accent/50 transition-all text-sm cursor-pointer appearance-none font-medium`}
              >
                <option value="Any" className="bg-bg-dark text-white">Any district</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist} className="bg-bg-dark text-white">
                    {DISTRICT_NAMES[dist] || dist} ({dist})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext pointer-events-none" />
            </div>
          </div>

          {/* Premium Searchable Custom Dropdown for Preferred Course */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-subtext" /> Preferred course
            </label>
            
            {/* Dropdown Toggle Button */}
            <button
              type="button"
              onClick={() => setCourseOpen(true)}
              className={`w-full h-11 bg-white/5 border ${
                course !== "Any" ? "border-accent/40 bg-accent/[0.02]" : "border-white/8"
              } rounded-xl px-4 text-white text-sm font-medium text-left flex items-center justify-between cursor-pointer focus:outline-none focus:border-accent/50 transition-all`}
            >
              <span className="truncate">{selectedCourseLabel}</span>
              <ChevronDown className="h-4 w-4 text-subtext shrink-0" />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
              {courseOpen && (
                <>
                  {/* Transparent overlay backdrop to close dropdown on click outside */}
                  <div 
                    className="fixed inset-0 z-30 cursor-default" 
                    onClick={() => {
                      setCourseOpen(false);
                      setCourseSearch("");
                    }} 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[72px] left-0 w-full bg-[#181818] rounded-xl border border-white/10 shadow-2xl z-40 max-h-[300px] flex flex-col overflow-hidden"
                  >
                    {/* Search query input */}
                    <div className="p-2 border-b border-white/5 flex items-center gap-2">
                      <Search className="h-4 w-4 text-subtext shrink-0" />
                      <input
                        type="text"
                        placeholder="Search branches..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full h-8 bg-transparent text-white placeholder-subtext text-xs font-medium focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {/* Scrollable list items */}
                    <div className="overflow-y-auto no-scrollbar py-1">
                      {/* Any Course option */}
                      <button
                        type="button"
                        onClick={() => {
                          setCourse("Any");
                          setCourseOpen(false);
                          setCourseSearch("");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>Any course</span>
                        {course === "Any" && <Check className="h-3.5 w-3.5 text-accent" />}
                      </button>

                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((c) => (
                          <button
                            type="button"
                            key={c.code}
                            onClick={() => {
                              setCourse(c.code);
                              setCourseOpen(false);
                              setCourseSearch("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span className="truncate max-w-[90%]">
                              {c.code} - <span className="text-subtext font-normal">{c.name.split(" (")[0]}</span>
                            </span>
                            {course === c.code && <Check className="h-3.5 w-3.5 text-accent" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs font-semibold text-subtext text-center italic">
                          No branches match search
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preference Mode */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-sm font-medium text-white">
            Preference Priority
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["College First", "Branch First"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setPreferenceMode(mode)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  preferenceMode === mode
                    ? "bg-accent/10 border-accent/40 text-accent font-bold"
                    : "bg-white/5 border-white/8 text-subtext hover:border-white/15 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${preferenceMode === mode ? 'bg-accent' : 'bg-subtext/30'}`} />
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Options Button ("Get My List", using ListFilter icon) */}
        <button
          type="submit"
          className="w-full h-12 bg-accent text-bg-dark font-bold text-sm tracking-wide rounded-xl transition-all shadow-md hover:bg-accent/90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <ListFilter className="h-4.5 w-4.5 text-bg-dark" />
          <span>Get My List</span>
        </button>
      </form>
    </motion.div>
  );
}
