"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Handshake,
  Heart,
  Headphones,
  Languages,
  Mail,
  MessageCircleMore,
  Music2,
  Phone,
  SlidersHorizontal,
  Sparkles,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";

import {
  AhedBrand,
  AhedWordmark,
} from "@/components/ahed-brand";

import { homeContent, type HomeLocale } from "../home-content";
import styles from "./model-2.module.css";

const privacyIcons = [Mail, Handshake, SlidersHorizontal, FileCheck2];
const journeyIcons = [UserRoundPlus, ClipboardCheck, UserSearch, MessageCircleMore];

export default function ModelTwo() {
  const [locale, setLocale] = useState<HomeLocale>("ar");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const copy = homeContent[locale];
  const isArabic = locale === "ar";
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  const labels = isArabic
    ? {
        model: "نموذج التصميم رقم ٢",
        first: "فتح النموذج الأول",
        coupleAlt: "رسم فني لعروسين داخل قلب مضيء",
        ringsAlt: "يدا زوجين بخاتمين ذهبي وفضي بجوار ورد أبيض",
        journeyAlt: "خيط عهد ذهبي تتدلّى منه بطاقات مراحل الرحلة الأربع",
        journey: "من النية إلى أول حوار",
        principles: "أربع قيم تصنع تجربة مختلفة",
        privacyPromise: "وعد الخصوصية",
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
        email: "البريد الرسمي",
        website: "الموقع الرسمي",
        call: "طلب اتصال",
        callValue: "تواصل مع فريق عَهْد",
        tiktok: "تيك توك",
        support: "الدعم",
      }
    : {
        model: "Design model 2",
        first: "Open model 1",
        coupleAlt: "Gold line-art bride and groom inside a glowing heart",
        ringsAlt: "A couple wearing gold and silver wedding rings beside white roses",
        journeyAlt: "Four AHED journey cards suspended from a golden commitment thread",
        journey: "From intention to the first conversation",
        principles: "Four values shaping a different experience",
        privacyPromise: "The privacy promise",
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
      <div className={styles.comparisonBar}>
        <span>{labels.model}</span>
        <Link href="/">
          {labels.first}
          <DirectionalArrow aria-hidden="true" />
        </Link>
      </div>

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
            <a href="#safety">{copy.nav.safety}</a>
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

        <div className={styles.freeRibbon} aria-label={copy.freeJoin.title}>
          <UserRoundPlus aria-hidden="true" />
          <div>
            <small>{copy.freeJoin.eyebrow}</small>
            <strong>{copy.freeJoin.title}</strong>
          </div>
          <p>{copy.freeJoin.description}</p>
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
                  <stop offset="0" stopColor="#a76e1d" />
                  <stop offset="0.23" stopColor="#f2d48a" />
                  <stop offset="0.5" stopColor="#bd8330" />
                  <stop offset="0.76" stopColor="#f7dda0" />
                  <stop offset="1" stopColor="#a56b1d" />
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

      <section id="safety" className={styles.safetyPromise}>
        <header className={styles.safetyHeader}>
          <span className={styles.storyIndex}>03</span>
          <small>{labels.privacyPromise}</small>
        </header>

        <div className={styles.safetyBanner}>
          <span className={styles.safetyBannerFlourish} aria-hidden="true" />
          <h2>{copy.safety.title}</h2>
          <span className={styles.safetyBannerFlourish} aria-hidden="true" />
        </div>

        <p className={styles.safetyDescription}>{copy.safety.description}</p>

        <ol className={styles.safetyScreen}>
          {copy.safety.items.map((item, index) => {
            const PrivacyIcon = privacyIcons[index];

            return (
              <li key={item}>
                <span className={styles.safetyPanelInner}>
                  <span className={styles.safetyPanelIcon}>
                    <PrivacyIcon aria-hidden="true" />
                  </span>
                  <strong>{item}</strong>
                  <span className={styles.safetyPanelDrape} aria-hidden="true" />
                </span>
                {index > 0 ? (
                  <span className={styles.safetyPanelHinges} aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
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

      <section className={styles.finalCta}>
        <span className={styles.finalHeart} aria-hidden="true">
          <Heart />
        </span>
        <span className={styles.eyebrowLight}>{copy.final.eyebrow}</span>
        <h2>{copy.final.title}</h2>
        <p>{copy.final.description}</p>
        <div className={styles.finalActions}>
          <Link className={styles.finalPrimary} href="/register">
            {copy.final.create}
            <DirectionalArrow aria-hidden="true" />
          </Link>
          <Link className={styles.finalSecondary} href="/login">
            {copy.final.login}
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrandLockup} aria-label="شعار عَهْد" role="img">
          <span className={styles.footerLogoIcon} aria-hidden="true">
            <AhedBrand alt="" className={styles.footerLogoSource} />
          </span>
          <AhedWordmark className={styles.footerWordmark} />
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
            <a href="#safety">{copy.footer.privacy}</a>
            <a href="#faq">{copy.footer.faq}</a>
            <Link href="/login">{copy.footer.login}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
