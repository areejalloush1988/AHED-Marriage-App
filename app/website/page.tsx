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

const LOGO = "data:image/webp;base64,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";

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
            <img className="website-logo" src={LOGO} alt="شعار عَهْد" />
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
                <img className="hero-phone-logo" src={LOGO} alt="" />
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
            <img className="privacy-visual-logo" src={LOGO} alt="شعار عَهْد" />
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
            <img className="website-logo" src={LOGO} alt="شعار عَهْد" />
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
