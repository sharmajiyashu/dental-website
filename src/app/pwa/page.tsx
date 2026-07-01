"use client";

import React, { useState, useEffect } from "react";
import { useAppState, User, Article } from "@/lib/state";
import { api } from "@/lib/api";
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
  User as UserIcon,
  Lock,
  Phone,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  PlusCircle,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  Target
} from "lucide-react";
import Link from "next/link";

export default function PwaSimulator() {
  const {
    isLoaded,
    users,
    articles,
    addUser,
    updateUserMetrics,
    addSurveyResponse,
  } = useAppState();

  // App routing state
  const [currentScreen, setCurrentScreen] = useState<"Welcome" | "Login" | "OTP" | "Register" | "Dashboard" | "Survey">("Welcome");
  const [activeTab, setActiveTab] = useState<"Home" | "Learn" | "Track" | "Reminders" | "Profile">("Home");

  // Selected article for reading/video mode
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Active logged-in user state
  const [activeUser, setActiveUser] = useState<User | null>(null);

  // Login inputs
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register inputs
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("24");
  const [regGender, setRegGender] = useState("Male");
  const [regRole, setRegRole] = useState("Student");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("123456");

  // OTP State
  const [authEmail, setAuthEmail] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  // Custom added reminders state
  const [customReminders, setCustomReminders] = useState<{ id: string; name: string; time: string; enabled: boolean }[]>([]);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminderName, setNewReminderName] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("08:00 AM");

  // Manual Logger inputs (Track tab)
  const [inputSteps, setInputSteps] = useState("6245");
  const [inputWater, setInputWater] = useState("6");
  const [inputSleep, setInputSleep] = useState("7.3");
  const [inputWeight, setInputWeight] = useState("65.5");

  // Survey Flow state
  const [surveyStep, setSurveyStep] = useState(1); // 1 to 5
  const [surveyName, setSurveyName] = useState("");
  const [surveyAge, setSurveyAge] = useState("18-25");
  const [surveyGender, setSurveyGender] = useState("Male");
  const [surveyEducation, setSurveyEducation] = useState("Graduate");
  const [surveyOccupation, setSurveyOccupation] = useState("Student");

  const [surveyBrush, setSurveyBrush] = useState("Twice a day");
  const [surveyToothpaste, setSurveyToothpaste] = useState("Yes, always");
  const [surveyFloss, setSurveyFloss] = useState("Sometimes");
  const [surveyMouthwash, setSurveyMouthwash] = useState("Occasionally");
  const [surveyDentist, setSurveyDentist] = useState("Once a year");

  const [surveyTrivia, setSurveyTrivia] = useState("");
  const [surveyScore, setSurveyScore] = useState(0);
  const [surveyCorrect, setSurveyCorrect] = useState(0);

  // Article reading completed steps checkmarks
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Search & Filter state for articles
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sync state to active user once loaded
  useEffect(() => {
    if (isLoaded && users.length > 0) {
      const storedId = window.localStorage.getItem("hl_pwa_active_user");
      const found = users.find(u => u.id === storedId);
      if (found) {
        setActiveUser(found);
      } else {
        setActiveUser(users[0]);
      }
    }
  }, [isLoaded, users]);

  // Sync metric inputs to user when active user changes
  useEffect(() => {
    if (activeUser) {
      setInputSteps(activeUser.stepsLogged.toString());
      setInputWater(activeUser.waterLogged.toString());
      setInputSleep(activeUser.sleepLogged.toString());
      setInputWeight(activeUser.weight.toString());
    }
  }, [activeUser]);

  // OTP Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentScreen === "OTP" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, otpTimer]);

  if (!isLoaded || !activeUser) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading Healthy Life PWA...</span>
      </div>
    );
  }

  // Handle Metrics update to sync with /admin
  const handleUpdateMetrics = () => {
    const stepsVal = parseInt(inputSteps) || 0;
    const waterVal = parseInt(inputWater) || 0;
    const sleepVal = parseFloat(inputSleep) || 0;
    const weightVal = parseFloat(inputWeight) || 0;

    updateUserMetrics(activeUser.id, {
      stepsLogged: stepsVal,
      waterLogged: waterVal,
      sleepLogged: sleepVal,
      weight: weightVal
    });

    // Update locally too
    setActiveUser(prev => prev ? {
      ...prev,
      stepsLogged: stepsVal,
      waterLogged: waterVal,
      sleepLogged: sleepVal,
      weight: weightVal,
      // Recalculate local healthscore to match hook formula
      healthScore: Math.round(
        (Math.min(1, stepsVal / prev.stepsTarget) * 40) +
        (Math.min(1, waterVal / prev.waterTarget) * 30) +
        (Math.min(1, sleepVal / prev.sleepTarget) * 30)
      )
    } : null);

    alert("Metrics logged successfully! Synchronized with the admin portal.");
  };

  // Toggle standard reminders
  const handleToggleReminder = (key: "drinkWater" | "morningWalk" | "takeMedicine" | "sleepEarly") => {
    const updatedReminders = {
      ...activeUser.reminders,
      [key]: !activeUser.reminders[key]
    };
    updateUserMetrics(activeUser.id, { reminders: updatedReminders });
    setActiveUser(prev => prev ? { ...prev, reminders: updatedReminders } : null);
  };

  // Add customized reminders
  const handleAddReminder = () => {
    if (!newReminderName) return;
    const newRem = {
      id: `r-${Date.now()}`,
      name: newReminderName,
      time: newReminderTime,
      enabled: true
    };
    setCustomReminders([...customReminders, newRem]);
    setNewReminderName("");
    setShowAddReminderModal(false);
  };

  // Delete customized reminders
  const handleDeleteCustomReminder = (id: string) => {
    setCustomReminders(customReminders.filter(r => r.id !== id));
  };

  // Evaluate assessment survey
  const handleEvaluateSurvey = () => {
    let score = 0;
    let correct = 0;

    if (surveyBrush === "Twice a day") { score += 20; correct++; }
    if (surveyToothpaste === "Yes, always") { score += 20; correct++; }
    if (surveyFloss === "Daily" || surveyFloss === "Sometimes") { score += 20; correct++; }
    if (surveyMouthwash === "Daily" || surveyMouthwash === "Occasionally") { score += 20; correct++; }
    if (surveyDentist === "Once a year" || surveyDentist === "Twice a year") { score += 10; correct++; }
    if (surveyTrivia === "Brush for 2 minutes, twice a day") { score += 10; correct++; }

    setSurveyCorrect(correct);
    setSurveyScore(score);

    // Save survey to admin dashboard state
    addSurveyResponse({
      name: activeUser.name || "Anonymous User",
      age: activeUser.age || "24",
      gender: activeUser.gender || "Male",
      education: "N/A",
      occupation: activeUser.role || "User",
      answers: {
        brushFrequency: surveyBrush,
        useToothpaste: surveyToothpaste,
        flossFrequency: surveyFloss,
        useMouthwash: surveyMouthwash,
        dentistVisits: surveyDentist,
        triviaAnswer: surveyTrivia
      },
      score,
      correctCount: correct,
      wrongCount: 6 - correct,
      accuracy: Math.round((correct / 6) * 100)
    });

    setSurveyStep(5);
  };

  // Finish survey and onboarding
  const handleFinishSurvey = () => {
    setSurveyStep(2); // Reset to first habits step for next run
    setSurveyName("");
    setSurveyTrivia("");
    setCurrentScreen("Dashboard");
    setActiveTab("Home");
  };

  // Handle login simulation using backend
  const handleLogin = async () => {
    if (!loginPhone) {
      alert("Please enter your email or mobile number.");
      return;
    }

    // Check if input looks like email, else format as mock email for test ease
    const email = loginPhone.includes("@") ? loginPhone : `${loginPhone.toLowerCase().replace(/\s+/g, "")}@example.com`;

    try {
      const result = await api.auth.login(email, loginPassword || "123456");
      setAuthEmail(email);
      setReceivedOtp(result.otpCode || "");
      setOtpTimer(45);
      setCurrentScreen("OTP");
      alert(`OTP sent to verify your email! (Testing OTP Code: ${result.otpCode})`);
    } catch (error: any) {
      // Offline fallback
      const matching = users.find(u => u.mobile === loginPhone || u.name.toLowerCase() === loginPhone.toLowerCase());
      if (matching) {
        window.localStorage.setItem("hl_pwa_active_user", matching.id);
        setActiveUser(matching);
        setCurrentScreen("Dashboard");
        setActiveTab("Home");
        alert("Running offline. Logged in locally.");
      } else {
        alert(error.message || "Login failed");
      }
    }
  };

  // Handle register simulation using backend
  const handleRegister = async () => {
    if (!regName || !regPhone || !regEmail) {
      alert("Name, Email, and Phone number are required.");
      return;
    }

    if (regPhone.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    if (regPassword && regPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await api.auth.register({
        name: regName,
        email: regEmail,
        mobile: regPhone,
        password: regPassword || "123456",
        age: regAge,
        gender: regGender,
        role: regRole
      });
      setAuthEmail(regEmail);
      setReceivedOtp(result.otpCode || "");
      setOtpTimer(45);
      setCurrentScreen("OTP");
      alert(`Account registered successfully! OTP sent to verify. (Testing OTP Code: ${result.otpCode})`);
    } catch (error: any) {
      if (error.message && error.message.includes("already registered")) {
        alert("This email is already registered. Trying to log in instead...");
        setAuthEmail(regEmail);
        try {
          const loginRes = await api.auth.login(regEmail, regPassword || "123456");
          setReceivedOtp(loginRes.otpCode || "");
          setOtpTimer(45);
          setCurrentScreen("OTP");
        } catch (loginErr) {
          alert("Email is already registered. Please go to Login screen.");
        }
      } else {
        // Offline fallback
        const newUser = addUser({
          name: regName,
          age: regAge,
          gender: regGender,
          role: regRole,
          email: regEmail,
          mobile: regPhone
        });
        window.localStorage.setItem("hl_pwa_active_user", newUser.id);
        setActiveUser(newUser);
        setCurrentScreen("Dashboard");
        setActiveTab("Home");
        alert("Running offline. Registered local session.");
      }
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      alert("Please enter the 6-digit OTP code.");
      return;
    }
    try {
      const result = await api.auth.verifyOtp(authEmail, otp);
      const savedUser = {
        ...result.user,
        id: result.user._id || result.user.id
      };
      setActiveUser(savedUser);
      setCurrentScreen("Dashboard");
      setActiveTab("Home");
      setOtpDigits(["", "", "", "", "", ""]);
      alert("Verification successful!");
    } catch (err: any) {
      if (otp === "111111" || otp === receivedOtp) {
        setCurrentScreen("Dashboard");
        setActiveTab("Home");
        alert("Mock verify accepted.");
      } else {
        alert(err.message || "Invalid verification code.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col lg:flex-row items-center justify-center p-0 sm:p-6 md:p-12 overflow-x-hidden font-sans">

      {/* LEFT PANE FOR DESKTOP - DESCRIPTION */}
      <div className="hidden lg:flex flex-col max-w-sm space-y-6 text-slate-100 pr-12">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-teal-600 rounded-xl text-white">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <span className="font-outfit font-extrabold text-2xl bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Healthy Life PWA
          </span>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight font-outfit text-white leading-tight">
            Live Mobile Simulation
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Experience the complete native mobile screens flow in this responsive mockup. Any users registered or metrics tracked here sync directly to the <Link href="/admin" className="text-teal-400 font-bold hover:underline">Admin Panel</Link>.
          </p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2.5">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Installation</span>
          <p className="text-xs text-slate-400">
            This app is fully PWA-configured. You can click "Install App" or "Add to Home Screen" in your browser's address bar to launch it stand-alone!
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 font-semibold underline">Back to Website</Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-slate-300 font-semibold underline">Admin Dashboard</Link>
        </div>
      </div>

      {/* MOBILE DEVICE CONTAINER */}
      <div className="dark w-full max-w-[412px] h-[100dvh] sm:h-[820px] bg-slate-950 sm:rounded-[2.5rem] sm:border-[6px] sm:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden sm:ring-4 sm:ring-teal-500/10">

        {/* Notch / Speaker header */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex justify-center items-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
        </div>

        {/* STATUS BAR MOCK */}
        <div className="h-10 pt-2 bg-white dark:bg-[#0b0f19] px-6 flex justify-between items-center text-slate-800 dark:text-slate-200 text-xs select-none z-40 shrink-0 font-medium">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 font-bold">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.58 10.49 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" /></svg>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          </div>
        </div>

        {/* MAIN DISPLAY AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0b0f19] flex flex-col relative text-slate-900 dark:text-slate-100">

          {/* SCREEN 1: WELCOME SCREEN */}
          {currentScreen === "Welcome" && (
            <div className="flex-1 flex flex-col justify-between p-6 pb-12 pt-8">
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-3xl bg-teal-500/10 flex items-center justify-center">
                  <span className="text-5xl animate-pulse">🌱</span>
                </div>
                <div className="space-y-2">
                  <h1 className="font-outfit font-black text-3xl text-slate-800 dark:text-slate-100">
                    Healthy Life
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed">
                    Track, Learn, Improve your health. Start your journey towards a healthier you!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setCurrentScreen("Register");
                  }}
                  className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white rounded-2xl shadow-lg shadow-teal-600/10 transition"
                >
                  Register Now
                </button>

                <button
                  onClick={() => setCurrentScreen("Login")}
                  className="w-full py-4 font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-[0.98] rounded-2xl transition text-sm text-slate-700 dark:text-slate-300"
                >
                  Already have an account? <span className="text-teal-500 underline font-semibold">Login</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: LOGIN */}
          {currentScreen === "Login" && (
            <div className="flex-1 flex flex-col justify-between p-6 pt-10">
              <div className="space-y-8">
                <div>
                  <button onClick={() => setCurrentScreen("Welcome")} className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <h2 className="text-2xl font-black font-outfit mt-4 text-slate-800 dark:text-slate-100">
                    Welcome Back!
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Login to continue</p>
                </div>

                <div className="space-y-4">
                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Mobile / Name</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Enter mobile or name"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="text-[11px] font-semibold text-teal-500 hover:underline">Forgot Password?</button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={handleLogin}
                  className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setOtpTimer(45);
                    setCurrentScreen("OTP");
                  }}
                  className="w-full py-3.5 font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 rounded-2xl transition"
                >
                  Login with OTP
                </button>

                <div className="text-center text-xs text-slate-400">
                  Don't have an account?{" "}
                  <button onClick={() => setCurrentScreen("Register")} className="text-teal-500 font-bold hover:underline">Register</button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: OTP VERIFICATION */}
          {currentScreen === "OTP" && (
            <div className="flex-1 flex flex-col justify-between p-6 pt-10">
              <div className="space-y-8">
                <div>
                  <button onClick={() => setCurrentScreen("Login")} className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <h2 className="text-2xl font-black font-outfit mt-4 text-slate-800 dark:text-slate-100">
                    Verify OTP
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the 6 digit code sent to {activeUser.mobile}
                  </p>
                </div>

                {/* 6 Digit Squares */}
                <div className="flex justify-between gap-1.5">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newDigits = [...otpDigits];
                        newDigits[i] = e.target.value;
                        setOtpDigits(newDigits);
                        // Auto focus next
                        if (e.target.value && e.target.nextSibling) {
                          (e.target.nextSibling as HTMLInputElement).focus();
                        }
                      }}
                      className="w-11 h-12 text-center text-lg font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <span className="text-xs text-slate-400 font-medium">
                    {otpTimer > 0 ? `Resend OTP in 00:${otpTimer.toString().padStart(2, "0")}` : (
                      <button onClick={() => setOtpTimer(45)} className="text-teal-500 font-semibold hover:underline">Resend OTP</button>
                    )}
                  </span>
                </div>

                {receivedOtp && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Testing Verification Code:</span>
                    <span className="text-sm text-teal-300 font-black tracking-widest">{receivedOtp}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                >
                  Verify
                </button>

                <button
                  onClick={() => setCurrentScreen("Login")}
                  className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Change Number
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: REGISTER */}
          {currentScreen === "Register" && (
            <div className="flex-1 flex flex-col p-6 pt-10">
              <div className="flex-1 space-y-6">
                <div>
                  <button onClick={() => setCurrentScreen("Login")} className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <h2 className="text-2xl font-black font-outfit mt-4 text-slate-800 dark:text-slate-100">
                    Create Account
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Fill your details to register</p>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Age</label>
                      <input
                        type="number"
                        placeholder="24"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Gender</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Role / Profession */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Role / Profession</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                    >
                      <option>Student</option>
                      <option>Parent</option>
                      <option>Working Professional</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Password</label>
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-teal-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={handleRegister}
                  className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                >
                  Register
                </button>

                <div className="text-center text-xs text-slate-400">
                  Already have an account?{" "}
                  <button onClick={() => setCurrentScreen("Login")} className="text-teal-500 font-bold hover:underline">Login</button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: SURVEY WORKFLOW */}
          {currentScreen === "Survey" && (
            <div className="flex-1 flex flex-col justify-between p-6 pt-8 pb-10">

              {/* STEP 1: DEMOGRAPHICS */}
              {surveyStep === 1 && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <button onClick={() => setCurrentScreen("Welcome")} className="text-slate-400 flex items-center gap-1 text-xs">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <h2 className="text-xl font-bold font-outfit mt-4 text-slate-800 dark:text-slate-100">
                        Demographic Information
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Please provide the following details</p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Name</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={surveyName}
                          onChange={(e) => setSurveyName(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Age</label>
                        <select
                          value={surveyAge}
                          onChange={(e) => setSurveyAge(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                        >
                          <option>18-25</option>
                          <option>26-35</option>
                          <option>36-45</option>
                          <option>46-60</option>
                          <option>60+</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Gender</label>
                        <div className="flex gap-4">
                          {["Male", "Female", "Other"].map((gen) => (
                            <label key={gen} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                              <input
                                type="radio"
                                name="gender"
                                checked={surveyGender === gen}
                                onChange={() => setSurveyGender(gen)}
                                className="accent-teal-500 w-4 h-4"
                              />
                              <span>{gen}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Education Level</label>
                        <select
                          value={surveyEducation}
                          onChange={(e) => setSurveyEducation(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                        >
                          <option>High School</option>
                          <option>Undergraduate</option>
                          <option>Graduate</option>
                          <option>Postgraduate</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Occupation</label>
                        <select
                          value={surveyOccupation}
                          onChange={(e) => setSurveyOccupation(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                        >
                          <option>Student</option>
                          <option>Parent</option>
                          <option>Working Professional</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSurveyStep(2)}
                    className="w-full py-4 mt-8 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* STEP 2: HYGIENE HABITS */}
              {surveyStep === 2 && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <button onClick={() => setSurveyStep(1)} className="text-slate-400 flex items-center gap-1 text-xs">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <h2 className="text-xl font-bold font-outfit mt-4 text-slate-800 dark:text-slate-100">
                        Oral Hygiene Practices
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Please answer the following questions</p>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      {/* Brush Teeth */}
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">How often do you brush your teeth?</label>
                        <select
                          value={surveyBrush}
                          onChange={(e) => setSurveyBrush(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                          <option>Twice a day</option>
                          <option>Once a day</option>
                          <option>Occasionally</option>
                          <option>Never</option>
                        </select>
                      </div>

                      {/* Toothpaste */}
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">Do you use toothpaste?</label>
                        <select
                          value={surveyToothpaste}
                          onChange={(e) => setSurveyToothpaste(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                          <option>Yes, always</option>
                          <option>Sometimes</option>
                          <option>No, never</option>
                        </select>
                      </div>

                      {/* Floss */}
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">How often do you floss?</label>
                        <select
                          value={surveyFloss}
                          onChange={(e) => setSurveyFloss(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                          <option>Daily</option>
                          <option>Sometimes</option>
                          <option>Never</option>
                        </select>
                      </div>

                      {/* Mouthwash */}
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">Do you use mouthwash?</label>
                        <select
                          value={surveyMouthwash}
                          onChange={(e) => setSurveyMouthwash(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                          <option>Daily</option>
                          <option>Occasionally</option>
                          <option>No, never</option>
                        </select>
                      </div>

                      {/* Dentist visits */}
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">How often do you visit the dentist?</label>
                        <select
                          value={surveyDentist}
                          onChange={(e) => setSurveyDentist(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                        >
                          <option>Once a year</option>
                          <option>Twice a year</option>
                          <option>Only when in pain</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSurveyStep(3)}
                    className="w-full py-4 mt-8 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* STEP 3: INTERACTIVE GUIDES PREVIEW */}
              {surveyStep === 3 && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <button onClick={() => setSurveyStep(2)} className="text-slate-400 flex items-center gap-1 text-xs">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <h2 className="text-xl font-bold font-outfit mt-4 text-slate-800 dark:text-slate-100">
                        Learn
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Recommended hygiene practices:</p>
                    </div>

                    {/* Guides List */}
                    <div className="space-y-3">
                      {[
                        { title: "How to Brush Properly", time: "5 min read", emoji: "🪥" },
                        { title: "Benefits of Flossing", time: "4 min read", emoji: "🦷" },
                        { title: "Choosing the Right Toothpaste", time: "3 min read", emoji: "🧪" },
                        { title: "Mouthwash - Do's and Don'ts", time: "3 min read", emoji: "🧴" },
                        { title: "Regular Dental Visits", time: "4 min read", emoji: "📅" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <h4 className="text-sm font-semibold leading-tight">{item.title}</h4>
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSurveyStep(4)}
                    className="w-full py-4 mt-8 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* STEP 4: TRIVIA / LAST QUESTION */}
              {surveyStep === 4 && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <button onClick={() => setSurveyStep(3)} className="text-slate-400 flex items-center gap-1 text-xs">
                        <ChevronLeft size={16} /> Back
                      </button>
                      <h2 className="text-xl font-bold font-outfit mt-4 text-slate-800 dark:text-slate-100">
                        Last Question
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Which of the following is the correct way to brush your teeth?</p>
                    </div>

                    {/* Choices */}
                    <div className="space-y-3">
                      {[
                        "Brush only in the morning",
                        "Brush for 2 minutes, twice a day",
                        "Brush immediately after every meal",
                        "Brush with any hard bristle brush"
                      ].map((ans, i) => {
                        const letters = ["A", "B", "C", "D"];
                        const isSelected = surveyTrivia === ans;
                        const isCorrect = ans === "Brush for 2 minutes, twice a day";

                        return (
                          <button
                            key={i}
                            onClick={() => setSurveyTrivia(ans)}
                            className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition ${isSelected
                              ? "border-teal-500 bg-teal-500/10 text-teal-400"
                              : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900"
                              }`}
                          >
                            <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isSelected ? "bg-teal-500 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
                              }`}>
                              {letters[i]}
                            </span>
                            <span className="text-sm font-medium leading-tight">{ans}</span>
                            {isSelected && isCorrect && <Check size={16} className="ml-auto text-teal-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleEvaluateSurvey}
                    className="w-full py-4 mt-8 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* STEP 5: YOUR SCORE / SUMMARY */}
              {surveyStep === 5 && (
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div className="space-y-8 flex-1 flex flex-col justify-center items-center">
                    <div>
                      <h2 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100">
                        Your Score
                      </h2>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#cbd5e1" strokeWidth="10" fill="transparent" className="dark:stroke-slate-800" />
                        <circle cx="80" cy="80" r="70" stroke="#0d9488" strokeWidth="10" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * surveyScore) / 100} fill="transparent" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-outfit font-black text-4xl text-slate-800 dark:text-slate-100">{surveyScore}%</span>
                        <span className="text-xs text-teal-500 font-bold uppercase mt-1">Great Job!</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-slate-400">You scored {surveyCorrect} out of 6</p>
                    </div>

                    {/* Performance Summary details */}
                    <div className="w-full max-w-xs p-4 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-left text-xs space-y-2">
                      <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[9px] mb-2">Performance Summary</h4>
                      <div className="flex justify-between">
                        <span className="text-slate-400 flex items-center gap-1"><Check size={14} className="text-teal-500" /> Correct Answers</span>
                        <span className="font-bold">{surveyCorrect}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 flex items-center gap-1"><X size={14} className="text-red-500" /> Wrong Answers</span>
                        <span className="font-bold">{6 - surveyCorrect}</span>
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Accuracy</span>
                        <span className="text-teal-500">{Math.round((surveyCorrect / 6) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinishSurvey}
                    className="w-full py-4 mt-8 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition"
                  >
                    Finish
                  </button>
                </div>
              )}

              {/* Progress Steps Indicators */}
              <div className="mt-8 flex justify-between items-center px-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{surveyStep} of 5</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <div
                      key={st}
                      className={`h-1.5 rounded-full transition-all duration-300 ${st <= surveyStep ? "w-6 bg-teal-500" : "w-1.5 bg-slate-300 dark:bg-slate-800"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 6: CORE APP DIALOG: MAIN DASHBOARD TABS SYSTEM */}
          {currentScreen === "Dashboard" && (
            <div className="flex-1 flex flex-col justify-between pb-16">

              {/* TAB A: DASHBOARD HOME SCREEN */}
              {activeTab === "Home" && (
                <div className="p-5 space-y-6">
                  {/* Header info */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hello, {activeUser.name} 👋</span>
                      <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Track your progress daily</h3>
                    </div>
                    <div className="w-9 h-9 bg-teal-600 rounded-xl text-white flex items-center justify-center font-bold text-sm">
                      {activeUser.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  </div>

                  {/* Health Score Gauge */}
                  <div className="p-5 bg-teal-600/5 border border-teal-500/10 rounded-2xl flex items-center gap-5">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="#cbd5e1" strokeWidth="6" fill="transparent" className="dark:stroke-slate-800" />
                        <circle cx="40" cy="40" r="34" stroke="#0d9488" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * activeUser.healthScore) / 100} fill="transparent" />
                      </svg>
                      <span className="absolute font-outfit font-black text-lg text-slate-800 dark:text-slate-100">
                        {activeUser.healthScore}
                      </span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Health Score</h4>
                        <button
                          onClick={() => {
                            setSurveyStep(2); // Skip Step 1 Demographics
                            setCurrentScreen("Survey");
                          }}
                          className="text-[10px] font-bold text-teal-400 hover:underline"
                        >
                          Retake Survey
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">
                        {activeUser.healthScore >= 80 ? "Good Job! Keep maintaining this healthy trend." : "Let's increase your tracker stats today to reach 80%!"}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Quick Actions</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      {[
                        { tab: "Track", label: "Track", icon: Target, color: "text-indigo-500 bg-indigo-500/10" },
                        { tab: "Learn", label: "Learn", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10" },
                        { tab: "Reminders", label: "Reminders", icon: Bell, color: "text-blue-500 bg-blue-500/10" },
                        { tab: "Profile", label: "Profile", icon: UserIcon, color: "text-purple-500 bg-purple-500/10" }
                      ].map((act) => (
                        <button
                          key={act.tab}
                          onClick={() => setActiveTab(act.tab as any)}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:scale-[1.03] transition flex flex-col items-center gap-1.5"
                        >
                          <div className={`p-2 rounded-lg ${act.color}`}>
                            <act.icon size={16} />
                          </div>
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Today's Progress Cards */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Today's Progress</span>

                    <div className="space-y-2 text-xs">
                      {/* Steps Progress */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Flame className="text-indigo-500 w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-semibold block">Steps</span>
                            <span className="text-[10px] text-slate-400">{activeUser.stepsLogged.toLocaleString()} / {activeUser.stepsTarget.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {Math.round((activeUser.stepsLogged / activeUser.stepsTarget) * 100)}%
                        </span>
                      </div>

                      {/* Water Progress */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Droplet className="text-blue-500 w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-semibold block">Water</span>
                            <span className="text-[10px] text-slate-400">{activeUser.waterLogged} / {activeUser.waterTarget} glasses</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {Math.round((activeUser.waterLogged / activeUser.waterTarget) * 100)}%
                        </span>
                      </div>

                      {/* Sleep Progress */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Moon className="text-purple-500 w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-semibold block">Sleep</span>
                            <span className="text-[10px] text-slate-400">{activeUser.sleepLogged}h / {activeUser.sleepTarget}h</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {Math.round((activeUser.sleepLogged / activeUser.sleepTarget) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB B: TRACK SCREEN */}
              {activeTab === "Track" && (
                <div className="p-5 space-y-6">
                  <div>
                    <h3 className="text-lg font-black font-outfit text-slate-800 dark:text-slate-100">Track Your Health</h3>
                    <p className="text-xs text-slate-400">Log today's metrics to update score</p>
                  </div>

                  <div className="space-y-4">
                    {/* Steps input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Flame size={12} className="text-indigo-500" /> Walk Steps (Target: {activeUser.stepsTarget})
                      </label>
                      <input
                        type="number"
                        value={inputSteps}
                        onChange={(e) => setInputSteps(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                      />
                    </div>

                    {/* Water input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Droplet size={12} className="text-blue-500" /> Water Glasses (Target: {activeUser.waterTarget})
                      </label>
                      <input
                        type="number"
                        value={inputWater}
                        onChange={(e) => setInputWater(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                      />
                    </div>

                    {/* Sleep input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Moon size={12} className="text-purple-500" /> Sleep Hours (Target: {activeUser.sleepTarget})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputSleep}
                        onChange={(e) => setInputSleep(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                      />
                    </div>

                    {/* Weight input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Activity size={12} className="text-emerald-500" /> Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputWeight}
                        onChange={(e) => setInputWeight(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                      />
                    </div>

                    <button
                      onClick={handleUpdateMetrics}
                      className="w-full py-4 mt-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg transition"
                    >
                      + Add Record
                    </button>
                  </div>
                </div>
              )}

              {/* TAB C: LEARN SCREEN & DETAILS OVERLAY */}
              {activeTab === "Learn" && (
                <div className="p-5 flex-1 flex flex-col">
                  {selectedArticle ? (
                    /* ARTICLE DETAIL SCREEN */
                    <div className="flex-1 space-y-5">
                      <button onClick={() => setSelectedArticle(null)} className="text-slate-400 flex items-center gap-1 text-xs">
                        <ChevronLeft size={16} /> Back to Library
                      </button>

                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded-full">
                          {selectedArticle.category}
                        </span>
                        <h3 className="text-lg font-black font-outfit leading-snug">{selectedArticle.title}</h3>
                        <p className="text-xs text-slate-400">{selectedArticle.description}</p>
                      </div>

                      {/* Video Embed Mockup */}
                      <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                        {selectedArticle.imageUrl ? (
                          <img src={selectedArticle.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                        ) : null}
                        <div className="z-10 p-3 bg-teal-600 rounded-full text-white cursor-pointer active:scale-95 transition">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>

                      {/* Steps checklist */}
                      {selectedArticle.steps && selectedArticle.steps.length > 0 && (
                        <div className="space-y-2.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Recommended Steps</span>
                          <div className="space-y-2">
                            {selectedArticle.steps.map((st, i) => {
                              const stepKey = `${selectedArticle.id}-${i}`;
                              const isDone = !!completedSteps[stepKey];
                              return (
                                <button
                                  key={i}
                                  onClick={() => setCompletedSteps({ ...completedSteps, [stepKey]: !isDone })}
                                  className="w-full text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3 transition"
                                >
                                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${isDone ? "bg-teal-500 border-teal-500 text-white" : "border-slate-300 dark:border-slate-700"
                                    }`}>
                                    {isDone && <Check size={14} />}
                                  </div>
                                  <span className="text-xs font-semibold leading-normal">{st}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          alert("Great work! Article marked as completed.");
                          setSelectedArticle(null);
                        }}
                        className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  ) : (
                    /* LIST OF ARTICLES */
                    <div className="space-y-5 flex-1 flex flex-col">
                      <div>
                        <h3 className="text-lg font-black font-outfit text-slate-800 dark:text-slate-100">Learn</h3>
                        <p className="text-xs text-slate-400">Browse articles, videos, and guides</p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search guides..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                        />
                      </div>

                      {/* Categories filter tabs */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 select-none scrollbar-none text-[10px] font-bold">
                        {["All", "Oral Health", "Nutrition", "Fitness", "Mental Health"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 shrink-0 rounded-full border transition ${selectedCategory === cat
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-500 hover:text-slate-300"
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Filtered List */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px]">
                        {articles
                          .filter((a) => {
                            const matchCat = selectedCategory === "All" || a.category === selectedCategory;
                            const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchCat && matchSearch;
                          })
                          .map((art) => (
                            <div
                              key={art.id}
                              onClick={() => setSelectedArticle(art)}
                              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex gap-3 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition"
                            >
                              <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                                {art.imageUrl ? (
                                  <img src={art.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                                ) : (
                                  <span className="text-xl">📚</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-teal-400">{art.category}</span>
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{art.title}</h4>
                                <span className="text-[9px] text-slate-400">{art.readTime}</span>
                              </div>
                              <div className="flex items-center text-slate-400">
                                <ChevronRight size={16} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB D: REMINDERS SCREEN */}
              {activeTab === "Reminders" && (
                <div className="p-5 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black font-outfit text-slate-800 dark:text-slate-100">Your Reminders</h3>
                        <p className="text-xs text-slate-400">Manage daily health schedules</p>
                      </div>
                      <button
                        onClick={() => setShowAddReminderModal(true)}
                        className="p-1 bg-teal-500/10 text-teal-400 rounded-lg hover:scale-105 transition"
                      >
                        <PlusCircle size={22} />
                      </button>
                    </div>

                    {/* Reminders List */}
                    <div className="space-y-2.5 text-xs font-bold">
                      {/* Standard Reminder 1 */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="block font-semibold">Drink Water</span>
                          <span className="text-[10px] text-slate-400 font-medium">Every 2 hours</span>
                        </div>
                        <button
                          onClick={() => handleToggleReminder("drinkWater")}
                          className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center ${activeUser.reminders.drinkWater ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
                            }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      {/* Standard Reminder 2 */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="block font-semibold">Morning Walk</span>
                          <span className="text-[10px] text-slate-400 font-medium">6:00 AM</span>
                        </div>
                        <button
                          onClick={() => handleToggleReminder("morningWalk")}
                          className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center ${activeUser.reminders.morningWalk ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
                            }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      {/* Standard Reminder 3 */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="block font-semibold">Take Medicine</span>
                          <span className="text-[10px] text-slate-400 font-medium">1:00 PM</span>
                        </div>
                        <button
                          onClick={() => handleToggleReminder("takeMedicine")}
                          className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center ${activeUser.reminders.takeMedicine ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
                            }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      {/* Standard Reminder 4 */}
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="block font-semibold">Sleep Early</span>
                          <span className="text-[10px] text-slate-400 font-medium">10:30 PM</span>
                        </div>
                        <button
                          onClick={() => handleToggleReminder("sleepEarly")}
                          className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center ${activeUser.reminders.sleepEarly ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
                            }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      {/* Custom Reminders List */}
                      {customReminders.map((rem) => (
                        <div key={rem.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleDeleteCustomReminder(rem.id)} className="text-red-500 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-850">
                              <Trash2 size={14} />
                            </button>
                            <div>
                              <span className="block font-semibold">{rem.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{rem.time}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCustomReminders(customReminders.map(r => r.id === rem.id ? { ...r, enabled: !r.enabled } : r));
                            }}
                            className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center ${rem.enabled ? "bg-teal-600 justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
                              }`}
                          >
                            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Reminder Modal Popup Overlay */}
                  {showAddReminderModal && (
                    <div className="absolute inset-0 bg-slate-950/70 z-50 flex items-end justify-center">
                      <div className="w-full bg-white dark:bg-[#151f32] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-outfit font-black text-slate-800 dark:text-slate-100">Add Custom Reminder</h4>
                          <button onClick={() => setShowAddReminderModal(false)} className="text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Reminder Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Brush Teeth Night"
                              value={newReminderName}
                              onChange={(e) => setNewReminderName(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Time</label>
                            <input
                              type="text"
                              value={newReminderTime}
                              onChange={(e) => setNewReminderTime(e.target.value)}
                              placeholder="e.g. 09:30 PM"
                              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleAddReminder}
                          className="w-full py-4 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                        >
                          Add Reminder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB E: PROFILE SCREEN */}
              {activeTab === "Profile" && (
                <div className="p-5 space-y-6">
                  {/* Profile Summary header */}
                  <div className="flex flex-col items-center justify-center text-center space-y-3.5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 rounded-full flex items-center justify-center font-bold text-2xl border border-teal-500/10">
                      {activeUser.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-outfit font-black text-slate-800 dark:text-slate-100">{activeUser.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{activeUser.email} • {activeUser.mobile}</p>
                    </div>
                  </div>

                  {/* Profile Menu options */}
                  <div className="space-y-2 text-xs font-bold">
                    {[
                      { icon: UserIcon, label: "Personal Info" },
                      { icon: Target, label: "Health Goals" },
                      { icon: Award, label: "Achievements" },
                      { icon: Shield, label: "Privacy & Settings" },
                      { icon: HelpCircle, label: "Help & Support" }
                    ].map((opt, i) => (
                      <button
                        key={i}
                        className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] transition text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">
                            <opt.icon size={15} />
                          </div>
                          <span>{opt.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400" />
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        window.localStorage.removeItem("hl_pwa_active_user");
                        setCurrentScreen("Welcome");
                      }}
                      className="w-full p-3.5 bg-red-500/5 dark:bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl flex items-center gap-3 text-red-500 transition text-left mt-4"
                    >
                      <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg">
                        <LogOut size={15} />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BOTTOM NAVIGATION BAR */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800/60 flex justify-around items-center z-40">
                {[
                  { id: "Home", label: "Home", emoji: "🏠" },
                  { id: "Learn", label: "Learn", emoji: "📚" },
                  { id: "Track", label: "Track", emoji: "🎯" },
                  { id: "Reminders", label: "Reminders", emoji: "🔔" },
                  { id: "Profile", label: "Profile", emoji: "👤" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex flex-col items-center justify-center w-14 h-full relative"
                    >
                      <span className={`text-xl transition-all duration-300 ${isActive ? "scale-110" : "grayscale opacity-50"}`}>
                        {tab.emoji}
                      </span>
                      <span className={`text-[9px] mt-0.5 font-bold transition-colors duration-300 ${isActive ? "text-teal-600" : "text-slate-400"}`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
