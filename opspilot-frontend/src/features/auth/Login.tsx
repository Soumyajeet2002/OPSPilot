import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  ChartNoAxesCombined,
  Layers,
  LockKeyhole,
} from "lucide-react";
import { useAuth } from "./auth-context";
import type { LoginValues } from "./auth-context";
import { errorMessage } from "../../lib/api";
import { Brand } from "../../components/Brand";
import { ThemeToggle } from "../../components/ThemeToggle";
import earth from "../../assets/opspilot-login-earth.png";
import styles from "./Login.module.css";

export function Login() {
  const { user, login, notice } = useAuth();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const from: unknown = location.state?.from;
  const destination =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.startsWith("/login")
      ? from
      : "/dashboard";
  if (user) return <Navigate to={destination} replace />;
  const submit = async (values: LoginValues): Promise<void> => {
    setError("");
    try {
      await login(values);
    } catch (failure: unknown) {
      setError(errorMessage(failure));
    }
  };
  return (
    <main className={styles.page}>
      <section className={styles.identity} aria-label="About OpsPilot">
        <Brand />
        <div className={styles.pitch}>
          <span className="eyebrow">ENTERPRISE OPERATIONS & INTELLIGENCE</span>
          <h1>
            Clarity. Control.
            <br />
            <span>Intelligence.</span>
          </h1>
          <p>
            The enterprise operations platform
            <br />
            for modern organizations.
          </p>
          <div className={styles.features}>
            <span>
              <Zap />
              Real-time
              <br />
              insights
            </span>
            <span>
              <ChartNoAxesCombined />
              Operational
              <br />
              intelligence
            </span>
            <span>
              <Layers />
              One connected
              <br />
              workspace
            </span>
          </div>
        </div>
        <img
          className={styles.earth}
          src={earth}
          alt="Earth at night with a blue horizon"
        />
        <p className={styles.caption}>
          A world of operations. One clear perspective.
        </p>
      </section>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.theme}>
          <ThemeToggle />
        </div>
        <div className={styles.formWrap}>
          <span className="eyebrow">YOUR WORKSPACE, CONNECTED</span>
          <h2 id="login-title">Welcome back.</h2>
          <p className="muted">Sign in to your OpsPilot account to continue.</p>
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          <form noValidate onSubmit={handleSubmit(submit)}>
            <div className="field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email", {
                  required: "Enter your work email.",
                  validate: (value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
                    "Enter a valid email address.",
                })}
              />
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className={styles.password}>
                <input
                  id="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password", {
                    required: "Enter your password.",
                  })}
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="field-error">
                  {errors.password.message}
                </span>
              )}
            </div>
            <label className={styles.remember}>
              <input type="checkbox" {...register("rememberMe")} />
              Remember me on this device
            </label>
            {error && (
              <p className="error-box" role="alert">
                {error}
              </p>
            )}
            <button
              className="button primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>
          <p className={styles.support}>
            Need access? Contact your organization administrator.
          </p>
          <div className={styles.preview}>
            <span>Explore the interface before signing in.</span>
            <Link to="/preview/dashboard">
              Open demonstration <ArrowRight size={14} />
            </Link>
          </div>
          <p className={styles.sessionNote}>
            <LockKeyhole size={14} /> Sessions currently end when you reload
            this page. You will need to sign in again.
          </p>
        </div>
        <footer className={styles.footer}>
          OpsPilot <span>Enterprise Operations & Intelligence Platform</span>
        </footer>
      </section>
    </main>
  );
}
