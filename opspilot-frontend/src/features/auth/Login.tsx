import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Moon, ShieldCheck, Sun } from "lucide-react";
import { useAuth } from "./auth-context";
import type { LoginValues } from "./auth-context";
import { errorMessage } from "../../lib/api";
import { useTheme } from "../../theme/theme-context";
import { Dialog } from "../../components/Dialog";
import styles from "./Login.module.css";

type Information = "Forgot password?" | "Privacy Policy" | "Terms of Service" | "Support";
const information: Record<Information, string> = {
  "Forgot password?": "Contact your organization administrator to recover access to your account. Self-service password recovery is not available yet.",
  "Privacy Policy": "Your organization’s privacy policy has not been provided yet. Contact your administrator for the applicable policy before signing in.",
  "Terms of Service": "Your organization’s terms of service have not been provided yet. Contact your administrator for the applicable terms.",
  Support: "For account access and product support, contact your organization administrator.",
};

export function Login() {
  const { user, login, notice } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<Information | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const from: unknown = location.state?.from;
  const destination = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login") ? from : "/dashboard";
  if (user) return <Navigate to={destination} replace />;
  const submit = async (values: LoginValues): Promise<void> => {
    setError("");
    try { await login(values); } catch (failure: unknown) { setError(errorMessage(failure)); }
  };
  return (
    <main className={styles.page}>
      <div className={styles.composition}>
        <section className={styles.identity} aria-label="OpsPilot — Enterprise Operations & Intelligence">
          <div className="sr-only">
            <p>OPSPILOT</p>
            <h1>Clarity. Control. Intelligence.</h1>
            <p>The enterprise operations platform for modern organizations.</p>
            <ul><li>Real-Time Insights</li><li>Operational Efficiency</li><li>Enterprise-Grade Security</li></ul>
          </div>
        </section>
        <section className={styles.panel} aria-labelledby="login-title">
          <div className={styles.theme} role="group" aria-label="Appearance">
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}><Sun aria-hidden="true" /><span>Light</span></button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><Moon aria-hidden="true" /><span>Dark</span></button>
          </div>
          <div className={styles.formWrap}>
            <header className={styles.heading}><h2 id="login-title">Welcome back.</h2><p>Sign in to continue to your workspace.</p></header>
            <form noValidate onSubmit={handleSubmit(submit)}>
              <div className={styles.field}>
                <label htmlFor="email">Email address</label>
                <div className={styles.inputWrap}><Mail className={styles.inputIcon} aria-hidden="true" /><input id="email" type="email" autoComplete="username" placeholder="Enter your email address" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email", { required: "Enter your email address.", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email address." })} /></div>
                <span id="email-error" className={styles.fieldError} aria-live="polite">{errors.email?.message}</span>
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrap}><LockKeyhole className={styles.inputIcon} aria-hidden="true" /><input id="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password", { required: "Enter your password." })} /><button className={styles.visibility} type="button" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}</button></div>
                <span id="password-error" className={styles.fieldError} aria-live="polite">{errors.password?.message}</span>
              </div>
              <div className={styles.options}><label className={styles.remember}><input type="checkbox" {...register("rememberMe")} /><span>Remember me</span></label><button className={styles.textButton} type="button" onClick={() => setInfo("Forgot password?")}>Forgot password?</button></div>
              <div className={styles.feedback} aria-live="polite">{error ? <p role="alert">{error}</p> : notice ? <p role="status">{notice}</p> : null}</div>
              <button className={styles.submit} disabled={isSubmitting} type="submit"><span>{isSubmitting ? "Signing in…" : "Sign in"}</span><ArrowRight aria-hidden="true" /></button>
            </form>
            <div className={styles.secure}><span /><p><ShieldCheck aria-hidden="true" />Secure access to OpsPilot</p><span /></div>
          </div>
          <svg className={styles.corner} viewBox="0 0 220 130" fill="none" aria-hidden="true"><path d="M0 129 60 66H144L219 0" stroke="url(#edge-blue)" /><path d="m120 100 12-12h12l-12 12zm24 0 12-12h12l-12 12zm24 0 12-12h12l-12 12z" fill="#0164ff" /><defs><linearGradient id="edge-blue"><stop stopColor="#132234" /><stop offset="1" stopColor="#038dff" /></linearGradient></defs></svg>
        </section>
      </div>
      <footer className={styles.footer}><p>© 2025 OpsPilot. All rights reserved.</p><nav aria-label="Legal and support">{(["Privacy Policy", "Terms of Service", "Support"] as const).map(item => <button type="button" key={item} onClick={() => setInfo(item)}>{item}</button>)}</nav></footer>
      {info && <Dialog title={info} onClose={() => setInfo(null)}><p className={styles.information}>{information[info]}</p></Dialog>}
    </main>
  );
}
