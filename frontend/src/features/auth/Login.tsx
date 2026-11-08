
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css";

type LoginValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

function BrandLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-label="OpsPilot logo">
      <path
        d="M5 51 30 8 59 51H43L30 29 18 51H5Z"
        fill="currentColor"
      />
      <path
        d="m29 43 11-17 17 25H41l-5-8-7 11"
        fill="currentColor"
        opacity=".75"
      />
      <path
        d="m24 51 12-18 8 12"
        stroke="#02050B"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {visible ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </>
      ) : (
        <>
          <path d="M3 3 21 21M10.6 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.4 8.1 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 20 5v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.5 12 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Login() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setStatusMessage(
      "Login API integration is pending. Your form is ready for backend connection."
    );

    console.log("Login form submitted:", {
      email: data.email,
      rememberMe: data.rememberMe,
    });
  };

  return (
    <main className={styles.loginPage} data-theme={theme}>
      <div className={styles.mainContent}>
        {/* LEFT BRAND PANEL */}
        <section className={styles.brandPanel}>
          <div className={styles.brandHeader}>
            <div className={styles.logo}>
              <BrandLogo />
            </div>

            <span className={styles.brandName}>OPSPILOT</span>
          </div>

          <div className={styles.brandContent}>
            <h1 className={styles.brandHeading}>
              Clarity. Control.
              <span>Intelligence.</span>
            </h1>

            <p className={styles.brandDescription}>
              The enterprise operations platform
              <br />
              for modern organizations.
            </p>

            <div className={styles.brandDivider}>
              <span />
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>ϟ</div>
                <span>Real-Time<br />Insights</span>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>▥</div>
                <span>Operational<br />Efficiency</span>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <ShieldIcon />
                </div>
                <span>Enterprise-Grade<br />Security</span>
              </div>
            </div>
          </div>

          <div className={styles.earthArtwork} aria-hidden="true" />

          <div className={styles.brandGeometry} aria-hidden="true" />
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className={styles.formPanel}>
          <div className={styles.themeToggle} aria-label="Choose theme">
            <button
              type="button"
              className={theme === "light" ? styles.themeActive : ""}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
            >
              <SunIcon />
              <span>Light</span>
            </button>

            <button
              type="button"
              className={theme === "dark" ? styles.themeActive : ""}
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              <MoonIcon />
              <span>Dark</span>
            </button>
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formHeading}>
              <h2>Welcome back.</h2>
              <p>Sign in to continue to your workspace.</p>
            </div>

            <form
              className={styles.loginForm}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className={styles.formGroup}>
                <label htmlFor="email">Email address</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <MailIcon />
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Email address is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <span className={styles.fieldError}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 8,
                        message: "Password must contain at least 8 characters.",
                      },
                    })}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>

                {errors.password && (
                  <span className={styles.fieldError}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" {...register("rememberMe")} />
                  <span className={styles.customCheckbox} />
                  <span>Remember me</span>
                </label>

                <button type="button" className={styles.forgotPassword}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
                <ArrowIcon />
              </button>

              {statusMessage && (
                <p className={styles.statusMessage} role="status">
                  {statusMessage}
                </p>
              )}
            </form>

            <div className={styles.secureAccess}>
              <span />
              <div>
                <ShieldIcon />
                <p>Secure access to OpsPilot</p>
              </div>
              <span />
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2025 OpsPilot. All rights reserved.</p>

        <nav aria-label="Footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <span />
          <a href="#terms">Terms of Service</a>
          <span />
          <a href="#support">Support</a>
        </nav>

        <div className={styles.footerMark}>
          <i />
          <i />
          <i />
        </div>
      </footer>
    </main>
  );
}

export default Login;
