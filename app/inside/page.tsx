"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  ChevronLeft,
  CircleDot,
  Clock3,
  Crown,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  Home,
  Languages,
  LockKeyhole,
  LogOut,
  Megaphone,
  MessageCircle,
  PenLine,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
  Users,
} from "lucide-react";

import { AhedBrand } from "@/components/ahed-brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

import "./inside.css";

type Section = "home" | "discover" | "online" | "posts" | "requests" | "messages" | "saved" | "profile";
type ConversationItem = { id: string; partnerId?: string; name: string; headline: string; time: string; unread: number; isDemo: boolean };
type ChatMessage = { id: string; senderId: string; body: string; createdAt: string; readAt?: string | null };
type ConversationRow = { id: string; participant_a: string; participant_b: string; status: string; last_message_at: string };
type MessageRow = { id: number; sender_id: string; body: string; created_at: string; read_at: string | null };

type DiscoveryProfile = {
  id: string; code: string; displayName: string; age: number; country: string; city: string;
  maritalStatus: string; education: string; occupation: string; height: number;
  childrenStatus: string; wantsChildren: string; smoking: string; relocation: string; commitment: string;
  values: string[]; languages: string[]; bio: string; baseMatch: number; verified: boolean;
  isOnline: boolean; sponsored: boolean; isDemo: boolean;
};

type DiscoveryRow = {
  user_id: string; display_name: string; age: number; country: string; city: string | null;
  marital_status: string; education: string | null; occupation: string | null; height_cm: number | null;
  children_status: string; wants_children: string; smoking: string; relocation: string;
  religious_commitment: string; languages: string[]; family_values: string[]; bio: string | null;
  verification_status: string; boost_until: string | null;
};

type MarriagePost = {
  id: string; author: string; headline: string; body: string; partnerSummary: string; time: string;
  featured: boolean; status: "approved" | "pending" | "preview"; isDemo: boolean;
};

type MarriagePostRow = {
  id: number; user_id: string; headline: string; body: string; partner_summary: string;
  moderation_status: string; boost_until: string | null; created_at: string;
};

type SearchFilters = {
  ageMin: string; ageMax: string; country: string; maritalStatus: string; education: string;
  smoking: string; childrenStatus: string; commitment: string; nearMatches: boolean;
};

type MySpecs = {
  height: string; childrenStatus: string; wantsChildren: string; smoking: string;
  relocation: string; commitment: string; languages: string[]; values: string[];
};

type PartnerSpecs = {
  ageMin: string; ageMax: string; country: string; maritalStatus: string; education: string;
  heightMin: string; heightMax: string; childrenStatus: string; smoking: string;
  relocation: string; commitment: string; requiredFields: string[]; nearMatches: boolean;
};

const navItems: Array<{ id: Section; label: string; icon: typeof Home }> = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "discover", label: "البحث", icon: Search },
  { id: "online", label: "المتواجدون الآن", icon: Users },
  { id: "posts", label: "طلبات الزواج", icon: Megaphone },
  { id: "requests", label: "طلبات التعارف", icon: HeartHandshake },
  { id: "messages", label: "المحادثات", icon: MessageCircle },
  { id: "saved", label: "المحفوظات", icon: Heart },
  { id: "profile", label: "مواصفاتي", icon: UserRound },
];

const demoConversations: ConversationItem[] = [
  { id: "demo-1", name: "ملف تجريبي 01", headline: "آخر رسالة منذ 5 دقائق", time: "10:42", unread: 2, isDemo: true },
  { id: "demo-2", name: "ملف تجريبي 02", headline: "شكراً، يسعدني التعارف بوضوح", time: "أمس", unread: 0, isDemo: true },
  { id: "demo-3", name: "ملف تجريبي 03", headline: "تم قبول طلب التعارف", time: "الأحد", unread: 0, isDemo: true },
];

const demoMessages: Record<string, ChatMessage[]> = {
  "demo-1": [
    { id: "demo-message-1", senderId: "partner", body: "السلام عليكم، قرأت ملفك وأعجبني وضوح أهدافك.", createdAt: "10:35" },
    { id: "demo-message-2", senderId: "me", body: "وعليكم السلام، شكراً لك. الوضوح والجدية أهم شيء عندي.", createdAt: "10:38", readAt: "10:39" },
    { id: "demo-message-3", senderId: "partner", body: "ممتاز، ممكن نبدأ بأسئلة القيم ونظرتنا للحياة الأسرية.", createdAt: "10:42" },
  ],
  "demo-2": [{ id: "demo-message-4", senderId: "partner", body: "شكراً، يسعدني التعارف بوضوح واحترام.", createdAt: "أمس" }],
  "demo-3": [{ id: "demo-message-5", senderId: "system", body: "تم قبول طلب التعارف. أصبحت المحادثة متاحة للطرفين.", createdAt: "الأحد" }],
};

const demoProfiles: DiscoveryProfile[] = [
  {
    id: "demo-profile-1", code: "01", displayName: "حساب عَهْد 01", age: 29, country: "الإمارات", city: "دبي",
    maritalStatus: "single", education: "bachelor", occupation: "مجال تقني", height: 168,
    childrenStatus: "none", wantsChildren: "yes", smoking: "never", relocation: "gulf", commitment: "balanced",
    values: ["الاستقرار", "الوضوح", "العائلة"], languages: ["العربية", "الإنجليزية"],
    bio: "شخصية عملية وهادئة تبحث عن ارتباط واضح يقوم على الاحترام والمسؤولية.", baseMatch: 94,
    verified: true, isOnline: true, sponsored: true, isDemo: true,
  },
  {
    id: "demo-profile-2", code: "02", displayName: "حساب عَهْد 02", age: 32, country: "السعودية", city: "الرياض",
    maritalStatus: "single", education: "postgraduate", occupation: "مجال صحي", height: 174,
    childrenStatus: "none", wantsChildren: "yes", smoking: "never", relocation: "same_country", commitment: "committed",
    values: ["الدين", "الرحمة", "الطموح"], languages: ["العربية"],
    bio: "جاد في قرار الزواج ويقدّر الحوار الهادئ وبناء أسرة متعاونة ومستقرة.", baseMatch: 91,
    verified: true, isOnline: true, sponsored: false, isDemo: true,
  },
  {
    id: "demo-profile-3", code: "03", displayName: "حساب عَهْد 03", age: 27, country: "قطر", city: "الدوحة",
    maritalStatus: "single", education: "bachelor", occupation: "مجال تعليمي", height: 165,
    childrenStatus: "none", wantsChildren: "open", smoking: "never", relocation: "gulf", commitment: "balanced",
    values: ["التفاهم", "الصدق", "التطور"], languages: ["العربية", "الإنجليزية"],
    bio: "تحب التعلم والحياة العائلية الهادئة وترى أن التفاهم أساس الاختيار الصحيح.", baseMatch: 88,
    verified: false, isOnline: true, sponsored: false, isDemo: true,
  },
  {
    id: "demo-profile-4", code: "04", displayName: "حساب عَهْد 04", age: 35, country: "الكويت", city: "الكويت",
    maritalStatus: "divorced", education: "diploma", occupation: "إدارة أعمال", height: 178,
    childrenStatus: "has_children", wantsChildren: "open", smoking: "never", relocation: "not_possible", commitment: "committed",
    values: ["المسؤولية", "الصراحة", "الأسرة"], languages: ["العربية"],
    bio: "واضح بشأن تجربته السابقة ويبحث عن بداية ناضجة تحفظ كرامة الطرفين.", baseMatch: 84,
    verified: true, isOnline: false, sponsored: false, isDemo: true,
  },
  {
    id: "demo-profile-5", code: "05", displayName: "حساب عَهْد 05", age: 30, country: "البحرين", city: "المنامة",
    maritalStatus: "single", education: "bachelor", occupation: "تصميم", height: 170,
    childrenStatus: "none", wantsChildren: "yes", smoking: "occasionally", relocation: "open", commitment: "balanced",
    values: ["الإبداع", "الاحترام", "الاستقرار"], languages: ["العربية", "الإنجليزية"],
    bio: "شخصية اجتماعية متزنة تبحث عن شريك جاد يقدّر المساحة الشخصية والعائلة.", baseMatch: 82,
    verified: false, isOnline: true, sponsored: false, isDemo: true,
  },
  {
    id: "demo-profile-6", code: "06", displayName: "حساب عَهْد 06", age: 38, country: "عُمان", city: "مسقط",
    maritalStatus: "widowed", education: "postgraduate", occupation: "مجال قانوني", height: 180,
    childrenStatus: "has_children", wantsChildren: "open", smoking: "never", relocation: "same_country", commitment: "very_committed",
    values: ["الأمانة", "السكينة", "العائلة"], languages: ["العربية", "الإنجليزية"],
    bio: "يبحث عن علاقة جادة ومحترمة يكون فيها النضج والتعاون أساس الحياة اليومية.", baseMatch: 79,
    verified: true, isOnline: false, sponsored: false, isDemo: true,
  },
];

