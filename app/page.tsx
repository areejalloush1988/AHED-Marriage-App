"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  EyeOff,
  HeartHandshake,
  HouseHeart,
  Languages,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import { AhedBrand, AhedWordmark } from "@/components/ahed-brand";

import { homeContent, type HomeLocale } from "./home-content";
import styles from "./home.module.css";

const principleIcons = [ShieldCheck, BadgeCheck, EyeOff, HeartHandshake] as const;

function Brand({
  light = false,
  priority = false,
}: {
  light?: boolean;
  priority?: boolean;
}) {
  if (light) {
    return (
      <span
        aria-label="شعار عَهْد"
        className={`${styles.brand} ${styles.brandLight}`}
        role="img"
      >
        <span className={styles.footerBrandIcon} aria-hidden="true">
          <AhedBrand alt="" className={styles.footerBrandIconSource} />
        </span>
        <AhedWordmark className={styles.footerBrandWord} />
      </span>
    );
  }

  return (
    <span className={`${styles.brand} ${styles.brandAnimated}`}>
      <AhedBrand
        alt=""
        className={styles.brandLogo}
        priority={priority}
      />
    </span>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<HomeLocale>("ar");
  const copy = homeContent[locale];
  const isArabic = locale === "ar";
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      id="top"
      className={styles.site}
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className={styles.announcement}>
        <p className={styles.announcementVerse}>
          <span>{copy.announcement.text}</span>
          <small>{copy.announcement.reference}</small>
        </p>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" aria-label={copy.brandHomeLabel}>
            <Brand priority />
          </a>

          <nav className={styles.nav} aria-label={copy.navLabel}>
            <a href="#why">{copy.nav.why}</a>
            <a href="#how">{copy.nav.how}</a>
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
            <Link className={styles.headerPrimary} href="/register">
              {copy.actions.create}
              <DirectionalArrow />
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
              {copy.hero.eyebrow}
            </span>
            <h1>
              {copy.hero.title}
              <span>{copy.hero.titleAccent}</span>
            </h1>
            <p>{copy.hero.description}</p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/register">
                {copy.hero.primary}
                <DirectionalArrow />
              </Link>
              <Link className={styles.secondaryButton} href="/login">
                {copy.hero.secondary}
              </Link>
            </div>

            <div className={styles.heroNote}>
              <HouseHeart aria-hidden="true" />
              <span>{copy.hero.note}</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label={copy.visual.aria}>
            <article className={styles.covenantCard}>
              <HouseHeart className={styles.visualIcon} aria-hidden="true" />
              <span className={styles.covenantKicker}>{copy.visual.kicker}</span>
              <h2>{copy.visual.title}</h2>
              <span className={styles.visualRule} aria-hidden="true" />
              <p>{copy.visual.description}</p>
              <strong className={styles.cardSignature}>{copy.visual.signature}</strong>
            </article>
          </div>
        </div>
      </section>

      <section id="why" className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>{copy.why.eyebrow}</span>
          <h2>{copy.why.title}</h2>
          <p>{copy.why.description}</p>
        </div>

        <div className={styles.principlesGrid}>
          {copy.why.principles.map((principle, index) => {
            const Icon = principleIcons[index];
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
          <span className={styles.eyebrow}>{copy.process.eyebrow}</span>
          <h2>{copy.process.title}</h2>
          <p>{copy.process.description}</p>
          <Link className={styles.textLink} href="/register">
            {copy.process.action}
            <DirectionalArrow />
          </Link>
        </div>

        <div className={styles.stepsList}>
          {copy.process.steps.map((step) => (
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
          <span className={styles.eyebrow}>{copy.safety.eyebrow}</span>
          <h2>{copy.safety.title}</h2>
          <p>{copy.safety.description}</p>
          <ul>
            {copy.safety.items.map((item) => (
              <li key={item}>
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="plans" className={`${styles.section} ${styles.plansSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>{copy.plans.eyebrow}</span>
          <h2>{copy.plans.title}</h2>
          <p>{copy.plans.description}</p>
        </div>

        <div className={styles.plansGrid}>
          {copy.plans.items.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.planCard} ${plan.featured ? styles.planFeatured : ""}`}
            >
              {plan.featured ? (
                <span className={styles.planBadge}>{copy.plans.featuredBadge}</span>
              ) : null}
              <div className={styles.planHead}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className={styles.priceRows}>
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
              <span className={styles.onceLabel}>{copy.plans.once}</span>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link className={styles.planButton} href="/register">
                {copy.plans.select}
                <DirectionalArrow />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
        <div className={styles.faqIntro}>
          <span className={styles.eyebrow}>{copy.faq.eyebrow}</span>
          <h2>{copy.faq.title}</h2>
          <p>{copy.faq.description}</p>
          <a className={styles.emailLink} href="mailto:info@ahedmarriage.com">
            <Mail />
            info@ahedmarriage.com
          </a>
        </div>

        <div className={styles.faqList}>
          {copy.faq.items.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span className={styles.eyebrow}>{copy.final.eyebrow}</span>
          <h2>{copy.final.title}</h2>
          <p>{copy.final.description}</p>
        </div>
        <div className={styles.finalActions}>
          <Link className={styles.ctaLight} href="/register">
            {copy.final.create}
            <DirectionalArrow />
          </Link>
          <Link className={styles.ctaOutline} href="/login">
            {copy.final.login}
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Brand light />
          <p>{copy.footer.description}</p>
          <a href="mailto:info@ahedmarriage.com">info@ahedmarriage.com</a>
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
