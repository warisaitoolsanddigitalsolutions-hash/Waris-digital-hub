import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";
if(!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) throw new Error("Supabase is not configured. Add GitHub Actions secrets.");
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
export const ADMIN_EMAIL="warisalidigitalsolutions@gmail.com";
export async function getSession(){return (await supabase.auth.getSession()).data.session}
export async function getProfile(uid){const {data,error}=await supabase.from("profiles").select("*").eq("id",uid).maybeSingle();if(error)throw error;return data}
export async function requireUser(){const s=await getSession();if(!s){location.href="login.html";throw new Error("Authentication required.")}return s.user}
export async function requireAdmin(){const user=await requireUser();const profile=await getProfile(user.id);if(profile?.role!=="admin"){location.href="dashboard.html";throw new Error("Admin access required.")}return{user,profile}}
export async function signInWithGoogle(){const redirectTo=new URL("login.html",location.href).href;const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo,queryParams:{access_type:"offline",prompt:"select_account"}}});if(error)throw error}
export async function signOut(){await supabase.auth.signOut();location.href="index.html"}
export function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
export function publicMediaUrl(path){if(!path)return"";if(/^https?:\/\//i.test(path))return path;return supabase.storage.from("media").getPublicUrl(path).data.publicUrl}
