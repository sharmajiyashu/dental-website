"use client";

import { useState, useEffect } from "react";
import {
  User,
  SurveyResponse,
  Article,
  Enquiry,
  initialUsers,
  initialSurveys,
  initialArticles,
  initialEnquiries,
} from "./mockData";

export type { User, SurveyResponse, Article, Enquiry };


import { api } from "./api";

// LocalStorage Keys
const KEYS = {
  USERS: "hl_users",
  SURVEYS: "hl_surveys",
  ARTICLES: "hl_articles",
  ENQUIRIES: "hl_enquiries",
};

// Safe LocalStorage getter
const getStorageItem = <T,>(key: string, initial: T): T => {
  if (typeof window === "undefined") return initial;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    console.error("Error reading localStorage key: " + key, e);
    return initial;
  }
};

const setStorageItem = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing localStorage key: " + key, e);
  }
};

// Normalization function to map Mongoose _id to frontend id
const norm = (item: any) => {
  if (!item) return item;
  return {
    ...item,
    id: item._id || item.id,
    registrationDate: item.registrationDate ? new Date(item.registrationDate).toISOString().split('T')[0] : item.registrationDate
  };
};

// Functions to manipulate data globally
export const getAppState = () => {
  const users = getStorageItem<User[]>(KEYS.USERS, initialUsers);
  const surveys = getStorageItem<SurveyResponse[]>(KEYS.SURVEYS, initialSurveys);
  const articles = getStorageItem<Article[]>(KEYS.ARTICLES, initialArticles);
  const enquiries = getStorageItem<Enquiry[]>(KEYS.ENQUIRIES, initialEnquiries);
  return { users, surveys, articles, enquiries };
};

export const saveAppState = (state: {
  users?: User[];
  surveys?: SurveyResponse[];
  articles?: Article[];
  enquiries?: Enquiry[];
}) => {
  if (state.users) setStorageItem(KEYS.USERS, state.users);
  if (state.surveys) setStorageItem(KEYS.SURVEYS, state.surveys);
  if (state.articles) setStorageItem(KEYS.ARTICLES, state.articles);
  if (state.enquiries) setStorageItem(KEYS.ENQUIRIES, state.enquiries);
};

