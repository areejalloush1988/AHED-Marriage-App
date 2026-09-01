import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  CircleCheckBig,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  MessageCircleHeart,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";

import "./website.css";

const LOGO = "/ahed-logo.webp";

const trustItems = [
  { icon: ShieldCheck, title: "خصوصية من البداية", text: "بيانات التواصل لا تظهر لأي مستخدم آخر." },
  { icon: BadgeCheck, title: "ملفات موثقة", text: "المراجعة والتوثيق قبل الظهور داخل المنصة." },
  { icon: HeartHandshake, title: "نية واضحة للزواج", text: "تجربة مصممة للزواج الجاد لا للعلاقات العابرة." },
  { icon: LockKeyhole, title: "تواصل بضوابط", text: "فتح المحادثة بعد القبول المتبادل فقط." },
];

const plans = [
  {
    name: "عَهْد الأساسي",
    subtitle: "دخول موثّق إلى المنصة والبدء في رحلة البحث الجاد.",
    women: "50",
    men: "150",
    features: ["ملف شخصي موثّق", "طلبات تواصل للزواج", "محادثة بعد القبول"],
  },
  {
    name: "عَهْد Pro",
    subtitle: "تحكم وخصوصية أكبر مع أدوات بحث وترشيح متقدمة.",
    women: "250",
    men: "350",
    featured: true,
    features: ["جميع مزايا الأساسي", "فلاتر بحث دقيقة", "خيارات ظهور وخصوصية إضافية"],
  },
  {
    name: "الموفّق الشخصي",
    subtitle: "خدمة مخصصة لمن يريد ترشيحات مدروسة ومتابعة شخصية.",
    women: "850",
    men: "950",
    features: ["جميع مزايا Pro", "جلسة تعريف", "ترشيحات يدوية مدروسة"],
  },
];

