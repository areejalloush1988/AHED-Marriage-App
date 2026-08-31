"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AhedBrand } from "@/components/ahed-brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase";

import "./login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "").trim();

    if (!/^\d{6}$/.test(password)) {
      setErrorMessage("كلمة المرور يجب أن تتكوّن من 6 أرقام فقط.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage("الربط قيد التجهيز حالياً. استخدمي زر معاينة الداخل.");
      return;
    }

    setIsSubmitting(true);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }

    window.location.assign("/inside");
  };

  return (
    <main className="login-page" dir="rtl">
      <header className="login-topbar">
        <Link
          aria-label="العودة إلى الصفحة الرئيسية لموقع عهد"
          className="login-brand"
          href="/"
        >
          <AhedBrand alt="" className="login-brand-logo" priority />
        </Link>
        <Link className="login-home-link" href="/">
          <ArrowRight aria-hidden="true" />
          العودة إلى الموقع
        </Link>
      </header>

      <section className="login-shell">
        <aside className="login-story">
          <div>
            <span className="login-eyebrow">
              <Sparkles />
              أهلاً بعودتك
            </span>
            <h1>زواج جاد يبدأ من مساحة آمنة.</h1>
            <p>
              ادخل إلى حسابك لمراجعة الترشيحات وطلبات الاهتمام والمحادثات التي
              وافق عليها الطرفان.
            </p>
          </div>

          <div className="login-trust">
            <ShieldCheck />
            <span>
              <strong>خصوصية قبل كل شيء</strong>
              <small>لا يظهر رقم الهاتف أو البريد لأي حساب آخر.</small>
            </span>
          </div>
        </aside>

        <section className="login-form-panel">
          <div className="login-form-heading">
            <span className="login-eyebrow">الدخول إلى حسابك</span>
            <h2>مرحباً من جديد</h2>
            <p>اكتب البريد الإلكتروني وكلمة المرور المكوّنة من 6 أرقام.</p>
          </div>

          <form onSubmit={submitLogin}>
            <label htmlFor="login-email">البريد الإلكتروني</label>
            <div className="login-input">
              <Mail />
              <Input
                id="login-email"
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <label htmlFor="login-password">كلمة المرور</label>
            <div className="login-input">
              <LockKeyhole />
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                autoComplete="current-password"
                placeholder="••••••"
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 6);
                }}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />
                تذكّرني
              </label>
              <button type="button">نسيت كلمة المرور؟</button>
            </div>

            {errorMessage ? (
              <p className="login-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
              <ArrowLeft />
            </Button>
          </form>

          <div className="login-divider">
            <span>أو</span>
          </div>

          <Link className="login-preview" href="/inside">
            معاينة التطبيق من الداخل
          </Link>

          <p className="login-register">
            ليس لديك حساب؟
            <Link href="/register">إنشاء حساب جديد</Link>
          </p>
        </section>
      </section>
    </main>
  );
}
