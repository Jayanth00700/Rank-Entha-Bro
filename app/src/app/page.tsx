"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Form, { FormValues } from "@/components/Form";
import Loader from "@/components/Loader";
import Results, { OptionResult } from "@/components/Results";
import rawData from "@/data/data.json";
import collegePrecedenceMap from "@/data/college_precedence.json";
import { CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";

interface RawRecord {
  collegeCode: string;
  collegeName: string;
  place: string;
  district: string;
  coeducation: string;
  collegeType: string;
  branchCode: string;
  branchName: string;
  ranks: string[];
  university: string;
}

export default function Home() {
  const [step, setStep] = useState<'form' | 'loading' | 'results' | 'about'>('form');
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("OC");
  const formRef = useRef<HTMLDivElement | null>(null);

  const dataset = rawData as RawRecord[];

  // Extract unique districts and courses for form selection
  const { uniqueDistricts, uniqueCourses } = useMemo(() => {
    const districts = Array.from(new Set(dataset.map(item => item.district))).sort();
    
    // Group branchCode to find the most common branchName
    const courseMap: Record<string, string> = {};
    dataset.forEach(item => {
      if (!courseMap[item.branchCode] || courseMap[item.branchCode].length < item.branchName.length) {
        courseMap[item.branchCode] = item.branchName;
      }
    });

    const courses = Object.keys(courseMap).sort().map(code => ({
      code,
      name: courseMap[code]
    }));

    return { uniqueDistricts: districts, uniqueCourses: courses };
  }, [dataset]);

  // Precedence helper function
  const getPrecedenceRank = (code: string): number => {
    const prec = (collegePrecedenceMap as Record<string, number>)[code];
    return prec !== undefined ? prec : 999;
  };

  // Generate counseling preference list based on user selections
  const generatedOptions = useMemo(() => {
    if (!formValues) return [];

    const studentRank = parseInt(formValues.rank);
    const category = formValues.category;
    const gender = formValues.gender;
    const preferredCourse = formValues.course;
    const preferredDistrict = formValues.district;
    const preferredCollegeType = formValues.collegeType;
    const preferenceMode = formValues.preferenceMode;

    const parseRank = (val: string | undefined): number => {
      if (!val || val === "NA") return 151634; // max rank in dataset is 151634, meaning NA stands for vacant/open eligibility
      const parsed = parseInt(val);
      return isNaN(parsed) ? 151634 : parsed;
    };

    const formatCutoffText = (val: string | undefined): string => {
      if (!val || val === "NA") return "NA (Vacant)";
      const parsed = parseInt(val);
      return isNaN(parsed) ? "NA (Vacant)" : parsed.toLocaleString();
    };

    const formatSCRange = (ranks: string[], g: 'Male' | 'Female'): string => {
      const indices = g === 'Male' ? [12, 14, 16] : [13, 15, 17];
      const vals = indices.map(idx => ranks[idx]).filter(v => v && v !== "NA").map(v => parseInt(v)).filter(v => !isNaN(v));
      if (vals.length === 0) return "NA (Vacant)";
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      if (min === max) return min.toLocaleString();
      return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    };

    const eligibleList: OptionResult[] = [];

    dataset.forEach((item) => {
      // 1. Gender filtering for Girls-only colleges
      if (gender === 'Male' && item.coeducation.toUpperCase() === 'GIRLS') {
        return;
      }

      // 2. Preferred Course Filter
      if (preferredCourse !== 'Any' && item.branchCode !== preferredCourse) {
        return;
      }

      // 3. Preferred District Filter
      if (preferredDistrict !== 'Any' && item.district !== preferredDistrict) {
        return;
      }

      // 4. College Type Filter
      const type = item.collegeType.toUpperCase();
      const name = item.collegeName.toUpperCase();
      const isAutonomous = name.includes('(AUTONOMOUS)') || name.includes('AUTONOMOUS');
      
      if (preferredCollegeType !== 'Any') {
        if (preferredCollegeType === 'Government' && type !== 'GOV' && !name.includes('GOVERNMENT') && !name.includes('GOVT')) {
          return;
        }
        if (preferredCollegeType === 'University' && type !== 'UNIV' && !name.includes('UNIVERSITY') && !name.includes('UNIV') && item.university !== 'CONSTITUENT') {
          return;
        }
        if (preferredCollegeType === 'Autonomous' && !isAutonomous) {
          return;
        }
        if (preferredCollegeType === 'Private' && (type !== 'PVT' && type !== 'SF' || isAutonomous)) {
          return;
        }
      }

      // 5. Category-wise cutoff validation
      let boysIdx = 0;
      let girlsIdx = 1;
      let isSC = false;

      // OC is index 0 (Boys) and 1 (Girls)
      const ocBoys = parseRank(item.ranks[0]);
      const ocGirls = parseRank(item.ranks[1]);

      let catBoys = 0;
      let catGirls = 0;
      let ocCutoffText = "";
      let categoryCutoffText = "";

      // Calculate OC cutoff text depending on gender
      ocCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[0] : item.ranks[1]);

      switch (category) {
        case 'OC':
          catBoys = ocBoys; 
          catGirls = ocGirls; 
          categoryCutoffText = ocCutoffText;
          break;
        case 'BC-A':
          catBoys = parseRank(item.ranks[2]); 
          catGirls = parseRank(item.ranks[3]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[2] : item.ranks[3]);
          break;
        case 'BC-B':
          catBoys = parseRank(item.ranks[4]); 
          catGirls = parseRank(item.ranks[5]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[4] : item.ranks[5]);
          break;
        case 'BC-C':
          catBoys = parseRank(item.ranks[6]); 
          catGirls = parseRank(item.ranks[7]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[6] : item.ranks[7]);
          break;
        case 'BC-D':
          catBoys = parseRank(item.ranks[8]); 
          catGirls = parseRank(item.ranks[9]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[8] : item.ranks[9]);
          break;
        case 'BC-E':
          catBoys = parseRank(item.ranks[10]); 
          catGirls = parseRank(item.ranks[11]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[10] : item.ranks[11]);
          break;
        case 'SC':
          isSC = true;
          categoryCutoffText = formatSCRange(item.ranks, gender);
          break;
        case 'ST':
          catBoys = parseRank(item.ranks[18]); 
          catGirls = parseRank(item.ranks[19]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[18] : item.ranks[19]);
          break;
        case 'EWS':
          catBoys = parseRank(item.ranks[20]); 
          catGirls = parseRank(item.ranks[21]); 
          categoryCutoffText = formatCutoffText(gender === 'Male' ? item.ranks[20] : item.ranks[21]);
          break;
      }

      let cutoff = 0;

      if (isSC) {
        // Take maximum across SC_I, SC_II, and SC_III
        const sci_b = parseRank(item.ranks[12]);
        const scii_b = parseRank(item.ranks[14]);
        const sciii_b = parseRank(item.ranks[16]);
        
        if (gender === 'Male') {
          cutoff = Math.max(sci_b, scii_b, sciii_b, ocBoys);
        } else {
          const sci_g = parseRank(item.ranks[13]);
          const scii_g = parseRank(item.ranks[15]);
          const sciii_g = parseRank(item.ranks[17]);
          cutoff = Math.max(sci_b, sci_g, scii_b, scii_g, sciii_b, sciii_g, ocBoys, ocGirls);
        }
      } else {
        if (gender === 'Male') {
          cutoff = Math.max(catBoys, ocBoys);
        } else {
          cutoff = Math.max(catBoys, catGirls, ocBoys, ocGirls);
        }
      }

      if (cutoff === 0) {
        return;
      }

      // Check student rank
      if (studentRank <= cutoff) {
        eligibleList.push({
          collegeCode: item.collegeCode,
          collegeName: item.collegeName,
          place: item.place,
          district: item.district,
          coeducation: item.coeducation,
          collegeType: item.collegeType,
          branchCode: item.branchCode,
          branchName: item.branchName,
          university: item.university,
          cutoffVal: cutoff,
          isAutonomous,
          ocCutoffText,
          categoryCutoffText
        });
      }
    });

    // 6. Sorting options by custom college precedence ranks and cutoff values
    if (preferenceMode === "College First") {
      return eligibleList.sort((a, b) => {
        const precA = getPrecedenceRank(a.collegeCode);
        const precB = getPrecedenceRank(b.collegeCode);
        
        if (precA !== precB) {
          return precA - precB;
        }
        
        if (a.collegeCode !== b.collegeCode) {
          return a.collegeCode.localeCompare(b.collegeCode);
        }
        
        return a.cutoffVal - b.cutoffVal;
      });
    } else {
      // Branch First: Sort primarily by branch cutoff ascending, then by college precedence ascending!
      return eligibleList.sort((a, b) => {
        if (a.cutoffVal !== b.cutoffVal) {
          return a.cutoffVal - b.cutoffVal;
        }
        const precA = getPrecedenceRank(a.collegeCode);
        const precB = getPrecedenceRank(b.collegeCode);
        return precA - precB;
      });
    }
  }, [formValues, dataset]);

  const handleFormSubmit = (values: FormValues) => {
    setFormValues(values);
    setStep('loading');
  };

  const handleLoaderComplete = () => {
    setStep('results');
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-white selection:bg-white/10 selection:text-white">
      {/* Sticky Navigation Header */}
      <Navigation 
        onNavigate={(target) => setStep(target)} 
        currentStep={step}
      />

      <main className="flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: FORM ONLY */}
          {step === 'form' && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl flex flex-col items-start py-8 px-4 md:py-12"
            >
              {/* Header Title */}
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white uppercase">
                COLLEGE <span className="text-[#84CC16]">PREFERENCE</span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-xl mb-8 font-semibold">
                Set your rank and criteria, we'll rank the right colleges and branches for you.
              </p>

              {/* Form Section */}
              <div className="w-full">
                <Form 
                  districts={uniqueDistricts}
                  courses={uniqueCourses}
                  onCategoryChange={setSelectedCategory}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOADING SCREEN */}
          {step === 'loading' && (
            <motion.div
              key="loading-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center py-20"
            >
              <Loader onComplete={handleLoaderComplete} />
            </motion.div>
          )}

          {/* STEP 3: RESULTS SCREEN */}
          {step === 'results' && formValues && (
            <motion.div
              key="results-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Results 
                name={formValues.name}
                rank={parseInt(formValues.rank)}
                category={formValues.category}
                gender={formValues.gender}
                options={generatedOptions}
                preferenceMode={formValues.preferenceMode}
                onBack={() => setStep('form')}
              />
            </motion.div>
          )}

          {/* STEP 4: ABOUT PAGE */}
          {step === 'about' && (
            <motion.div
              key="about-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl px-4 py-12 md:py-20 flex flex-col gap-4"
            >
              {/* Back to Home Button */}
              <button
                onClick={() => setStep('form')}
                className="group flex items-center gap-2 text-sm font-bold text-subtext hover:text-white transition-colors mb-2 cursor-pointer w-fit"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </button>

              <div className="glass-card rounded-2xl p-6 md:p-10 border border-white/8 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <h1 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
                  About Rank Entha Bro
                </h1>
                
                <p className="text-subtext leading-relaxed text-sm md:text-base mb-6 font-medium">
                  <strong>Rank Entha Bro</strong> is a premium, minimal counselling preferences tool designed for Telangana EAPCET engineering admissions. It matches student ranks against the official closing cutoffs from the 2025 final phase statements to generate custom college option orders.
                </p>

                <h3 className="text-base font-bold text-white mb-3">Core features:</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-subtext font-semibold">
                    <CheckCircle className="h-4.5 w-4.5 text-white/60 shrink-0 mt-0.5" />
                    <span><strong>Accurate Datasets:</strong> Matches preferences against official cutoff structures.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-subtext font-semibold">
                    <CheckCircle className="h-4.5 w-4.5 text-white/60 shrink-0 mt-0.5" />
                    <span><strong>Intelligent Cutoff Checks:</strong> Factors in reservation categories (BC, EWS, SC, ST) and gender quota algorithms.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-subtext font-semibold">
                    <CheckCircle className="h-4.5 w-4.5 text-white/60 shrink-0 mt-0.5" />
                    <span><strong>Structured Sorting layouts:</strong> Groups options by College or Branch to prevent truncations and list everything in a structured format.</span>
                  </li>
                </ul>

                <div className="border-t border-white/5 pt-6 flex items-center justify-between text-xs text-subtext font-semibold">
                  <span>Version 1.1.0</span>
                  <a 
                    href="https://tgeapcet.nic.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Official TG EAPCET Board <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
