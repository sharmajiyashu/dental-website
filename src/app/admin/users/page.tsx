"use client";

import { useState } from "react";
import { useAppState, User } from "@/lib/state";
import {
  Search,
  Trash2,
  Eye,
  Plus,
  Flame,
  Droplet,
  Moon,
  Scale,
  X,
  Bell,
  Heart,
  Edit2,
  Save,
} from "lucide-react";

export default function UserManagement() {
  const { isLoaded, users, addUser, deleteUser, updateUserMetrics } = useAppState();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Metric editing state
  const [editingMetrics, setEditingMetrics] = useState({
    stepsLogged: 0,
    waterLogged: 0,
    sleepLogged: 0,
    weight: 0,
  });

  // User adding state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    age: "18-25",
    gender: "Female",
    role: "Student",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading patient directory...</span>
      </div>
    );
  }

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setEditingMetrics({
      stepsLogged: user.stepsLogged,
      waterLogged: user.waterLogged,
      sleepLogged: user.sleepLogged,
      weight: user.weight,
    });
  };

  const handleSaveMetrics = () => {
    if (!selectedUser) return;
    updateUserMetrics(selectedUser.id, {
      stepsLogged: editingMetrics.stepsLogged,
      waterLogged: editingMetrics.waterLogged,
      sleepLogged: editingMetrics.sleepLogged,
      weight: editingMetrics.weight,
    });

    // Refresh selected user modal info
    const updatedUser = users.find((u) => u.id === selectedUser.id);
    if (updatedUser) {
      setSelectedUser({
        ...updatedUser,
        stepsLogged: editingMetrics.stepsLogged,
        waterLogged: editingMetrics.waterLogged,
        sleepLogged: editingMetrics.sleepLogged,
        weight: editingMetrics.weight,
      });
    }
    alert("Patient metrics updated and health score recalculated!");
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    if (newUser.password && newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    addUser(newUser);
    setNewUser({
      name: "",
      age: "18-25",
      gender: "Female",
      role: "Student",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setShowAddModal(false);
    alert("New patient added successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl tracking-tight">Patient Directory</h1>
          <p className="text-muted-foreground text-sm">
            View patient health profiles, track logs, and edit diagnostics checklists.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/10 hover-scale"
        >
          <Plus size={16} />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name, email, or mobile..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card outline-none text-sm focus:border-teal-500"
        />
      </div>

      {/* Users Datatable */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                <th className="p-4 pl-6">Patient Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Demographics</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Health Score</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  {/* Name Avatar */}
                  <td className="p-4 pl-6 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 flex items-center justify-center font-bold">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                        <span className="text-xs text-muted-foreground">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="p-4 space-y-0.5">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{user.email}</div>
                    <div className="text-[10px] text-muted-foreground">{user.mobile}</div>
                  </td>
                  {/* Demographics */}
                  <td className="p-4 text-xs font-semibold">
                    <span className="capitalize">{user.gender}</span> • {user.age} yrs • <span className="text-slate-500">{user.role}</span>
                  </td>
                  {/* Registration Date */}
                  <td className="p-4 text-xs text-muted-foreground">{user.registrationDate}</td>
                  {/* Health Score */}
                  <td className="p-4">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/30">
                      {user.healthScore}%
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenDetails(user)}
                      className="p-2 text-slate-500 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition"
                      title="View Profile Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                          deleteUser(user.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:text-red-700 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No patients match your search. Try adding a new patient record!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal (Drawer) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-600 text-white rounded-t-3xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Patient Profile details</span>
                <h2 className="font-outfit font-extrabold text-xl">{selectedUser.name}</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white hover:bg-teal-700 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Demographics Summary */}
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-2xl border border-border text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Age Group</span>
                  <span className="font-bold">{selectedUser.age} Years</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Gender</span>
                  <span className="font-bold">{selectedUser.gender}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Role</span>
                  <span className="font-bold">{selectedUser.role}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Mobile Number</span>
                  <span className="font-bold">{selectedUser.mobile || "N/A"}</span>
                </div>
              </div>

              {/* Health Score Overview */}
              <div className="flex items-center gap-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 p-4 rounded-2xl">
                <div className="p-3 bg-teal-500/10 text-teal-600 rounded-xl">
                  <Heart className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs text-teal-600 font-semibold uppercase tracking-wider block">Health score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black">{selectedUser.healthScore}%</span>
                    <span className="text-xs text-muted-foreground">calculated automatically from logs</span>
                  </div>
                </div>
              </div>

              {/* Active Reminders */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Bell size={14} /> Active Reminders (Toggled by user)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedUser.reminders).map(([key, active]) => (
                    <div
                      key={key}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        active
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                          : "bg-muted/40 border-border text-muted-foreground"
                      }`}
                    >
                      <span className="capitalize font-semibold">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-bold text-[10px] uppercase">
                        {active ? "On" : "Off"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Logging Form (Interactivity) */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Edit2 size={14} /> Update Logged Health Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Steps */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      <Flame size={12} className="inline mr-1 text-indigo-500" />
                      Logged Steps
                    </label>
                    <input
                      type="number"
                      value={editingMetrics.stepsLogged}
                      onChange={(e) =>
                        setEditingMetrics({ ...editingMetrics, stepsLogged: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Water */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      <Droplet size={12} className="inline mr-1 text-blue-500" />
                      Logged Water (cups)
                    </label>
                    <input
                      type="number"
                      value={editingMetrics.waterLogged}
                      onChange={(e) =>
                        setEditingMetrics({ ...editingMetrics, waterLogged: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Sleep */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      <Moon size={12} className="inline mr-1 text-purple-500" />
                      Logged Sleep (hours)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingMetrics.sleepLogged}
                      onChange={(e) =>
                        setEditingMetrics({ ...editingMetrics, sleepLogged: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      <Scale size={12} className="inline mr-1 text-teal-600" />
                      Logged Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingMetrics.weight}
                      onChange={(e) =>
                        setEditingMetrics({ ...editingMetrics, weight: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-transparent outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveMetrics}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover-scale flex items-center justify-center gap-1.5"
                >
                  <Save size={16} />
                  <span>Save Metric Updates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-600 text-white rounded-t-3xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Add New patient</span>
                <h2 className="font-outfit font-extrabold text-xl">Create Record</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:bg-teal-700 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value.replace(/\D/g, "") })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Role / Status</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                  >
                    <option>Student</option>
                    <option>Parent</option>
                    <option>Working Professional</option>
                    <option>Retired</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Age Range</label>
                  <select
                    value={newUser.age}
                    onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                  >
                    <option>18-25</option>
                    <option>26-35</option>
                    <option>36-45</option>
                    <option>46-60</option>
                    <option>60+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Gender</label>
                  <select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover-scale"
              >
                Register Patient Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
