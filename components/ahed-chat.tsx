"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  CheckCheck,
  Download,
  FileText,
  LoaderCircle,
  Mic,
  Paperclip,
  Pencil,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Square,
  Trash2,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { EmojiClickData } from "emoji-picker-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const MESSAGE_COLUMNS =
  "id, conversation_id, sender_id, body, created_at, delivered_at, read_at, edited_at, deleted_at, deleted_by, message_type, attachment_path, attachment_name, attachment_mime, attachment_size_bytes, audio_duration_seconds";

const CHAT_BUCKET = "ahed-chat-media";
const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const MAX_RECORDING_SECONDS = 300;
const EDIT_WINDOW_MS = 15 * 60 * 1000;

type ChatMode = "demo" | "live" | "empty";
type MessageType = "text" | "image" | "file" | "audio";

type ConversationItem = {
  id: string;
  latestMessageId?: string;
  partnerId?: string;
  name: string;
  headline: string;
  time: string;
  unread: number;
  isDemo: boolean;
};

type MessageRow = {
  id: number | string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  delivered_at: string | null;
  read_at: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  message_type: MessageType;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  attachment_size_bytes: number | null;
  audio_duration_seconds: number | null;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  createdAtIso: string;
  deliveredAt: string | null;
  readAt: string | null;
  editedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  messageType: MessageType;
  attachmentPath: string | null;
  attachmentName: string | null;
  attachmentMime: string | null;
  attachmentSizeBytes: number | null;
  audioDurationSeconds: number | null;
  attachmentUrl?: string;
};

type IncomingNotice = {
  conversationId: string;
  title: string;
  body: string;
};

type AhedChatProps = {
  currentUserId?: string;
  isVisible: boolean;
  onModeChange: (mode: ChatMode) => void;
  onOpenChat: () => void;
  onUnreadCountChange: (count: number) => void;
};

const nowIso = () => new Date().toISOString();

function formatConversationTime(value: string) {
  return new Intl.DateTimeFormat("ar-AE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} ك.ب`;
  return `${(bytes / 1024 / 1024).toFixed(1)} م.ب`;
}

function mapMessage(row: MessageRow, attachmentUrl?: string): ChatMessage {
  return {
    id: String(row.id),
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: formatConversationTime(row.created_at),
    createdAtIso: row.created_at,
    deliveredAt: row.delivered_at,
    readAt: row.read_at,
    editedAt: row.edited_at,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    messageType: row.message_type ?? "text",
    attachmentPath: row.attachment_path,
    attachmentName: row.attachment_name,
    attachmentMime: row.attachment_mime,
    attachmentSizeBytes: row.attachment_size_bytes,
    audioDurationSeconds: row.audio_duration_seconds,
    attachmentUrl,
  };
}

async function hydrateMessage(row: MessageRow) {
  if (!row.attachment_path || row.deleted_at || !isSupabaseConfigured) {
    return mapMessage(row);
  }

  const { data } = await getSupabaseClient()
    .storage.from(CHAT_BUCKET)
    .createSignedUrl(row.attachment_path, 60 * 60);

  return mapMessage(row, data?.signedUrl);
}

function upsertMessage(messages: ChatMessage[], incoming: ChatMessage) {
  const index = messages.findIndex((message) => message.id === incoming.id);
  if (index === -1) return [...messages, incoming];
  const next = [...messages];
  next[index] = incoming;
  return next;
}

function extensionForMime(mime: string) {
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  return "webm";
}

function createLocalMessage(
  conversationId: string,
  body: string,
  type: MessageType = "text",
  extras: Partial<ChatMessage> = {},
): ChatMessage {
  const createdAtIso = nowIso();
  return {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    conversationId,
    senderId: "me",
    body,
    createdAt: formatConversationTime(createdAtIso),
    createdAtIso,
    deliveredAt: null,
    readAt: null,
    editedAt: null,
    deletedAt: null,
    deletedBy: null,
    messageType: type,
    attachmentPath: null,
    attachmentName: null,
    attachmentMime: null,
    attachmentSizeBytes: null,
    audioDurationSeconds: null,
    ...extras,
  };
}

const demoConversations: ConversationItem[] = [
  {
    id: "demo-1",
    latestMessageId: "demo-message-3",
    name: "ملف تجريبي 01",
    headline: "ممتاز، ممكن نبدأ بأسئلة القيم",
    time: "10:42",
    unread: 2,
    isDemo: true,
  },
  {
    id: "demo-2",
    latestMessageId: "demo-message-4",
    name: "ملف تجريبي 02",
    headline: "شكراً، يسعدني التعارف بوضوح",
    time: "أمس",
    unread: 0,
    isDemo: true,
  },
  {
    id: "demo-3",
    latestMessageId: "demo-message-5",
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
      ...createLocalMessage(
        "demo-1",
        "السلام عليكم، قرأت ملفك وأعجبني وضوح أهدافك.",
      ),
      id: "demo-message-1",
      senderId: "partner",
      createdAt: "10:35",
    },
    {
      ...createLocalMessage(
        "demo-1",
        "وعليكم السلام، شكراً لك. الوضوح والجدية أهم شيء عندي.",
      ),
      id: "demo-message-2",
      createdAt: "10:38",
      readAt: nowIso(),
    },
    {
      ...createLocalMessage(
        "demo-1",
        "ممتاز، ممكن نبدأ بأسئلة القيم ونظرتنا للحياة الأسرية.",
      ),
      id: "demo-message-3",
      senderId: "partner",
      createdAt: "10:42",
    },
  ],
  "demo-2": [
    {
      ...createLocalMessage(
        "demo-2",
        "شكراً، يسعدني التعارف بوضوح واحترام.",
      ),
      id: "demo-message-4",
      senderId: "partner",
      createdAt: "أمس",
    },
  ],
  "demo-3": [
    {
      ...createLocalMessage(
        "demo-3",
        "تم قبول طلب التعارف. أصبحت المحادثة متاحة للطرفين.",
      ),
      id: "demo-message-5",
      senderId: "system",
      createdAt: "الأحد",
    },
  ],
};

