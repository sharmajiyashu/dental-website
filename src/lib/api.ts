/**
 * Dental Healthy Life API Client
 * Interfaces with the backend at http://localhost:5000/v1/api
 */

// const BASE_URL = "http://localhost:5000/v1/api";
const BASE_URL = "https://dental-backend-pink.vercel.app/v1/api";

const getHeaders = (path: string) => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = window.localStorage.getItem("hl_auth_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (path.startsWith("/admin")) {
    headers["Authorization"] = "Bearer dev-admin";
  }
  return headers;
};

async function fetchAPI(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(path),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

/** Upload files (multipart/form-data) — skips JSON Content-Type header */
async function uploadMedia(path: string, formData: FormData) {
  const url = `${BASE_URL}${path}`;
  const token = typeof window !== "undefined" ? window.localStorage.getItem("hl_auth_token") : null;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  else if (path.startsWith("/admin")) headers["Authorization"] = "Bearer dev-admin";

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export const api = {
  // Authentication
  auth: {
    async register(data: {
      name: string;
      email: string;
      mobile: string;
      password?: string;
      age?: string;
      gender?: string;
      role?: string;
    }) {
      return fetchAPI("/app/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },

    async login(email: string, password?: string) {
      return fetchAPI("/app/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
    },

    async verifyOtp(email: string, otp: string) {
      const data = await fetchAPI("/app/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp })
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("hl_auth_token", data.token);
        window.localStorage.setItem("hl_pwa_active_user", data.user._id);
      }
      return data;
    }
  },

  // Patient App Operations
  app: {
    async getProfile() {
      return fetchAPI("/app/users/profile");
    },

    async updateProfile(updates: any) {
      return fetchAPI("/app/users/profile", {
        method: "PUT",
        body: JSON.stringify(updates)
      });
    },

    async updateMetrics(metrics: {
      stepsLogged?: number;
      waterLogged?: number;
      sleepLogged?: number;
      weight?: number;
    }) {
      return fetchAPI("/app/users/metrics", {
        method: "PUT",
        body: JSON.stringify(metrics)
      });
    },

    async updateReminders(reminders: {
      drinkWater?: boolean;
      morningWalk?: boolean;
      takeMedicine?: boolean;
      sleepEarly?: boolean;
    }) {
      return fetchAPI("/app/users/reminders", {
        method: "PUT",
        body: JSON.stringify(reminders)
      });
    },

    async getArticles(category?: string, search?: string) {
      let query = "";
      if (category || search) {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        query = `?${params.toString()}`;
      }
      return fetchAPI(`/app/articles${query}`);
    },

    async submitSurvey(surveyData: any) {
      return fetchAPI("/app/surveys", {
        method: "POST",
        body: JSON.stringify(surveyData)
      });
    },

    async submitEnquiry(enquiryData: any) {
      return fetchAPI("/app/enquiries", {
        method: "POST",
        body: JSON.stringify(enquiryData)
      });
    }
  },

  // Admin Dashboard Operations
  admin: {
    async getUsers() {
      return fetchAPI("/admin/users");
    },

    async deleteUser(id: string) {
      return fetchAPI(`/admin/users/${id}`, {
        method: "DELETE"
      });
    },

    async getSurveys() {
      return fetchAPI("/admin/surveys");
    },

    async getEnquiries() {
      return fetchAPI("/admin/enquiries");
    },

    async replyEnquiry(id: string) {
      return fetchAPI(`/admin/enquiries/${id}/reply`, {
        method: "PUT"
      });
    },

    async getMetrics() {
      return fetchAPI("/admin/metrics");
    },

    async getArticles() {
      // Use client app articles list for admin view since schemas are shared
      return fetchAPI("/app/articles");
    },

    async createArticle(data: any) {
      return fetchAPI("/admin/articles", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },

    async updateArticle(id: string, data: any) {
      return fetchAPI(`/admin/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },

    async deleteArticle(id: string) {
      return fetchAPI(`/admin/articles/${id}`, {
        method: "DELETE"
      });
    },

    async uploadMedia(files: File[]) {
      const formData = new FormData();
      files.forEach(f => formData.append("media", f));
      return uploadMedia("/admin/media/upload", formData);
    },

    async deleteMedia(id: string) {
      return fetchAPI(`/admin/media/${id}`, { method: "DELETE" });
    }
  },

  // App media upload
  media: {
    async upload(files: File[]) {
      const formData = new FormData();
      files.forEach(f => formData.append("media", f));
      return uploadMedia("/app/media/upload", formData);
    },

    async delete(id: string) {
      return fetchAPI(`/app/media/${id}`, { method: "DELETE" });
    }
  }
};
