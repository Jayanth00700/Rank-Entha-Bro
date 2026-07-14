"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Copy, ArrowLeft, CheckCircle, Info, Building, BookOpen, MapPin, Award } from "lucide-react";

interface ResultsProps {
  name: string;
  rank: number;
  category: string;
  gender: string;
  options: OptionResult[];
  preferenceMode: 'College First' | 'Branch First';
  onBack: () => void;
}

export interface OptionResult {
  collegeCode: string;
  collegeName: string;
  place: string;
  district: string;
  coeducation: string;
  collegeType: string;
  branchCode: string;
  branchName: string;
  university: string;
  cutoffVal: number;
  isAutonomous: boolean;
  ocCutoffText: string;
  categoryCutoffText: string;
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

export default function Results({ name, rank, category, gender, options, preferenceMode, onBack }: ResultsProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("Any");
  const [filterBranch, setFilterBranch] = useState("Any");
  const [filterCollegeType, setFilterCollegeType] = useState("Any");
  
  const [copied, setCopied] = useState(false);

  // Filter lists from original options
  const uniqueDistricts = Array.from(new Set(options.map(o => o.district))).sort();
  const uniqueBranches = Array.from(new Set(options.map(o => o.branchCode))).sort();

  // Filter options based on search and selected values
  const filteredOptions = options.filter((opt) => {
    const matchesSearch = 
      opt.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.collegeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.branchCode.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDistrict = filterDistrict === "Any" || opt.district === filterDistrict;
    const matchesBranch = filterBranch === "Any" || opt.branchCode === filterBranch;
    
    let matchesType = true;
    if (filterCollegeType !== "Any") {
      const type = opt.collegeType.toUpperCase();
      const name = opt.collegeName.toUpperCase();
      if (filterCollegeType === "Government") {
        matchesType = type === "GOV" || name.includes("GOVERNMENT") || name.includes("GOVT");
      } else if (filterCollegeType === "University") {
        matchesType = type === "UNIV" || name.includes("UNIVERSITY") || name.includes("UNIV") || opt.university === "CONSTITUENT";
      } else if (filterCollegeType === "Autonomous") {
        matchesType = opt.isAutonomous;
      } else if (filterCollegeType === "Private") {
        matchesType = (type === "PVT" || type === "SF") && !opt.isAutonomous;
      }
    }

    return matchesSearch && matchesDistrict && matchesBranch && matchesType;
  });

  // Calculate unique college counts
  const totalColleges = Array.from(new Set(options.map(o => o.collegeCode))).length;
  const filteredColleges = Array.from(new Set(filteredOptions.map(o => o.collegeCode))).length;

  // Actions
  const handleCopy = () => {
    const textList = filteredOptions.map((opt, i) => 
      `${i + 1}. [${opt.collegeCode}] ${opt.collegeName} (${DISTRICT_NAMES[opt.district] || opt.district}) - ${opt.branchCode} (${opt.branchName})`
    ).join("\n");
    
    navigator.clipboard.writeText(textList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadCSV = () => {
    const headers = [
      "Option No", "College Code", "College Name", "Branch Code", "Branch Name", 
      "Place", "District", "College Type", "Affiliated University", "Last Rank Cutoff"
    ];
    
    const rows = filteredOptions.map((opt, index) => [
      index + 1,
      opt.collegeCode,
      opt.collegeName,
      opt.branchCode,
      opt.branchName,
      opt.place,
      opt.district,
      opt.collegeType,
      opt.university,
      opt.cutoffVal === 999999 ? "NA" : opt.cutoffVal
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RankEnthaBro_CounsellingOptions_${name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Grouping Options for presentation:
  // College First -> Group by College, list branches inside
  // Branch First -> Group by Branch, list colleges inside
  const groupedData = React.useMemo(() => {
    if (preferenceMode === "College First") {
      const groups: {
        collegeCode: string;
        collegeName: string;
        place: string;
        district: string;
        collegeType: string;
        university: string;
        isAutonomous: boolean;
        branches: {
          branchCode: string;
          branchName: string;
          cutoffVal: number;
          ocCutoffText: string;
          categoryCutoffText: string;
        }[];
      }[] = [];

      filteredOptions.forEach((opt) => {
        let group = groups.find((g) => g.collegeCode === opt.collegeCode);
        if (!group) {
          group = {
            collegeCode: opt.collegeCode,
            collegeName: opt.collegeName,
            place: opt.place,
            district: opt.district,
            collegeType: opt.collegeType,
            university: opt.university,
            isAutonomous: opt.isAutonomous,
            branches: []
          };
          groups.push(group);
        }
        group.branches.push({
          branchCode: opt.branchCode,
          branchName: opt.branchName,
          cutoffVal: opt.cutoffVal,
          ocCutoffText: opt.ocCutoffText,
          categoryCutoffText: opt.categoryCutoffText
        });
      });

      return { type: "college", items: groups };
    } else {
      const groups: {
        branchCode: string;
        branchName: string;
        colleges: {
          collegeCode: string;
          collegeName: string;
          place: string;
          district: string;
          collegeType: string;
          university: string;
          isAutonomous: boolean;
          cutoffVal: number;
          ocCutoffText: string;
          categoryCutoffText: string;
        }[];
      }[] = [];

      filteredOptions.forEach((opt) => {
        let group = groups.find((g) => g.branchCode === opt.branchCode);
        if (!group) {
          group = {
            branchCode: opt.branchCode,
            branchName: opt.branchName,
            colleges: []
          };
          groups.push(group);
        }
        group.colleges.push({
          collegeCode: opt.collegeCode,
          collegeName: opt.collegeName,
          place: opt.place,
          district: opt.district,
          collegeType: opt.collegeType,
          university: opt.university,
          isAutonomous: opt.isAutonomous,
          cutoffVal: opt.cutoffVal,
          ocCutoffText: opt.ocCutoffText,
          categoryCutoffText: opt.categoryCutoffText
        });
      });

      return { type: "branch", items: groups };
    }
  }, [filteredOptions, preferenceMode]);

  // Keep a running sequential counter for branches or colleges across groups
  let runningOptionNumber = 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card-list {
            display: block !important;
          }
          .glass-card {
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid #ddd !important;
            box-shadow: none !important;
            color: black !important;
            backdrop-filter: none !important;
            padding: 12px 0 !important;
            margin-bottom: 0 !important;
            border-radius: 0 !important;
          }
          .text-white {
            color: black !important;
          }
          .text-subtext, .text-gray-400 {
            color: #444 !important;
          }
          .badge {
            border: 1px solid #666 !important;
            color: black !important;
            background: transparent !important;
          }
        }
      `}} />

      {/* Prominent Back to Home button */}
      <button
        onClick={onBack}
        className="no-print group flex items-center gap-2 text-sm font-bold text-subtext hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </button>

      {/* Structured Congratulations Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl p-6 md:p-8 border border-white/8 shadow-2xl relative overflow-hidden mb-8"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
            Congratulations!
          </h1>
          <p className="text-sm md:text-base text-subtext font-semibold mb-4">
            Based on your profile
          </p>
          
          <ul className="space-y-2 mb-6 border-l border-white/10 pl-4 py-1">
            <li className="text-sm font-semibold flex items-center gap-2">
              <span className="text-subtext">Rank:</span>
              <span className="text-white font-bold font-mono">{rank.toLocaleString()}</span>
            </li>
            <li className="text-sm font-semibold flex items-center gap-2">
              <span className="text-subtext">Category:</span>
              <span className="text-white font-bold">{category}</span>
            </li>
            <li className="text-sm font-semibold flex items-center gap-2">
              <span className="text-subtext">Gender:</span>
              <span className="text-white font-bold">{gender}</span>
            </li>
          </ul>

          <div className="mb-4">
            <p className="text-sm font-semibold text-white/90">
              You are eligible for
            </p>
            <div className="inline-block text-3xl font-extrabold text-white tracking-tight border-b-2 border-white/40 pb-1 mt-1 font-mono">
              {totalColleges} Colleges
            </div>
          </div>

          <p className="text-xs text-subtext/90 italic mt-4 max-w-2xl leading-relaxed">
            We've also generated your optimized counselling web options based on the 2025 TG EAPCET Final Phase cutoff data.
          </p>
        </div>
      </motion.div>

      {/* Main Results Header and Action Buttons */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Generated Options List
          </h2>
          <p className="text-xs text-subtext font-medium mt-1">
            Found {filteredOptions.length} eligible branch listings across {filteredColleges} colleges
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/12 text-white rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
          
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/12 text-white rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download Excel
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/12 text-white rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer min-w-[140px] justify-center"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied list!" : "Copy Option List"}
          </button>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="no-print glass-card rounded-xl p-4 border border-white/8 mb-6 flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext" />
          <input
            type="text"
            placeholder="Search college name, code, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-white/5 border border-white/8 rounded-lg pl-10 pr-4 text-white placeholder-subtext focus:outline-none focus:border-white/20 transition-all text-sm font-medium"
          />
        </div>

        {/* Multi-Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* District Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 h-10">
            <span className="text-[10px] font-bold text-subtext uppercase tracking-wider shrink-0">District:</span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer border-none"
            >
              <option value="Any" className="bg-bg-dark text-white">Any District</option>
              {uniqueDistricts.map(dist => (
                <option key={dist} value={dist} className="bg-bg-dark text-white">
                  {DISTRICT_NAMES[dist] || dist} ({dist})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 h-10">
            <span className="text-[10px] font-bold text-subtext uppercase tracking-wider shrink-0">Course:</span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer border-none"
            >
              <option value="Any" className="bg-bg-dark text-white">Any Course</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch} className="bg-bg-dark text-white">{branch}</option>
              ))}
            </select>
          </div>

          {/* College Type Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 h-10">
            <span className="text-[10px] font-bold text-subtext uppercase tracking-wider shrink-0">Type:</span>
            <select
              value={filterCollegeType}
              onChange={(e) => setFilterCollegeType(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer border-none"
            >
              <option value="Any" className="bg-bg-dark text-white">Any Type</option>
              <option value="Autonomous" className="bg-bg-dark text-white">Autonomous Only</option>
              <option value="Government" className="bg-bg-dark text-white">Government Only</option>
              <option value="University" className="bg-bg-dark text-white">University Only</option>
              <option value="Private" className="bg-bg-dark text-white">Private Non-Auton</option>
            </select>
          </div>
        </div>
      </div>

      {/* Options Grouped Output List */}
      <div className="flex flex-col gap-6">
        {groupedData.items.length > 0 ? (
          
          /* OPTION A: Grouped by College */
          groupedData.type === "college" ? (
            (groupedData.items as any[]).map((group, gIdx) => {
              const isGovOrUniv = group.collegeType === "GOV" || group.collegeType === "UNIV" || group.collegeName.includes("UNIVERSITY") || group.collegeName.includes("GOVERNMENT");
              const typeLabel = isGovOrUniv
                ? (group.collegeType === "UNIV" || group.collegeName.includes("UNIVERSITY") ? "University College" : "Government College")
                : (group.isAutonomous ? "Private Autonomous" : "Private College");

              return (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(gIdx * 0.03, 0.3) }}
                  key={group.collegeCode}
                  className="glass-card rounded-xl border border-white/8 overflow-hidden"
                >
                  {/* College Header */}
                  <div className="bg-white/[0.02] border-b border-white/5 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
                        <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-tight">
                          {group.collegeName}
                        </h3>
                        <span className="text-[10px] font-bold font-mono text-white/90 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 shrink-0">
                          {group.collegeCode}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-subtext">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-subtext shrink-0" />
                          {DISTRICT_NAMES[group.district] || group.district}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-subtext shrink-0" />
                          {typeLabel}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="italic">Affiliated to {group.university}</span>
                      </div>
                    </div>
                  </div>

                  {/* Branches (Nested List) */}
                  <div className="divide-y divide-white/5">
                    {group.branches.map((br: any, brIdx: number) => {
                      runningOptionNumber++;
                      return (
                        <div 
                          key={`${br.branchCode}-${brIdx}`}
                          className="p-4 hover:bg-white/[0.015] transition-all flex items-start gap-4"
                        >
                          {/* Option Number Circle */}
                          <div className="flex items-center justify-center h-6 w-6 rounded-md bg-white/5 border border-white/8 text-[11px] font-bold text-subtext font-mono shrink-0">
                            {runningOptionNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white flex items-baseline gap-1.5">
                              <span>{br.branchName}</span>
                              <span className="text-xs font-bold font-mono text-secondary shrink-0">({br.branchCode})</span>
                            </h4>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center shrink-0 gap-4 self-center text-right">
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success">
                              <CheckCircle className="h-2.5 w-2.5" /> Eligible
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          ) : (
            
            /* OPTION B: Grouped by Branch */
            (groupedData.items as any[]).map((group, gIdx) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(gIdx * 0.04, 0.3) }}
                  key={group.branchCode}
                  className="glass-card rounded-xl border border-white/8 overflow-hidden"
                >
                  {/* Branch Header */}
                  <div className="bg-white/[0.02] border-b border-white/5 p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white tracking-tight flex items-baseline gap-2">
                        <span>{group.branchName}</span>
                        <span className="text-xs font-bold font-mono text-secondary shrink-0">({group.branchCode})</span>
                      </h3>
                    </div>
                  </div>

                  {/* Colleges offering this branch (Nested List) */}
                  <div className="divide-y divide-white/5">
                    {group.colleges.map((col: any, colIdx: number) => {
                      runningOptionNumber++;
                      const isGovOrUniv = col.collegeType === "GOV" || col.collegeType === "UNIV" || col.collegeName.includes("UNIVERSITY") || col.collegeName.includes("GOVERNMENT");
                      const typeLabel = isGovOrUniv
                        ? (col.collegeType === "UNIV" || col.collegeName.includes("UNIVERSITY") ? "University" : "Government")
                        : (col.isAutonomous ? "Private Auton" : "Private");

                      return (
                        <div 
                          key={`${col.collegeCode}-${colIdx}`}
                          className="p-4 hover:bg-white/[0.015] transition-all flex items-start gap-4"
                        >
                          {/* Option Number */}
                          <div className="flex items-center justify-center h-6 w-6 rounded-md bg-white/5 border border-white/8 text-[11px] font-bold text-subtext font-mono shrink-0">
                            {runningOptionNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white flex items-baseline gap-1.5 leading-snug mb-1">
                              <span>{col.collegeName}</span>
                              <span className="text-xs font-bold font-mono text-white/60 shrink-0">[{col.collegeCode}]</span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-subtext font-semibold">
                              <span>{DISTRICT_NAMES[col.district] || col.district}</span>
                              <span>•</span>
                              <span>{typeLabel}</span>
                              <span>•</span>
                              <span className="italic">Affiliated: {col.university}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center shrink-0 gap-4 self-center text-right">
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success">
                              <CheckCircle className="h-2.5 w-2.5" /> Eligible
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          )
        ) : (
          <div className="text-center py-12 glass-card rounded-xl border border-white/8">
            <Info className="h-8 w-8 text-subtext mx-auto mb-3" />
            <p className="text-sm text-subtext font-semibold">
              No matching counselling options found for your filters.
            </p>
          </div>
        )}
      </div>

      {/* Required Footer Note */}
      <footer className="mt-12 border-t border-white/5 pt-6 text-center text-[10px] leading-relaxed text-subtext/60 no-print">
        All recommendations are generated using the official Telangana TG EAPCET 2025 Final Phase Last Rank data. This tool is intended to assist students during counselling and should be used as a guidance tool.
      </footer>
    </div>
  );
}
