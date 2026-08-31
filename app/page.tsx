import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
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

import { AhedBrand } from "@/components/ahed-brand";

import styles from "./home.module.css";

const principles = [
  {
    icon: ShieldCheck,
    title: "نية زواج واضحة",
    description:
      "المنصة مخصّصة لمن يدخل بهدف الزواج الجاد، وليست مساحة للتعارف العابر.",
  },
  {
    icon: BadgeCheck,
    title: "مراجعة قبل الظهور",
    description:
      "يُراجع الملف وتأكيد البريد قبل تفعيله، مع خطوات تحقق إضافية بحسب مرحلة الإطلاق.",
  },
  {
    icon: EyeOff,
    title: "خصوصية من البداية",
    description:
      "لا يظهر البريد أو أي بيانات تواصل للملفات الأخرى، ولا تبدأ المحادثة دون قبول متبادل.",
  },
  {
    icon: HeartHandshake,
    title: "قبول متبادل",
    description:
      "التواصل يفتح فقط عندما يوافق الطرفان، حتى تبقى الرحلة محترمة وواضحة.",
  },
];

const steps = [
  {
    number: "01",
    title: "أنشئ ملفك",
    description: "أضف معلوماتك الأساسية ومواصفات شريك الحياة بوضوح وصدق.",
  },
  {
    number: "02",
    title: "أكمل المراجعة",
    description: "أكّد بريدك وانتظر مراجعة الملف قبل ظهوره داخل المنصة.",
  },
  {
    number: "03",
    title: "استعرض الترشيحات",
    description: "ابحث وفق مواصفات جدية، واطّلع على الملفات المتوافقة مع معاييرك.",
  },
  {
    number: "04",
    title: "تواصل بعد القبول",
    description: "أرسل طلب توافق، وتبدأ المحادثة فقط بعد موافقة الطرفين.",
  },
];

const plans = [
  {
    name: "عَهْد الأساسي",
    womenPrice: 50,
    menPrice: 150,
    description: "المدخل الواضح لبدء رحلة الزواج الجاد.",
    features: [
      "ملف شخصي بعد المراجعة",
      "البحث والترشيحات الأساسية",
      "طلبات توافق للزواج",
      "محادثة بعد القبول المتبادل",
    ],
  },
  {
    name: "عَهْد Pro",
    womenPrice: 250,
    menPrice: 350,
    description: "تحكم وخصوصية أكبر خلال رحلة البحث.",
    featured: true,
    features: [
      "كل مزايا عَهْد الأساسي",
      "فلاتر بحث أكثر دقة",
      "حفظ مواصفات شريك الحياة",
      "خيارات ظهور وخصوصية إضافية",
    ],
  },
  {
    name: "الموفّق الشخصي",
    womenPrice: 850,
    menPrice: 950,
    description: "ترشيحات مدروسة ومتابعة بشرية عند تفعيل الخدمة.",
    features: [
      "كل مزايا عَهْد Pro",
      "جلسة تعريف بالاحتياجات",
      "ترشيحات يدوية مختارة",
      "متابعة أكثر تخصيصاً",
    ],
  },
];

const faqs = [
  {
    question: "هل عَهْد تطبيق تعارف؟",
    answer:
      "لا. عَهْد منصة مخصّصة للزواج الجاد فقط. بُنيت رحلة الاستخدام حول وضوح النية، مراجعة الملفات، والقبول المتبادل قبل أي محادثة.",
  },
  {
    question: "متى أستطيع بدء المحادثة؟",
    answer:
      "لا تُفتح المحادثة مباشرة. يُرسل طلب توافق للزواج أولاً، وتُفتح المحادثة فقط عندما يوافق الطرف الآخر أيضاً.",
  },
  {
    question: "هل يوجد اشتراك شهري أو تجديد تلقائي؟",
    answer:
      "لا. الأسعار المعروضة دفعة واحدة لكل مستوى، ولا يوجد اشتراك شهري أو تجديد تلقائي.",
  },
  {
    question: "لماذا تسجيل الرجال على قائمة انتظار؟",
    answer:
      "يُطلق عَهْد على مراحل للحفاظ على تجربة متوازنة وحقيقية. تسجيل النساء مفتوح حالياً، ويُفتح تسجيل الرجال عند توفر عدد مناسب من الملفات النشطة.",
  },
  {
    question: "هل تظهر معلومات التواصل للآخرين؟",
    answer:
      "لا يظهر البريد الإلكتروني أو أي بيانات تواصل ضمن الملف العام. التواصل يتم داخل المنصة بعد القبول المتبادل.",
  },
  {
    question: "هل أدفع أثناء إنشاء الحساب؟",
    answer:
      "لا يتم سحب أي مبلغ أثناء إدخال البيانات. الدفع يُفتح بعد قبول الملف وتحديد المستوى المناسب. والرجال لا يُطلب منهم الدفع قبل فتح التسجيل.",
  },
];

function Brand({
  light = false,
  priority = false,
}: {
  light?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={`${styles.brand} ${light ? styles.brandLight : ""}`}>
      <AhedBrand
        alt={light ? "شعار عَهْد" : ""}
        className={styles.brandLogo}
        priority={priority}
      />
    </span>
  );
}

