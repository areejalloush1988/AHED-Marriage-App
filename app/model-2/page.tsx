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

const principleIcons = [ShieldCheck, BadgeCheck, EyeOff, HeartHandshake] as const;

export default function ModelTwo() {
  const [locale, setLocale] = useState<HomeLocale>("ar");
  const copy = homeContent[locale];
  const isArabic = locale === "ar";
  const DirectionalArrow = isArabic ? ArrowLeft : ArrowRight;

  const comparisonLabel = isArabic ? "نموذج التصميم رقم ٢" : "Design model 2";
  const comparisonLink = isArabic ? "فتح النموذج الأول" : "Open model 1";
  const sectionNumbers = ["٠١", "٠٢", "٠٣", "٠٤"];

  return (
    <main
      id="top"
      className={styles.site}
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className={styles.comparisonBar}>
        <span>{comparisonLabel}</span>
        <Link href="/">
          {comparisonLink}
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
        <span className={styles.heroOrbOne} aria-hidden="true" />
        <span className={styles.heroOrbTwo} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.eyebrowLight}>
            <Sparkles aria-hidden="true" />
            {copy.hero.eyebrow}
          </span>
          <h1>
            {copy.hero.title}
            <em>{copy.hero.titleAccent}</em>
          </h1>
          <p>{copy.hero.description}</p>
        </div>

        <div className={styles.freeJoin} aria-label={copy.freeJoin.title}>
          <span className={styles.freeJoinIcon} aria-hidden="true">
            <UserRoundPlus />
          </span>
          <div>
            <small>{copy.freeJoin.eyebrow}</small>
            <strong>{copy.freeJoin.title}</strong>
          </div>
          <p>{copy.freeJoin.description}</p>
        </div>
      </section>

      <section id="how" className={styles.timelineSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>{sectionNumbers[0]}</span>
          <div>
            <span className={styles.eyebrow}>{copy.process.eyebrow}</span>
            <h2>{copy.process.title}</h2>
            <p>{copy.process.description}</p>
          </div>
        </div>

        <div className={styles.timeline}>
          {copy.process.steps.map((step) => (
            <article key={step.number} className={styles.timelineStep}>
              <span className={styles.timelineDot} aria-hidden="true" />
              <span className={styles.stepNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className={styles.bentoSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>{sectionNumbers[1]}</span>
          <div>
            <span className={styles.eyebrow}>{copy.why.eyebrow}</span>
            <h2>{copy.why.title}</h2>
            <p>{copy.why.description}</p>
          </div>
        </div>

        <div className={styles.bentoGrid}>
          {copy.why.principles.map((principle, index) => {
            const Icon = principleIcons[index];

            return (
              <article
                key={principle.title}
                className={`${styles.bentoCard} ${index === 0 ? styles.bentoFeatured : ""}`}
              >
                <span className={styles.bentoIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.bentoIndex}>0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="safety" className={styles.safetyBand}>
        <div className={styles.safetyMark} aria-hidden="true">
          <span>
            <LockKeyhole />
          </span>
        </div>

        <div className={styles.safetyContent}>
          <span className={styles.sectionNumber}>{sectionNumbers[2]}</span>
          <span className={styles.eyebrowLight}>{copy.safety.eyebrow}</span>
          <h2>{copy.safety.title}</h2>
          <p>{copy.safety.description}</p>
          <ul>
            {copy.safety.items.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="plans" className={styles.plansSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>{sectionNumbers[3]}</span>
          <div>
            <span className={styles.eyebrow}>{copy.plans.eyebrow}</span>
            <h2>{copy.plans.title}</h2>
            <p>{copy.plans.description}</p>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {copy.plans.items.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.planCard} ${plan.featured ? styles.planFeatured : ""}`}
            >
              <div className={styles.planTopline}>
                <span>{plan.featured ? copy.plans.featuredBadge : copy.plans.once}</span>
                <Sparkles aria-hidden="true" />
              </div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className={styles.pricePair}>
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
              <Link className={styles.planButton} href="/register">
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
