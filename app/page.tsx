"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  CircleUserRound,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase";

type Gender = "woman" | "man";
type Step =
  | "entry"
  | "account"
  | "profile"
  | "verification"
  | "plans"
  | "complete"
  | "waitlist"
  | "waitlist-complete";
type Plan = "basic" | "pro" | "matchmaker";

type WomanDraft = {
  firstName: string;
  birthDate: string;
  country: string;
  city: string;
  email: string;
  password: string;
  maritalStatus: string;
  nationality: string;
  occupation: string;
  education: string;
  bio: string;
  preferredAgeFrom: string;
  preferredAgeTo: string;
};

const emptyWomanDraft: WomanDraft = {
  firstName: "",
  birthDate: "",
  country: "",
  city: "",
  email: "",
  password: "",
  maritalStatus: "",
  nationality: "",
  occupation: "",
  education: "",
  bio: "",
  preferredAgeFrom: "",
  preferredAgeTo: "",
};

function textValue(data: FormData, name: string): string {
  return String(data.get(name) ?? "").trim();
}

function isAdult(birthDate: string): boolean {
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;

  const today = new Date();
  const cutoff = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  return birth <= cutoff;
}

function submissionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
    return "قاعدة بيانات عَهْد قيد التجهيز حالياً. لم تُحفظ أي بيانات بعد.";
  }

  return "تعذّر حفظ الطلب الآن. تأكدي من البيانات والاتصال ثم حاولي مرة أخرى.";
}

const stepProgress: Record<Step, number> = {
  entry: 8,
  account: 26,
  profile: 48,
  verification: 70,
  plans: 90,
  complete: 100,
  waitlist: 58,
  "waitlist-complete": 100,
};

const countries = [
  "الإمارات العربية المتحدة",
  "المملكة العربية السعودية",
  "الكويت",
  "قطر",
  "البحرين",
  "سلطنة عُمان",
];

const planDetails = {
  basic: {
    name: "عَهْد الأساسي",
    price: 50,
    description: "تفعيل لمرة واحدة دون تجديد تلقائي",
    features: ["ملف موثّق", "طلبات اهتمام", "محادثة بعد القبول"],
  },
  pro: {
    name: "عَهْد Pro",
    price: 250,
    description: "خصوصية وتحكم أكبر في رحلة البحث",
    features: ["كل مزايا الأساسي", "فلاتر دقيقة", "وضع مخفي"],
  },
  matchmaker: {
    name: "الموفّق الشخصي",
    price: 850,
    description: "مراجعة بشرية وترشيحات مدروسة",
    features: ["يشمل Pro", "جلسة تعريف", "ترشيحات يدوية"],
  },
} satisfies Record<
  Plan,
  { name: string; price: number; description: string; features: string[] }
