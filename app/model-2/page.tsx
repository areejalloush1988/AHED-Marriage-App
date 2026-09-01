"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  Handshake,
  Heart,
  Headphones,
  Languages,
  Mail,
  MapPin,
  MessageCircleMore,
  Music2,
  Phone,
  Sparkles,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";

import { AhedBrand } from "@/components/ahed-brand";

import { homeContent, type HomeLocale } from "../home-content";
import styles from "./model-2.module.css";

const fireworkRays = Array.from({ length: 12 }, (_, index) => index);
const compatibilityIcons = [Heart, Sparkles, GraduationCap, Handshake];
const journeyIcons = [UserRoundPlus, ClipboardCheck, UserSearch, MessageCircleMore];

export default function ModelTwo() {
  const [locale, setLocale] = useState<HomeLocale>("ar");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const copy = homeContent[locale];
  const isArabic = locale === "ar";
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  const labels = isArabic
    ? {
        coupleAlt: "رسم فني لعروسين داخل قلب مضيء",
        matchmakerEyebrow: "خدمة الموفّق الشخصي",
        matchmakerTitle: "نبحث لك عن شريك حياة مناسب",
        matchmakerDescription:
          "موفّقون للطرفين يراجعون المواصفات بعناية ويساعدونك في الوصول إلى توافق جاد وواضح.",
        ringsAlt: "يدا زوجين بخاتمين ذهبي وفضي بجوار ورد أبيض",
        journeyAlt: "خيط عهد ذهبي تتدلّى منه بطاقات مراحل الرحلة الأربع",
        journey: "من النية إلى أول حوار",
        principles: "أربع قيم تصنع تجربة مختلفة",
        compatibilityNav: "التوافق",
        compatibilityEyebrow: "بوصلة التوافق",
        compatibilityTitle: "التوافق أعمق من الانطباع الأول.",
        compatibilityDescription:
          "في عَهْد، ننظر إلى ما يصنع حياة مشتركة قابلة للاستمرار.",
        compatibilityFooter: "أربع زوايا تساعدك على قراءة التوافق بوضوح.",
        compatibilityDimensions: [
          {
            title: "القيم",
            description: "مشاركة المبادئ التي توجّه القرارات وتبني الثقة.",
          },
          {
            title: "أسلوب الحياة",
            description: "تقارب العادات والاهتمامات لصناعة حياة يومية مريحة.",
          },
          {
            title: "الطموح",
            description: "انسجام الرؤية والأهداف لبناء مستقبل منسجم.",
          },
          {
            title: "الاستعداد للزواج",
            description: "وضوح النية والجاهزية لبناء علاقة مسؤولة ومستقرة.",
          },
        ],
        storyEyebrow: "قصة عَهْد في ١٥ ثانية",
        storyNav: "قصة عَهْد",
        storyTitle: "مو تعارف عابر… عَهْد للزواج الجاد.",
        storyDescription: "نية واضحة، خصوصية، وقبول متبادل — من أول خطوة حتى بداية حوار جاد.",
        storyStages: ["النية", "الخصوصية", "العَهْد"],
        storyVideoLabel: "فيديو تعريفي عن تجربة عَهْد للزواج الجاد",
        storyVideoFallback: "متصفحك لا يدعم تشغيل الفيديو.",
        faqAnswer: "الإجابة",
        faqOpen: "اضغط لفتح الباب",
        faqOpenLabel: "فتح الباب وقراءة الإجابة",
        faqCloseLabel: "إغلاق باب الإجابة",
        faqHint: "اختر سؤالاً ليفتح بابه وتظهر الإجابة",
        decisionProfileTitle: "ملفك أول خطوة نحو التوافق",
        decisionProfileDescription:
          "أنشئ ملفك وحدّد مواصفات الشريك الذي تبحث عنه.",
        decisionProfileAction: "أنشئ ملفك",
        decisionMatchmakerTitle: "نرافقك في الاختيار",
        decisionMatchmakerDescription:
          "موفّق شخصي يساعدك للوصول إلى ترشيحات جادة.",
        decisionMatchmakerAction: "تعرّف إلى الموفّق",
        decisionChoiceTitle: "اختر الطريق الأنسب لك",
        decisionChooseProfile: "ابدأ بإنشاء ملفك",
        decisionChooseMatchmaker: "دع الموفّق يساعدك",
        profileAge: "العمر",
        profileLocation: "الموقع",
        profileEducation: "المستوى التعليمي",
        profilePreferences: "المواصفات",
        email: "البريد الرسمي",
        website: "الموقع الرسمي",
        call: "طلب اتصال",
        callValue: "تواصل مع فريق عَهْد",
        tiktok: "تيك توك",
        support: "الدعم",
      }
    : {
        coupleAlt: "Gold line-art bride and groom inside a glowing heart",
        matchmakerEyebrow: "Personal matchmaker service",
        matchmakerTitle: "We help you find the right life partner",
        matchmakerDescription:
          "Dedicated matchmakers support both sides, review preferences carefully, and help you reach a serious, compatible match.",
        ringsAlt: "A couple wearing gold and silver wedding rings beside white roses",
        journeyAlt: "Four AHED journey cards suspended from a golden commitment thread",
        journey: "From intention to the first conversation",
        principles: "Four values shaping a different experience",
        compatibilityNav: "Compatibility",
        compatibilityEyebrow: "Compatibility compass",
        compatibilityTitle: "Compatibility goes deeper than a first impression.",
        compatibilityDescription:
          "At AHED, we look at what makes a shared life capable of lasting.",
        compatibilityFooter: "Four dimensions that help you read compatibility clearly.",
        compatibilityDimensions: [
          {
            title: "Values",
            description: "Shared principles that guide decisions and build trust.",
          },
          {
            title: "Lifestyle",
            description: "Aligned habits and interests for a comfortable daily life.",
          },
          {
            title: "Ambition",
            description: "A compatible vision and goals for a shared future.",
          },
          {
            title: "Readiness for marriage",
            description: "Clear intention and readiness for a responsible, stable bond.",
          },
        ],
        storyEyebrow: "AHED in 15 seconds",
        storyNav: "Our story",
        storyTitle: "Not casual dating… AHED is for serious marriage.",
        storyDescription: "Clear intention, privacy, and mutual acceptance — from the first step to a serious conversation.",
        storyStages: ["Intention", "Privacy", "Commitment"],
        storyVideoLabel: "An introduction to the AHED serious-marriage experience",
        storyVideoFallback: "Your browser does not support video playback.",
        faqAnswer: "Answer",
        faqOpen: "Open the door",
        faqOpenLabel: "Open the door and read the answer",
        faqCloseLabel: "Close the answer door",
        faqHint: "Choose a question to open its door and reveal the answer",
        decisionProfileTitle: "Your profile is the first step toward compatibility",
        decisionProfileDescription:
          "Create your profile and define the qualities you seek in a partner.",
        decisionProfileAction: "Create your profile",
        decisionMatchmakerTitle: "We accompany you in the choice",
        decisionMatchmakerDescription:
          "A personal matchmaker helps you reach serious recommendations.",
        decisionMatchmakerAction: "Meet the matchmaker",
        decisionChoiceTitle: "Choose the path that suits you",
        decisionChooseProfile: "Start with your profile",
        decisionChooseMatchmaker: "Let a matchmaker help",
        profileAge: "Age",
        profileLocation: "Location",
        profileEducation: "Education",
        profilePreferences: "Preferences",
        email: "Official email",
        website: "Official website",
        call: "Request a call",
        callValue: "Contact the AHED team",
        tiktok: "TikTok",
        support: "Support",
      };

  return (
    <main
      id="top"
      className={styles.site}
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className={styles.verseBar}>
        <p>
          <span>{copy.announcement.text}</span>
          <small>{copy.announcement.reference}</small>
        </p>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brandLink} href="#top" aria-label={copy.brandHomeLabel}>
            <AhedBrand alt="" className={styles.brandLogo} priority />
          </a>

          <nav className={styles.nav} aria-label={copy.navLabel}>
            <a href="#how">{copy.nav.how}</a>
            <a href="#why">{copy.nav.why}</a>
            <a href="#compatibility">{labels.compatibilityNav}</a>
            <a href="#story">{labels.storyNav}</a>
            <a href="#faq">{copy.nav.faq}</a>
          </nav>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.languageButton}
              aria-label={copy.languageLabel}
              onClick={() => setLocale(isArabic ? "en" : "ar")}
            >
              <Languages aria-hidden="true" />
              <span>{copy.languageButton}</span>
            </button>
            <Link className={styles.loginButton} href="/login">
              {copy.actions.login}
            </Link>
            <Link className={styles.createButton} href="/register">
              {copy.actions.create}
              <DirectionalArrow aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.hero} data-hero-layout="static-couple">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrowLight}>
            <Sparkles aria-hidden="true" />
            {copy.hero.eyebrow}
          </span>
          <h1>
            {copy.hero.title}
            <em>{copy.hero.titleAccent}</em>
          </h1>
          <p>{copy.hero.description}</p>
          <span className={styles.heroNote}>
            <Heart aria-hidden="true" />
            {copy.hero.note}
          </span>
        </div>

        <div className={styles.heroArtwork}>
          <span
            className={`${styles.firework} ${styles.fireworkLeft}`}
            aria-hidden="true"
          >
            {fireworkRays.map((ray) => (
              <i key={ray} />
            ))}
          </span>
          <span
            className={`${styles.firework} ${styles.fireworkRight}`}
            aria-hidden="true"
          >
            {fireworkRays.map((ray) => (
              <i key={ray} />
            ))}
          </span>
          <span
            className={`${styles.firework} ${styles.fireworkTop}`}
            aria-hidden="true"
          >
            {fireworkRays.map((ray) => (
              <i key={ray} />
            ))}
          </span>
          <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true">
            <Sparkles />
          </span>
          <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true">
            <Sparkles />
          </span>
          <span className={`${styles.spark} ${styles.sparkThree}`} aria-hidden="true">
            <Sparkles />
          </span>
          <div className={styles.coupleStage}>
            <Image
              alt={labels.coupleAlt}
              className={styles.coupleImage}
              height={1024}
              priority
              sizes="(max-width: 920px) calc(100vw - 40px), 52vw"
              src="/ahed-couple-v2.webp"
              width={1536}
            />
          </div>
        </div>

        <div className={styles.freeRibbon} aria-label={labels.matchmakerTitle}>
          <Handshake aria-hidden="true" />
          <div>
            <small>{labels.matchmakerEyebrow}</small>
            <strong>{labels.matchmakerTitle}</strong>
          </div>
          <p>{labels.matchmakerDescription}</p>
        </div>
      </section>

      <section id="how" className={styles.journeySection}>
        <div className={styles.editorialHeading}>
          <span>01</span>
          <div>
            <small>{labels.journey}</small>
            <h2>{copy.process.title}</h2>
            <p>{copy.process.description}</p>
          </div>
        </div>

        <div className={styles.journeyVisual}>
          <div
            aria-label={labels.journeyAlt}
            className={styles.journeyPath}
            role="group"
          >
            <svg
              aria-hidden="true"
              className={styles.journeyThread}
              preserveAspectRatio="none"
              viewBox="0 0 1400 100"
            >
              <defs>
                <linearGradient id="journey-rope-gold" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#9b5f18" />
                  <stop offset="0.23" stopColor="#f1cf90" />
                  <stop offset="0.5" stopColor="#c88d34" />
                  <stop offset="0.76" stopColor="#faf0cf" />
                  <stop offset="1" stopColor="#9b5f18" />
                </linearGradient>
              </defs>

              <path
                className={styles.journeyRopeShadow}
                d="M-10 50 C55 76 110 30 175 50 S350 64 525 50 C580 42 610 65 650 52 C690 40 710 66 750 52 C790 38 820 62 875 50 S1050 70 1225 50 S1350 64 1410 50"
              />
              <path
                className={styles.journeyRopeMain}
                d="M-10 50 C55 76 110 30 175 50 S350 64 525 50 C580 42 610 65 650 52 C690 40 710 66 750 52 C790 38 820 62 875 50 S1050 70 1225 50 S1350 64 1410 50"
              />
              <path
                className={styles.journeyRopeHighlight}
                d="M-10 50 C55 76 110 30 175 50 S350 64 525 50 C580 42 610 65 650 52 C690 40 710 66 750 52 C790 38 820 62 875 50 S1050 70 1225 50 S1350 64 1410 50"
              />
              <path
                className={styles.journeyRopeBraid}
                d="M-10 50 C55 76 110 30 175 50 S350 64 525 50 C580 42 610 65 650 52 C690 40 710 66 750 52 C790 38 820 62 875 50 S1050 70 1225 50 S1350 64 1410 50"
              />

              <g className={styles.journeyKnot}>
                <path
                  className={styles.journeyRopeShadow}
                  d="M610 52 C640 17 675 17 700 52 C725 87 760 87 790 52 C760 17 725 17 700 52 C675 87 640 87 610 52"
                />
                <path
                  className={styles.journeyRopeMain}
                  d="M610 52 C640 17 675 17 700 52 C725 87 760 87 790 52 C760 17 725 17 700 52 C675 87 640 87 610 52"
                />
                <path
                  className={styles.journeyRopeHighlight}
                  d="M610 52 C640 17 675 17 700 52 C725 87 760 87 790 52 C760 17 725 17 700 52 C675 87 640 87 610 52"
                />
                <path
                  className={styles.journeyRopeBraid}
                  d="M610 52 C640 17 675 17 700 52 C725 87 760 87 790 52 C760 17 725 17 700 52 C675 87 640 87 610 52"
                />
              </g>
            </svg>

            <ol className={styles.journeySteps}>
              {copy.process.steps.map((step, index) => {
                const JourneyIcon = journeyIcons[index];

                return (
                  <li key={step.number} className={styles.journeyStep}>
                    <span className={styles.journeyMedallion}>
                      {step.number}
                    </span>
                    <span className={styles.journeyDrop} aria-hidden="true" />
                    <div className={styles.journeyCardFrame}>
                      <svg
                        aria-hidden="true"
                        className={styles.journeyCardShape}
                        preserveAspectRatio="none"
                        viewBox="0 0 300 360"
                      >
                        <path d="M20 34 H119 C126 34 130 31 134 24 L144 9 C148 3 152 3 156 9 L166 24 C170 31 174 34 181 34 H280 C288 34 293 39 293 47 V334 C293 346 286 353 274 353 H26 C14 353 7 346 7 334 V47 C7 39 12 34 20 34 Z" />
                      </svg>
                      <div className={styles.journeyCard}>
                        <JourneyIcon aria-hidden="true" />
                        <span className={styles.journeyOrnament} aria-hidden="true" />
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section id="why" className={styles.ringsStory}>
        <div className={styles.ringsVisual}>
          <Image
            alt={labels.ringsAlt}
            className={styles.ringsImage}
            height={735}
            sizes="(max-width: 620px) calc(100vw - 20px), (max-width: 920px) 58vw, 58vw"
            src="/ahed-rings-hands-v1.webp"
            width={1456}
          />
          <span className={styles.ringsGlint} aria-hidden="true" />
        </div>

        <div className={styles.ringsContent}>
          <span className={styles.storyIndex}>02</span>
          <small>{labels.principles}</small>
          <h2>{copy.why.title}</h2>
          <p>{copy.why.description}</p>
        </div>

        <ol className={`${styles.principleGroup} ${styles.principlesUnderVisual}`}>
          {copy.why.principles.slice(0, 2).map((principle, index) => (
            <li key={principle.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <ol className={`${styles.principleGroup} ${styles.principlesUnderContent}`} start={3}>
          {copy.why.principles.slice(2).map((principle, index) => (
            <li key={principle.title}>
              <span>0{index + 3}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="compatibility" className={styles.compatibilitySection}>
        <header className={styles.compatibilityHeader}>
          <span className={styles.storyIndex}>03</span>
          <small>{labels.compatibilityEyebrow}</small>
          <h2>{labels.compatibilityTitle}</h2>
          <p>{labels.compatibilityDescription}</p>
        </header>

        <div className={styles.compatibilityMap}>
          <div className={styles.compatibilityCompass} aria-hidden="true">
            <span className={styles.compassFace}>
              <span className={styles.compassNeedle} />
              <span className={styles.compassPin} />
            </span>
          </div>

          <ol className={styles.compatibilityCards}>
            {labels.compatibilityDimensions.map((dimension, index) => {
              const DimensionIcon = compatibilityIcons[index];

              return (
                <li key={dimension.title}>
                  <span className={styles.compatibilityIcon}>
                    <DimensionIcon aria-hidden="true" />
                  </span>
                  <h3>{dimension.title}</h3>
                  <p>{dimension.description}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <p className={styles.compatibilityFooter}>{labels.compatibilityFooter}</p>
      </section>

      <section id="story" className={styles.storySection}>
        <header className={styles.storyIntro}>
          <AhedBrand alt="" className={styles.storyBrand} />
          <small>{labels.storyEyebrow}</small>
          <h2>{labels.storyTitle}</h2>
          <p>{labels.storyDescription}</p>
        </header>

        <div className={styles.storyPlayerShell}>
          <span className={styles.storyCornerTop} aria-hidden="true" />
          <video
            aria-label={labels.storyVideoLabel}
            autoPlay
            className={styles.storyVideo}
            controls
            loop
            muted
            playsInline
            poster="/images/model-2/ahed-story-v1-poster.webp"
            preload="metadata"
          >
            <source src="/images/model-2/ahed-story-v1.mp4" type="video/mp4" />
            {labels.storyVideoFallback}
          </video>
          <span className={styles.storyCornerBottom} aria-hidden="true" />
        </div>

        <div className={styles.storyTimeline} aria-label={labels.storyEyebrow}>
          <ol>
            {labels.storyStages.map((stage, index) => (
              <li key={stage}>
                <span aria-hidden="true">0{index + 1}</span>
                <strong>{stage}</strong>
              </li>
            ))}
          </ol>
          <div className={styles.storyTimes} aria-hidden="true">
            <span>00:00</span>
            <span>00:15</span>
          </div>
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.faqHeading}>
          <span className={styles.eyebrow}>{copy.faq.eyebrow}</span>
          <h2>{copy.faq.title}</h2>
          <p>{copy.faq.description}</p>
          <span className={styles.faqDoorHint}>
            <Sparkles aria-hidden="true" />
            {labels.faqHint}
          </span>
        </div>

        <ol className={styles.faqDoors} aria-label={copy.faq.eyebrow}>
          {copy.faq.items.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const answerId = `faq-door-answer-${index}`;

            return (
              <li
                key={faq.question}
                className={`${styles.faqDoor} ${isOpen ? styles.faqDoorOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.faqDoorStage}
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? labels.faqCloseLabel : labels.faqOpenLabel}: ${faq.question}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                >
                  <span
                    id={answerId}
                    className={styles.faqDoorAnswer}
                    aria-hidden={!isOpen}
                  >
                    <span className={styles.faqDoorAnswerLabel}>{labels.faqAnswer}</span>
                    <span className={styles.faqDoorAnswerQuestion}>{faq.question}</span>
                    <span className={styles.faqDoorAnswerText}>{faq.answer}</span>
                  </span>

                  <span className={styles.faqDoorLeaf} aria-hidden="true">
                    <span className={styles.faqDoorNumber}>0{index + 1}</span>
                    <span className={styles.faqDoorDivider} />
                    <span className={styles.faqDoorQuestion}>{faq.question}</span>
                    <span className={styles.faqDoorKnocker}>
                      <span />
                    </span>
                    <span className={styles.faqDoorPrompt}>{labels.faqOpen}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <a className={styles.faqContact} href="mailto:info@ahedmarriage.com">
          <Mail aria-hidden="true" />
          info@ahedmarriage.com
        </a>
      </section>

      <section className={styles.decisionSection} aria-labelledby="decision-title">
        <div className={styles.decisionCards}>
          <article className={`${styles.decisionCard} ${styles.decisionMatchmakerCard}`}>
            <div className={styles.decisionMatchmakerVisual} aria-hidden="true">
              <span className={styles.decisionVisualHalo}>
                <UserSearch />
              </span>
              <span className={styles.decisionVisualOrnament} />
            </div>

            <div className={styles.decisionCardCopy}>
              <span className={styles.decisionCardEyebrow}>{labels.matchmakerEyebrow}</span>
              <h2>{labels.decisionMatchmakerTitle}</h2>
              <span className={styles.decisionCardDivider} aria-hidden="true" />
              <p>{labels.decisionMatchmakerDescription}</p>
              <a
                className={styles.decisionCardAction}
                href="mailto:info@ahedmarriage.com?subject=AHED%20Personal%20Matchmaker"
              >
                {labels.decisionMatchmakerAction}
                <DirectionalArrow aria-hidden="true" />
              </a>
            </div>
          </article>

          <article className={`${styles.decisionCard} ${styles.decisionProfileCard}`}>
            <div className={styles.decisionCardCopy}>
              <span className={styles.decisionCardEyebrow}>{copy.final.eyebrow}</span>
              <h2>{labels.decisionProfileTitle}</h2>
              <span className={styles.decisionCardDivider} aria-hidden="true" />
              <p>{labels.decisionProfileDescription}</p>
              <Link className={styles.decisionCardAction} href="/register">
                {labels.decisionProfileAction}
                <DirectionalArrow aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.decisionProfileVisual} aria-hidden="true">
              <span className={styles.decisionProfileAvatar}>
                <UserRoundPlus />
              </span>
              <span className={styles.decisionProfileRule} />
              <span>
                <CalendarDays />
                {labels.profileAge}
              </span>
              <span>
                <MapPin />
                {labels.profileLocation}
              </span>
              <span>
                <GraduationCap />
                {labels.profileEducation}
              </span>
              <span>
                <Heart />
                {labels.profilePreferences}
              </span>
            </div>
          </article>
        </div>

        <div className={styles.decisionChoice}>
          <span className={styles.decisionChoiceOrnament} aria-hidden="true">
            <Sparkles />
          </span>
          <h2 id="decision-title">{labels.decisionChoiceTitle}</h2>
          <span className={styles.decisionChoiceDivider} aria-hidden="true" />
          <div className={styles.decisionChoiceActions}>
            <Link className={styles.decisionChoiceButton} href="/register">
              <UserRoundPlus aria-hidden="true" />
              {labels.decisionChooseProfile}
            </Link>
            <a
              className={styles.decisionChoiceButton}
              href="mailto:info@ahedmarriage.com?subject=AHED%20Personal%20Matchmaker"
            >
              <UserSearch aria-hidden="true" />
              {labels.decisionChooseMatchmaker}
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrandLockup} aria-label="شعار عَهْد" role="img">
          <AhedBrand alt="" className={styles.footerBrandLogo} />
        </div>
        <p>{copy.footer.description}</p>

        <div className={styles.footerContacts}>
          <a href="mailto:info@ahedmarriage.com">
            <Mail aria-hidden="true" />
            <span>
              <small>{labels.email}</small>
              <strong>info@ahedmarriage.com</strong>
            </span>
          </a>
          <a href="https://www.ahedmarriage.com">
            <Globe2 aria-hidden="true" />
            <span>
              <small>{labels.website}</small>
              <strong>www.ahedmarriage.com</strong>
            </span>
          </a>
          <a href="mailto:info@ahedmarriage.com?subject=AHED%20Call%20Request">
            <Phone aria-hidden="true" />
            <span>
              <small>{labels.call}</small>
              <strong>{labels.callValue}</strong>
            </span>
          </a>
        </div>

        <div className={styles.footerSideActions}>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label={labels.tiktok}
            title={labels.tiktok}
          >
            <Music2 aria-hidden="true" />
          </a>
          <a
            href="mailto:info@ahedmarriage.com?subject=AHED%20Support"
            aria-label={labels.support}
          >
            <Headphones aria-hidden="true" />
            <span>{labels.support}</span>
          </a>
        </div>

        <div className={styles.footerBottom}>
          <span>{copy.footer.copyright}</span>
          <nav aria-label={copy.footer.navLabel}>
            <a href="#compatibility">{labels.compatibilityNav}</a>
            <a href="#faq">{copy.footer.faq}</a>
            <Link href="/login">{copy.footer.login}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