const demoPosts: MarriagePost[] = [
  {
    id: "demo-post-1", author: "حساب عَهْد 08", headline: "أبحث عن شراكة هادئة وجادة",
    body: "مقيمة في الإمارات، أقدّر الحوار الصريح والحياة الأسرية المتوازنة وأبحث عن زواج واضح النية.",
    partnerSummary: "جاد، مسؤول، غير مدخن، ويقدّر الاستقرار العائلي.", time: "منذ ساعة", featured: true,
    status: "approved", isDemo: true,
  },
  {
    id: "demo-post-2", author: "حساب عَهْد 12", headline: "بداية ناضجة أساسها التفاهم",
    body: "أعمل في المجال الصحي وأرغب في التعارف الجاد ضمن حدود واضحة وصولاً إلى قرار زواج متأنٍ.",
    partnerSummary: "متعلمة، واضحة، مستعدة لبناء أسرة متعاونة.", time: "اليوم", featured: false,
    status: "approved", isDemo: true,
  },
  {
    id: "demo-post-3", author: "حساب عَهْد 17", headline: "الاحترام قبل أي شيء",
    body: "شخصية عملية وهادئة من الخليج، أبحث عن شريك يحترم الخصوصية ويؤمن بالحوار والمسؤولية المشتركة.",
    partnerSummary: "هادئ، صادق، لديه هدف واضح من وجوده في التطبيق.", time: "أمس", featured: false,
    status: "approved", isDemo: true,
  },
];

const educationLabels: Record<string, string> = { secondary: "ثانوي", diploma: "دبلوم", bachelor: "جامعي", postgraduate: "دراسات عليا" };
const defaultFilters: SearchFilters = { ageMin: "25", ageMax: "38", country: "all", maritalStatus: "all", education: "all", smoking: "never", childrenStatus: "all", commitment: "all", nearMatches: true };
const defaultMySpecs: MySpecs = { height: "168", childrenStatus: "none", wantsChildren: "yes", smoking: "never", relocation: "gulf", commitment: "balanced", languages: ["العربية"], values: ["الاستقرار", "الوضوح"] };
const defaultPartnerSpecs: PartnerSpecs = { ageMin: "27", ageMax: "38", country: "all", maritalStatus: "all", education: "all", heightMin: "160", heightMax: "190", childrenStatus: "all", smoking: "never", relocation: "all", commitment: "all", requiredFields: ["العمر", "التدخين"], nearMatches: true };

function Brand() {
  return (
    <div className="inside-brand" aria-label="شعار عَهْد" role="img">
      <AhedBrand alt="" className="inside-brand-logo" />
    </div>
  );
}