async function registerAhedServiceWorker() {
  if (!("serviceWorker" in navigator)) return undefined;
  try {
    const scriptUrl = new URL("../ahed-sw.js", window.location.href);
    return await navigator.serviceWorker.register(scriptUrl);
  } catch {
    return undefined;
  }
}

export async function enableAhedNotifications() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported" as const;
  }

  await registerAhedServiceWorker();
  if (Notification.permission === "granted") return "granted" as const;
  if (Notification.permission === "denied") return "denied" as const;

  const permission = await Notification.requestPermission();
  return permission === "granted" ? ("granted" as const) : ("denied" as const);
}

async function showDeviceNotification(conversationName: string, conversationId: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    const registration = await registerAhedServiceWorker();
    if (registration) {
      const appRoot = new URL("../", window.location.href);
      await registration.showNotification("رسالة جديدة في عَهْد", {
        body: `وصلتك رسالة جديدة من ${conversationName}`,
        icon: new URL("favicon.png", appRoot).href,
        badge: new URL("favicon.png", appRoot).href,
        tag: `ahed-message-${conversationId}`,
        data: { url: new URL("inside/", appRoot).href, conversationId },
      });
    }
  } catch {
    // The in-app notification remains available when system notifications fail.
  }
}

function playSendSound() {
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startedAt = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(760, startedAt);
    oscillator.frequency.exponentialRampToValueAtTime(1120, startedAt + 0.08);
    gain.gain.setValueAtTime(0.0001, startedAt);
    gain.gain.exponentialRampToValueAtTime(0.085, startedAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.13);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startedAt);
    oscillator.stop(startedAt + 0.14);
    oscillator.addEventListener("ended", () => void context.close());
  } catch {
    // Sending must never fail because sound playback was unavailable.
  }
}

