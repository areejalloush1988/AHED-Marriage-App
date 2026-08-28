"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  CheckCheck,
  ChevronLeft,
  Compass,
  Heart,
  HeartHandshake,
  Home,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Search,
  Send,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase";

import "./inside.css";

type Section =
  | "home"
  | "discover"
  | "requests"
  | "messages"
  | "saved"
  | "profile";

type ConversationItem = {
  id: string;
  partnerId?: string;
  name: string;
  headline: string;
  time: string;
  unread: number;
  isDemo: boolean;
};

type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
};

type ConversationRow = {
  id: string;
  participant_a: string;
  participant_b: string;
  status: string;
  last_message_at: string;
};

type MessageRow = {
  id: number;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

const navItems: Array<{
  id: Section;
  label: string;
  icon: typeof Home;
}> = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "discover", label: "الترشيحات", icon: Compass },
  { id: "requests", label: "طلبات التعارف", icon: HeartHandshake },
  { id: "messages", label: "المحادثات", icon: MessageCircle },
  { id: "saved", label: "المحفوظات", icon: Heart },
  { id: "profile", label: "حسابي", icon: UserRound },
];

const demoConversations: ConversationItem[] = [
  {
    id: "demo-1",
    name: "ملف تجريبي 01",
    headline: "آخر رسالة منذ 5 دقائق",
    time: "10:42",
    unread: 2,
    isDemo: true,
  },
  {
    id: "demo-2",
    name: "ملف تجريبي 02",
    headline: "شكراً، يسعدني التعارف بوضوح",
    time: "أمس",
    unread: 0,
    isDemo: true,
  },
  {
    id: "demo-3",
    name: "ملف تجريبي 03",
    headline: "تم قبول طلب التعارف",
    time: "الأحد",
    unread: 0,
    isDemo: true,
  },
];

const demoMessages: Record<string, ChatMessage[]> = {
  "demo-1": [
    {
      id: "demo-message-1",
      senderId: "partner",
      body: "السلام عليكم، قرأت ملفك وأعجبني وضوح أهدافك.",
      createdAt: "10:35",
    },
    {
      id: "demo-message-2",
      senderId: "me",
      body: "وعليكم السلام، شكراً لك. الوضوح والجدية أهم شيء عندي.",
      createdAt: "10:38",
      readAt: "10:39",
    },
    {
      id: "demo-message-3",
      senderId: "partner",
      body: "ممتاز، ممكن نبدأ بأسئلة القيم ونظرتنا للحياة الأسرية.",
      createdAt: "10:42",
    },
  ],
  "demo-2": [
    {
      id: "demo-message-4",
      senderId: "partner",
      body: "شكراً، يسعدني التعارف بوضوح واحترام.",
      createdAt: "أمس",
    },
  ],
  "demo-3": [
    {
      id: "demo-message-5",
      senderId: "system",
      body: "تم قبول طلب التعارف. أصبحت المحادثة متاحة للطرفين.",
      createdAt: "الأحد",
    },
  ],
};

const recommendationCards = [
  {
    code: "01",
    age: "29 سنة",
    place: "الإمارات",
    detail: "تعليم جامعي · اهتمام بالاستقرار الأسري",
    match: "توافق 92%",
  },
  {
    code: "02",
    age: "32 سنة",
    place: "السعودية",
    detail: "مجال صحي · تفضّل حياة عائلية هادئة",
    match: "توافق 88%",
  },
  {
    code: "03",
    age: "27 سنة",
    place: "قطر",
    detail: "مجال تعليمي · وضوح وجدية بالقرار",
    match: "توافق 85%",
  },
];

function Brand() {
  return (
    <div className="inside-brand" aria-label="عَهْد AHED">
      <span className="inside-brand__mark">ع</span>
      <span>
        <strong>عَهْد</strong>
        <small>AHED</small>
      </span>
    </div>
  );
}

function formatConversationTime(value: string) {
  return new Intl.DateTimeFormat("ar-AE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: String(row.id),
    senderId: row.sender_id,
    body: row.body,
    createdAt: formatConversationTime(row.created_at),
    readAt: row.read_at,
  };
}

