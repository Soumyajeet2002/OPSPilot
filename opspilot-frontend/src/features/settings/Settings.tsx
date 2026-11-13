import { useState } from "react";
import {
  Bell,
  Building2,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "../../theme/theme-context";
import { useAuth } from "../auth/auth-context";
import { PageHeader } from "../../components/PageHeader";
import styles from "./Settings.module.css";
const sections = [
  { name: "Appearance", icon: Monitor },
  { name: "Profile", icon: UserRound },
  { name: "Notifications", icon: Bell },
  { name: "Security", icon: ShieldCheck },
  { name: "Organization", icon: Building2 },
];
export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [section, setSection] = useState("Appearance");
  return (
    <>
      <PageHeader
        eyebrow="YOUR WORKSPACE"
        title="Settings"
        description="Personalize your experience and manage account preferences."
      />
      <div className={styles.layout}>
        <nav className={styles.sections} aria-label="Settings sections">
          {sections.map((item) => (
            <button
              type="button"
              key={item.name}
              className={section === item.name ? styles.selected : ""}
              aria-current={section === item.name ? "page" : undefined}
              onClick={() => setSection(item.name)}
            >
              <item.icon size={17} />
              {item.name}
            </button>
          ))}
        </nav>
        <section
          className={`panel ${styles.settingsPanel}`}
          aria-labelledby="settings-heading"
        >
          <h2 id="settings-heading">{section}</h2>
          {section === "Appearance" ? (
            <>
              <p className="muted">
                Choose how OpsPilot looks on this browser.
              </p>
              <div className={styles.themes}>
                {(["dark", "light"] as const).map((option) => (
                  <button
                    type="button"
                    className={`${styles.themeCard} ${styles[option]} ${theme === option ? styles.active : ""}`}
                    key={option}
                    aria-pressed={theme === option}
                    onClick={() => setTheme(option)}
                  >
                    <span className={styles.mockWindow} aria-hidden="true">
                      <i />
                      <span>
                        <b />
                        <em />
                        <em />
                      </span>
                    </span>
                    <span>
                      {option === "dark" ? (
                        <Moon size={16} />
                      ) : (
                        <Sun size={16} />
                      )}
                      {option === "dark" ? "Dark" : "Light"}
                      <i className={styles.radio} />
                    </span>
                  </button>
                ))}
              </div>
              <p className={styles.note} role="status">
                {theme === "dark" ? "Dark" : "Light"} theme selected. Your
                preference is retained when browser storage is available.
              </p>
              <div className={styles.preferenceRow}>
                <div>
                  <h3>Motion preferences</h3>
                  <p>OpsPilot follows your device’s reduced-motion setting.</p>
                </div>
                <span className="badge">AUTOMATIC</span>
              </div>
            </>
          ) : section === "Profile" ? (
            <>
              <p className="muted">Your current account information.</p>
              <dl className={styles.profile}>
                <dt>Name</dt>
                <dd>
                  {user
                    ? `${user.firstName} ${user.lastName}`
                    : "Demonstration visitor"}
                </dd>
                <dt>Email</dt>
                <dd>{user?.email || "Not signed in"}</dd>
                <dt>Roles & permissions</dt>
                <dd>Role information is not available yet.</dd>
              </dl>
              <p className="notice">
                Profile changes and account preferences are not available yet.
              </p>
            </>
          ) : section === "Security" ? (
            <>
              <p className="muted">Session and account security.</p>
              <div className={styles.preferenceRow}>
                <div>
                  <h3>Browser session</h3>
                  <p>
                    {user
                      ? "Active in this browser until the session expires or the page reloads."
                      : "No authenticated session in this browser."}
                  </p>
                </div>
                <span className="badge">{user ? "ACTIVE" : "PREVIEW"}</span>
              </div>
              <p className="notice">
                Session renewal, sign-out across devices, password changes, and
                session history are not available yet. Reloading ends this browser
                session. You can also end it from the account menu.
              </p>
            </>
          ) : (
            <>
              <p className="muted">
                {section === "Notifications"
                  ? "Manage how your workspace keeps you informed."
                  : "Organization details and role administration."}
              </p>
              <div className="empty-state">
                <ShieldCheck size={30} />
                <h3>{section} integration pending</h3>
                <p>
                  {section === "Organization"
                    ? "Organization settings and role administration are not connected yet."
                    : "Notification preferences will be available when notifications are connected."}
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
