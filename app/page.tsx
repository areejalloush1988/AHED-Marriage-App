"use client";

import { useMemo, useState } from "react";
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
  Phone,
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

export default function Home() {
  const [step, setStep] = useState<Step>("entry");
  const [gender, setGender] = useState<Gender | undefined>();
  const [plan, setPlan] = useState<Plan>("basic");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [waitlistSent, setWaitlistSent] = useState(false);
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
    setStep(previous[step] ?? "entry");
  };

  const restart = () => {
    setStep("entry");
    setGender(undefined);
    setPlan("basic");
    setTermsAccepted(false);
    setWaitlistSent(false);
  };

  const continueFromEntry = () => {
    if (gender === "woman") setStep("account");
    if (gender === "man") setStep("waitlist");
  };

  return (
    <main className="ahed-app">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand-button" type="button" onClick={restart}>
            <Brand compact />
          </button>
          <div className="launch-chip">
            <span className="live-dot" />
            مرحلة التأسيس للنساء
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
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep("profile");
                }}
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
                      required
                    />
                  </Field>
                  <Field id="birthDate" label="تاريخ الميلاد" hint="18+ فقط">
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      autoComplete="bday"
                      required
                    />
                  </Field>
                  <Field id="country" label="دولة الإقامة">
                    <NativeSelect
                      id="country"
                      name="country"
                      className="w-full"
                      defaultValue=""
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
                      required
                    />
                  </Field>
                  <Field id="phone" label="رقم الهاتف" hint="للتوثيق فقط">
                    <div className="input-with-icon">
                      <Phone />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        dir="ltr"
                        placeholder="+971 5X XXX XXXX"
                        autoComplete="tel"
                        required
                      />
                    </div>
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
                        required
                      />
                    </div>
                  </Field>
                  <div className="form-span-2">
                    <Field id="password" label="كلمة المرور" hint="8 أحرف على الأقل">
                      <div className="input-with-icon">
                        <LockKeyhole />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          dir="ltr"
                          placeholder="••••••••"
                          minLength={8}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </Field>
                  </div>
                </div>
                <Button type="submit" size="lg" className="primary-action">
                  حفظ ومتابعة
                  <ArrowLeft />
                </Button>
              </form>
            ) : null}

            {step === "profile" ? (
              <form
                className="step-content"
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep("verification");
                }}
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
                      defaultValue=""
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
                    <Input id="nationality" name="nationality" required />
                  </Field>
                  <Field id="occupation" label="مجال العمل">
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="مثال: التعليم"
                      required
                    />
                  </Field>
                  <Field id="education" label="المستوى التعليمي">
                    <NativeSelect
                      id="education"
                      name="education"
                      className="w-full"
                      defaultValue=""
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
                      required
                    />
                  </Field>
                </div>
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
                  description="لن يظهر مستندك أو رقمك لأي مستخدم. تُستخدم خطوات التوثيق لحماية المجتمع فقط."
                />
                <div className="verification-list">
                  <article>
                    <span className="verification-icon">
                      <Phone />
                    </span>
                    <div>
                      <strong>تأكيد رقم الهاتف</strong>
                      <p>رمز من ستة أرقام يُرسل إلى رقمك.</p>
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
                  onClick={() => setStep("complete")}
                >
                  تأكيد الباقة
                  <ArrowLeft />
                </Button>
                <p className="microcopy">
                  لن يتم سحب أي مبلغ في هذه النسخة. بوابة الدفع ستُربط قبل الإطلاق
                  العام.
                </p>
              </section>
            ) : null}

            {step === "complete" ? (
              <section className="step-content completion-state">
                <span className="completion-icon">
                  <Check />
                </span>
                <span className="step-eyebrow">اكتملت معاينة الهيكل</span>
                <h1>رحلة التسجيل النسائية جاهزة</h1>
                <p>
                  أصبح لدينا الهيكل الكامل من إنشاء الحساب إلى التوثيق واختيار
                  الباقة. الخطوة التالية هي ربط قاعدة البيانات والدفع الحقيقي.
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
                    <span>الدفع</span>
                    <strong>{selectedPlan.price} درهماً مرة واحدة</strong>
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
                onSubmit={(event) => {
                  event.preventDefault();
                  setWaitlistSent(true);
                  setStep("waitlist-complete");
                }}
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
                  <Field id="waitlistPhone" label="رقم الهاتف">
                    <div className="input-with-icon">
                      <Phone />
                      <Input
                        id="waitlistPhone"
                        name="waitlistPhone"
                        type="tel"
                        dir="ltr"
                        placeholder="+971 5X XXX XXXX"
                        required
                      />
                    </div>
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
                <Button type="submit" size="lg" className="primary-action">
                  الانضمام إلى قائمة الانتظار
                  <ArrowLeft />
                </Button>
                <p className="microcopy">لا دفع ولا بطاقة بنكية في هذه المرحلة.</p>
              </form>
            ) : null}

            {step === "waitlist-complete" && waitlistSent ? (
              <section className="step-content completion-state">
                <span className="completion-icon">
                  <MessageCircleHeart />
                </span>
                <span className="step-eyebrow">قائمة انتظار الرجال</span>
                <h1>تمت معاينة مسار قائمة الانتظار</h1>
                <p>
                  عند ربط قاعدة البيانات سيصل إشعار فتح التسجيل فقط بعد تجهيز
                  مجتمع حقيقي مناسب، ومن دون تحصيل أي مبلغ مسبقاً.
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