// Standard React hook for App State
export function useAppState() {
  const [users, setUsers] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [useBackend, setUseBackend] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Try fetching metrics or user list from backend
        const backendUsers = await api.admin.getUsers();
        const backendSurveys = await api.admin.getSurveys();
        const backendArticles = await api.admin.getArticles();
        const backendEnquiries = await api.admin.getEnquiries();

        setUsers(backendUsers.map(norm));
        setSurveys(backendSurveys.map(norm));
        setArticles(backendArticles.map(norm));
        setEnquiries(backendEnquiries.map(norm));
        setUseBackend(true);
        console.log("🔌 Connected to Healthy Life backend database server on port 5000.");
      } catch (err) {
        console.warn("⚠️ Backend server not reachable on http://localhost:5000. Running in offline localStorage simulator mode.");
        setUsers(getStorageItem<User[]>(KEYS.USERS, initialUsers).map(norm));
        setSurveys(getStorageItem<SurveyResponse[]>(KEYS.SURVEYS, initialSurveys).map(norm));
        setArticles(getStorageItem<Article[]>(KEYS.ARTICLES, initialArticles).map(norm));
        setEnquiries(getStorageItem<Enquiry[]>(KEYS.ENQUIRIES, initialEnquiries).map(norm));
        setUseBackend(false);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    setStorageItem(KEYS.USERS, newUsers);
  };

  const updateSurveys = (newSurveys: SurveyResponse[]) => {
    setSurveys(newSurveys);
    setStorageItem(KEYS.SURVEYS, newSurveys);
  };

  const updateArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    setStorageItem(KEYS.ARTICLES, newArticles);
  };

  const updateEnquiries = (newEnquiries: Enquiry[]) => {
    setEnquiries(newEnquiries);
    setStorageItem(KEYS.ENQUIRIES, newEnquiries);
  };

  // User Actions
  const addUser = (user: Omit<User, "id" | "registrationDate" | "healthScore" | "stepsLogged" | "stepsTarget" | "waterLogged" | "waterTarget" | "sleepLogged" | "sleepTarget" | "weight" | "reminders"> & { password?: string }) => {
    const tempId = `u-${Date.now()}`;
    const newUser: User = {
      ...user,
      id: tempId,
      healthScore: 75, // Starting score
      stepsLogged: 0,
      stepsTarget: 8000,
      waterLogged: 0,
      waterTarget: 8,
      sleepLogged: 0,
      sleepTarget: 8,
      weight: 70,
      reminders: {
        drinkWater: true,
        morningWalk: false,
        takeMedicine: false,
        sleepEarly: true,
      },
      registrationDate: new Date().toISOString().split("T")[0],
    };

    if (useBackend) {
      api.auth.register({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        age: user.age,
        gender: user.gender,
        role: user.role
      }).then(res => {
        const saved = norm(res.user);
        setUsers(prev => prev.map(u => u.id === tempId ? saved : u));
      }).catch(err => console.error("Error creating user on backend:", err));
    }

    const updated = [newUser, ...users];
    updateUsers(updated);
    return newUser;
  };

  const deleteUser = (id: string) => {
    if (useBackend) {
      api.admin.deleteUser(id).catch(err => console.error(err));
    }
    const updated = users.filter((u) => u.id !== id);
    updateUsers(updated);
  };

  const updateUserMetrics = (id: string, updates: Partial<User>) => {
    if (useBackend) {
      api.app.updateMetrics(updates).then(res => {
        const saved = norm(res);
        setUsers(prev => prev.map(u => u.id === id ? saved : u));
      }).catch(err => console.error(err));
    }
    const updated = users.map((u) => {
      if (u.id === id) {
        const result = { ...u, ...updates };
        // Recalculate health score based on metrics logged
        const waterProgress = Math.min(1, result.waterLogged / result.waterTarget);
        const stepsProgress = Math.min(1, result.stepsLogged / result.stepsTarget);
        const sleepProgress = Math.min(1, result.sleepLogged / result.sleepTarget);
        result.healthScore = Math.round((waterProgress + stepsProgress + sleepProgress) * 33.3);
        return result;
      }
      return u;
    });
    updateUsers(updated);
  };

  // Survey Actions
  const addSurveyResponse = (survey: Omit<SurveyResponse, "id" | "date">) => {
    const tempId = `s-${Date.now()}`;
    const newSurvey: SurveyResponse = {
      ...survey,
      id: tempId,
      date: new Date().toLocaleString(),
    };

    if (useBackend) {
      api.app.submitSurvey(survey).then(res => {
        const saved = norm(res);
        setSurveys(prev => prev.map(s => s.id === tempId ? saved : s));
      }).catch(err => console.error(err));
    }

    const updated = [newSurvey, ...surveys];
    updateSurveys(updated);

    // Sync to user database if user already exists or create user
    const existingUser = users.find((u) => u.name.toLowerCase() === survey.name.toLowerCase());
    if (existingUser) {
      // Modify score slightly based on assessment
      updateUserMetrics(existingUser.id, { healthScore: Math.round((existingUser.healthScore + survey.score) / 2) });
    } else {
      // Create user
      addUser({
        name: survey.name,
        age: survey.age,
        gender: survey.gender,
        role: survey.occupation || "User",
        email: `${survey.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
        mobile: "+91 99999 88888"
      });
    }
  };

  // Article CRUD
  const addArticle = (article: Omit<Article, "id">) => {
    const tempId = `a-${Date.now()}`;
    const newArticle: Article = {
      ...article,
      id: tempId,
    };

    if (useBackend) {
      api.admin.createArticle(article).then(res => {
        const saved = norm(res);
        setArticles(prev => prev.map(a => a.id === tempId ? saved : a));
      }).catch(err => console.error(err));
    }

    const updated = [newArticle, ...articles];
    updateArticles(updated);
  };

  const editArticle = (id: string, updates: Partial<Article>) => {
    if (useBackend) {
      api.admin.updateArticle(id, updates).then(res => {
        const saved = norm(res);
        setArticles(prev => prev.map(a => a.id === id ? saved : a));
      }).catch(err => console.error(err));
    }
    const updated = articles.map((a) => (a.id === id ? { ...a, ...updates } : a));
    updateArticles(updated);
  };

  const deleteArticle = (id: string) => {
    if (useBackend) {
      api.admin.deleteArticle(id).catch(err => console.error(err));
    }
    const updated = articles.filter((a) => a.id !== id);
    updateArticles(updated);
  };

  // Enquiry Actions
  const addEnquiry = (enquiry: Omit<Enquiry, "id" | "date" | "status">) => {
    const tempId = `e-${Date.now()}`;
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: tempId,
      date: new Date().toLocaleString(),
      status: "New",
    };

    if (useBackend) {
      api.app.submitEnquiry(enquiry).then(res => {
        const saved = norm(res);
        setEnquiries(prev => prev.map(e => e.id === tempId ? saved : e));
      }).catch(err => console.error(err));
    }

    const updated = [newEnquiry, ...enquiries];
    updateEnquiries(updated);
  };

  const markEnquiryReplied = (id: string) => {
    if (useBackend) {
      api.admin.replyEnquiry(id).then(res => {
        const saved = norm(res);
        setEnquiries(prev => prev.map(e => e.id === id ? saved : e));
      }).catch(err => console.error(err));
    }
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status: "Replied" as const } : e));
    updateEnquiries(updated);
  };

  // Dashboard Aggregates
  const getMetrics = () => {
    const totalUsers = users.length;
    const avgHealthScore = totalUsers
      ? Math.round(users.reduce((sum, u) => sum + u.healthScore, 0) / totalUsers)
      : 0;
    const totalSurveys = surveys.length;
    const pendingEnquiries = enquiries.filter((e) => e.status === "New").length;

    return { totalUsers, avgHealthScore, totalSurveys, pendingEnquiries };
  };

  return {
    isLoaded,
    users,
    surveys,
    articles,
    enquiries,
    addUser,
    deleteUser,
    updateUserMetrics,
    addSurveyResponse,
    addArticle,
    editArticle,
    deleteArticle,
    addEnquiry,
    markEnquiryReplied,
    getMetrics,
  };
}
