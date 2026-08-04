import { useState, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/api/profile";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({
    meta: [
      { title: "Edit profile · Daily" },
      { name: "description", content: "Update your profile photo, name, email and phone number on Daily." },
      { property: "og:title", content: "Edit profile · Daily" },
      { property: "og:description", content: "Update your profile photo, name, email and phone number on Daily." },
    ],
  }),
  component: EditProfilePage,
});

function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    avatar: user?.avatar ?? "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, avatar: reader.result as string }));
        toast.success("Profile photo loaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setForm((f) => ({ ...f, avatar: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Profile photo removed");
  };

  const save = async () => {
    await updateProfile(form); // PUT /profile
    updateUser(form);
    toast.success("Profile updated successfully");
    void navigate({ to: "/profile" });
  };

  return (
    <AppShell title="Edit profile" back>
      <PageTransition>
        <div className="mx-auto max-w-md space-y-5 rounded-3xl border border-border bg-card p-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center space-y-3 pb-3 border-b border-border">
            <div className="relative group">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Profile Preview"
                  className="size-24 rounded-full object-cover border-4 border-primary/20 shadow-md"
                />
              ) : (
                <div className="grid size-24 place-items-center rounded-full bg-primary text-3xl font-black text-primary-foreground shadow-md">
                  {(form.name || "G").slice(0, 1).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm shadow-lg hover:scale-105 transition border-2 border-card"
                title="Change Photo"
              >
                <FiCamera />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
              >
                <FiCamera /> Choose Photo
              </button>
              {form.avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="inline-flex items-center gap-1 rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
                >
                  <FiTrash2 /> Remove
                </button>
              )}
            </div>
          </div>

          {(["name", "email", "phone"] as const).map((field) => (
            <label key={field} className="block space-y-1.5">
              <span className="text-sm font-semibold capitalize">{field}</span>
              <input
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}
          <button
            onClick={save}
            className="w-full rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 transition"
          >
            Save changes
          </button>
        </div>
      </PageTransition>
    </AppShell>
  );
}
