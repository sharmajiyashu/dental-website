"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/state";
import {
  Activity,
  Heart,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  Moon,
  Droplet,
  Flame,
  Plus,
  Compass,
  Bell,
  Search,
  Lock,
} from "lucide-react";

export default function Home() {
  const {
    users,
    articles,
    addSurveyResponse,
    addEnquiry,
  } = useAppState();

  const [activeUser, setActiveUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = window.localStorage.getItem("hl_pwa_active_user");
      if (storedId && users.length > 0) {
        const found = users.find((u) => u.id === storedId || (u as any)._id === storedId);
        if (found) {
          setActiveUser(found);
        }
      }
    }
  }, [users]);

  // Navigation state
  const [activeTab, setActiveTab] = useState("features");

  // Lead Enquiry state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Survey Widget State
  const [surveyStep, setSurveyStep] = useState(2); // 1 to 5
  const [surveyData, setSurveyData] = useState({
    name: "",
    age: "18-25",
    gender: "Female",
    education: "Graduate",
    occupation: "Student",
    brushFrequency: "Twice a day",
    useToothpaste: "Yes, always",
    flossFrequency: "Sometimes",
    useMouthwash: "Occasionally",
    dentistVisits: "Once a year",
    triviaAnswer: "",
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyScoreDetails, setSurveyScoreDetails] = useState({
    score: 0,
    correctCount: 0,
    wrongCount: 0,
  });

  // Health Tracker Preview State (Interactive Mockup of App Screen 5 & 6)
  const [loggedSteps, setLoggedSteps] = useState(6245);
  const [loggedWater, setLoggedWater] = useState(6);
  const [loggedSleep, setLoggedSleep] = useState(7.3);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Reminders Toggle States (App Screen 9)
  const [reminders, setReminders] = useState({
    drinkWater: true,
    morningWalk: true,
    takeMedicine: false,
    sleepEarly: true,
  });

  // Articles search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Enquiry submission
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.message) return;
    addEnquiry({
      name: enquiryForm.name,
      email: enquiryForm.email,
      subject: enquiryForm.subject || "General Inquiry",
      message: enquiryForm.message,
    });
    setEnquirySuccess(true);
    setEnquiryForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setEnquirySuccess(false), 5000);
  };

  // Grade the survey response and go to Step 5
  const evaluateSurvey = () => {
    let score = 0;
    let correct = 0;
    let wrong = 0;

    // Check habits and assign points
    if (surveyData.brushFrequency === "Twice a day") {
      score += 20;
      correct++;
    } else wrong++;

    if (surveyData.useToothpaste === "Yes, always") {
      score += 20;
      correct++;
    } else wrong++;

    if (surveyData.flossFrequency === "Daily" || surveyData.flossFrequency === "Sometimes") {
      score += 20;
      correct++;
    } else wrong++;

    if (surveyData.useMouthwash === "Daily" || surveyData.useMouthwash === "Occasionally") {
      score += 20;
      correct++;
    } else wrong++;

    if (surveyData.dentistVisits === "Once a year" || surveyData.dentistVisits === "Twice a year") {
      score += 10;
      correct++;
    } else wrong++;

    // Check trivia question (10 points)
    if (surveyData.triviaAnswer === "Brush for 2 minutes, twice a day") {
      score += 10;
      correct++;
    } else {
      wrong++;
    }

    setSurveyScoreDetails({
      score,
      correctCount: correct,
      wrongCount: wrong,
    });
    setSurveyStep(5);
  };

  const handleSurveyFinish = () => {
    // Submit response to App State
    addSurveyResponse({
      name: activeUser?.name || "Anonymous User",
      age: activeUser?.age || "24",
      gender: activeUser?.gender || "Male",
      education: "N/A",
      occupation: activeUser?.role || "User",
      answers: {
        brushFrequency: surveyData.brushFrequency,
        useToothpaste: surveyData.useToothpaste,
        flossFrequency: surveyData.flossFrequency,
        useMouthwash: surveyData.useMouthwash,
        dentistVisits: surveyData.dentistVisits,
        triviaAnswer: surveyData.triviaAnswer,
      },
      score: surveyScoreDetails.score,
      correctCount: surveyScoreDetails.correctCount,
      wrongCount: surveyScoreDetails.wrongCount,
      accuracy: Math.round((surveyScoreDetails.correctCount / 6) * 100),
    });

    setSurveySubmitted(true);
  };

  const resetSurvey = () => {
    setSurveyStep(2);
    setSurveySubmitted(false);
    setSurveyData({
      name: "",
      age: "18-25",
      gender: "Female",
      education: "Graduate",
      occupation: "Student",
      brushFrequency: "Twice a day",
      useToothpaste: "Yes, always",
      flossFrequency: "Sometimes",
      useMouthwash: "Occasionally",
      dentistVisits: "Once a year",
      triviaAnswer: "",
    });
  };

  return (
    <div className="flex-1 flex flex-col font-sans bg-slate-50 dark:bg-[#0b0f19] dark:text-slate-100">
      {/* Header Banner */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-600 rounded-lg text-white">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-outfit font-bold text-xl bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Healthy Life
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-teal-600 transition">App Features</a>
          <a href="#assessment" className="hover:text-teal-600 transition">Free Assessment</a>
          <a href="#articles" className="hover:text-teal-600 transition">Learning Hub</a>
          <a href="#contact" className="hover:text-teal-600 transition">Contact Us</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-600/10 hover-scale"
          >
            Open Admin Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-10 left-10 -z-10 w-72 h-72 bg-teal-200/40 rounded-full filter blur-3xl dark:bg-teal-950/20" />
        <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 bg-emerald-200/40 rounded-full filter blur-3xl dark:bg-emerald-950/20" />

        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 dark:bg-teal-950/30 dark:border-teal-900/40 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="animate-spin" />
            Your Intelligent Health Companion
          </div>
          <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-slate-900 dark:text-slate-50">
            Track, Learn, Improve Your{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Health Journey
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
            Build lasting habits, schedule customized reminders, read professional guidebooks, and check your oral health score right from your web panel.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#assessment"
              className="px-6 py-3.5 text-base font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-600/20 hover-scale"
            >
              Start Dental Survey
            </a>
            <a
              href="#features"
              className="px-6 py-3.5 text-base font-bold border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl transition"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Mockup Panel */}
        <div className="flex-1 flex justify-center w-full max-w-md mx-auto">
          <div className="w-full bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-4 border-slate-800 dark:border-slate-700 relative overflow-hidden">
            {/* Phone Speaker & Camera notches */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex justify-center items-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full mb-1" />
            </div>

            <div className="bg-white dark:bg-[#0b0f19] rounded-[2.5rem] overflow-hidden border-2 border-slate-950 p-4 pt-10 min-h-[500px] flex flex-col justify-between">
              {/* Internal Mockup Header */}
              <div className="flex justify-between items-center px-2">
                <div>
                  <span className="text-xs text-slate-400">Welcome Back</span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Rahul Sharma</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
                  RS
                </div>
              </div>

              {/* Health Score Gauge */}
              <div className="my-6 bg-teal-50/50 dark:bg-slate-900/60 border border-teal-100/50 dark:border-slate-800 p-4 rounded-2xl text-center flex flex-col items-center">
                <span className="text-xs font-medium text-slate-400">Overall Health Score</span>
                <div className="relative w-28 h-28 my-3 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#cbd5e1" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                    <circle cx="56" cy="56" r="48" stroke="#0d9488" strokeWidth="8" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * 80) / 100} fill="transparent" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-outfit font-extrabold text-2xl text-slate-800 dark:text-slate-100">80%</span>
                    <span className="text-[10px] text-teal-600 font-semibold uppercase">Good Job!</span>
                  </div>
                </div>
              </div>

              {/* Track Metrics Logs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Logged Today</span>
                  <span className="text-teal-600 font-semibold">Active trackers</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-center">
                    <Flame className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <span className="text-[9px] text-slate-400 block">Steps</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">6.2k</span>
                  </div>
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-center">
                    <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <span className="text-[9px] text-slate-400 block">Water</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">6 cups</span>
                  </div>
                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl text-center">
                    <Moon className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <span className="text-[9px] text-slate-400 block">Sleep</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">7.3 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Demos / Features */}
      <section id="features" className="py-20 bg-slate-100 dark:bg-[#0f1524]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-slate-50">
              Interactive Dashboard Mockups
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Test out the features directly on this page to see how data logs sync. You can increase steps, log cups of water, or toggles reminders.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Metric Logger Card */}
            <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
              <h3 className="font-outfit font-bold text-xl text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <Compass className="animate-spin" /> Log Daily Metrics
              </h3>
              <p className="text-sm text-muted-foreground">
                In the real application, users log their stats daily. Click the buttons below to increase metrics and simulate health logs.
              </p>

              <div className="space-y-4">
                {/* Steps Logger */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                      <Flame />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Walk Tracker</h4>
                      <span className="text-xs text-muted-foreground">{loggedSteps} / 10,000 steps</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLoggedSteps((prev) => prev + 500)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition"
                  >
                    <Plus size={14} /> Add 500 Steps
                  </button>
                </div>

                {/* Water Logger */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                      <Droplet />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Hydration Tracker</h4>
                      <span className="text-xs text-muted-foreground">{loggedWater} / 8 glasses</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLoggedWater((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition"
                  >
                    <Plus size={14} /> Add 1 Glass
                  </button>
                </div>

                {/* Sleep Logger */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                      <Moon />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Sleep Tracker</h4>
                      <span className="text-xs text-muted-foreground">{loggedSleep.toFixed(1)} / 8 hours</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLoggedSleep((prev) => prev + 0.5)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition"
                  >
                    <Plus size={14} /> Add 0.5 Hrs
                  </button>
                </div>
              </div>
            </div>

            {/* Reminders Toggle Card */}
            <div className="bg-card border border-border p-8 rounded-3xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-outfit font-bold text-xl text-teal-600 dark:text-teal-400 flex items-center gap-2">
                  <Bell className="animate-bounce" /> Daily Reminders Toggles
                </h3>
                <p className="text-sm text-muted-foreground">
                  Simulate reminder schedules. Users toggle switches on screen 9. Toggled statuses are stored in their dashboard.
                </p>

                <div className="space-y-3 pt-3">
                  {Object.keys(reminders).map((key) => {
                    const typedKey = key as keyof typeof reminders;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl border border-border"
                      >
                        <span className="text-sm font-semibold capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <button
                          onClick={() =>
                            setReminders((prev) => ({
                              ...prev,
                              [typedKey]: !prev[typedKey],
                            }))
                          }
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                            reminders[typedKey] ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                              reminders[typedKey] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-xl border border-border/30">
                Tip: Completing the dental quiz and finishing creates a real profile with these logs!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded 5-step Survey Widget */}
      <section id="assessment" className="py-20 max-w-5xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-slate-50">
            Oral Health Assessment Survey
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Evaluate your dental habits and see your score. At the end, enter your name to view recommendations.
          </p>
        </div>

        {/* Survey Frame Mockup */}
        <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
          {!activeUser ? (
            <div className="p-12 text-center flex flex-col justify-center items-center min-h-[380px] space-y-6">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500">
                <Lock size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="font-outfit font-black text-xl text-slate-900 dark:text-slate-100">
                  Authentication Required
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Please register or login inside our Mobile Web App simulator to start the oral health assessment and track your daily scores.
                </p>
              </div>
              <Link
                href="/pwa"
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/20 transition hover-scale inline-block"
              >
                Go to Mobile App / Register
              </Link>
            </div>
          ) : (
            <>
              {/* Header Panel */}
              <div className="bg-teal-600 p-6 text-white flex justify-between items-center text-left">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Step {surveyStep} of 5</span>
                  <h3 className="font-outfit font-bold text-lg">
                    {surveyStep === 1 && "Demographic Information"}
                    {surveyStep === 2 && "Oral Hygiene Practices"}
                    {surveyStep === 3 && "Personalized Educational Hub"}
                    {surveyStep === 4 && "Trivia / Testing Knowledge"}
                    {surveyStep === 5 && "Your Oral Health Score"}
                  </h3>
                </div>
                <div className="text-xs bg-teal-700/50 px-3 py-1 rounded-full border border-teal-500/30">
                  {surveyStep === 5 && surveySubmitted ? "Finished" : "In Progress"}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-teal-400 transition-all duration-300"
                  style={{ width: `${(surveyStep / 5) * 100}%` }}
                />
              </div>

              <div className="p-8 min-h-[350px] flex flex-col justify-between text-left">
                {/* Step 1: Demographic */}
                {surveyStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">Please provide your details to begin the survey:</p>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={surveyData.name}
                        onChange={(e) => setSurveyData({ ...surveyData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Age Range</label>
                        <select
                          value={surveyData.age}
                          onChange={(e) => setSurveyData({ ...surveyData, age: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                        >
                          <option>18-25</option>
                          <option>26-35</option>
                          <option>36-45</option>
                          <option>46-60</option>
                          <option>60+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Education Level</label>
                        <select
                          value={surveyData.education}
                          onChange={(e) => setSurveyData({ ...surveyData, education: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                        >
                          <option>High School</option>
                          <option>Graduate</option>
                          <option>Postgraduate</option>
                          <option>Doctorate</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Gender</label>
                      <div className="flex gap-6 mt-1">
                        {["Male", "Female", "Other"].map((g) => (
                          <label key={g} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={surveyData.gender === g}
                              onChange={() => setSurveyData({ ...surveyData, gender: g })}
                              className="text-teal-600 focus:ring-teal-500"
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Occupation</label>
                      <select
                        value={surveyData.occupation}
                        onChange={(e) => setSurveyData({ ...surveyData, occupation: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                      >
                        <option>Student</option>
                        <option>Working Professional</option>
                        <option>Parent / Homemaker</option>
                        <option>Retired</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Oral Hygiene Practices */}
                {surveyStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">Answer questions about your daily oral hygiene routine:</p>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">How often do you brush your teeth?</label>
                      <select
                        value={surveyData.brushFrequency}
                        onChange={(e) => setSurveyData({ ...surveyData, brushFrequency: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option>Once a day</option>
                        <option>Twice a day</option>
                        <option>Three times a day</option>
                        <option>Occasionally</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Do you use toothpaste?</label>
                      <select
                        value={surveyData.useToothpaste}
                        onChange={(e) => setSurveyData({ ...surveyData, useToothpaste: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option>Yes, always</option>
                        <option>Sometimes</option>
                        <option>No, never</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">How often do you floss?</label>
                      <select
                        value={surveyData.flossFrequency}
                        onChange={(e) => setSurveyData({ ...surveyData, flossFrequency: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option>Daily</option>
                        <option>Sometimes</option>
                        <option>Never</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Do you use mouthwash?</label>
                      <select
                        value={surveyData.useMouthwash}
                        onChange={(e) => setSurveyData({ ...surveyData, useMouthwash: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option>Daily</option>
                        <option>Occasionally</option>
                        <option>No, never</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">How often do you visit the dentist?</label>
                      <select
                        value={surveyData.dentistVisits}
                        onChange={(e) => setSurveyData({ ...surveyData, dentistVisits: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option>Once a year</option>
                        <option>Twice a year</option>
                        <option>Only when in pain</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Personalized Educational Hub */}
                {surveyStep === 3 && (
                  <div className="space-y-4 text-left">
                    <p className="text-sm text-muted-foreground mb-2">Recommended dental hygiene guidebooks based on your checklist:</p>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
                      {articles.filter(a => a.category === "Oral Health").map((art) => (
                        <div
                          key={art.id}
                          className="flex items-center gap-3 p-3 bg-muted/50 border border-border hover:border-teal-500 rounded-xl transition cursor-pointer"
                          onClick={() => setSelectedArticle(art)}
                        >
                          <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-lg">
                            <BookOpen size={18} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm leading-snug">{art.title}</h4>
                            <span className="text-[10px] text-muted-foreground">{art.readTime}</span>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground" />
                        </div>
                      ))}
                      {articles.filter(a => a.category === "Oral Health").length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">No recommendations found. Keep brushing!</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Trivia */}
                {surveyStep === 4 && (
                  <div className="space-y-4 text-left">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Trivia Question: Which of the following is the correct way to brush your teeth?
                    </p>
                    <div className="space-y-3">
                      {[
                        "Brush only in the morning",
                        "Brush for 2 minutes, twice a day",
                        "Brush immediately after every meal",
                        "Brush with any hard bristle brush",
                      ].map((option) => {
                        const isSelected = surveyData.triviaAnswer === option;
                        return (
                          <button
                            key={option}
                            onClick={() => setSurveyData({ ...surveyData, triviaAnswer: option })}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition ${
                              isSelected
                                ? "bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 5: Score summary */}
                {surveyStep === 5 && (
                  <div className="text-center space-y-6">
                    {!surveySubmitted ? (
                      <>
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                            <div
                              className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"
                              style={{ animationDuration: "3s" }}
                            />
                            <div className="flex flex-col items-center">
                              <span className="font-outfit font-extrabold text-3xl text-slate-800 dark:text-slate-100">
                                {surveyScoreDetails.score}%
                              </span>
                              <span className="text-[10px] text-teal-600 font-bold uppercase">Accuracy</span>
                            </div>
                          </div>
                          <h4 className="font-outfit font-bold text-lg text-slate-900 dark:text-slate-50">
                            Assessment Finished!
                          </h4>
                          <p className="text-sm text-slate-500 max-w-sm mt-1">
                            You got {surveyScoreDetails.correctCount} answers recommended. Click Finish to save your logs and create a user profile in the database.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto border-t border-border pt-4 text-sm font-medium">
                          <div className="text-center">
                            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Answers Checked</span>
                            <span className="text-teal-600 font-bold">{surveyScoreDetails.correctCount} / 6</span>
                          </div>
                          <div className="text-center">
                            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Trivia Result</span>
                            <span
                              className={`font-bold ${
                                surveyData.triviaAnswer === "Brush for 2 minutes, twice a day"
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              {surveyData.triviaAnswer === "Brush for 2 minutes, twice a day" ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center">
                          <Award size={36} />
                        </div>
                        <div>
                          <h4 className="font-outfit font-bold text-xl text-slate-900 dark:text-slate-50">
                            Profile Synced Successfully!
                          </h4>
                          <p className="text-sm text-slate-500 max-w-sm mt-1">
                            Your profile has been logged to the Admin Database. You can now open the Admin Panel to view the update!
                          </p>
                        </div>
                        <button
                          onClick={resetSurvey}
                          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/10 hover-scale"
                        >
                          Retake Assessment
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation buttons */}
                {!surveySubmitted && (
                  <div className="flex justify-between items-center mt-8 border-t border-border pt-6">
                    <button
                      onClick={() => setSurveyStep((prev) => Math.max(2, prev - 1))}
                      disabled={surveyStep === 2}
                      className="px-4 py-2 border border-border hover:bg-muted text-sm font-semibold rounded-xl disabled:opacity-40 transition"
                    >
                      Back
                    </button>
                    {surveyStep < 4 ? (
                      <button
                        onClick={() => {
                          setSurveyStep((prev) => prev + 1);
                        }}
                        className="flex items-center gap-1 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl hover-scale"
                      >
                        <span>Next</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : surveyStep === 4 ? (
                      <button
                        onClick={evaluateSurvey}
                        disabled={!surveyData.triviaAnswer}
                        className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover-scale"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleSurveyFinish}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl hover-scale"
                      >
                        Finish Survey
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Learning Resource Library Screen */}
      <section id="articles" className="py-20 bg-slate-100 dark:bg-[#0f1524]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h2 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-slate-50">
                Educational Guideline Library
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Browse medical guides, daily hygiene routines, and nutrition recommendations.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Oral Health", "Nutrition", "Fitness"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white"
                      : "bg-card border border-border text-slate-600 dark:text-slate-400 hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search health guidebooks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card outline-none text-sm focus:border-teal-500"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-card border border-border rounded-2xl overflow-hidden hover-scale cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {art.imageUrl && (
                    <div className="h-44 relative bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        {art.category}
                      </span>
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">{art.readTime}</span>
                    <h3 className="font-outfit font-bold text-base leading-snug text-slate-900 dark:text-slate-50">
                      {art.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{art.description}</p>
                  </div>
                </div>
                <div className="p-5 border-t border-border/40 flex items-center justify-between text-teal-600 text-xs font-bold">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 max-w-4xl mx-auto px-6 w-full">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-teal-600 dark:text-teal-400">
              Submit an Enquiry
            </h2>
            <p className="text-sm text-muted-foreground">
              Have questions about registration, partnership programs, or app releases? Drop us a query. Admins receive these messages directly.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-xl text-teal-600">
                  <Heart size={18} />
                </div>
                <span>Healthy Life Support Team</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-xl text-teal-600">
                  <MessageSquare size={18} />
                </div>
                <span>support@healthylife.org</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleEnquirySubmit} className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Your Name</label>
              <input
                type="text"
                required
                value={enquiryForm.name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                placeholder="Enter name"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Subject</label>
                <input
                  type="text"
                  value={enquiryForm.subject}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, subject: e.target.value })}
                  placeholder="Query category"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Message</label>
              <textarea
                required
                rows={3}
                value={enquiryForm.message}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                placeholder="Enter enquiry message..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/10 hover-scale"
            >
              Send Enquiry
            </button>

            {enquirySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Your enquiry was sent! View it immediately in the Admin Panel.</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 Healthy Life Inc. Designed for premium oral hygiene diagnostics and general fitness metrics tracking.</p>
      </footer>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-60 bg-slate-200">
              {selectedArticle.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full transition"
              >
                ✕
              </button>
              <span className="absolute bottom-4 left-4 bg-teal-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                {selectedArticle.category}
              </span>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">{selectedArticle.readTime}</span>
                <h2 className="font-outfit font-extrabold text-2xl text-slate-900 dark:text-slate-50">
                  {selectedArticle.title}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedArticle.description}</p>
              </div>

              {/* Video Embed */}
              {selectedArticle.videoUrl && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-teal-600 tracking-wider">Video Guide Tutorial</h4>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-slate-900 flex items-center justify-center text-white">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedArticle.videoUrl}
                      title={selectedArticle.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-none"
                    />
                  </div>
                </div>
              )}

              {/* Steps Guide */}
              {selectedArticle.steps && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-teal-600 tracking-wider">Instructions Step-by-Step</h4>
                  <ol className="space-y-2">
                    {selectedArticle.steps.map((step: string, index: number) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover-scale"
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