>;

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={compact ? "brand-mark brand-mark--compact" : "brand-mark"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" fill="none">
        <path
          d="M60 87C43 87 29 73 29 56C29 39 43 25 60 25C77 25 91 39 91 56"
          stroke="#F3E4CF"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M60 33C77 33 91 47 91 64C91 81 77 95 60 95C43 95 29 81 29 64"
          stroke="#D8B994"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M53 60L60 53L67 60L60 67L53 60Z" fill="#FFF9F3" />
      </svg>
    </span>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <BrandMark compact={compact} />
      <span className="brand-words">
        <strong>عَهْد</strong>
        <small>AHED</small>
      </span>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field-stack">
      <div className="field-heading">
        <Label htmlFor={id}>{label}</Label>
        {hint ? <span>{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="step-header">
      <span className="step-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function AhedRegistration({
  initialStep = "entry",
  initialGender,
}: {
  initialStep?: Step;
  initialGender?: Gender;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [gender, setGender] = useState<Gender | undefined>(initialGender);
  const [plan, setPlan] = useState<Plan>("basic");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [waitlistTermsAccepted, setWaitlistTermsAccepted] = useState(false);
  const [womanDraft, setWomanDraft] =
    useState<WomanDraft>(emptyWomanDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const selectedPlan = useMemo(() => planDetails[plan], [plan]);

  const goBack = () => {
    const previous: Partial<Record<Step, Step>> = {
      account: "entry",
      profile: "account",
      verification: "profile",
      plans: "verification",
      complete: "plans",
      waitlist: "entry",
      "waitlist-complete": "waitlist",
    };
    setSubmitError("");
    setStep(previous[step] ?? "entry");
  };

  const restart = () => {
    setStep("entry");
    setGender(undefined);
    setPlan("basic");
    setTermsAccepted(false);
    setWaitlistSent(false);
    setWaitlistTermsAccepted(false);
    setWomanDraft(emptyWomanDraft);
    setIsSubmitting(false);
    setSubmitError("");
    setRegistrationEmail("");
  };

  const continueFromEntry = () => {
    setSubmitError("");
    if (gender === "woman") setStep("account");
    if (gender === "man") setStep("waitlist");
  };

  const saveAccountStep = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const birthDate = textValue(data, "birthDate");

    if (!isAdult(birthDate)) {
      setSubmitError("يجب أن يكون العمر 18 عاماً أو أكثر لإكمال التسجيل.");
      return;
    }

    setWomanDraft((current) => ({
      ...current,
      firstName: textValue(data, "firstName"),
      birthDate,
      country: textValue(data, "country"),
      city: textValue(data, "city"),
      email: textValue(data, "email").toLowerCase(),
      password: textValue(data, "password"),
    }));
    setSubmitError("");
    setStep("profile");
  };

  const saveProfileStep = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const preferredAgeFrom = textValue(data, "preferredAgeFrom");
    const preferredAgeTo = textValue(data, "preferredAgeTo");

    if (Number(preferredAgeFrom) > Number(preferredAgeTo)) {
      setSubmitError("العمر المناسب من يجب أن يكون أصغر من أو مساوياً للعمر إلى.");
      return;
    }

    setWomanDraft((current) => ({
      ...current,
      maritalStatus: textValue(data, "maritalStatus"),
      nationality: textValue(data, "nationality"),
      occupation: textValue(data, "occupation"),
      education: textValue(data, "education"),
      bio: textValue(data, "bio"),
      preferredAgeFrom,
      preferredAgeTo,
    }));
    setSubmitError("");
    setStep("verification");
  };

  const submitWomanRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!isSupabaseConfigured) {
        throw new Error("SUPABASE_NOT_CONFIGURED");
      }

      const supabase = getSupabaseClient();
      const emailRedirectTo = `${window.location.origin}/?email-confirmed=1`;
      const { error } = await supabase.auth.signUp({
        email: womanDraft.email,
        password: womanDraft.password,
        options: {
          emailRedirectTo,
          data: {
            first_name: womanDraft.firstName,
            birth_date: womanDraft.birthDate,
            country: womanDraft.country,
            city: womanDraft.city,
            marital_status: womanDraft.maritalStatus,
            nationality: womanDraft.nationality,
            occupation: womanDraft.occupation,
            education: womanDraft.education,
            bio: womanDraft.bio,
            preferred_age_from: Number(womanDraft.preferredAgeFrom),
            preferred_age_to: Number(womanDraft.preferredAgeTo),
            requested_plan: plan,
            terms_accepted: true,
          },
        },
      });

      if (error) throw error;

      setRegistrationEmail(womanDraft.email);
      setWomanDraft((current) => ({ ...current, password: "" }));
      setStep("complete");
    } catch (error) {
      setSubmitError(submissionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitMenWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!isSupabaseConfigured) {
        throw new Error("SUPABASE_NOT_CONFIGURED");
      }

      const data = new FormData(event.currentTarget);
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("men_waitlist").insert({
        first_name: textValue(data, "waitlistName"),
        country: textValue(data, "waitlistCountry"),
        email: textValue(data, "waitlistEmail").toLowerCase(),
      });

      if (error && error.code !== "23505") throw error;

      setWaitlistSent(true);
      setStep("waitlist-complete");
    } catch (error) {
      setSubmitError(submissionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="ahed-app">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand-button" type="button" onClick={restart}>
            <Brand compact />
          </button>
          <div className="topbar-actions">
            <a className="topbar-login-link" href="/login">
              تسجيل الدخول
            </a>
            <div className="launch-chip">
              <span className="live-dot" />
              مرحلة التأسيس للنساء
            </div>
          </div>
        </div>
      </header>

      <div className="app-frame">
        <aside className="brand-panel">
          <div className="brand-panel__content">
            <Brand />
            <div className="brand-statement">
              <span>للزواج الإسلامي الجاد</span>
              <h2>البداية الهادئة لقرارٍ يستحق الوضوح.</h2>
              <p>
                هيكل التسجيل الأول مبني على الجدية، التحقق، والقبول المتبادل قبل
                فتح أي محادثة.
              </p>
            </div>

            <div className="trust-points">
              <div>
                <ShieldCheck />
                <span>
                  <strong>ملفات حقيقية فقط</strong>
                  <small>مراجعة وتوثيق قبل الظهور</small>
                </span>
              </div>
              <div>
                <EyeOff />
                <span>
                  <strong>الخصوصية أساس التجربة</strong>
                  <small>لا محادثة دون قبول متبادل</small>
                </span>
              </div>
              <div>
                <HeartHandshake />
                <span>
                  <strong>دفع مرة واحدة</strong>
                  <small>لا اشتراك ولا تجديد تلقائي</small>
                </span>
              </div>
            </div>
          </div>

          <div className="founding-note">
            <Sparkles />
            <p>
              <strong>إطلاق على مراحل</strong>
              نبدأ بالنساء، ثم نفتح الرجال عند توفر عدد مناسب من الملفات النشطة.
            </p>
          </div>
        </aside>

        <section className="flow-panel">
          <div className="flow-shell">
            <div className="progress-area" aria-label="تقدم التسجيل">
              <div className="progress-copy">
                <span>تجهيز الحساب</span>
                <strong>{stepProgress[step]}%</strong>
              </div>
              <Progress value={stepProgress[step]} />
            </div>

            {step !== "entry" ? (
              <Button
                type="button"
                variant="ghost"
                className="back-button"
                onClick={goBack}
              >
                <ArrowRight />
                رجوع
              </Button>
            ) : null}

            {step === "entry" ? (
              <section className="step-content">
                <StepHeader
                  eyebrow="أهلاً بك في عَهْد"
                  title="كيف تريد بدء رحلتك؟"
                  description="اختر نوع الحساب حتى نعرض لك مرحلة التسجيل المناسبة. التسجيل متاح للبالغين 18 عاماً فما فوق فقط."
                />

                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as Gender)}
                  className="gender-grid"
                >
                  <Label
                    htmlFor="gender-woman"
                    className="choice-card choice-card--open"
                  >
                    <RadioGroupItem value="woman" id="gender-woman" />
                    <span className="choice-icon">
                      <CircleUserRound />
                    </span>
                    <span className="choice-copy">
                      <span className="status-pill status-pill--open">
                        التسجيل مفتوح
                      </span>
                      <strong>حساب امرأة</strong>
                      <small>50 درهماً لمرة واحدة بعد قبول وتوثيق الملف</small>
                    </span>
                    <ChevronLeft className="choice-arrow" />
                  </Label>

                  <Label htmlFor="gender-man" className="choice-card">
                    <RadioGroupItem value="man" id="gender-man" />
                    <span className="choice-icon">
                      <UsersRound />
                    </span>
                    <span className="choice-copy">
                      <span className="status-pill">قائمة انتظار</span>
                      <strong>حساب رجل</strong>
                      <small>لن يتم تحصيل 150 درهماً قبل فتح التسجيل</small>
                    </span>
                    <ChevronLeft className="choice-arrow" />
                  </Label>
                </RadioGroup>

                <Button
                  type="button"
                  size="lg"
                  className="primary-action"
                  disabled={!gender}
                  onClick={continueFromEntry}
                >
                  متابعة
                  <ArrowLeft />
                </Button>
                <p className="microcopy">
                  بالمتابعة أنت لا تدفع أي مبلغ الآن. الدفع يُفتح فقط بعد مراجعة
                  الطلب والموافقة عليه.
                </p>
              </section>
            ) : null}

            {step === "account" ? (
              <form
                className="step-content"
                onSubmit={saveAccountStep}
              >
                <StepHeader
                  eyebrow="الخطوة 1 من 4"
                  title="أنشئي حسابك بأمان"
                  description="هذه البيانات خاصة بالحساب ولا يظهر منها للآخرين إلا ما تختارينه لاحقاً."
                />
                <div className="form-grid">
                  <Field id="firstName" label="الاسم الأول">
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="مثال: مريم"
                      autoComplete="given-name"
                      defaultValue={womanDraft.firstName}
                      required
                    />
                  </Field>
                  <Field id="birthDate" label="تاريخ الميلاد" hint="18+ فقط">
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      autoComplete="bday"
                      defaultValue={womanDraft.birthDate}
                      required
                    />
                  </Field>
                  <Field id="country" label="دولة الإقامة">
                    <NativeSelect
                      id="country"
                      name="country"
                      className="w-full"
                      defaultValue={womanDraft.country}
                      required
                    >
                      <NativeSelectOption value="" disabled>
                        اختاري الدولة
                      </NativeSelectOption>
                      {countries.map((country) => (
                        <NativeSelectOption key={country} value={country}>
                          {country}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field id="city" label="المدينة">
                    <Input
                      id="city"
                      name="city"
                      placeholder="مثال: دبي"
                      autoComplete="address-level2"
                      defaultValue={womanDraft.city}
                      required
                    />
                  </Field>
                  <Field id="email" label="البريد الإلكتروني">
                    <div className="input-with-icon">
                      <Mail />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        dir="ltr"
                        placeholder="name@example.com"
                        autoComplete="email"
                        defaultValue={womanDraft.email}
                        required
                      />
                    </div>
                  </Field>
                  <div className="form-span-2">
                    <Field id="password" label="كلمة المرور" hint="6 أرقام فقط">
                      <div className="input-with-icon">
                        <LockKeyhole />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          dir="ltr"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          title="كلمة المرور يجب أن تتكوّن من 6 أرقام فقط"
                          placeholder="••••••"
                          minLength={6}
                          maxLength={6}
                          autoComplete="new-password"
                          defaultValue={womanDraft.password}
                          onInput={(event) => {
                            event.currentTarget.value = event.currentTarget.value
                              .replace(/\D/g, "")
                              .slice(0, 6);
                          }}
                          required
                        />
                      </div>
                    </Field>
                  </div>
                </div>
                {submitError ? (
                  <p className="form-alert form-alert--error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <Button type="submit" size="lg" className="primary-action">
                  حفظ ومتابعة
                  <ArrowLeft />
                </Button>
              </form>
            ) : null}

            {step === "profile" ? (
              <form
                className="step-content"
                onSubmit={saveProfileStep}
              >
                <StepHeader
                  eyebrow="الخطوة 2 من 4"
                  title="ملف واضح بنية الزواج"
                  description="المعلومات الجادة تساعد على ترشيحات أقرب، من دون تحويل التجربة إلى تصفح سطحي."
                />
                <div className="form-grid">
                  <Field id="maritalStatus" label="الحالة الاجتماعية">
                    <NativeSelect
                      id="maritalStatus"
                      name="maritalStatus"
                      className="w-full"
                      defaultValue={womanDraft.maritalStatus}
                      required
                    >
                      <NativeSelectOption value="" disabled>
                        اختاري الحالة
                      </NativeSelectOption>
                      <NativeSelectOption value="single">لم يسبق لي الزواج</NativeSelectOption>
                      <NativeSelectOption value="divorced">مطلّقة</NativeSelectOption>
                      <NativeSelectOption value="widowed">أرملة</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <Field id="nationality" label="الجنسية">
                    <Input
                      id="nationality"
                      name="nationality"
                      defaultValue={womanDraft.nationality}
                      required
                    />
                  </Field>
                  <Field id="occupation" label="مجال العمل">
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="مثال: التعليم"
                      defaultValue={womanDraft.occupation}
                      required
                    />
                  </Field>
                  <Field id="education" label="المستوى التعليمي">
                    <NativeSelect
                      id="education"
                      name="education"
                      className="w-full"
                      defaultValue={womanDraft.education}
                      required
                    >
                      <NativeSelectOption value="" disabled>
                        اختاري المستوى
                      </NativeSelectOption>
                      <NativeSelectOption value="secondary">ثانوي</NativeSelectOption>
                      <NativeSelectOption value="diploma">دبلوم</NativeSelectOption>
                      <NativeSelectOption value="bachelor">بكالوريوس</NativeSelectOption>
                      <NativeSelectOption value="postgraduate">دراسات عليا</NativeSelectOption>
                    </NativeSelect>
                  </Field>
                  <div className="form-span-2">
                    <Field id="bio" label="نبذة جادة عنك" hint="حتى 400 حرف">
                      <Textarea
                        id="bio"
                        name="bio"
                        maxLength={400}
                        rows={5}
                        placeholder="اكتبي باختصار عن شخصيتك وقيمك وما تتوقعينه من الزواج..."
                        defaultValue={womanDraft.bio}
                        required
                      />
                    </Field>
                  </div>
                  <Field id="preferredAgeFrom" label="العمر المناسب من">
                    <Input
                      id="preferredAgeFrom"
                      name="preferredAgeFrom"
                      type="number"
                      min={18}
                      max={80}
                      placeholder="25"
                      defaultValue={womanDraft.preferredAgeFrom}
                      required
                    />
                  </Field>
                  <Field id="preferredAgeTo" label="إلى">
                    <Input
                      id="preferredAgeTo"
                      name="preferredAgeTo"
                      type="number"
                      min={18}
                      max={80}
                      placeholder="35"
                      defaultValue={womanDraft.preferredAgeTo}
                      required
                    />
                  </Field>
                </div>
                {submitError ? (
                  <p className="form-alert form-alert--error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <Button type="submit" size="lg" className="primary-action">
                  متابعة إلى التوثيق
                  <ArrowLeft />
                </Button>
              </form>
            ) : null}

            {step === "verification" ? (
              <section className="step-content">
                <StepHeader
                  eyebrow="الخطوة 3 من 4"
                  title="الثقة تبدأ من التوثيق"
                  description="لن يظهر مستندك أو بريدك لأي مستخدم. تُستخدم خطوات التوثيق لحماية المجتمع فقط."
                />
                <div className="verification-list">
                  <article>
                    <span className="verification-icon">
                      <Mail />
                    </span>
                    <div>
                      <strong>تأكيد البريد الإلكتروني</strong>
                      <p>رابط تأكيد يُرسل إلى بريدك.</p>
                    </div>
                    <span className="stage-tag">مطلوب</span>
                  </article>
                  <article>
                    <span className="verification-icon">
                      <BadgeCheck />
                    </span>
                    <div>
                      <strong>مطابقة الهوية والعمر</strong>
                      <p>نتحقق أن الحساب لشخص حقيقي بالغ.</p>
                    </div>
                    <span className="stage-tag">مطلوب</span>
                  </article>
                  <article>
                    <span className="verification-icon">
                      <UserRoundCheck />
                    </span>
                    <div>
                      <strong>مطابقة صورة الوجه</strong>
                      <p>فحص سريع لمنع انتحال الهوية.</p>
                    </div>
                    <span className="stage-tag">مطلوب</span>
                  </article>
                </div>
                <Label htmlFor="terms" className="consent-row">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked === true)
                    }
                  />
                  <span>
                    أوافق على سياسة الخصوصية وشروط الاستخدام، وأؤكد أن عمري 18
                    عاماً أو أكثر وأن المعلومات صحيحة.
                  </span>
                </Label>
                <Button
                  type="button"
                  size="lg"
                  className="primary-action"
                  disabled={!termsAccepted}
                  onClick={() => setStep("plans")}
                >
                  متابعة إلى الباقات
                  <ArrowLeft />
                </Button>
                <p className="microcopy">
                  هذه النسخة تعرض هيكل التوثيق فقط؛ رفع المستندات غير مفعّل بعد.
                </p>
              </section>
            ) : null}

            {step === "plans" ? (
              <section className="step-content step-content--wide">
                <StepHeader
                  eyebrow="الخطوة 4 من 4"
                  title="اختاري المستوى المناسب"
                  description="كل باقة تُدفع مرة واحدة فقط. لا يوجد اشتراك شهري أو تجديد تلقائي."
                />
                <RadioGroup
                  value={plan}
                  onValueChange={(value) => setPlan(value as Plan)}
                  className="plan-grid"
                >
                  {(
                    Object.entries(planDetails) as [
                      Plan,
                      (typeof planDetails)[Plan],
                    ][]
                  ).map(([key, item]) => (
                    <Label
                      key={key}
                      htmlFor={`plan-${key}`}
                      className={`plan-card ${key === "pro" ? "plan-card--featured" : ""}`}
                    >
                      {key === "pro" ? (
                        <span className="recommended-badge">الأكثر توازناً</span>
                      ) : null}
                      <div className="plan-topline">
                        <RadioGroupItem value={key} id={`plan-${key}`} />
                        <span>{item.name}</span>
                      </div>
                      <div className="plan-price">
                        <strong>{item.price}</strong>
                        <span>درهماً</span>
                      </div>
                      <p>{item.description}</p>
                      <ul>
                        {item.features.map((feature) => (
                          <li key={feature}>
                            <Check />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Label>
                  ))}
                </RadioGroup>
                <div className="selection-summary">
                  <div>
                    <span>الباقة المختارة</span>
                    <strong>{selectedPlan.name}</strong>
                  </div>
                  <div>
                    <span>الإجمالي لمرة واحدة</span>
                    <strong>{selectedPlan.price} درهماً</strong>
                  </div>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="primary-action"
                  disabled={isSubmitting}
                  onClick={submitWomanRegistration}
                >
                  {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب وحفظ الطلب"}
                  <ArrowLeft />
                </Button>
                {submitError ? (
                  <p className="form-alert form-alert--error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <p className="microcopy">
                  إنشاء الحساب لا يسحب أي مبلغ. الدفع يُفتح فقط بعد مراجعة الملف
                  والموافقة عليه.
                </p>
              </section>
            ) : null}

            {step === "complete" ? (
              <section className="step-content completion-state">
                <span className="completion-icon">
                  <Check />
                </span>
                <span className="step-eyebrow">تم إنشاء الحساب</span>
                <h1>راجعي بريدك لتأكيد الحساب</h1>
                <p>
                  حُفظ طلبك الحقيقي بأمان. أرسلنا رابط التأكيد إلى
                  {registrationEmail ? ` ${registrationEmail}` : " بريدك الإلكتروني"}،
                  وبعد التأكيد ينتقل الملف إلى المراجعة.
                </p>
                <div className="completion-summary">
                  <div>
                    <span>نوع الحساب</span>
                    <strong>امرأة</strong>
                  </div>
                  <div>
                    <span>الباقة</span>
                    <strong>{selectedPlan.name}</strong>
                  </div>
                  <div>
                    <span>حالة الدفع</span>
                    <strong>لاحقاً بعد قبول الملف</strong>
                  </div>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="primary-action"
                  onClick={restart}
                >
                  العودة إلى البداية
                  <ArrowLeft />
                </Button>
              </section>
            ) : null}

            {step === "waitlist" ? (
              <form
                className="step-content"
                onSubmit={submitMenWaitlist}
              >
                <StepHeader
                  eyebrow="التسجيل الرجالي يفتح لاحقاً"
                  title="انضم إلى قائمة الانتظار"
                  description="لن نطلب منك الدفع قبل توفر عدد مناسب من الملفات النسائية الحقيقية والمتوافقة مع معاييرك."
                />
                <div className="waitlist-banner">
                  <ShieldCheck />
                  <p>
                    <strong>السعر عند فتح التسجيل: 150 درهماً</strong>
                    دفعة واحدة بعد قبول الملف، دون اشتراك أو تجديد تلقائي.
                  </p>
                </div>
                <div className="form-grid">
                  <Field id="waitlistName" label="الاسم الأول">
                    <Input id="waitlistName" name="waitlistName" required />
                  </Field>
                  <Field id="waitlistCountry" label="دولة الإقامة">
                    <NativeSelect
                      id="waitlistCountry"
                      name="waitlistCountry"
                      className="w-full"
                      defaultValue=""
                      required
                    >
                      <NativeSelectOption value="" disabled>
                        اختر الدولة
                      </NativeSelectOption>
                      {countries.map((country) => (
                        <NativeSelectOption key={country} value={country}>
                          {country}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field id="waitlistEmail" label="البريد الإلكتروني">
                    <div className="input-with-icon">
                      <Mail />
                      <Input
                        id="waitlistEmail"
                        name="waitlistEmail"
                        type="email"
                        dir="ltr"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </Field>
                </div>
                <Label htmlFor="waitlistTerms" className="consent-row">
                  <Checkbox
                    id="waitlistTerms"
                    checked={waitlistTermsAccepted}
                    onCheckedChange={(checked) =>
                      setWaitlistTermsAccepted(checked === true)
                    }
                  />
                  <span>
                    أوافق على سياسة الخصوصية، وأؤكد أن عمري 18 عاماً أو أكثر.
                  </span>
                </Label>
                <Button
                  type="submit"
                  size="lg"
                  className="primary-action"
                  disabled={!waitlistTermsAccepted || isSubmitting}
                >
                  {isSubmitting
                    ? "جاري حفظ الطلب..."
                    : "الانضمام إلى قائمة الانتظار"}
                  <ArrowLeft />
                </Button>
                {submitError ? (
                  <p className="form-alert form-alert--error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <p className="microcopy">لا دفع ولا بطاقة بنكية في هذه المرحلة.</p>
              </form>
            ) : null}

            {step === "waitlist-complete" && waitlistSent ? (
              <section className="step-content completion-state">
                <span className="completion-icon">
                  <MessageCircleHeart />
                </span>
                <span className="step-eyebrow">قائمة انتظار الرجال</span>
                <h1>تم حفظ طلبك في قائمة الانتظار</h1>
                <p>
                  سيصل إشعار فتح التسجيل فقط بعد تجهيز مجتمع حقيقي مناسب، ومن
                  دون تحصيل أي مبلغ مسبقاً.
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="primary-action"
                  onClick={restart}
                >
                  العودة إلى البداية
                  <ArrowLeft />
                </Button>
              </section>
            ) : null}
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <div>
          <Brand compact />
          <span>للزواج الإسلامي الجاد</span>
        </div>
        <p>الخصوصية · شروط الاستخدام · حذف الحساب</p>
      </footer>
    </main>
  );
}

export default function Home() {
  return <AhedRegistration />;
}
