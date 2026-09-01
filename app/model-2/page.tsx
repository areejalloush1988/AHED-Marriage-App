"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Languages,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";

import { AhedBrand, AhedWordmark } from "@/components/ahed-brand";

import { homeContent, type HomeLocale } from "../home-content";
import styles from "./model-2.module.css";

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
        ringsAlt: "خاتما زواج على قماش خمري",
        journey: "من النية إلى أول حوار",
        principles: "أربع قيم تصنع تجربة مختلفة",
        privacyPromise: "وعد الخصوصية",
        membership: "مسارات العضوية",
      }
    : {
        model: "Design model 2",
        first: "Open model 1",
        coupleAlt: "Gold line-art bride and groom inside a glowing heart",
        ringsAlt: "Wedding rings on burgundy silk",
        journey: "From intention to the first conversation",
        principles: "Four values shaping a different experience",
        privacyPromise: "The privacy promise",
        membership: "Membership paths",
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

        <div className={styles.journeyPath}>
          <span className={styles.pathLine} aria-hidden="true" />
          {copy.process.steps.map((step) => (
            <article key={step.number} className={styles.journeyStop}>
              <span className={styles.stopNumber}>{step.number}</span>
              <span className={styles.stopDot} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className={styles.ringsStory}>
        <Image
          alt={labels.ringsAlt}
          className={styles.ringsImage}
          fill
          sizes="(max-width: 800px) 100vw, 1400px"
          src="/ahed-rings-v2.webp"
        />
        <div className={styles.ringsShade} aria-hidden="true" />
        <span className={styles.ringsGlint} aria-hidden="true" />
        <div className={styles.ringsContent}>
          <span className={styles.storyIndex}>02</span>
          <small>{labels.principles}</small>
          <h2>{copy.why.title}</h2>
          <p>{copy.why.description}</p>

          <ol className={styles.principleLines}>
            {copy.why.principles.map((principle, index) => (
              <li key={principle.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
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
        <div className={styles.footerBrand} aria-label="شعار عَهْد" role="img">
          <AhedWordmark className={styles.footerWordmark} />
        </div>
        <p>{copy.footer.description}</p>
        <a href="mailto:info@ahedmarriage.com">info@ahedmarriage.com</a>
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