function formatConversationTime(value: string) {
  return new Intl.DateTimeFormat("ar-AE", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function mapMessage(row: MessageRow): ChatMessage {
  return { id: String(row.id), senderId: row.sender_id, body: row.body, createdAt: formatConversationTime(row.created_at), readAt: row.read_at };
}

function SelectField({ label, value, onChange, children, hint }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode; hint?: string }) {
  return <label className="inside-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>{hint ? <small>{hint}</small> : null}</label>;
}

function ProfileCard({ profile, saved, exact, score, onSave, onOpen }: { profile: DiscoveryProfile; saved: boolean; exact?: boolean; score?: number; onSave: () => void; onOpen: () => void }) {
  const visibleScore = score ?? profile.baseMatch;
  return (
    <article className={profile.sponsored ? "recommendation-card is-sponsored" : "recommendation-card"}>
      {profile.sponsored ? <span className="sponsored-ribbon"><Crown /> مميّز</span> : null}
      <div className="recommendation-card__top"><span className={profile.isOnline ? "recommendation-avatar is-online" : "recommendation-avatar"}>ع{profile.code}</span><span className={exact === false ? "match-badge is-near" : "match-badge"}>{exact === false ? "قريب " : "توافق "}{visibleScore}%</span></div>
      <div className="profile-card-copy">
        <div className="profile-card-labels">{profile.isDemo ? <span className="demo-label">ملف تجريبي</span> : null}{profile.verified ? <span className="verified-label"><BadgeCheck /> موثّق</span> : null}{profile.isOnline ? <span className="online-label"><CircleDot /> متواجد الآن</span> : null}</div>
        <h3>{profile.displayName}</h3><p>{profile.age} سنة · {profile.country} · {profile.city}</p><small>{profile.occupation} · {educationLabels[profile.education] ?? profile.education}</small>
        <div className="profile-traits">{profile.values.slice(0, 3).map((value) => <span key={value}>{value}</span>)}</div>
      </div>
      <div className="recommendation-actions"><button type="button" className={saved ? "save-button is-saved" : "save-button"} aria-label="حفظ الملف" onClick={onSave}><Heart /></button><button type="button" className="profile-button" onClick={onOpen}>عرض الملف <ChevronLeft /></button></div>
    </article>
  );
}

export default function InsidePage() {
  const [section, setSection] = useState<Section>("home");
  const [conversations, setConversations] = useState<ConversationItem[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState(demoConversations[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages[demoConversations[0].id]);
  const [messageDraft, setMessageDraft] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [mode, setMode] = useState<"demo" | "live" | "empty">("demo");
  const [chatError, setChatError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [notice, setNotice] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filterDraft, setFilterDraft] = useState<SearchFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(defaultFilters);
  const [liveProfiles, setLiveProfiles] = useState<DiscoveryProfile[]>([]);
  const [onlineIds, setOnlineIds] = useState<string[]>([]);
  const [showOnline, setShowOnline] = useState(true);
  const [posts, setPosts] = useState<MarriagePost[]>(demoPosts);
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [postDraft, setPostDraft] = useState({ headline: "", body: "", partnerSummary: "" });
  const [mySpecs, setMySpecs] = useState<MySpecs>(defaultMySpecs);
  const [partnerSpecs, setPartnerSpecs] = useState<PartnerSpecs>(defaultPartnerSpecs);
  const [specTab, setSpecTab] = useState<"mine" | "partner">("mine");

  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId), [activeConversationId, conversations]);
  const availableProfiles = useMemo(() => liveProfiles.length === 0 ? demoProfiles : liveProfiles.map((profile) => ({ ...profile, isOnline: onlineIds.includes(profile.id) })), [liveProfiles, onlineIds]);
  const searchResults = useMemo(() => {
    const min = Number(appliedFilters.ageMin) || 18;
    const max = Number(appliedFilters.ageMax) || 80;
    return availableProfiles.map((profile) => {
      const checks = [
        profile.age >= min && profile.age <= max,
        appliedFilters.country === "all" || profile.country === appliedFilters.country,
        appliedFilters.maritalStatus === "all" || profile.maritalStatus === appliedFilters.maritalStatus,
        appliedFilters.education === "all" || profile.education === appliedFilters.education,
        appliedFilters.smoking === "all" || profile.smoking === appliedFilters.smoking,
        appliedFilters.childrenStatus === "all" || profile.childrenStatus === appliedFilters.childrenStatus,
        appliedFilters.commitment === "all" || profile.commitment === appliedFilters.commitment,
      ];
      const passed = checks.filter(Boolean).length;
      const exact = passed === checks.length;
      const score = Math.min(99, Math.max(58, Math.round((passed / checks.length) * 72 + profile.baseMatch * 0.28)));
      return { profile, exact, score };
    }).filter((result) => appliedFilters.nearMatches || result.exact).sort((a, b) => Number(b.profile.sponsored) - Number(a.profile.sponsored) || Number(b.exact) - Number(a.exact) || b.score - a.score);
  }, [appliedFilters, availableProfiles]);
  const onlineProfiles = useMemo(() => availableProfiles.filter((profile) => profile.isOnline), [availableProfiles]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    const supabase = getSupabaseClient();
    async function loadAccount() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled || !session?.user) return;
      const userId = session.user.id;
      setCurrentUserId(userId);
      const { data, error } = await supabase.from("conversations").select("id, participant_a, participant_b, status, last_message_at").order("last_message_at", { ascending: false });
      if (cancelled || error) return;
      const rows = (data ?? []) as ConversationRow[];
      if (rows.length === 0) { setMode("empty"); setConversations([]); setMessages([]); return; }
      const liveConversations = rows.map((row, index) => ({
        id: row.id, partnerId: row.participant_a === userId ? row.participant_b : row.participant_a,
        name: `حساب عَهْد ${String(index + 1).padStart(2, "0")}`,
        headline: row.status === "active" ? "محادثة خاصة بعد قبول متبادل" : "المحادثة مغلقة",
        time: formatConversationTime(row.last_message_at), unread: 0, isDemo: false,
      }));
      setMode("live"); setConversations(liveConversations); setActiveConversationId(liveConversations[0].id);
    }
    void loadAccount();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!currentUserId || !isSupabaseConfigured) return;
    let cancelled = false;
    const supabase = getSupabaseClient();
    async function loadFeatures() {
      const [profilesResult, postsResult, settingsResult, myResult, partnerResult] = await Promise.all([
        supabase.from("discovery_profiles").select("user_id, display_name, age, country, city, marital_status, education, occupation, height_cm, children_status, wants_children, smoking, relocation, religious_commitment, languages, family_values, bio, verification_status, boost_until").eq("is_visible", true).eq("moderation_status", "approved"),
        supabase.from("marriage_posts").select("id, user_id, headline, body, partner_summary, moderation_status, boost_until, created_at").order("created_at", { ascending: false }).limit(30),
        supabase.from("presence_settings").select("show_online").eq("user_id", currentUserId).maybeSingle(),
        supabase.from("profile_attributes").select("height_cm, children_status, wants_children, smoking, relocation, religious_commitment, languages, family_values").eq("user_id", currentUserId).maybeSingle(),
        supabase.from("partner_preferences").select("age_min, age_max, countries, marital_statuses, education_levels, height_min, height_max, children_preferences, smoking_preferences, relocation_preferences, religious_commitment_levels, required_fields, allow_near_matches").eq("user_id", currentUserId).maybeSingle(),
      ]);
      if (cancelled) return;
      if (profilesResult.error || postsResult.error) setFeatureError("تعذّر تحميل بعض ميزات البحث الآن.");
      const mappedProfiles = ((profilesResult.data ?? []) as DiscoveryRow[]).map((row, index) => ({
        id: row.user_id, code: String(index + 1).padStart(2, "0"), displayName: row.display_name,
        age: row.age, country: row.country, city: row.city ?? "—", maritalStatus: row.marital_status,
        education: row.education ?? "—", occupation: row.occupation ?? "غير محدد", height: row.height_cm ?? 0,
        childrenStatus: row.children_status, wantsChildren: row.wants_children, smoking: row.smoking,
        relocation: row.relocation, commitment: row.religious_commitment, values: row.family_values ?? [],
        languages: row.languages ?? [], bio: row.bio ?? "", baseMatch: 80,
        verified: row.verification_status === "verified", isOnline: false,
        sponsored: Boolean(row.boost_until && new Date(row.boost_until) > new Date()), isDemo: false,
      }));
      setLiveProfiles(mappedProfiles);
      const mappedPosts = ((postsResult.data ?? []) as MarriagePostRow[]).map((row) => ({
        id: String(row.id), author: `عضو عَهْد ${row.user_id.slice(0, 4)}`, headline: row.headline,
        body: row.body, partnerSummary: row.partner_summary,
        time: new Intl.DateTimeFormat("ar-AE", { dateStyle: "medium" }).format(new Date(row.created_at)),
        featured: Boolean(row.boost_until && new Date(row.boost_until) > new Date()),
        status: row.moderation_status === "approved" ? "approved" as const : "pending" as const, isDemo: false,
      }));
      if (mappedPosts.length) setPosts(mappedPosts);
      if (settingsResult.data) setShowOnline(Boolean(settingsResult.data.show_online));
      if (myResult.data) setMySpecs({ height: String(myResult.data.height_cm ?? ""), childrenStatus: myResult.data.children_status, wantsChildren: myResult.data.wants_children, smoking: myResult.data.smoking, relocation: myResult.data.relocation, commitment: myResult.data.religious_commitment, languages: myResult.data.languages ?? [], values: myResult.data.family_values ?? [] });
      if (partnerResult.data) setPartnerSpecs({
        ageMin: String(partnerResult.data.age_min), ageMax: String(partnerResult.data.age_max), country: partnerResult.data.countries?.[0] ?? "all",
        maritalStatus: partnerResult.data.marital_statuses?.[0] ?? "all", education: partnerResult.data.education_levels?.[0] ?? "all",
        heightMin: String(partnerResult.data.height_min ?? ""), heightMax: String(partnerResult.data.height_max ?? ""),
        childrenStatus: partnerResult.data.children_preferences?.[0] ?? "all", smoking: partnerResult.data.smoking_preferences?.[0] ?? "all",
        relocation: partnerResult.data.relocation_preferences?.[0] ?? "all", commitment: partnerResult.data.religious_commitment_levels?.[0] ?? "all",
        requiredFields: partnerResult.data.required_fields ?? [], nearMatches: partnerResult.data.allow_near_matches,
      });
    }
    void loadFeatures();
    return () => { cancelled = true; };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId || !isSupabaseConfigured) return;
    const supabase = getSupabaseClient();
    let stopped = false;
    async function refreshPresence() {
      await supabase.from("presence_sessions").upsert({ user_id: currentUserId, visible: showOnline }, { onConflict: "user_id" });
      const { data } = await supabase.from("presence_sessions").select("user_id");
      if (!stopped) setOnlineIds(((data ?? []) as Array<{ user_id: string }>).map((row) => row.user_id));
    }
    void refreshPresence();
    const timer = window.setInterval(() => { void refreshPresence(); }, 45000);
    return () => { stopped = true; window.clearInterval(timer); void supabase.from("presence_sessions").delete().eq("user_id", currentUserId); };
  }, [currentUserId, showOnline]);

  useEffect(() => {
    if (activeConversationId.startsWith("demo-") || !currentUserId || !isSupabaseConfigured) return;
    const supabase = getSupabaseClient();
    let active = true;
    async function loadMessages() {
      const { data, error } = await supabase.from("messages").select("id, sender_id, body, created_at, read_at").eq("conversation_id", activeConversationId).order("created_at", { ascending: true });
      if (!active) return;
      if (error) { setChatError("تعذّر تحميل الرسائل الآن."); return; }
      setMessages(((data ?? []) as MessageRow[]).map(mapMessage));
    }
    void loadMessages();
    const channel = supabase.channel(`ahed-chat-${activeConversationId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConversationId}` }, (payload) => {
      const incoming = mapMessage(payload.new as MessageRow);
      setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [...current, incoming]);
    }).subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, [activeConversationId, currentUserId]);

  const openConversation = (conversation: ConversationItem) => {
    setChatError("");
    if (conversation.isDemo) setMessages(demoMessages[conversation.id] ?? []);
    setActiveConversationId(conversation.id); setSection("messages");
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = messageDraft.trim();
    if (!body || !activeConversation) return;
    setMessageDraft(""); setChatError("");
    if (activeConversation.isDemo || !currentUserId) {
      setMessages((current) => [...current, { id: `local-${Date.now()}`, senderId: "me", body, createdAt: new Intl.DateTimeFormat("ar-AE", { hour: "2-digit", minute: "2-digit" }).format(new Date()), readAt: null }]);
      return;
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("messages").insert({ conversation_id: activeConversation.id, sender_id: currentUserId, body }).select("id, sender_id, body, created_at, read_at").single();
    if (error) { setMessageDraft(body); setChatError("لم تُرسل الرسالة. حاولي مرة أخرى."); return; }
    const sent = mapMessage(data as MessageRow);
    setMessages((current) => current.some((message) => message.id === sent.id) ? current : [...current, sent]);
  };

  const applySearch = () => { setAppliedFilters(filterDraft); setSection("discover"); setNotice("تم ترتيب النتائج حسب مواصفاتك."); };
  const toggleSaved = (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const updateOnlinePreference = async () => {
    const next = !showOnline; setShowOnline(next);
    if (currentUserId && isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("presence_settings").upsert({ user_id: currentUserId, show_online: next }, { onConflict: "user_id" });
      await supabase.from("presence_sessions").upsert({ user_id: currentUserId, visible: next }, { onConflict: "user_id" });
      setNotice(error ? "تعذّر تحديث حالة الظهور." : next ? "أصبحتِ ظاهرة ضمن المتواجدين الآن." : "تم إخفاء حالة تواجدك.");
    } else setNotice(next ? "تم تشغيل الظهور في وضع المعاينة." : "تم إخفاء الظهور في وضع المعاينة.");
  };

  const saveMySpecs = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUserId || !isSupabaseConfigured) { setNotice("تم حفظ المواصفات داخل المعاينة. تُربط بالحساب بعد تسجيل الدخول."); return; }
    const { error } = await getSupabaseClient().from("profile_attributes").upsert({ user_id: currentUserId, height_cm: Number(mySpecs.height) || null, children_status: mySpecs.childrenStatus, wants_children: mySpecs.wantsChildren, smoking: mySpecs.smoking, relocation: mySpecs.relocation, religious_commitment: mySpecs.commitment, languages: mySpecs.languages, family_values: mySpecs.values });
    setNotice(error ? "تعذّر حفظ مواصفاتك الآن." : "تم حفظ مواصفاتك بأمان.");
  };

  const savePartnerSpecs = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFilters: SearchFilters = { ageMin: partnerSpecs.ageMin, ageMax: partnerSpecs.ageMax, country: partnerSpecs.country, maritalStatus: partnerSpecs.maritalStatus, education: partnerSpecs.education, smoking: partnerSpecs.smoking, childrenStatus: partnerSpecs.childrenStatus, commitment: partnerSpecs.commitment, nearMatches: partnerSpecs.nearMatches };
    setFilterDraft(nextFilters); setAppliedFilters(nextFilters);
    if (!currentUserId || !isSupabaseConfigured) { setNotice("تم حفظ مواصفات الشريك وتطبيقها على البحث في المعاينة."); return; }
    const singleton = (value: string) => value === "all" ? [] : [value];
    const { error } = await getSupabaseClient().from("partner_preferences").upsert({ user_id: currentUserId, age_min: Number(partnerSpecs.ageMin), age_max: Number(partnerSpecs.ageMax), countries: singleton(partnerSpecs.country), marital_statuses: singleton(partnerSpecs.maritalStatus), education_levels: singleton(partnerSpecs.education), height_min: Number(partnerSpecs.heightMin) || null, height_max: Number(partnerSpecs.heightMax) || null, children_preferences: singleton(partnerSpecs.childrenStatus), smoking_preferences: singleton(partnerSpecs.smoking), relocation_preferences: singleton(partnerSpecs.relocation), religious_commitment_levels: singleton(partnerSpecs.commitment), required_fields: partnerSpecs.requiredFields, allow_near_matches: partnerSpecs.nearMatches });
    setNotice(error ? "تعذّر حفظ مواصفات الشريك الآن." : "تم حفظ مواصفات الشريك وتطبيقها على البحث.");
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { headline, body, partnerSummary } = postDraft;
    const contactPattern = /(?:\+?\d[\d\s-]{6,}|@|واتس|تلغرام|تليغرام|انستغرام|سناب|\.com)/i;
    if (contactPattern.test(`${headline} ${body} ${partnerSummary}`)) { setNotice("احذفي رقم الهاتف أو وسيلة التواصل؛ التواصل يتم داخل عَهْد فقط."); return; }
    if (headline.trim().length < 8 || body.trim().length < 30 || partnerSummary.trim().length < 15) { setNotice("أكملي وصف الطلب ومواصفات الشريك بشكل أوضح قبل الإرسال."); return; }
    if (currentUserId && isSupabaseConfigured) {
      const { error } = await getSupabaseClient().from("marriage_posts").insert({ user_id: currentUserId, headline: headline.trim(), body: body.trim(), partner_summary: partnerSummary.trim() });
      if (error) { setNotice("تعذّر إرسال الطلب للمراجعة الآن."); return; }
      setPosts((current) => [{ id: `pending-${Date.now()}`, author: "طلبك", headline, body, partnerSummary, time: "الآن", featured: false, status: "pending", isDemo: false }, ...current]);
      setNotice("تم إرسال طلب الزواج للمراجعة، ولن يظهر للآخرين قبل اعتماده.");
    } else {
      setPosts((current) => [{ id: `preview-${Date.now()}`, author: "معاينة طلبك", headline, body, partnerSummary, time: "الآن", featured: false, status: "preview", isDemo: false }, ...current]);
      setNotice("أضيف الطلب للمعاينة فقط؛ الإرسال الفعلي يتطلب تسجيل الدخول.");
    }
    setPostDraft({ headline: "", body: "", partnerSummary: "" }); setPostFormOpen(false);
  };

  const requestBoost = async (placement: "search" | "post") => {
    if (!currentUserId || !isSupabaseConfigured) { setNotice("طلب الظهور المميّز جاهز، ويُرسل فعلياً بعد تسجيل الدخول."); return; }
    const { error } = await getSupabaseClient().from("visibility_boosts").insert({ user_id: currentUserId, placement, duration_days: 3 });
    setNotice(error ? "تعذّر إرسال طلب الظهور المميّز." : "تم تسجيل طلب الظهور المميّز. ستظهر المدة والسعر قبل أي دفع.");
  };

  const toggleArrayValue = (values: string[], value: string) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  return (
    <main className="inside-app" dir="rtl">
      <aside className="inside-sidebar">
        <Brand />
        <div className="inside-profile-chip"><span className="inside-avatar">أ</span><span><strong>حساب المعاينة</strong><small><BadgeCheck /> ملف موثّق</small></span></div>
        <nav className="inside-nav" aria-label="القائمة الرئيسية">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={section === item.id ? "is-active" : ""} onClick={() => setSection(item.id)}><Icon /><span>{item.label}</span>{item.id === "messages" ? <b className="nav-count">2</b> : null}{item.id === "online" ? <b className="nav-live-dot" /> : null}</button>;
          })}
        </nav>
        <div className="inside-safety"><ShieldCheck /><span><strong>مساحتك محمية</strong><small>لا محادثة إلا بعد القبول المتبادل</small></span></div>
        <Link className="inside-logout" href="/"><LogOut /> العودة للتسجيل</Link>
      </aside>

      <section className="inside-main">
        <header className="inside-topbar">
          <div className="inside-mobile-brand"><Brand /></div>
          <form className="inside-search" onSubmit={(event) => { event.preventDefault(); applySearch(); }}><Search /><Input aria-label="البحث" placeholder="ابحث بالمواصفات..." /></form>
          <div className="inside-top-actions"><button type="button" aria-label="الإشعارات"><Bell /><span /></button><div className="inside-stage"><Sparkles /> النسخة التأسيسية</div></div>
        </header>

        <div className="inside-preview-notice"><Shield /><p><strong>معاينة الهيكل الداخلي المطوّر</strong>الملفات والإعلانات الموسومة «تجريبي» ليست لأشخاص حقيقيين.</p><span>{mode === "live" ? "بيانات الحساب الفعلية" : mode === "empty" ? "حساب فعلي بلا محادثات" : "وضع المعاينة"}</span></div>
        {notice ? <button type="button" className="inside-toast" onClick={() => setNotice("")}><Check />{notice}<span>×</span></button> : null}
        {featureError ? <p className="inside-inline-error">{featureError}</p> : null}

        {section === "home" ? (
          <div className="inside-content">
            <section className="inside-welcome inside-welcome--rich">
              <div><span className="inside-eyebrow">مساحة زواج جاد</span><h1>اختيار أوضح، ونتائج أقرب لما تريدينه.</h1><p>حددي مواصفاتك ومواصفات الشريك، ثم دعي عَهْد يرتّب لك المطابقات والطلبات الجادة ضمن مساحة آمنة.</p></div>
              <Button className="inside-primary-button" onClick={() => setSection("profile")}>أكملي مواصفاتك <ChevronLeft /></Button>
            </section>

            <section className="quick-match-panel">
              <div className="quick-match-title"><span><Target /></span><div><small>بحث سريع</small><h2>من هو الشريك الذي تبحثين عنه؟</h2></div></div>
              <div className="quick-match-fields">
                <label><span>العمر من</span><Input inputMode="numeric" value={filterDraft.ageMin} onChange={(event) => setFilterDraft({ ...filterDraft, ageMin: event.target.value })} /></label>
                <label><span>إلى</span><Input inputMode="numeric" value={filterDraft.ageMax} onChange={(event) => setFilterDraft({ ...filterDraft, ageMax: event.target.value })} /></label>
                <label><span>الدولة</span><select value={filterDraft.country} onChange={(event) => setFilterDraft({ ...filterDraft, country: event.target.value })}><option value="all">كل الدول</option><option>الإمارات</option><option>السعودية</option><option>قطر</option><option>الكويت</option><option>البحرين</option><option>عُمان</option></select></label>
                <label><span>الحالة</span><select value={filterDraft.maritalStatus} onChange={(event) => setFilterDraft({ ...filterDraft, maritalStatus: event.target.value })}><option value="all">الكل</option><option value="single">أعزب/عزباء</option><option value="divorced">مطلق/مطلقة</option><option value="widowed">أرمل/أرملة</option></select></label>
                <Button type="button" onClick={applySearch}><Search /> ابحث بالمواصفات</Button>
              </div>
            </section>

            <section className="inside-stats inside-stats--four" aria-label="ملخص الحساب">
              <article><span className="stat-icon stat-icon--spark"><Sparkles /></span><div><small>مطابقات قوية</small><strong>{searchResults.filter((result) => result.exact).length}</strong><p>حسب مواصفاتك</p></div></article>
              <article><span className="stat-icon stat-icon--online"><Users /></span><div><small>متواجدون الآن</small><strong>{onlineProfiles.length}</strong><p>مع خيار إخفاء الظهور</p></div></article>
              <article><span className="stat-icon stat-icon--heart"><HeartHandshake /></span><div><small>طلبات تعارف</small><strong>4</strong><p>بانتظار المراجعة</p></div></article>
              <article><span className="stat-icon stat-icon--chat"><MessageCircle /></span><div><small>رسائل جديدة</small><strong>2</strong><p>في محادثة واحدة</p></div></article>
            </section>

            <section className="inside-section">
              <div className="inside-section__head"><div><span className="inside-eyebrow">نشطون الآن</span><h2>متواجدون ويمكن إرسال طلب تعارف لهم</h2></div><button type="button" onClick={() => setSection("online")}>عرض الكل <ChevronLeft /></button></div>
              <div className="online-strip">
                {onlineProfiles.slice(0, 5).map((profile) => <button type="button" key={profile.id} onClick={() => setSection("online")}><span className="online-ring">ع{profile.code}<b /></span><strong>{profile.displayName}</strong><small>{profile.age} · {profile.country}</small>{profile.isDemo ? <em>تجريبي</em> : null}</button>)}
              </div>
            </section>

            <section className="inside-section">
              <div className="inside-section__head"><div><span className="inside-eyebrow">الأقرب لك</span><h2>نتائج مرتبة حسب مواصفات الشريك</h2></div><button type="button" onClick={() => setSection("discover")}>بحث متقدم <SlidersHorizontal /></button></div>
              <div className="recommendation-grid">{searchResults.slice(0, 3).map(({ profile, exact, score }) => <ProfileCard key={profile.id} profile={profile} exact={exact} score={score} saved={savedIds.includes(profile.id)} onSave={() => toggleSaved(profile.id)} onOpen={() => setSection("requests")} />)}</div>
            </section>

            <section className="inside-home-grid inside-home-grid--features">
              <article className="post-preview-card">
                <div className="inside-section__head inside-section__head--compact"><div><span className="inside-eyebrow">طلبات الزواج</span><h2>أعضاء يعلنون نيتهم بوضوح</h2></div><button type="button" onClick={() => setSection("posts")}>فتح <ChevronLeft /></button></div>
                {posts.slice(0, 2).map((post) => <div className="mini-post" key={post.id}><span>{post.featured ? <Crown /> : <Megaphone />}</span><div><small>{post.isDemo ? "طلب تجريبي" : post.status === "pending" ? "قيد المراجعة" : "طلب معتمد"}</small><strong>{post.headline}</strong><p>{post.partnerSummary}</p></div></div>)}
              </article>
              <article className="boost-card"><span className="boost-card__icon"><Crown /></span><span className="inside-eyebrow">ظهور مميّز بشفافية</span><h2>ارفعي فرص ظهور ملفك.</h2><p>يوسم الملف بكلمة «مميّز» بوضوح، ويبقى ملتزماً بشروط البحث الأساسية للمستخدم.</p><ul><li><Check /> لا يتجاوز المواصفات الإلزامية</li><li><Check /> المدة والسعر يظهران قبل الدفع</li><li><Check /> لا يمنح توثيقاً مزيفاً</li></ul><button type="button" onClick={() => void requestBoost("search")}>طلب ظهور مميّز <ChevronLeft /></button></article>
            </section>
          </div>
        ) : null}

        {section === "discover" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">بحث مفصّل ومحترم</span><h1>البحث بالمواصفات</h1><p>اختاري الشروط المهمة، وسنوضح لك الفرق بين المطابقة الكاملة والنتيجة القريبة.</p></div><button type="button" onClick={() => setSection("profile")}><Save /> حفظ كمواصفات الشريك</button></section>
            <div className="discovery-layout">
              <aside className="advanced-filters">
                <div className="filter-title"><SlidersHorizontal /><div><strong>تصفية النتائج</strong><small>يمكنك تغييرها في أي وقت</small></div></div>
                <div className="filter-age-row"><label><span>العمر من</span><Input inputMode="numeric" value={filterDraft.ageMin} onChange={(event) => setFilterDraft({ ...filterDraft, ageMin: event.target.value })} /></label><label><span>إلى</span><Input inputMode="numeric" value={filterDraft.ageMax} onChange={(event) => setFilterDraft({ ...filterDraft, ageMax: event.target.value })} /></label></div>
                <SelectField label="الدولة" value={filterDraft.country} onChange={(country) => setFilterDraft({ ...filterDraft, country })}><option value="all">كل الدول</option><option>الإمارات</option><option>السعودية</option><option>قطر</option><option>الكويت</option><option>البحرين</option><option>عُمان</option></SelectField>
                <SelectField label="الحالة الاجتماعية" value={filterDraft.maritalStatus} onChange={(maritalStatus) => setFilterDraft({ ...filterDraft, maritalStatus })}><option value="all">الكل</option><option value="single">أعزب/عزباء</option><option value="divorced">مطلق/مطلقة</option><option value="widowed">أرمل/أرملة</option></SelectField>
                <SelectField label="التعليم" value={filterDraft.education} onChange={(education) => setFilterDraft({ ...filterDraft, education })}><option value="all">كل المستويات</option><option value="secondary">ثانوي</option><option value="diploma">دبلوم</option><option value="bachelor">جامعي</option><option value="postgraduate">دراسات عليا</option></SelectField>
                <SelectField label="التدخين" value={filterDraft.smoking} onChange={(smoking) => setFilterDraft({ ...filterDraft, smoking })}><option value="all">غير مهم</option><option value="never">غير مدخن</option><option value="occasionally">أحياناً</option><option value="yes">مدخن</option></SelectField>
                <SelectField label="الأطفال" value={filterDraft.childrenStatus} onChange={(childrenStatus) => setFilterDraft({ ...filterDraft, childrenStatus })}><option value="all">غير مهم</option><option value="none">لا يوجد أطفال</option><option value="has_children">لديه أطفال</option></SelectField>
                <SelectField label="الالتزام" value={filterDraft.commitment} onChange={(commitment) => setFilterDraft({ ...filterDraft, commitment })}><option value="all">كل المستويات</option><option value="balanced">متوازن</option><option value="committed">ملتزم</option><option value="very_committed">ملتزم جداً</option></SelectField>
                <button type="button" className={filterDraft.nearMatches ? "near-match-toggle is-on" : "near-match-toggle"} onClick={() => setFilterDraft({ ...filterDraft, nearMatches: !filterDraft.nearMatches })}><span>{filterDraft.nearMatches ? <Check /> : null}</span><div><strong>إظهار نتائج قريبة</strong><small>عندما لا تتوفر مطابقة كاملة</small></div></button>
                <Button type="button" className="filter-submit" onClick={applySearch}><Search /> تطبيق البحث</Button>
                <button type="button" className="filter-reset" onClick={() => { setFilterDraft(defaultFilters); setAppliedFilters(defaultFilters); }}><RotateCcw /> إعادة الضبط</button>
              </aside>
              <section className="discovery-results">
                <div className="results-summary"><div><strong>{searchResults.length} نتيجة</strong><span><b /> مطابقة كاملة</span><span><b className="near" /> نتيجة قريبة</span></div><small>الملف المميّز لا يتجاوز شروطك الأساسية</small></div>
                <div className="recommendation-grid recommendation-grid--wide">{searchResults.map(({ profile, exact, score }) => <ProfileCard key={profile.id} profile={profile} exact={exact} score={score} saved={savedIds.includes(profile.id)} onSave={() => toggleSaved(profile.id)} onOpen={() => setSection("requests")} />)}</div>
                {searchResults.length === 0 ? <div className="inside-empty inside-empty--large"><Search /><strong>لا توجد مطابقة كاملة</strong><p>فعّلي خيار النتائج القريبة أو عدّلي أحد الشروط.</p></div> : null}
              </section>
            </div>
          </div>
        ) : null}

        {section === "online" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">حضور اختياري وآمن</span><h1>المتواجدون الآن</h1><p>تظهر هنا الحسابات التي اختارت إظهار حضورها، من دون حفظ سجل آخر ظهور للآخرين.</p></div></section>
            <section className="presence-privacy-card"><div className="presence-privacy-icon">{showOnline ? <Eye /> : <EyeOff />}</div><div><small>خصوصية الظهور</small><h2>{showOnline ? "أنتِ ظاهرة ضمن المتواجدين الآن" : "حالة تواجدك مخفية"}</h2><p>يمكنك استقبال الطلبات حتى عند إخفاء الظهور، ولن يظهر وقت دخولك أو خروجك.</p></div><button type="button" className={showOnline ? "privacy-switch is-on" : "privacy-switch"} onClick={() => void updateOnlinePreference()}><span />{showOnline ? "إظهار تواجدي" : "إخفاء تواجدي"}</button></section>
            <div className="online-page-head"><div><span className="live-pulse" />{onlineProfiles.length} متواجدون الآن</div><small>تُحدّث الحالة تلقائياً</small></div>
            <div className="recommendation-grid recommendation-grid--wide">{onlineProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} saved={savedIds.includes(profile.id)} onSave={() => toggleSaved(profile.id)} onOpen={() => setSection("requests")} />)}</div>
          </div>
        ) : null}

        {section === "posts" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">إعلانات نية الزواج</span><h1>طلبات الزواج</h1><p>طلبات جادة ومراجَعة، بلا أرقام هاتف أو حسابات تواصل خارجية.</p></div><button type="button" onClick={() => setPostFormOpen((open) => !open)}><Plus /> إنشاء طلب</button></section>
            <div className="posts-toolbar"><button type="button" className="is-active">الأحدث</button><button type="button">الأقرب لمواصفاتي</button><button type="button">المميّزة</button><span>كل طلب يمر بالمراجعة قبل نشره</span></div>
            {postFormOpen ? (
              <form className="post-composer-card" onSubmit={submitPost}>
                <div className="post-composer-head"><span><PenLine /></span><div><small>طلب جديد</small><h2>اكتبي نيتك بوضوح واختصار</h2></div></div>
                <label><span>عنوان الطلب</span><Input minLength={8} maxLength={90} value={postDraft.headline} onChange={(event) => setPostDraft({ ...postDraft, headline: event.target.value })} placeholder="مثال: أبحث عن شراكة هادئة وجادة" /></label>
                <label><span>نبذة عنك وعن هدفك</span><textarea minLength={30} maxLength={700} value={postDraft.body} onChange={(event) => setPostDraft({ ...postDraft, body: event.target.value })} placeholder="اكتبي ما يهم الشريك معرفته عنك وعن رؤيتك للحياة الزوجية..." /></label>
                <label><span>مواصفات الشريك باختصار</span><textarea minLength={15} maxLength={300} value={postDraft.partnerSummary} onChange={(event) => setPostDraft({ ...postDraft, partnerSummary: event.target.value })} placeholder="القيم والصفات الأساسية التي تبحثين عنها..." /></label>
                <div className="post-rules"><ShieldCheck /><p><strong>لا تضعي رقم هاتف أو حساب تواصل.</strong>سيبقى التواصل داخل عَهْد وبعد القبول المتبادل فقط.</p></div>
                <div className="post-form-actions"><button type="button" onClick={() => setPostFormOpen(false)}>إلغاء</button><Button type="submit">إرسال للمراجعة <ChevronLeft /></Button></div>
              </form>
            ) : null}
            <section className="boost-inline"><span><Crown /></span><div><small>ظهور مميّز</small><strong>اجعلي طلبك أعلى القائمة لفترة محددة</strong><p>سيظهر بوسم «مميّز»، وتُعرض المدة والسعر قبل أي دفع.</p></div><button type="button" onClick={() => void requestBoost("post")}>طلب التمييز</button></section>
            <div className="posts-feed">
              {posts.map((post) => (
                <article className={post.featured ? "marriage-post is-featured" : "marriage-post"} key={post.id}>
                  <header><div><span className="post-avatar">ع</span><span><strong>{post.author}</strong><small><Clock3 /> {post.time}</small></span></div><div className="post-badges">{post.isDemo ? <span className="demo-label">طلب تجريبي</span> : null}{post.featured ? <span className="sponsored-label"><Crown /> مميّز</span> : null}{post.status === "pending" ? <span className="pending-label">قيد المراجعة</span> : null}{post.status === "preview" ? <span className="pending-label">معاينة فقط</span> : null}</div></header>
                  <h2>{post.headline}</h2><p>{post.body}</p><div className="partner-summary"><Target /><div><small>أبحث عن</small><strong>{post.partnerSummary}</strong></div></div>
                  <footer><button type="button"><Heart /> حفظ</button><button type="button" onClick={() => setSection("requests")}>عرض الملف</button><Button type="button" onClick={() => setSection("requests")}>إرسال طلب تعارف</Button></footer>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {section === "messages" ? (
          <div className="messages-page">
            <div className="messages-heading"><div><span className="inside-eyebrow">تواصل واضح وآمن</span><h1>المحادثات</h1></div><button type="button" aria-label="فلترة المحادثات"><SlidersHorizontal /></button></div>
            <div className="chat-layout">
              <aside className="conversation-list">
                <div className="conversation-search"><Search /><Input placeholder="ابحث في المحادثات..." /></div>
                <div className="conversation-scroll">
                  {conversations.map((conversation, index) => <button type="button" key={conversation.id} className={activeConversationId === conversation.id ? "conversation-row is-active" : "conversation-row"} onClick={() => openConversation(conversation)}><span className="conversation-avatar">ع{index + 1}</span><span className="conversation-copy"><strong>{conversation.name}</strong><small>{conversation.headline}</small></span><span className="conversation-meta"><small>{conversation.time}</small>{conversation.unread ? <b>{conversation.unread}</b> : null}</span></button>)}
                  {conversations.length === 0 ? <div className="inside-empty"><MessageCircle /><strong>لا توجد محادثات بعد</strong><p>يظهر هنا أي تعارف يقبله الطرفان.</p></div> : null}
                </div>
              </aside>
              <section className="chat-panel">
                {activeConversation ? (
                  <>
                    <header className="chat-header"><div><span className="conversation-avatar">ع</span><span><strong>{activeConversation.name}</strong><small><span className="online-dot" /> مساحة تعارف خاصة</small></span></div><button type="button"><ShieldCheck /> الأمان</button></header>
                    <div className="chat-safety-line"><LockKeyhole /> هذه المحادثة لا يراها إلا الحسابان المشاركان.</div>
                    <div className="chat-messages" aria-live="polite"><div className="chat-day"><span>اليوم</span></div>{messages.map((message) => {
                      const isMine = message.senderId === currentUserId || message.senderId === "me";
                      const isSystem = message.senderId === "system";
                      return <div key={message.id} className={isSystem ? "message-bubble message-bubble--system" : isMine ? "message-bubble message-bubble--mine" : "message-bubble"}><p>{message.body}</p><span>{message.createdAt}{isMine ? <CheckCheck /> : null}</span></div>;
                    })}</div>
                    <form className="chat-composer" onSubmit={sendMessage}><Input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} maxLength={2000} placeholder="اكتب رسالة باحترام ووضوح..." aria-label="نص الرسالة" /><Button type="submit" aria-label="إرسال الرسالة"><Send /></Button></form>
                    {chatError ? <p className="chat-error" role="alert">{chatError}</p> : null}
                  </>
                ) : <div className="inside-empty inside-empty--large"><MessageCircle /><strong>اختاري محادثة</strong><p>ستظهر الرسائل هنا بعد بدء تعارف متبادل.</p></div>}
              </section>
            </div>
          </div>
        ) : null}

        {section === "requests" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">القبول المتبادل أولاً</span><h1>طلبات التعارف</h1><p>لن تُفتح أي محادثة قبل موافقة الحسابين.</p></div></section>
            <div className="request-list">{availableProfiles.slice(0, 3).map((profile, index) => <article key={profile.id}><span className="recommendation-avatar">ع{index + 1}</span><div>{profile.isDemo ? <span className="demo-label">طلب تجريبي</span> : null}<h2>{profile.displayName}</h2><p>{profile.age} سنة · {profile.country} · توافق {profile.baseMatch}%</p></div><div className="request-actions"><button type="button" className="request-reject">ليس الآن</button><button type="button" className="request-accept" onClick={() => setSection("messages")}>قبول وفتح المحادثة</button></div></article>)}</div>
          </div>
        ) : null}

        {section === "saved" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">قائمة خاصة بك</span><h1>الملفات المحفوظة</h1><p>الحفظ لا يرسل إشعاراً لصاحب الملف.</p></div></section>
            {savedIds.length ? <div className="recommendation-grid recommendation-grid--wide">{availableProfiles.filter((profile) => savedIds.includes(profile.id)).map((profile) => <ProfileCard key={profile.id} profile={profile} saved onSave={() => toggleSaved(profile.id)} onOpen={() => setSection("requests")} />)}</div> : <div className="inside-placeholder"><Heart /><h2>لا توجد ملفات محفوظة بعد</h2><p>اضغطي على القلب في أي نتيجة للعودة إليها لاحقاً.</p><button type="button" onClick={() => setSection("discover")}>ابدئي البحث</button></div>}
          </div>
        ) : null}

        {section === "profile" ? (
          <div className="inside-content">
            <section className="inside-page-heading"><div><span className="inside-eyebrow">أساس المطابقة</span><h1>مواصفاتي ومواصفات الشريك</h1><p>كلما كانت المعلومات أوضح، أصبحت نتائج البحث والترشيح أدق.</p></div><div className="profile-completion"><span><b style={{ width: "72%" }} /></span><strong>72%</strong><small>اكتمال الملف</small></div></section>
            <div className="spec-tabs"><button type="button" className={specTab === "mine" ? "is-active" : ""} onClick={() => setSpecTab("mine")}><UserRound /> مواصفاتي</button><button type="button" className={specTab === "partner" ? "is-active" : ""} onClick={() => setSpecTab("partner")}><Target /> مواصفات الشريك</button></div>

            {specTab === "mine" ? (
              <form className="spec-form" onSubmit={saveMySpecs}>
                <div className="spec-form-intro"><span><UserRound /></span><div><small>عنّي</small><h2>معلومات تساعد على مطابقة أكثر واقعية</h2><p>هذه البيانات خاصة، ولا يظهر منها للبحث إلا ما توافقين على نشره في ملف الاكتشاف.</p></div></div>
                <div className="spec-grid">
                  <label className="inside-field"><span>الطول بالسنتيمتر</span><Input inputMode="numeric" value={mySpecs.height} onChange={(event) => setMySpecs({ ...mySpecs, height: event.target.value })} /></label>
                  <SelectField label="الأطفال" value={mySpecs.childrenStatus} onChange={(childrenStatus) => setMySpecs({ ...mySpecs, childrenStatus })}><option value="none">لا يوجد أطفال</option><option value="has_children">لدي أطفال</option><option value="prefer_not_to_say">أفضل عدم القول</option></SelectField>
                  <SelectField label="الرغبة بالإنجاب" value={mySpecs.wantsChildren} onChange={(wantsChildren) => setMySpecs({ ...mySpecs, wantsChildren })}><option value="yes">نعم</option><option value="no">لا</option><option value="open">منفتح/ة للنقاش</option></SelectField>
                  <SelectField label="التدخين" value={mySpecs.smoking} onChange={(smoking) => setMySpecs({ ...mySpecs, smoking })}><option value="never">غير مدخن/ة</option><option value="occasionally">أحياناً</option><option value="yes">مدخن/ة</option></SelectField>
                  <SelectField label="الانتقال بعد الزواج" value={mySpecs.relocation} onChange={(relocation) => setMySpecs({ ...mySpecs, relocation })}><option value="not_possible">غير ممكن</option><option value="same_country">ضمن نفس الدولة</option><option value="gulf">ضمن الخليج</option><option value="open">منفتح/ة</option></SelectField>
                  <SelectField label="مستوى الالتزام" value={mySpecs.commitment} onChange={(commitment) => setMySpecs({ ...mySpecs, commitment })}><option value="balanced">متوازن</option><option value="committed">ملتزم</option><option value="very_committed">ملتزم جداً</option></SelectField>
                </div>
                <div className="pill-field"><span><Languages /> اللغات</span><div>{["العربية", "الإنجليزية", "الفرنسية"].map((value) => <button type="button" key={value} className={mySpecs.languages.includes(value) ? "is-selected" : ""} onClick={() => setMySpecs({ ...mySpecs, languages: toggleArrayValue(mySpecs.languages, value) })}>{mySpecs.languages.includes(value) ? <Check /> : <Plus />}{value}</button>)}</div></div>
                <div className="pill-field"><span><HeartHandshake /> القيم الأهم</span><div>{["الاستقرار", "الوضوح", "العائلة", "الطموح", "الرحمة", "التعاون"].map((value) => <button type="button" key={value} className={mySpecs.values.includes(value) ? "is-selected" : ""} onClick={() => setMySpecs({ ...mySpecs, values: toggleArrayValue(mySpecs.values, value) })}>{mySpecs.values.includes(value) ? <Check /> : <Plus />}{value}</button>)}</div></div>
                <div className="spec-form-footer"><p><LockKeyhole /> لا ننشر بياناتك الخاصة أو وسائل تواصلك.</p><Button type="submit"><Save /> حفظ مواصفاتي</Button></div>
              </form>
            ) : (
              <form className="spec-form" onSubmit={savePartnerSpecs}>
                <div className="spec-form-intro"><span><Target /></span><div><small>ما أبحث عنه</small><h2>حددي الشروط المهمة فعلاً</h2><p>يمكن جعل بعض الحقول إلزامية، والسماح بنتائج قريبة في البقية.</p></div></div>
                <div className="spec-grid">
                  <label className="inside-field"><span>العمر من</span><Input inputMode="numeric" value={partnerSpecs.ageMin} onChange={(event) => setPartnerSpecs({ ...partnerSpecs, ageMin: event.target.value })} /></label>
                  <label className="inside-field"><span>العمر إلى</span><Input inputMode="numeric" value={partnerSpecs.ageMax} onChange={(event) => setPartnerSpecs({ ...partnerSpecs, ageMax: event.target.value })} /></label>
                  <SelectField label="الدولة" value={partnerSpecs.country} onChange={(country) => setPartnerSpecs({ ...partnerSpecs, country })}><option value="all">كل الدول</option><option>الإمارات</option><option>السعودية</option><option>قطر</option><option>الكويت</option><option>البحرين</option><option>عُمان</option></SelectField>
                  <SelectField label="الحالة الاجتماعية" value={partnerSpecs.maritalStatus} onChange={(maritalStatus) => setPartnerSpecs({ ...partnerSpecs, maritalStatus })}><option value="all">غير محدد</option><option value="single">أعزب/عزباء</option><option value="divorced">مطلق/مطلقة</option><option value="widowed">أرمل/أرملة</option></SelectField>
                  <SelectField label="التعليم" value={partnerSpecs.education} onChange={(education) => setPartnerSpecs({ ...partnerSpecs, education })}><option value="all">غير محدد</option><option value="secondary">ثانوي</option><option value="diploma">دبلوم</option><option value="bachelor">جامعي</option><option value="postgraduate">دراسات عليا</option></SelectField>
                  <SelectField label="التدخين" value={partnerSpecs.smoking} onChange={(smoking) => setPartnerSpecs({ ...partnerSpecs, smoking })}><option value="all">غير مهم</option><option value="never">غير مدخن</option><option value="occasionally">أحياناً</option></SelectField>
                  <label className="inside-field"><span>الطول من</span><Input inputMode="numeric" value={partnerSpecs.heightMin} onChange={(event) => setPartnerSpecs({ ...partnerSpecs, heightMin: event.target.value })} /></label>
                  <label className="inside-field"><span>الطول إلى</span><Input inputMode="numeric" value={partnerSpecs.heightMax} onChange={(event) => setPartnerSpecs({ ...partnerSpecs, heightMax: event.target.value })} /></label>
                  <SelectField label="الأطفال" value={partnerSpecs.childrenStatus} onChange={(childrenStatus) => setPartnerSpecs({ ...partnerSpecs, childrenStatus })}><option value="all">غير مهم</option><option value="none">لا يوجد أطفال</option><option value="has_children">لديه أطفال</option></SelectField>
                  <SelectField label="الانتقال" value={partnerSpecs.relocation} onChange={(relocation) => setPartnerSpecs({ ...partnerSpecs, relocation })}><option value="all">غير مهم</option><option value="not_possible">غير ممكن</option><option value="same_country">نفس الدولة</option><option value="gulf">ضمن الخليج</option><option value="open">منفتح</option></SelectField>
                  <SelectField label="الالتزام" value={partnerSpecs.commitment} onChange={(commitment) => setPartnerSpecs({ ...partnerSpecs, commitment })}><option value="all">غير محدد</option><option value="balanced">متوازن</option><option value="committed">ملتزم</option><option value="very_committed">ملتزم جداً</option></SelectField>
                </div>
                <div className="pill-field"><span><Check /> شروط أساسية لا تُتجاوز</span><div>{["العمر", "الدولة", "الحالة", "التدخين", "الأطفال", "الالتزام"].map((value) => <button type="button" key={value} className={partnerSpecs.requiredFields.includes(value) ? "is-selected" : ""} onClick={() => setPartnerSpecs({ ...partnerSpecs, requiredFields: toggleArrayValue(partnerSpecs.requiredFields, value) })}>{partnerSpecs.requiredFields.includes(value) ? <Check /> : <Plus />}{value}</button>)}</div></div>
                <button type="button" className={partnerSpecs.nearMatches ? "near-match-toggle is-on near-match-toggle--wide" : "near-match-toggle near-match-toggle--wide"} onClick={() => setPartnerSpecs({ ...partnerSpecs, nearMatches: !partnerSpecs.nearMatches })}><span>{partnerSpecs.nearMatches ? <Check /> : null}</span><div><strong>السماح بنتائج قريبة في الشروط غير الأساسية</strong><small>نوضح دائماً أنها نتيجة قريبة وليست مطابقة كاملة</small></div></button>
                <div className="spec-form-footer"><p><Target /> تُستخدم هذه المواصفات في البحث والترشيحات اليومية.</p><Button type="submit"><Save /> حفظ وتطبيق على البحث</Button></div>
              </form>
            )}
            <section className="spec-explainer"><div><BadgeCheck /><span><strong>المواصفات ليست حكماً على الأشخاص</strong><small>هي فقط أداة لتقليل النتائج غير المناسبة.</small></span></div><div><ShieldCheck /><span><strong>البيانات الحساسة تبقى خاصة</strong><small>لا نعرض الاسم الكامل أو وسيلة التواصل.</small></span></div><div><BookOpen /><span><strong>يمكن تعديلها دائماً</strong><small>تتغير الترشيحات بعد كل تحديث.</small></span></div></section>
          </div>
        ) : null}

        <nav className="inside-mobile-nav" aria-label="التنقل على الهاتف">
          {navItems.filter((item) => ["home", "discover", "online", "messages", "profile"].includes(item.id)).map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={section === item.id ? "is-active" : ""} onClick={() => setSection(item.id)}><Icon /><span>{item.label}</span></button>;
          })}
        </nav>
      </section>
    </main>
  );
}
