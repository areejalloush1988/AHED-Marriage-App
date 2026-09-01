"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe2,
  Heart,
  Headphones,
  Languages,
  LockKeyhole,
  Mail,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";

import { AhedBrand, AhedWordmark } from "@/components/ahed-brand";

import { homeContent, type HomeLocale } from "../home-content";
import styles from "./model-2.module.css";

const fireworkRays = Array.from({ length: 12 }, (_, index) => index);

const journeyGates = [
  {
    height: 560,
    src: "/ahed-journey-door-01-v1.webp",
    width: 310,
  },
  {
    height: 640,
    src: "/ahed-journey-door-02-v1.webp",
    width: 350,
  },
  {
    height: 720,
    src: "/ahed-journey-door-03-v1.webp",
    width: 360,
  },
  {
    height: 815,
    src: "/ahed-journey-door-04-v1.webp",
    width: 430,
  },
] as const;

export default function ModelTwo() {
  const [locale, setLocale] = useState<HomeLocale>("ar");
  const copy = homeContent[locale];
  const isArabic = locale === "ar";
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  const labels = isArabic
    ? {
        model: "نموذج التصميم رقم ٢",
        first: "فتح النموذج الأول",
        coupleAlt: "رسم فني لعروسين داخل قلب مضيء",
        ringsAlt: "يدا زوجين بخاتمين ذهبي وفضي بجوار ورد أبيض",
        journeyAlt: "أربع بوابات خمرية تمثل مراحل رحلة عَهْد",
        journey: "من النية إلى أول حوار",
        principles: "أربع قيم تصنع تجربة مختلفة",
        privacyPromise: "وعد الخصوصية",
        membership: "مسارات العضوية",
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
        journeyAlt: "Four burgundy gates representing the AHED journey",
        journey: "From intention to the first conversation",
        principles: "Four values shaping a different experience",
        privacyPromise: "The privacy promise",
        membership: "Membership paths",
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
            <a href="#plans">{copy.nav.plans}</a>
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

      <section className={styles.hero}>
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
          <span className={styles.heartPulse} aria-hidden="true">
            <Heart />
          </span>
          <Image
            alt={labels.coupleAlt}
            className={styles.coupleImage}
            height={1024}
            priority
            src="/ahed-couple-v2.webp"
            width={1536}
          />
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
          <ol className={styles.gateGallery}>
            {copy.process.steps.map((step, index) => {
              const gate = journeyGates[index] ?? journeyGates[0];

              return (
                <li key={step.number} className={styles.journeyGate}>
                  <Image
                    alt={`${labels.journeyAlt} ${step.number}`}
                    className={styles.journeyGateImage}
                    height={gate.height}
                    sizes="(max-width: 560px) 88vw, (max-width: 920px) 46vw, 24vw"
                    src={gate.src}
                    width={gate.width}
                  />
                  <div className={styles.journeyGateCopy}>
                    <h3>{step.title}</h3>
                    <span aria-hidden="true" />
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
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
        <div className={styles.safetySymbol} aria-hidden="true">
          <span className={styles.safetyOrbit} />
          <span className={styles.safetyOrbitInner} />
          <LockKeyhole />
        </div>

        <div className={styles.safetyCopy}>
          <span className={styles.storyIndex}>03</span>
          <small>{labels.privacyPromise}</small>
          <h2>{copy.safety.title}</h2>
          <p>{copy.safety.description}</p>
        </div>

        <ul className={styles.safetyList}>
          {copy.safety.items.map((item) => (
            <li key={item}>
              <ShieldCheck aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="plans" className={styles.membershipSection}>
        <div className={styles.editorialHeading}>
          <span>04</span>
          <div>
            <small>{labels.membership}</small>
            <h2>{copy.plans.title}</h2>
            <p>{copy.plans.description}</p>
          </div>
        </div>

        <div className={styles.membershipLadder}>
          {copy.plans.items.map((plan, index) => (
            <article
              key={plan.name}
              className={`${styles.membershipRow} ${plan.featured ? styles.membershipFeatured : ""}`}
            >
              <div className={styles.planIdentity}>
                <span>0{index + 1}</span>
                <div>
                  <small>{plan.featured ? copy.plans.featuredBadge : copy.plans.once}</small>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </div>
              </div>

              <div className={styles.planPrices}>
                <div>
                  <span>{copy.plans.women}</span>
                  <strong>{plan.womenPrice}</strong>
                  <small>{copy.plans.currency}</small>
                </div>
                <div>
                  <span>{copy.plans.men}</span>
                  <strong>{plan.menPrice}</strong>
                  <small>{copy.plans.currency}</small>
                </div>
              </div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link className={styles.planAction} href="/register">
                {copy.plans.select}
                <DirectionalArrow aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.faqHeading}>
          <span className={styles.eyebrow}>{copy.faq.eyebrow}</span>
          <h2>{copy.faq.title}</h2>
          <p>{copy.faq.description}</p>
          <a href="mailto:info@ahedmarriage.com">
            <Mail aria-hidden="true" />
            info@ahedmarriage.com
          </a>
        </div>

        <div className={styles.faqList}>
          {copy.faq.items.map((faq, index) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>
                <span>0{index + 1}</span>
                {faq.question}
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
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
