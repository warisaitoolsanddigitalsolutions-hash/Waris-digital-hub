import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = window.__SUPABASE_URL__ || "";
const SUPABASE_PUBLISHABLE_KEY = window.__SUPABASE_PUBLISHABLE_KEY__ || "";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) throw new Error("Supabase is not configured.");

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit"
  }
});

export async function getSession() {
  return (await supabase.auth.getSession()).data.session;
}

export async function getProfile(uid) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
  if (error) throw error;
  return data;
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    location.href = "login.html";
    throw new Error("Authentication required.");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") {
    location.href = "dashboard.html";
    throw new Error("Admin access required.");
  }
  return { user, profile };
}

export async function signInWithGoogle() {
  const redirectTo = new URL("/login.html", "https://httpswarisalidigitalhub.com/").href;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, queryParams: { prompt: "select_account" } }
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = "index.html";
}

export function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll(String.fromCharCode(34), "&quot;")
    .replaceAll(String.fromCharCode(39), "&#39;");
}

export function publicMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