export default function InsidePage() {
  const [section, setSection] = useState<Section>("home");
  const [conversations, setConversations] =
    useState<ConversationItem[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] =
    useState(demoConversations[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(
    demoMessages[demoConversations[0].id],
  );
  const [messageDraft, setMessageDraft] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [mode, setMode] = useState<"demo" | "live" | "empty">("demo");
  const [chatError, setChatError] = useState("");

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ),
    [activeConversationId, conversations],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    const supabase = getSupabaseClient();

    async function loadAccountConversations() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled || !session?.user) return;

      const userId = session.user.id;
      setCurrentUserId(userId);

      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, participant_a, participant_b, status, last_message_at",
        )
        .order("last_message_at", { ascending: false });

      if (cancelled || error) return;

      const rows = (data ?? []) as ConversationRow[];
      if (rows.length === 0) {
        setMode("empty");
        setConversations([]);
        setMessages([]);
        return;
      }

      const liveConversations = rows.map((row, index) => ({
        id: row.id,
        partnerId:
          row.participant_a === userId
            ? row.participant_b
            : row.participant_a,
        name: `حساب عَهْد ${String(index + 1).padStart(2, "0")}`,
        headline:
          row.status === "active"
            ? "محادثة خاصة ومشفّرة بالنقل"
            : "المحادثة مغلقة",
        time: formatConversationTime(row.last_message_at),
        unread: 0,
        isDemo: false,
      }));

      setMode("live");
      setConversations(liveConversations);
      setActiveConversationId(liveConversations[0].id);
    }

    void loadAccountConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeConversationId.startsWith("demo-")) return;

    if (!currentUserId || !isSupabaseConfigured) return;

    const supabase = getSupabaseClient();
    let active = true;

    async function loadMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, body, created_at, read_at")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true });

      if (!active) return;
      if (error) {
        setChatError("تعذّر تحميل الرسائل الآن.");
        return;
      }

      setMessages(((data ?? []) as MessageRow[]).map(mapMessage));
    }

    void loadMessages();

    const channel = supabase
      .channel(`ahed-chat-${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const incoming = mapMessage(payload.new as MessageRow);
          setMessages((current) =>
            current.some((message) => message.id === incoming.id)
              ? current
              : [...current, incoming],
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [activeConversationId, currentUserId]);

  const openConversation = (conversation: ConversationItem) => {
    setChatError("");
    if (conversation.isDemo) {
      setMessages(demoMessages[conversation.id] ?? []);
    }
    setActiveConversationId(conversation.id);
    setSection("messages");
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = messageDraft.trim();
    if (!body || !activeConversation) return;

    setMessageDraft("");
    setChatError("");

    if (activeConversation.isDemo || !currentUserId) {
      setMessages((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          senderId: "me",
          body,
          createdAt: new Intl.DateTimeFormat("ar-AE", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
          readAt: null,
        },
      ]);
      return;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        body,
      })
      .select("id, sender_id, body, created_at, read_at")
      .single();

    if (error) {
      setMessageDraft(body);
      setChatError("لم تُرسل الرسالة. حاولي مرة أخرى.");
      return;
    }

    const sent = mapMessage(data as MessageRow);
    setMessages((current) =>
      current.some((message) => message.id === sent.id)
        ? current
        : [...current, sent],
    );
  };

  return (
    <main className="inside-app" dir="rtl">
      <aside className="inside-sidebar">
        <Brand />
        <div className="inside-profile-chip">
          <span className="inside-avatar">أ</span>
          <span>
            <strong>حساب المعاينة</strong>
            <small>
              <BadgeCheck />
              ملف موثّق
            </small>
          </span>
        </div>

        <nav className="inside-nav" aria-label="القائمة الرئيسية">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={section === item.id ? "is-active" : ""}
                onClick={() => setSection(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
                {item.id === "messages" ? (
                  <b className="nav-count">2</b>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="inside-safety">
          <ShieldCheck />
          <span>
            <strong>مساحتك محمية</strong>
            <small>لا محادثة إلا بعد القبول المتبادل</small>
          </span>
        </div>

        <Link className="inside-logout" href="/">
          <LogOut />
          العودة للتسجيل
        </Link>
      </aside>

      <section className="inside-main">
        <header className="inside-topbar">
          <div className="inside-mobile-brand">
            <Brand />
          </div>
          <div className="inside-search">
            <Search />
            <Input
              aria-label="البحث"
              placeholder="ابحث في الترشيحات..."
            />
          </div>
          <div className="inside-top-actions">
            <button type="button" aria-label="الإشعارات">
              <Bell />
              <span />
            </button>
            <div className="inside-stage">
              <Sparkles />
              النسخة التأسيسية
            </div>
          </div>
        </header>

        <div className="inside-preview-notice">
          <Shield />
          <p>
            <strong>معاينة الهيكل الداخلي</strong>
            الملفات الظاهرة هنا تجريبية فقط وليست حسابات أشخاص حقيقيين.
          </p>
          <span>
            {mode === "live"
              ? "محادثات الحساب الفعلية"
              : mode === "empty"
                ? "لا محادثات فعلية بعد"
                : "وضع المعاينة"}
          </span>
        </div>

        {section === "home" ? (
          <div className="inside-content">
            <section className="inside-welcome">
              <div>
                <span className="inside-eyebrow">صباح الخير</span>
                <h1>خطوة هادئة نحو تعارف واضح.</h1>
                <p>
                  راجعي الترشيحات الجديدة، تابعي طلبات التعارف، وابدئي
                  المحادثة فقط عندما يكون القبول متبادلاً.
                </p>
              </div>
              <Button
                className="inside-primary-button"
                onClick={() => setSection("discover")}
              >
                عرض الترشيحات
                <ChevronLeft />
              </Button>
            </section>

            <section className="inside-stats" aria-label="ملخص الحساب">
              <article>
                <span className="stat-icon stat-icon--spark">
                  <Sparkles />
                </span>
                <div>
                  <small>ترشيحات جديدة</small>
                  <strong>12</strong>
                  <p>هذا الأسبوع</p>
                </div>
              </article>
              <article>
                <span className="stat-icon stat-icon--heart">
                  <HeartHandshake />
                </span>
                <div>
                  <small>طلبات تعارف</small>
                  <strong>4</strong>
                  <p>بانتظار المراجعة</p>
                </div>
              </article>
              <article>
                <span className="stat-icon stat-icon--chat">
                  <MessageCircle />
                </span>
                <div>
                  <small>رسائل جديدة</small>
                  <strong>2</strong>
                  <p>في محادثة واحدة</p>
                </div>
              </article>
            </section>

            <section className="inside-section">
              <div className="inside-section__head">
                <div>
                  <span className="inside-eyebrow">اختيارات اليوم</span>
                  <h2>ترشيحات قريبة من تفضيلاتك</h2>
                </div>
                <button type="button" onClick={() => setSection("discover")}>
                  عرض الكل
                  <ChevronLeft />
                </button>
              </div>

              <div className="recommendation-grid">
                {recommendationCards.map((card) => (
                  <article key={card.code} className="recommendation-card">
                    <div className="recommendation-card__top">
                      <span className="recommendation-avatar">
                        ع{card.code}
                      </span>
                      <span className="match-badge">{card.match}</span>
                    </div>
                    <div>
                      <span className="demo-label">ملف تجريبي</span>
                      <h3>حساب عَهْد {card.code}</h3>
                      <p>
                        {card.age} · {card.place}
                      </p>
                      <small>{card.detail}</small>
                    </div>
                    <div className="recommendation-actions">
                      <button
                        type="button"
                        className="save-button"
                        aria-label="حفظ الملف"
                      >
                        <Heart />
                      </button>
                      <button
                        type="button"
                        className="profile-button"
                        onClick={() => setSection("requests")}
                      >
                        عرض الملف
                        <ChevronLeft />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="inside-home-grid">
              <article className="recent-messages">
                <div className="inside-section__head inside-section__head--compact">
                  <div>
                    <span className="inside-eyebrow">آخر التحديثات</span>
                    <h2>المحادثات</h2>
                  </div>
                  <button type="button" onClick={() => setSection("messages")}>
                    فتح
                    <ChevronLeft />
                  </button>
                </div>
                {conversations.slice(0, 3).map((conversation, index) => (
                  <button
                    className="recent-message-row"
                    type="button"
                    key={conversation.id}
                    onClick={() => openConversation(conversation)}
                  >
                    <span className="mini-avatar">ع{index + 1}</span>
                    <span className="recent-message-copy">
                      <strong>{conversation.name}</strong>
                      <small>{conversation.headline}</small>
                    </span>
                    <span className="recent-message-meta">
                      <small>{conversation.time}</small>
                      {conversation.unread ? (
                        <b>{conversation.unread}</b>
                      ) : (
                        <CheckCheck />
                      )}
                    </span>
                  </button>
                ))}
                {conversations.length === 0 ? (
                  <div className="inside-empty">
                    <MessageCircle />
                    <strong>لا توجد محادثات بعد</strong>
                    <p>تبدأ المحادثة بعد قبول طلب التعارف من الطرفين.</p>
                  </div>
                ) : null}
              </article>

              <article className="safety-card">
                <span className="safety-card__icon">
                  <LockKeyhole />
                </span>
                <span className="inside-eyebrow">قواعد المحادثة</span>
                <h2>الاحترام والوضوح أولاً.</h2>
                <ul>
                  <li>المحادثة خاصة بين الطرفين فقط.</li>
                  <li>الإبلاغ والحظر متاحان في أي وقت.</li>
                  <li>لا يظهر رقم الهاتف أو البريد للطرف الآخر.</li>
                </ul>
                <button type="button">
                  قراءة إرشادات الأمان
                  <ChevronLeft />
                </button>
              </article>
            </section>
          </div>
        ) : null}

        {section === "messages" ? (
          <div className="messages-page">
            <div className="messages-heading">
              <div>
                <span className="inside-eyebrow">تواصل واضح وآمن</span>
                <h1>المحادثات</h1>
              </div>
              <button type="button" aria-label="فلترة المحادثات">
                <SlidersHorizontal />
              </button>
            </div>

            <div className="chat-layout">
              <aside className="conversation-list">
                <div className="conversation-search">
                  <Search />
                  <Input placeholder="ابحث في المحادثات..." />
                </div>
                <div className="conversation-scroll">
                  {conversations.map((conversation, index) => (
                    <button
                      type="button"
                      key={conversation.id}
                      className={
                        activeConversationId === conversation.id
                          ? "conversation-row is-active"
                          : "conversation-row"
                      }
                      onClick={() => openConversation(conversation)}
                    >
                      <span className="conversation-avatar">ع{index + 1}</span>
                      <span className="conversation-copy">
                        <strong>{conversation.name}</strong>
                        <small>{conversation.headline}</small>
                      </span>
                      <span className="conversation-meta">
                        <small>{conversation.time}</small>
                        {conversation.unread ? (
                          <b>{conversation.unread}</b>
                        ) : null}
                      </span>
                    </button>
                  ))}
                  {conversations.length === 0 ? (
                    <div className="inside-empty">
                      <MessageCircle />
                      <strong>لا توجد محادثات بعد</strong>
                      <p>يظهر هنا أي تعارف يقبله الطرفان.</p>
                    </div>
                  ) : null}
                </div>
              </aside>

              <section className="chat-panel">
                {activeConversation ? (
                  <>
                    <header className="chat-header">
                      <div>
                        <span className="conversation-avatar">ع</span>
                        <span>
                          <strong>{activeConversation.name}</strong>
                          <small>
                            <span className="online-dot" />
                            مساحة تعارف خاصة
                          </small>
                        </span>
                      </div>
                      <button type="button">
                        <ShieldCheck />
                        الأمان
                      </button>
                    </header>

                    <div className="chat-safety-line">
                      <LockKeyhole />
                      هذه المحادثة لا يراها إلا الحسابان المشاركان.
                    </div>

                    <div className="chat-messages" aria-live="polite">
                      <div className="chat-day">
                        <span>اليوم</span>
                      </div>
                      {messages.map((message) => {
                        const isMine =
                          message.senderId === currentUserId ||
                          message.senderId === "me";
                        const isSystem = message.senderId === "system";
                        return (
                          <div
                            key={message.id}
                            className={
                              isSystem
                                ? "message-bubble message-bubble--system"
                                : isMine
                                  ? "message-bubble message-bubble--mine"
                                  : "message-bubble"
                            }
                          >
                            <p>{message.body}</p>
                            <span>
                              {message.createdAt}
                              {isMine ? <CheckCheck /> : null}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <form className="chat-composer" onSubmit={sendMessage}>
                      <Input
                        value={messageDraft}
                        onChange={(event) =>
                          setMessageDraft(event.target.value)
                        }
                        maxLength={2000}
                        placeholder="اكتب رسالة باحترام ووضوح..."
                        aria-label="نص الرسالة"
                      />
                      <Button type="submit" aria-label="إرسال الرسالة">
                        <Send />
                      </Button>
                    </form>
                    {chatError ? (
                      <p className="chat-error" role="alert">
                        {chatError}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <div className="inside-empty inside-empty--large">
                    <MessageCircle />
                    <strong>اختاري محادثة</strong>
                    <p>ستظهر الرسائل هنا بعد بدء تعارف متبادل.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : null}

        {section === "discover" ? (
          <div className="inside-content">
            <section className="inside-page-heading">
              <div>
                <span className="inside-eyebrow">مطابقة هادئة ومدروسة</span>
                <h1>الترشيحات</h1>
                <p>ترتيب أولي للهيكل؛ الحسابات المعروضة تجريبية للمعاينة.</p>
              </div>
              <button type="button">
                <SlidersHorizontal />
                تعديل التفضيلات
              </button>
            </section>
            <div className="recommendation-grid recommendation-grid--wide">
              {[...recommendationCards, ...recommendationCards].map(
                (card, index) => (
                  <article
                    key={`${card.code}-${index}`}
                    className="recommendation-card"
                  >
                    <div className="recommendation-card__top">
                      <span className="recommendation-avatar">
                        ع{index + 1}
                      </span>
                      <span className="match-badge">{card.match}</span>
                    </div>
                    <div>
                      <span className="demo-label">ملف تجريبي</span>
                      <h3>حساب عَهْد {String(index + 1).padStart(2, "0")}</h3>
                      <p>
                        {card.age} · {card.place}
                      </p>
                      <small>{card.detail}</small>
                    </div>
                    <div className="recommendation-actions">
                      <button type="button" className="save-button">
                        <Heart />
                      </button>
                      <button type="button" className="profile-button">
                        عرض الملف
                        <ChevronLeft />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        ) : null}

        {section === "requests" ? (
          <div className="inside-content">
            <section className="inside-page-heading">
              <div>
                <span className="inside-eyebrow">القبول المتبادل أولاً</span>
                <h1>طلبات التعارف</h1>
                <p>لن تُفتح أي محادثة قبل موافقة الحسابين.</p>
              </div>
            </section>
            <div className="request-list">
              {recommendationCards.slice(0, 2).map((card, index) => (
                <article key={card.code}>
                  <span className="recommendation-avatar">ع{index + 1}</span>
                  <div>
                    <span className="demo-label">طلب تجريبي</span>
                    <h2>حساب عَهْد {card.code}</h2>
                    <p>
                      {card.age} · {card.place} · {card.match}
                    </p>
                  </div>
                  <div className="request-actions">
                    <button type="button" className="request-reject">
                      ليس الآن
                    </button>
                    <button
                      type="button"
                      className="request-accept"
                      onClick={() => setSection("messages")}
                    >
                      قبول وفتح المحادثة
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {section === "saved" || section === "profile" ? (
          <div className="inside-content">
            <section className="inside-page-heading">
              <div>
                <span className="inside-eyebrow">قيد ترتيب المرحلة التالية</span>
                <h1>
                  {section === "saved" ? "الملفات المحفوظة" : "حسابي"}
                </h1>
                <p>
                  تم تثبيت مكان الصفحة ضمن الهيكل، وسيُضاف محتواها التفصيلي في
                  المرحلة التالية.
                </p>
              </div>
            </section>
            <div className="inside-placeholder">
              {section === "saved" ? <Heart /> : <UserRound />}
              <h2>الصفحة جاهزة ضمن القائمة</h2>
              <p>سنرتب حقولها ووظائفها بعد تثبيت تجربة الرئيسية والمحادثات.</p>
            </div>
          </div>
        ) : null}

        <nav className="inside-mobile-nav" aria-label="التنقل على الهاتف">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={section === item.id ? "is-active" : ""}
                onClick={() => setSection(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