export function AhedChat({
  currentUserId,
  isVisible,
  onModeChange,
  onOpenChat,
  onUnreadCountChange,
}: AhedChatProps) {
  const [conversations, setConversations] =
    useState<ConversationItem[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState("demo-1");
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages["demo-1"]);
  const [messageDraft, setMessageDraft] = useState("");
  const [chatError, setChatError] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage>();
  const [selectedMessageCanEdit, setSelectedMessageCanEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string>();
  const [actionBusy, setActionBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [incomingNotice, setIncomingNotice] = useState<IncomingNotice>();
  const [editClock, setEditClock] = useState(() => Date.now());

  const activeConversationIdRef = useRef(activeConversationId);
  const conversationsRef = useRef(conversations);
  const isVisibleRef = useRef(isVisible);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const typingStopTimerRef = useRef<number | undefined>(undefined);
  const typingDisplayTimerRef = useRef<number | undefined>(undefined);
  const lastTypingSentAtRef = useRef(0);
  const noticeTimerRef = useRef<number | undefined>(undefined);
  const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
  const recordingStreamRef = useRef<MediaStream | undefined>(undefined);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | undefined>(undefined);
  const recordingStartedAtRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ),
    [activeConversationId, conversations],
  );

  const unreadCount = useMemo(
    () => conversations.reduce((sum, conversation) => sum + conversation.unread, 0),
    [conversations],
  );
  const activeChatId = activeConversation?.id;
  const activeChatIsDemo = activeConversation?.isDemo ?? true;

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    onUnreadCountChange(unreadCount);
    document.title = unreadCount
      ? `(${unreadCount}) عَهْد | المحادثات`
      : "عَهْد | منصة زواج جاد وموثوق";
  }, [onUnreadCountChange, unreadCount]);

  useEffect(() => {
    void registerAhedServiceWorker();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setEditClock(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const updateConversation = useCallback(
    (conversationId: string, update: Partial<ConversationItem>) => {
      setConversations((current) => {
        const next = current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, ...update }
            : conversation,
        );
        conversationsRef.current = next;
        return next;
      });
    },
    [],
  );

  const markConversationRead = useCallback(
    async (conversationId: string) => {
      if (
        conversationId.startsWith("demo-") ||
        !currentUserId ||
        !isSupabaseConfigured
      ) {
        updateConversation(conversationId, { unread: 0 });
        return;
      }

      const readAt = nowIso();
      const { error } = await getSupabaseClient()
        .from("messages")
        .update({ delivered_at: readAt, read_at: readAt })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .is("read_at", null);

      if (!error) updateConversation(conversationId, { unread: 0 });
    },
    [currentUserId, updateConversation],
  );

  useEffect(() => {
    let cancelled = false;

    if (!currentUserId || !isSupabaseConfigured) {
      onModeChange("demo");
      return () => {
        cancelled = true;
      };
    }

    async function loadConversations() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("conversations")
        .select("id, participant_a, participant_b, status, last_message_at")
        .order("last_message_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setChatError("تعذّر تحميل المحادثات الآن.");
        return;
      }

      const rows = (data ?? []) as Array<{
        id: string;
        participant_a: string;
        participant_b: string;
        status: string;
        last_message_at: string;
      }>;

      if (rows.length === 0) {
        setConversations([]);
        setMessages([]);
        setActiveConversationId("");
        onModeChange("empty");
        return;
      }

      const conversationIds = rows.map((row) => row.id);
      const partnerIds = rows.map((row) =>
        row.participant_a === currentUserId ? row.participant_b : row.participant_a,
      );
      const [messageResult, profileResult] = await Promise.all([
        supabase
          .from("messages")
          .select(MESSAGE_COLUMNS)
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("discovery_profiles")
          .select("user_id, display_name")
          .in("user_id", partnerIds),
      ]);

      if (cancelled) return;
      const messageRows = (messageResult.data ?? []) as unknown as MessageRow[];
      const names = new Map(
        ((profileResult.data ?? []) as Array<{
          user_id: string;
          display_name: string;
        }>).map((profile) => [profile.user_id, profile.display_name]),
      );
      const latestByConversation = new Map<string, MessageRow>();
      const unreadByConversation = new Map<string, number>();

      for (const message of messageRows) {
        if (!latestByConversation.has(message.conversation_id)) {
          latestByConversation.set(message.conversation_id, message);
        }
        if (message.sender_id !== currentUserId && !message.read_at) {
          unreadByConversation.set(
            message.conversation_id,
            (unreadByConversation.get(message.conversation_id) ?? 0) + 1,
          );
        }
      }

      const liveConversations = rows.map((row, index) => {
        const partnerId =
          row.participant_a === currentUserId ? row.participant_b : row.participant_a;
        const latest = latestByConversation.get(row.id);
        return {
          id: row.id,
          latestMessageId: latest ? String(latest.id) : undefined,
          partnerId,
          name:
            names.get(partnerId) ??
            `حساب عَهْد ${String(index + 1).padStart(2, "0")}`,
          headline:
            latest?.deleted_at
              ? "تم حذف هذه الرسالة"
              : latest?.body ??
                (row.status === "active"
                  ? "محادثة خاصة بعد قبول متبادل"
                  : "المحادثة مغلقة"),
          time: formatConversationTime(latest?.created_at ?? row.last_message_at),
          unread: unreadByConversation.get(row.id) ?? 0,
          isDemo: false,
        } satisfies ConversationItem;
      });

      setConversations(liveConversations);
      conversationsRef.current = liveConversations;
      setActiveConversationId((current) =>
        liveConversations.some((conversation) => conversation.id === current)
          ? current
          : liveConversations[0].id,
      );
      onModeChange("live");

      const deliveredAt = nowIso();
      await supabase
        .from("messages")
        .update({ delivered_at: deliveredAt })
        .in("conversation_id", conversationIds)
        .neq("sender_id", currentUserId)
        .is("delivered_at", null);
    }

    void loadConversations();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, onModeChange]);

  useEffect(() => {
    let cancelled = false;
    if (!activeChatId) return;
    const conversationId = activeChatId;

    if (activeChatIsDemo || !currentUserId || !isSupabaseConfigured) return;

    async function loadMessages() {
      const { data, error } = await getSupabaseClient()
        .from("messages")
        .select(MESSAGE_COLUMNS)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (cancelled) return;
      if (error) {
        setChatError("تعذّر تحميل الرسائل الآن.");
        return;
      }

      const hydrated = await Promise.all(
        ((data ?? []) as unknown as MessageRow[]).map(hydrateMessage),
      );
      if (!cancelled) setMessages(hydrated);
      if (isVisible && document.visibilityState === "visible") {
        await markConversationRead(conversationId);
      }
    }

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [
    activeChatId,
    activeChatIsDemo,
    currentUserId,
    isVisible,
    markConversationRead,
  ]);

  useEffect(() => {
    if (!currentUserId || !isSupabaseConfigured) return;
    let cancelled = false;
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`ahed-message-events-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          if (cancelled || payload.eventType === "DELETE") return;
          const row = payload.new as unknown as MessageRow;
          if (!row?.id || !row.conversation_id) return;

          const incoming = await hydrateMessage(row);
          if (cancelled) return;

          if (activeConversationIdRef.current === row.conversation_id) {
            setMessages((current) => upsertMessage(current, incoming));
          }

          if (payload.eventType === "UPDATE") {
            const conversation = conversationsRef.current.find(
              (item) => item.id === row.conversation_id,
            );
            if (conversation?.latestMessageId === String(row.id)) {
              updateConversation(row.conversation_id, {
                headline: row.deleted_at ? "تم حذف هذه الرسالة" : row.body,
              });
            }
            if (row.sender_id !== currentUserId && row.read_at) {
              updateConversation(row.conversation_id, { unread: 0 });
            }
            return;
          }

          updateConversation(row.conversation_id, {
            latestMessageId: String(row.id),
            headline: row.deleted_at ? "تم حذف هذه الرسالة" : row.body,
            time: formatConversationTime(row.created_at),
          });

          if (row.sender_id === currentUserId) return;
          const isReadingNow =
            isVisibleRef.current &&
            activeConversationIdRef.current === row.conversation_id &&
            document.visibilityState === "visible";

          if (isReadingNow) {
            await markConversationRead(row.conversation_id);
            return;
          }

          if (!row.read_at) {
            setConversations((current) => {
              const next = current.map((conversation) =>
                conversation.id === row.conversation_id
                  ? { ...conversation, unread: conversation.unread + 1 }
                  : conversation,
              );
              conversationsRef.current = next;
              return next;
            });
          }

          if (!row.delivered_at) {
            void supabase
              .from("messages")
              .update({ delivered_at: nowIso() })
              .eq("id", String(row.id))
              .is("delivered_at", null);
          }

          const conversation = conversationsRef.current.find(
            (item) => item.id === row.conversation_id,
          );
          const notice = {
            conversationId: row.conversation_id,
            title: conversation?.name ?? "رسالة جديدة في عَهْد",
            body: row.deleted_at ? "تم حذف رسالة" : row.body,
          };
          setIncomingNotice(notice);
          window.clearTimeout(noticeTimerRef.current);
          noticeTimerRef.current = window.setTimeout(
            () => setIncomingNotice(undefined),
            6500,
          );
          void showDeviceNotification(notice.title, row.conversation_id);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, markConversationRead, updateConversation]);

  useEffect(() => {
    const markVisibleConversationRead = () => {
      if (
        document.visibilityState === "visible" &&
        isVisibleRef.current &&
        activeConversationIdRef.current
      ) {
        void markConversationRead(activeConversationIdRef.current);
      }
    };
    document.addEventListener("visibilitychange", markVisibleConversationRead);
    return () =>
      document.removeEventListener("visibilitychange", markVisibleConversationRead);
  }, [markConversationRead]);

  useEffect(() => {
    if (
      !currentUserId ||
      !activeChatId ||
      activeChatIsDemo ||
      !isSupabaseConfigured
    ) {
      typingChannelRef.current = null;
      return;
    }
    const conversationId = activeChatId;

    let cancelled = false;
    let channel: RealtimeChannel | undefined;
    const supabase = getSupabaseClient();

    async function connectTyping() {
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase
        .channel(`ahed-chat:${conversationId}`, {
          config: { private: true, broadcast: { self: false, ack: false } },
        })
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (payload?.userId === currentUserId) return;
          const typing = payload?.typing === true;
          setPartnerTyping(typing);
          window.clearTimeout(typingDisplayTimerRef.current);
          if (typing) {
            typingDisplayTimerRef.current = window.setTimeout(
              () => setPartnerTyping(false),
              2600,
            );
          }
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED" && channel) {
            typingChannelRef.current = channel;
          }
        });
    }

    void connectTyping();
    return () => {
      cancelled = true;
      window.clearTimeout(typingStopTimerRef.current);
      window.clearTimeout(typingDisplayTimerRef.current);
      if (channel) {
        void channel.send({
          type: "broadcast",
          event: "typing",
          payload: { userId: currentUserId, typing: false },
        });
        void supabase.removeChannel(channel);
      }
      if (typingChannelRef.current === channel) typingChannelRef.current = null;
      setPartnerTyping(false);
    };
  }, [activeChatId, activeChatIsDemo, currentUserId]);

  useEffect(
    () => () => {
      window.clearTimeout(typingStopTimerRef.current);
      window.clearTimeout(typingDisplayTimerRef.current);
      window.clearTimeout(noticeTimerRef.current);
      window.clearInterval(recordingTimerRef.current);
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const broadcastTyping = useCallback(
    (typing: boolean) => {
      const channel = typingChannelRef.current;
      if (!channel || !currentUserId) return;

      const send = (active: boolean) => {
        lastTypingSentAtRef.current = Date.now();
        void channel.send({
          type: "broadcast",
          event: "typing",
          payload: { userId: currentUserId, typing: active },
        });
      };

      window.clearTimeout(typingStopTimerRef.current);
      if (!typing) {
        send(false);
        return;
      }

      if (Date.now() - lastTypingSentAtRef.current > 700) send(true);
      typingStopTimerRef.current = window.setTimeout(() => send(false), 1700);
    },
    [currentUserId],
  );

  const handleDraftChange = (value: string) => {
    setMessageDraft(value);
    broadcastTyping(Boolean(value.trim()));
  };

  const openConversation = (conversation: ConversationItem) => {
    setChatError("");
    setEditingMessageId(undefined);
    setMessageDraft("");
    broadcastTyping(false);
    setActiveConversationId(conversation.id);
    if (conversation.isDemo) setMessages(demoMessages[conversation.id] ?? []);
    if (isVisible) void markConversationRead(conversation.id);
  };

  const addSentMessage = (message: ChatMessage) => {
    setMessages((current) => upsertMessage(current, message));
    updateConversation(message.conversationId, {
      latestMessageId: message.id,
      headline: message.body,
      time: message.createdAt,
    });
  };

  const sendTextMessage = async () => {
    const body = messageDraft.trim();
    if (!body || !activeConversation) return;
    setChatError("");

    if (editingMessageId) {
      const editing = messages.find((message) => message.id === editingMessageId);
      if (!editing) return;

      if (activeConversation.isDemo || !currentUserId) {
        setMessages((current) =>
          current.map((message) =>
            message.id === editingMessageId
              ? { ...message, body, editedAt: nowIso() }
              : message,
          ),
        );
        if (activeConversation.latestMessageId === editingMessageId) {
          updateConversation(activeConversation.id, { headline: body });
        }
        setEditingMessageId(undefined);
        setMessageDraft("");
        broadcastTyping(false);
        return;
      }

      setActionBusy(true);
      const { data, error } = await getSupabaseClient()
        .from("messages")
        .update({ body })
        .eq("id", editingMessageId)
        .eq("sender_id", currentUserId)
        .is("deleted_at", null)
        .select(MESSAGE_COLUMNS)
        .single();
      setActionBusy(false);

      if (error) {
        setChatError(
          error.message.includes("15 minutes")
            ? "انتهت مهلة تعديل الرسالة (15 دقيقة)."
            : "تعذّر تعديل الرسالة الآن.",
        );
        return;
      }

      const updated = await hydrateMessage(data as unknown as MessageRow);
      setMessages((current) => upsertMessage(current, updated));
      if (activeConversation.latestMessageId === editingMessageId) {
        updateConversation(activeConversation.id, { headline: body });
      }
      setEditingMessageId(undefined);
      setMessageDraft("");
      broadcastTyping(false);
      return;
    }

    setMessageDraft("");
    broadcastTyping(false);
    if (activeConversation.isDemo || !currentUserId) {
      addSentMessage(createLocalMessage(activeConversation.id, body));
      playSendSound();
      return;
    }

    const { data, error } = await getSupabaseClient()
      .from("messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        body,
        message_type: "text",
      })
      .select(MESSAGE_COLUMNS)
      .single();

    if (error) {
      setMessageDraft(body);
      setChatError("لم تُرسل الرسالة. حاولي مرة أخرى.");
      return;
    }

    addSentMessage(await hydrateMessage(data as unknown as MessageRow));
    playSendSound();
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadBusy && !recording) void sendTextMessage();
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!uploadBusy && !recording) void sendTextMessage();
    }
  };

  const sendAttachment = async (
    file: File,
    type: Exclude<MessageType, "text">,
    durationSeconds?: number,
  ) => {
    if (!activeConversation) return;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setChatError("حجم المرفق يجب ألا يتجاوز 15 ميغابايت.");
      return;
    }

    setUploadBusy(true);
    setChatError("");
    const body =
      type === "audio" ? "رسالة صوتية" : type === "image" ? "صورة" : file.name;

    if (activeConversation.isDemo || !currentUserId) {
      addSentMessage(
        createLocalMessage(activeConversation.id, body, type, {
          attachmentName: file.name,
          attachmentMime: file.type,
          attachmentSizeBytes: file.size,
          audioDurationSeconds: durationSeconds ?? null,
          attachmentUrl: URL.createObjectURL(file),
        }),
      );
      setUploadBusy(false);
      playSendSound();
      return;
    }

    const supabase = getSupabaseClient();
    const extension =
      file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase()
        : extensionForMime(file.type);
    const path = `${activeConversation.id}/${currentUserId}/${crypto.randomUUID()}.${extension || "bin"}`;
    const { error: uploadError } = await supabase.storage
      .from(CHAT_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setUploadBusy(false);
      setChatError("تعذّر رفع المرفق الآن.");
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        body,
        message_type: type,
        attachment_path: path,
        attachment_name: file.name.slice(0, 180),
        attachment_mime: file.type,
        attachment_size_bytes: file.size,
        audio_duration_seconds: type === "audio" ? durationSeconds : null,
      })
      .select(MESSAGE_COLUMNS)
      .single();

    if (error) {
      await supabase.storage.from(CHAT_BUCKET).remove([path]);
      setUploadBusy(false);
      setChatError("تعذّر إرسال المرفق الآن.");
      return;
    }

    addSentMessage(await hydrateMessage(data as unknown as MessageRow));
    setUploadBusy(false);
    playSendSound();
  };

  const chooseAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const type: Exclude<MessageType, "text"> = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("audio/")
        ? "audio"
        : "file";
    void sendAttachment(file, type);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    if (recording) {
      stopRecording();
      return;
    }
    if (!activeConversation || !("MediaRecorder" in window)) {
      setChatError("تسجيل الصوت غير مدعوم على هذا الجهاز.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ].find((mime) => MediaRecorder.isTypeSupported(mime));
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recordingStreamRef.current = stream;
      recordingChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      setRecordingSeconds(0);
      setRecording(true);
      setChatError("");

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) recordingChunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        window.clearInterval(recordingTimerRef.current);
        stream.getTracks().forEach((track) => track.stop());
        const duration = Math.max(
          1,
          Math.min(
            MAX_RECORDING_SECONDS,
            Math.round((Date.now() - recordingStartedAtRef.current) / 1000),
          ),
        );
        const mime = recorder.mimeType || preferredMime || "audio/webm";
        const blob = new Blob(recordingChunksRef.current, { type: mime });
        const file = new File(
          [blob],
          `ahed-voice-${Date.now()}.${extensionForMime(mime)}`,
          { type: mime },
        );
        setRecording(false);
        setRecordingSeconds(0);
        if (blob.size) void sendAttachment(file, "audio", duration);
      });

      recorder.start(250);
      recordingTimerRef.current = window.setInterval(() => {
        const seconds = Math.floor(
          (Date.now() - recordingStartedAtRef.current) / 1000,
        );
        setRecordingSeconds(seconds);
        if (seconds >= MAX_RECORDING_SECONDS) stopRecording();
      }, 500);
    } catch {
      setRecording(false);
      setChatError("تعذّر تشغيل الميكروفون. تأكدي من السماح للتطبيق باستخدامه.");
    }
  };

  const beginEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setMessageDraft(message.body);
    setSelectedMessage(undefined);
    setSelectedMessageCanEdit(false);
    setConfirmDelete(false);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditingMessageId(undefined);
    setMessageDraft("");
    broadcastTyping(false);
  };

  const deleteMessage = async () => {
    if (!selectedMessage || !activeConversation) return;
    setActionBusy(true);
    setChatError("");

    if (activeConversation.isDemo || !currentUserId) {
      setMessages((current) =>
        current.map((message) =>
          message.id === selectedMessage.id
            ? {
                ...message,
                body: "تم حذف هذه الرسالة",
                deletedAt: nowIso(),
                deletedBy: "me",
                messageType: "text",
                attachmentUrl: undefined,
                attachmentPath: null,
                attachmentName: null,
                attachmentMime: null,
                attachmentSizeBytes: null,
                audioDurationSeconds: null,
              }
            : message,
        ),
      );
      if (activeConversation.latestMessageId === selectedMessage.id) {
        updateConversation(activeConversation.id, {
          headline: "تم حذف هذه الرسالة",
        });
      }
      if (editingMessageId === selectedMessage.id) {
        setEditingMessageId(undefined);
        setMessageDraft("");
      }
      setActionBusy(false);
      setSelectedMessage(undefined);
      setSelectedMessageCanEdit(false);
      setConfirmDelete(false);
      return;
    }

    const supabase = getSupabaseClient();
    const deletedAt = nowIso();
    const { data, error } = await supabase
      .from("messages")
      .update({
        body: "تم حذف هذه الرسالة",
        message_type: "text",
        attachment_path: null,
        attachment_name: null,
        attachment_mime: null,
        attachment_size_bytes: null,
        audio_duration_seconds: null,
        deleted_at: deletedAt,
        deleted_by: currentUserId,
      })
      .eq("id", selectedMessage.id)
      .eq("sender_id", currentUserId)
      .is("deleted_at", null)
      .select(MESSAGE_COLUMNS)
      .single();

    if (error) {
      setActionBusy(false);
      setChatError("تعذّر حذف الرسالة الآن.");
      return;
    }

    if (selectedMessage.attachmentPath) {
      void supabase.storage
        .from(CHAT_BUCKET)
        .remove([selectedMessage.attachmentPath]);
    }
    const deleted = await hydrateMessage(data as unknown as MessageRow);
    setMessages((current) => upsertMessage(current, deleted));
    if (activeConversation.latestMessageId === selectedMessage.id) {
      updateConversation(activeConversation.id, {
        headline: "تم حذف هذه الرسالة",
      });
    }
    if (editingMessageId === selectedMessage.id) {
      setEditingMessageId(undefined);
      setMessageDraft("");
    }
    setActionBusy(false);
    setSelectedMessage(undefined);
    setSelectedMessageCanEdit(false);
    setConfirmDelete(false);
  };

  const openMessageActions = (message: ChatMessage, isMine: boolean) => {
    if (!isMine || message.deletedAt || message.senderId === "system") return;
    setSelectedMessage(message);
    setSelectedMessageCanEdit(
      message.messageType === "text" &&
        !message.deletedAt &&
        (Boolean(activeConversation?.isDemo) ||
          message.id.startsWith("local-") ||
          editClock - new Date(message.createdAtIso).getTime() <= EDIT_WINDOW_MS),
    );
    setConfirmDelete(false);
  };

  const openNotice = () => {
    if (!incomingNotice) return;
    const conversation = conversationsRef.current.find(
      (item) => item.id === incomingNotice.conversationId,
    );
    if (conversation) openConversation(conversation);
    setIncomingNotice(undefined);
    onOpenChat();
  };

  return (
    <>
      {incomingNotice ? (
        <button
          type="button"
          className="chat-notification-toast"
          onClick={openNotice}
          aria-label={`فتح رسالة من ${incomingNotice.title}`}
        >
          <span className="conversation-avatar">ع</span>
          <span>
            <strong>{incomingNotice.title}</strong>
            <small>{incomingNotice.body}</small>
          </span>
          <b>{unreadCount}</b>
        </button>
      ) : null}

      <div className="messages-page" hidden={!isVisible}>
        <div className="messages-heading">
          <div>
            <span className="inside-eyebrow">تواصل واضح وآمن</span>
            <h1>المحادثات</h1>
          </div>
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
                    {conversation.unread ? <b>{conversation.unread}</b> : null}
                  </span>
                </button>
              ))}
              {conversations.length === 0 ? (
                <div className="inside-empty">
                  <span className="conversation-empty-icon">💬</span>
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
                      {partnerTyping ? (
                        <small className="typing-label">
                          جاري الكتابة
                          <span className="typing-dots" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                        </small>
                      ) : (
                        <small>
                          <span className="online-dot" /> مساحة تعارف خاصة
                        </small>
                      )}
                    </span>
                  </div>
                  <span className="chat-security-badge">
                    <ShieldCheck /> آمنة
                  </span>
                </header>

                <div className="chat-messages" aria-live="polite">
                  <div className="chat-day">
                    <span>اليوم</span>
                  </div>
                  {messages.map((message) => {
                    const isMine =
                      message.senderId === currentUserId || message.senderId === "me";
                    const isSystem = message.senderId === "system";
                    const bubbleClass = isSystem
                      ? "message-bubble message-bubble--system"
                      : isMine
                        ? "message-bubble message-bubble--mine"
                        : "message-bubble";

                    return (
                      <div
                        key={message.id}
                        className={`${bubbleClass}${message.deletedAt ? " is-deleted" : ""}`}
                        role={isMine && !message.deletedAt && !isSystem ? "button" : undefined}
                        tabIndex={isMine && !message.deletedAt && !isSystem ? 0 : undefined}
                        onClick={() => openMessageActions(message, isMine)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openMessageActions(message, isMine);
                          }
                        }}
                        aria-label={
                          isMine && !message.deletedAt && !isSystem
                            ? "اضغط لعرض خيارات الرسالة"
                            : undefined
                        }
                      >
                        {message.deletedAt ? (
                          <p className="deleted-message-copy">
                            <Trash2 /> تم حذف هذه الرسالة
                          </p>
                        ) : (
                          <>
                            {message.messageType === "image" && message.attachmentUrl ? (
                              <button
                                type="button"
                                className="message-image"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Image
                                  src={message.attachmentUrl}
                                  alt={message.attachmentName ?? "صورة مرفقة"}
                                  width={560}
                                  height={420}
                                  sizes="(max-width: 620px) 76vw, 420px"
                                  unoptimized
                                />
                              </button>
                            ) : null}
                            {message.messageType === "audio" && message.attachmentUrl ? (
                              <div
                                className="message-audio"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Mic />
                                <audio controls preload="metadata" src={message.attachmentUrl}>
                                  جهازك لا يدعم تشغيل الرسالة الصوتية.
                                </audio>
                                <small>
                                  {formatDuration(message.audioDurationSeconds ?? 0)}
                                </small>
                              </div>
                            ) : null}
                            {message.messageType === "file" && message.attachmentUrl ? (
                              <a
                                className="message-file"
                                href={message.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <FileText />
                                <span>
                                  <strong>{message.attachmentName ?? "مرفق"}</strong>
                                  <small>{formatFileSize(message.attachmentSizeBytes)}</small>
                                </span>
                                <Download />
                              </a>
                            ) : null}
                            {message.messageType === "text" ? <p>{message.body}</p> : null}
                          </>
                        )}

                        <span className="message-meta">
                          {message.editedAt && !message.deletedAt ? <em>معدّلة</em> : null}
                          <time>{message.createdAt}</time>
                          {isMine && !isSystem ? (
                            <CheckCheck
                              className={
                                message.readAt
                                  ? "message-receipt is-read"
                                  : "message-receipt"
                              }
                              aria-label={message.readAt ? "تمت القراءة" : "لم تُقرأ بعد"}
                            />
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                  {partnerTyping ? (
                    <div className="typing-bubble" aria-label="الطرف الآخر يكتب الآن">
                      <i />
                      <i />
                      <i />
                    </div>
                  ) : null}
                </div>

                <div className="chat-composer-area">
                  {editingMessageId ? (
                    <div className="editing-message-banner">
                      <Pencil />
                      <span>
                        <strong>تعديل الرسالة</strong>
                        <small>اضغطي سهم الإرسال لحفظ التعديل</small>
                      </span>
                      <button type="button" onClick={cancelEdit} aria-label="إلغاء التعديل">
                        <X />
                      </button>
                    </div>
                  ) : null}

                  {emojiOpen ? (
                    <div className="emoji-picker-popover" dir="ltr">
                      <EmojiPicker
                        width="100%"
                        height={360}
                        lazyLoadEmojis
                        searchPlaceHolder="ابحث عن سمايل..."
                        searchClearButtonLabel="مسح البحث"
                        previewConfig={{ showPreview: false }}
                        onEmojiClick={(emoji: EmojiClickData) => {
                          handleDraftChange(`${messageDraft}${emoji.emoji}`);
                          composerRef.current?.focus();
                        }}
                      />
                    </div>
                  ) : null}

                  <form className="chat-composer" onSubmit={sendMessage}>
                    <Button
                      type="submit"
                      className="chat-send-button"
                      aria-label={editingMessageId ? "حفظ تعديل الرسالة" : "إرسال الرسالة"}
                      disabled={
                        !messageDraft.trim() || uploadBusy || recording || actionBusy
                      }
                    >
                      {actionBusy ? <LoaderCircle className="is-spinning" /> : <Send />}
                    </Button>

                    <div className="chat-text-field">
                      <button
                        type="button"
                        className={emojiOpen ? "is-active" : ""}
                        onClick={() => setEmojiOpen((open) => !open)}
                        aria-label="فتح السمايلات"
                        aria-expanded={emojiOpen}
                      >
                        <Smile />
                      </button>
                      {recording ? (
                        <div className="recording-status" role="status">
                          <span />
                          <strong>جاري تسجيل الصوت</strong>
                          <time>{formatDuration(recordingSeconds)}</time>
                        </div>
                      ) : (
                        <textarea
                          ref={composerRef}
                          value={messageDraft}
                          onChange={(event) => handleDraftChange(event.target.value)}
                          onKeyDown={handleComposerKeyDown}
                          maxLength={2000}
                          rows={1}
                          placeholder="اكتب رسالة..."
                          aria-label="نص الرسالة"
                          dir="auto"
                        />
                      )}
                    </div>

                    <div className="chat-composer-tools">
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,.doc,.docx,.xls,.xlsx,audio/*"
                        onChange={chooseAttachment}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadBusy || recording}
                        aria-label="إرسال مرفق"
                      >
                        {uploadBusy ? <LoaderCircle className="is-spinning" /> : <Paperclip />}
                      </button>
                      <button
                        type="button"
                        className={recording ? "is-recording" : ""}
                        onClick={() => void startRecording()}
                        disabled={uploadBusy}
                        aria-label={recording ? "إيقاف وإرسال التسجيل" : "تسجيل رسالة صوتية"}
                      >
                        {recording ? <Square /> : <Mic />}
                      </button>
                    </div>
                  </form>
                  {chatError ? (
                    <p className="chat-error" role="alert">
                      {chatError}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="inside-empty inside-empty--large">
                <span className="conversation-empty-icon">💬</span>
                <strong>اختاري محادثة</strong>
                <p>ستظهر الرسائل هنا بعد بدء تعارف متبادل.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {isVisible && selectedMessage ? (
        <div
          className="message-action-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !actionBusy) {
              setSelectedMessage(undefined);
              setSelectedMessageCanEdit(false);
              setConfirmDelete(false);
            }
          }}
        >
          <section
            className="message-action-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-action-title"
          >
            {confirmDelete ? (
              <>
                <span className="message-action-icon is-danger">
                  <Trash2 />
                </span>
                <h2 id="message-action-title">هل تريد حذف هذه الرسالة؟</h2>
                <p>سيتم حذفها من المحادثة لدى الطرفين.</p>
                <div className="message-action-buttons">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={actionBusy}
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => void deleteMessage()}
                    disabled={actionBusy}
                  >
                    {actionBusy ? <LoaderCircle className="is-spinning" /> : <Trash2 />}
                    حذف لدى الطرفين
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="message-action-title">خيارات الرسالة</h2>
                <p className="message-action-preview">{selectedMessage.body}</p>
                <div className="message-action-list">
                  {selectedMessageCanEdit ? (
                    <button type="button" onClick={() => beginEdit(selectedMessage)}>
                      <Pencil />
                      <span>
                        <strong>تعديل الرسالة</strong>
                        <small>متاح خلال 15 دقيقة من الإرسال</small>
                      </span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 />
                    <span>
                      <strong>حذف الرسالة</strong>
                      <small>حذفها لدى الطرفين</small>
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  className="message-action-cancel"
                  onClick={() => {
                    setSelectedMessage(undefined);
                    setSelectedMessageCanEdit(false);
                  }}
                >
                  إلغاء
                </button>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