export default function Home() {
  return (
    <main id="top" className={styles.site} dir="rtl">
      <div className={styles.announcement}>
        <span className={styles.announcementDot} />
        منصة مخصّصة للزواج فقط
        <span className={styles.announcementDivider} />
        تسجيل النساء مفتوح الآن
        <span className={styles.announcementDivider} />
        الرجال عبر قائمة الانتظار
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" aria-label="العودة إلى بداية موقع عهد">
            <Brand priority />
          </a>

          <nav className={styles.nav} aria-label="التنقل الرئيسي">
            <a href="#why">لماذا عَهْد؟</a>
            <a href="#how">كيف يعمل؟</a>
            <a href="#safety">الأمان والخصوصية</a>
            <a href="#plans">الباقات</a>
            <a href="#faq">الأسئلة الشائعة</a>
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.loginButton} href="/login">
              تسجيل الدخول
            </Link>
            <Link className={styles.headerPrimary} href="/register">
              إنشاء حساب
              <ArrowLeft />
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Sparkles />
              منصة زواج جاد وموثوق
            </span>
            <h1>
              عَهْد… لأن الزواج
              <span> قرار حياة.</span>
            </h1>
            <p>
              منصة مخصّصة للزواج فقط؛ تجمع أصحاب النية الواضحة ضمن تجربة تبدأ
              بالمراجعة وتحفظ الخصوصية، ولا تفتح التواصل إلا بعد القبول المتبادل.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/register">
                ابدأ رحلة الزواج
                <ArrowLeft />
              </Link>
              <Link className={styles.secondaryButton} href="/inside">
                معاينة المنصة
              </Link>
            </div>

            <div className={styles.heroFacts}>
              <span>
                <UserRoundCheck />
                للبالغين 18+
              </span>
              <span>
                <HeartHandshake />
                تواصل بعد القبول
              </span>
              <span>
                <ShieldCheck />
                خصوصية من البداية
              </span>
              <span>
                <Check />
                دفع مرة واحدة
              </span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="ميثاق عهد للزواج الجاد">
            <span className={`${styles.ornament} ${styles.ornamentOne}`} aria-hidden="true" />
            <span className={`${styles.ornament} ${styles.ornamentTwo}`} aria-hidden="true" />
            <div className={styles.covenantHalo} aria-hidden="true" />

            <div className={styles.marriageSeal}>
              <span>عَهْد</span>
              <small>للزواج فقط</small>
            </div>

            <article className={styles.covenantCard}>
              <span className={styles.covenantKicker}>ميثاق التجربة</span>
              <h2>نية واضحة قبل أي تواصل.</h2>
              <p>
                كل خطوة داخل عَهْد مصممة لتبقى الرحلة جادة ومحترمة، من إنشاء
                الملف وحتى بدء الحوار.
              </p>

              <div className={styles.covenantPoints}>
                <div>
                  <span><BadgeCheck /></span>
                  <p><strong>ملف تحت المراجعة</strong><small>قبل الظهور داخل المنصة</small></p>
                </div>
                <div>
                  <span><EyeOff /></span>
                  <p><strong>بياناتك الخاصة محفوظة</strong><small>لا بريد ولا وسائل تواصل ظاهرة</small></p>
                </div>
                <div>
                  <span><HeartHandshake /></span>
                  <p><strong>قبول متبادل</strong><small>ثم تبدأ المحادثة داخل عَهْد</small></p>
                </div>
              </div>
            </article>

            <div className={styles.promiseLine}>
              <span />
              <strong>نية · احترام · خصوصية</strong>
              <span />
            </div>
            <span className={styles.visualNote}>قرار زواج، لا مساحة للدردشة العشوائية</span>
          </div>
        </div>
      </section>

      <section className={styles.trustBar} aria-label="مبادئ عهد الأساسية">
        <div>
          <ShieldCheck />
          <span>
            <strong>خصوصية أولاً</strong>
            <small>بيانات التواصل غير ظاهرة</small>
          </span>
        </div>
        <div>
          <BadgeCheck />
          <span>
            <strong>ملفات تحت المراجعة</strong>
            <small>قبل تفعيل الظهور داخل المنصة</small>
          </span>
        </div>
        <div>
          <MessageCircleHeart />
          <span>
            <strong>لا محادثة عشوائية</strong>
            <small>التواصل بعد موافقة الطرفين</small>
          </span>
        </div>
      </section>

      <section id="why" className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>فكرة مختلفة من الأساس</span>
          <h2>كل تفصيل في عَهْد يخدم قرار الزواج.</h2>
          <p>
            لا نعتمد على التصفح المفتوح أو الرسائل العشوائية. التجربة مبنية على
            الجدية والاحترام وحماية المعلومات منذ أول خطوة.
          </p>
        </div>

        <div className={styles.principlesGrid}>
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <article key={principle.title} className={styles.principleCard}>
                <span className={styles.iconBox}>
                  <Icon />
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how" className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.processIntro}>
          <span className={styles.eyebrow}>كيف يعمل عَهْد؟</span>
          <h2>رحلة واضحة من إنشاء الملف إلى بدء الحوار.</h2>
          <p>
            أربع مراحل بسيطة تمنع الفوضى وتحافظ على جدية كل خطوة، من دون طلب
            الدفع أثناء إنشاء الحساب.
          </p>
          <Link className={styles.textLink} href="/register">
            ابدأ الآن
            <ArrowLeft />
          </Link>
        </div>

        <div className={styles.stepsList}>
          {steps.map((step) => (
            <article key={step.number} className={styles.stepCard}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="safety" className={styles.safetySection}>
        <div className={styles.safetyVisual} aria-hidden="true">
          <span className={styles.safetyHalo} />
          <span className={styles.safetyLock}>
            <LockKeyhole />
          </span>
          <span className={`${styles.safetyOrbit} ${styles.safetyOrbitOne}`}>
            <EyeOff />
          </span>
          <span className={`${styles.safetyOrbit} ${styles.safetyOrbitTwo}`}>
            <ShieldCheck />
          </span>
          <span className={`${styles.safetyOrbit} ${styles.safetyOrbitThree}`}>
            <UserRoundCheck />
          </span>
        </div>

        <div className={styles.safetyCopy}>
          <span className={styles.eyebrow}>الأمان والخصوصية</span>
          <h2>معلوماتك ليست جزءاً من التصفح.</h2>
          <p>
            صُممت المنصة حتى تبقى بياناتك الحساسة خارج الملفات العامة. البريد
            الإلكتروني ووسائل التواصل لا تظهر للمستخدمين، وتتم المحادثات داخل
            عَهْد بعد موافقة الطرفين فقط.
          </p>
          <ul>
            <li>
              <Check />
              لا يظهر البريد الإلكتروني في الملف العام
            </li>
            <li>
              <Check />
              لا تبدأ المحادثة قبل القبول المتبادل
            </li>
            <li>
              <Check />
              إمكانية التحكم بالظهور ضمن مستويات الخصوصية
            </li>
            <li>
              <Check />
              مراجعة البلاغات والملفات المخالفة
            </li>
          </ul>
        </div>
      </section>

      <section id="plans" className={`${styles.section} ${styles.plansSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>باقات واضحة بلا تجديد تلقائي</span>
          <h2>اختر مستوى الخدمة المناسب.</h2>
          <p>
            جميع الأسعار دفعة واحدة. إنشاء الحساب لا يسحب أي مبلغ، ويُفتح الدفع
            بعد قبول الملف. تسجيل الرجال حالياً عبر قائمة الانتظار.
          </p>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.planCard} ${plan.featured ? styles.planFeatured : ""}`}
            >
              {plan.featured ? (
                <span className={styles.planBadge}>الأكثر توازناً</span>
              ) : null}
              <div className={styles.planHead}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className={styles.priceRows}>
                <div>
                  <span>للنساء</span>
                  <strong>{plan.womenPrice}</strong>
                  <small>درهماً</small>
                </div>
                <div>
                  <span>للرجال</span>
                  <strong>{plan.menPrice}</strong>
                  <small>درهماً</small>
                </div>
              </div>
              <span className={styles.onceLabel}>دفعة واحدة</span>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link className={styles.planButton} href="/register">
                اختيار الباقة
                <ArrowLeft />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.planNotice}>
          <UsersRound />
          <p>
            <strong>الرجال: لا دفع في مرحلة قائمة الانتظار.</strong>
            يصل إشعار فتح التسجيل أولاً، ثم تتم مراجعة الملف قبل إتاحة الدفع.
          </p>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
        <div className={styles.faqIntro}>
          <span className={styles.eyebrow}>أسئلة شائعة</span>
          <h2>إجابات واضحة قبل أن تبدأ.</h2>
          <p>
            ما زال لديك سؤال؟ تواصل مع فريق عَهْد عبر البريد الرسمي وسنجيبك.
          </p>
          <a className={styles.emailLink} href="mailto:info@ahedmarriage.com">
            <Mail />
            info@ahedmarriage.com
          </a>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span className={styles.eyebrow}>ابدأ بنية واضحة</span>
          <h2>قرار الزواج يستحق مساحة أكثر جدية.</h2>
          <p>
            أنشئ حسابك الآن. لن يُطلب منك الدفع أثناء التسجيل، ولن يظهر ملفك قبل
            استكمال المراجعة.
          </p>
        </div>
        <div className={styles.finalActions}>
          <Link className={styles.ctaLight} href="/register">
            إنشاء حساب جديد
            <ArrowLeft />
          </Link>
          <Link className={styles.ctaOutline} href="/login">
            لدي حساب بالفعل
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Brand light />
          <p>
            عَهْد منصة للزواج الجاد، تقوم على وضوح النية والخصوصية والقبول
            المتبادل.
          </p>
          <a href="mailto:info@ahedmarriage.com">info@ahedmarriage.com</a>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 AHED. جميع الحقوق محفوظة.</span>
          <nav aria-label="روابط التذييل">
            <a href="#safety">الخصوصية</a>
            <a href="#faq">الأسئلة الشائعة</a>
            <Link href="/login">تسجيل الدخول</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