export default function WebsiteConceptPage() {
  return (
    <main className="website-page" dir="rtl">
      <nav className="website-nav">
        <div className="website-wrap">
          <Link className="website-logo-link" href="/website" aria-label="عهد">
            <Image
              alt="شعار عَهْد"
              className="website-logo"
              height={925}
              priority
              src={LOGO}
              width={2048}
            />
          </Link>

          <div className="website-navlinks">
            <a href="#how">كيف يعمل عهد</a>
            <a href="#privacy">الخصوصية</a>
            <a href="#plans">الباقات</a>
          </div>

          <div className="website-nav-actions">
            <Link className="site-btn site-btn--soft" href="/login">تسجيل الدخول</Link>
            <Link className="site-btn site-btn--primary" href="/register">إنشاء حساب</Link>
          </div>
        </div>
      </nav>

      <section className="website-hero">
        <div className="website-wrap hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker">منصة زواج جاد وموثوق</span>
            <h1>
              لأن الزواج قرار حياة،
              <span>البداية لازم تكون واضحة.</span>
            </h1>
            <p>
              عَهْد مساحة مخصصة لمن يبحث عن شريك حياة بنية زواج حقيقية، ضمن تجربة تحترم الخصوصية، توثّق الملفات، وتنظّم التواصل بين الطرفين.
            </p>

            <div className="hero-actions">
              <Link className="site-btn site-btn--primary" href="/register">ابدأ طلب الزواج</Link>
              <a className="site-btn site-btn--soft" href="#how">اكتشف طريقة العمل</a>
            </div>

            <div className="hero-mini">
              <span><CircleCheckBig /> 18+ فقط</span>
              <span><CircleCheckBig /> بدون تجديد تلقائي</span>
              <span><CircleCheckBig /> خصوصية عالية</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="معاينة لهوية منصة عهد">
            <div className="hero-phone">
              <div className="hero-phone-top">
                <Image
                  alt=""
                  className="hero-phone-logo"
                  height={925}
                  src={LOGO}
                  width={2048}
                />
                <span className="hero-phone-dot" />
              </div>

              <div className="hero-profile">
                <div className="hero-profile-art" />
                <div className="hero-profile-copy">
                  <div className="hero-profile-row">
                    <strong>ملف زواج موثّق</strong>
                    <span className="hero-verified"><BadgeCheck /> موثّق</span>
                  </div>
                  <p>المعلومات الأساسية فقط تظهر بحسب إعدادات الخصوصية.</p>
                  <div className="hero-profile-tags">
                    <span>زواج جاد</span>
                    <span>ملف مكتمل</span>
                    <span>خصوصية مفعّلة</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card--one">
              <strong>قبول متبادل أولاً</strong>
              <small>لا محادثة عشوائية</small>
            </div>
            <div className="floating-card floating-card--two">
              <strong>بياناتك تبقى خاصة</strong>
              <small>أنت تتحكم بما يظهر</small>
            </div>
          </div>
        </div>
      </section>

      <section className="website-trustbar">
        <div className="website-wrap trustbar-grid">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div className="trustbar-item" key={title}>
              <span className="trustbar-icon"><Icon /></span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="site-section" id="how">
        <div className="website-wrap">
          <div className="section-heading">
            <span className="section-kicker">كيف يعمل عَهْد</span>
            <h2>ثلاث خطوات، وكل خطوة لها هدف واضح.</h2>
            <p>لا نريد تجربة مزدحمة. من إنشاء الملف إلى بدء التواصل، كل مرحلة مصممة لتبقي نية الزواج هي الأساس.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <span className="step-card-icon"><UserCheck /></span>
              <h3>أنشئ ملف الزواج</h3>
              <p>أضف معلوماتك الأساسية ومواصفات شريك الحياة، ثم يمر الملف بمرحلة المراجعة والتوثيق.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <span className="step-card-icon"><UsersRound /></span>
              <h3>ابحث بجدية</h3>
              <p>استخدم المواصفات المناسبة لك للوصول إلى ملفات متوافقة مع شروطك ونية الزواج لديك.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <span className="step-card-icon"><MessageCircleHeart /></span>
              <h3>ابدأ التواصل بعد القبول</h3>
              <p>لا تُفتح المحادثة إلا بعد قبول الطرفين، حتى يبقى التواصل هادفًا ومحترمًا من البداية.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="site-section site-section--wine" id="privacy">
        <div className="website-wrap privacy-grid">
          <div className="privacy-copy">
            <span className="section-kicker">الخصوصية ليست ميزة إضافية</span>
            <h2>هي جزء من طريقة عمل عَهْد.</h2>
            <p>صممنا التجربة لتقلل الظهور غير الضروري، وتمنح المستخدم تحكمًا حقيقيًا في ملفه وتواصله.</p>

            <div className="privacy-list">
              <div>
                <EyeOff />
                <span>
                  <strong>معلومات التواصل مخفية</strong>
                  <small>البريد وبيانات الاتصال لا تظهر في الملف العام.</small>
                </span>
              </div>
              <div>
                <ShieldCheck />
                <span>
                  <strong>الملفات تمر بالمراجعة</strong>
                  <small>الهدف تقليل الحسابات غير الجادة قبل ظهورها للآخرين.</small>
                </span>
              </div>
              <div>
                <HeartHandshake />
                <span>
                  <strong>التواصل بإرادة الطرفين</strong>
                  <small>لا يتم فتح المحادثة تلقائيًا دون قبول متبادل.</small>
                </span>
              </div>
            </div>
          </div>

          <div className="privacy-visual">
            <Image
              alt="شعار عَهْد"
              className="privacy-visual-logo"
              height={925}
              src={LOGO}
              width={2048}
            />
            <div className="privacy-stats">
              <div className="privacy-stat"><strong>18+</strong><small>للبالغين فقط</small></div>
              <div className="privacy-stat"><strong>1×</strong><small>دفع لمرة واحدة</small></div>
              <div className="privacy-stat"><strong>خاص</strong><small>بيانات التواصل</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section" id="plans">
        <div className="website-wrap">
          <div className="section-heading">
            <span className="section-kicker">باقات واضحة</span>
            <h2>اختر مستوى الخدمة الذي يناسب رحلتك.</h2>
            <p>جميع الأسعار دفعة واحدة، بدون اشتراك شهري وبدون تجديد تلقائي.</p>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => (
              <article className={`plan-card${plan.featured ? " plan-card--featured" : ""}`} key={plan.name}>
                {plan.featured ? <span className="plan-badge">الأكثر تميزًا</span> : null}
                <h3>{plan.name}</h3>
                <p className="plan-subtitle">{plan.subtitle}</p>
                <div className="plan-price"><strong>{plan.women}</strong><span>درهم للنساء</span></div>
                <p className="plan-secondary-price">{plan.men} درهم للرجال</p>
                <ul className="plan-features">
                  {plan.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}
                </ul>
                <Link className={plan.featured ? "site-btn site-btn--primary" : "site-btn site-btn--soft"} href="/register">
                  اختر هذه الباقة
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="website-cta">
        <div className="website-wrap">
          <div className="cta-card">
            <div className="cta-content">
              <h2>ابدأ بنية واضحة، واترك لعَهْد تنظيم الخطوات.</h2>
              <p>أنشئ حسابك، جهّز ملف الزواج، وحدد مواصفات شريك الحياة ضمن تجربة أكثر هدوءًا وخصوصية.</p>
              <div className="cta-actions">
                <Link className="site-btn site-btn--gold" href="/register">إنشاء حساب جديد</Link>
                <Link className="site-btn site-btn--soft" href="/login">لدي حساب بالفعل</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="website-footer">
        <div className="website-wrap footer-grid">
          <div className="footer-brand">
            <Image
              alt="شعار عَهْد"
              className="website-logo"
              height={925}
              src={LOGO}
              width={2048}
            />
            <p>عَهْد منصة زواج جاد وموثوق، صممت لتجمع بين وضوح النية، الخصوصية، والتواصل المنظم.</p>
          </div>
          <div className="footer-col">
            <strong>عَهْد</strong>
            <a href="#how">كيف يعمل</a>
            <a href="#privacy">الخصوصية</a>
            <a href="#plans">الباقات</a>
          </div>
          <div className="footer-col">
            <strong>التواصل</strong>
            <span>info@ahedmarriage.com</span>
            <Link href="/login">تسجيل الدخول</Link>
            <Link href="/register">إنشاء حساب</Link>
          </div>
        </div>
        <div className="website-wrap footer-bottom">
          <span>© 2026 AHED — عَهْد</span>
          <span>منصة للزواج الجاد والموثوق</span>
        </div>
      </footer>
    </main>
  );
}
