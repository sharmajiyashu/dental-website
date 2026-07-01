"use client";

import { useState, useRef } from "react";
import { useAppState, Article } from "@/lib/state";
import { api } from "@/lib/api";
import { BookOpen, Plus, Trash2, Edit2, X, Play, Image as ImageIcon, Upload, Loader2 } from "lucide-react";

export default function LearningLibrary() {
  const { isLoaded, articles, addArticle, editArticle, deleteArticle } = useAppState();

  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: "Oral Health" | "Nutrition" | "Fitness" | "Mental Health";
    readTime: string;
    description: string;
    videoUrl: string;
    imageUrl: string;
    stepsText: string;
  }>({
    title: "",
    category: "Oral Health",
    readTime: "5 min read",
    description: "",
    videoUrl: "",
    imageUrl: "",
    stepsText: "",
  });

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading guide libraries...</span>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      category: "Oral Health",
      readTime: "5 min read",
      description: "",
      videoUrl: "",
      imageUrl: "",
      stepsText: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (art: Article) => {
    setSelectedArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      description: art.description,
      videoUrl: art.videoUrl || "",
      imageUrl: art.imageUrl || "",
      stepsText: art.steps ? art.steps.join("\n") : "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImage(true);
    try {
      const result = await api.admin.uploadMedia(files);
      if (result?.media?.[0]?.url) {
        setFormData(prev => ({ ...prev, imageUrl: result.media[0].url }));
      }
    } catch (err: any) {
      alert("Image upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const articlePayload = {
      title: formData.title,
      category: formData.category,
      readTime: formData.readTime,
      description: formData.description,
      videoUrl: formData.videoUrl || undefined,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop",
      steps: formData.stepsText.split("\n").filter((s) => s.trim().length > 0),
    };

    if (selectedArticle) {
      editArticle(selectedArticle.id, articlePayload);
      setSelectedArticle(null);
      alert("Guidebook edited successfully!");
    } else {
      addArticle(articlePayload);
      setShowAddModal(false);
      alert("New guidebook added to directory!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl tracking-tight">Learning Library Manager</h1>
          <p className="text-muted-foreground text-sm">
            Configure learning guides, video templates, and dental hygiene tutorials shown on the homepage.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/10 hover-scale"
        >
          <Plus size={16} />
          <span>Add New Guidebook</span>
        </button>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col justify-between hover-scale"
          >
            <div>
              {art.imageUrl ? (
                <div className="h-40 relative bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-teal-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {art.category}
                  </span>
                </div>
              ) : (
                <div className="h-40 bg-muted/60 flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={32} />
                </div>
              )}

              <div className="p-5 space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">{art.readTime}</span>
                <h3 className="font-outfit font-bold text-base leading-snug">{art.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3">{art.description}</p>

                <div className="flex gap-2 pt-2 text-[10px] text-slate-500 font-bold uppercase">
                  {art.videoUrl && (
                    <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded text-indigo-600 border border-indigo-100 dark:border-indigo-900/30">
                      <Play size={10} /> Video Guide
                    </span>
                  )}
                  {art.steps && (
                    <span className="bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
                      {art.steps.length} Steps Instructions
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-5 border-t border-border/40 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(art)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                    deleteArticle(art.id);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 rounded-xl text-xs font-bold transition border border-red-100 dark:border-red-900/30"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal Drawer */}
      {(showAddModal || selectedArticle) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-600 text-white rounded-t-3xl">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-teal-100">Configure Guidebook</span>
                <h2 className="font-outfit font-extrabold text-xl">
                  {selectedArticle ? "Edit Article" : "Create Learning Resource"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedArticle(null);
                }}
                className="text-white hover:bg-teal-700 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Guidebook Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="How to Brush Properly"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as "Oral Health" | "Nutrition" | "Fitness" | "Mental Health",
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card outline-none focus:border-teal-500"
                  >
                    <option>Oral Health</option>
                    <option>Nutrition</option>
                    <option>Fitness</option>
                    <option>Mental Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Read / Watch Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 min read"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Thumbnail Image</label>

                {/* Upload button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-border hover:border-teal-500 rounded-xl cursor-pointer transition group bg-muted/20 hover:bg-teal-50/30"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 size={24} className="text-teal-500 animate-spin" />
                      <span className="text-xs text-muted-foreground">Uploading to Cloudinary...</span>
                    </>
                  ) : formData.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.imageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                      <span className="text-xs text-teal-600 font-semibold">Click to replace image</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-400 group-hover:text-teal-500 transition" />
                      <span className="text-xs text-muted-foreground">Click to upload image (JPG, PNG, WebP · max 10MB)</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* URL fallback */}
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste image URL directly..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-transparent outline-none focus:border-teal-500 text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Video Embed Link (Optional)</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Short Description Summary</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the key focus of this article..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Checklist Instructions Steps (one step per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.stepsText}
                  onChange={(e) => setFormData({ ...formData, stepsText: e.target.value })}
                  placeholder="Step 1 details&#10;Step 2 details&#10;Step 3 details..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-transparent outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover-scale"
              >
                {selectedArticle ? "Save Guidebook Updates" : "Upload Guidebook to Library"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
