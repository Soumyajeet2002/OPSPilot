import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Search,
  Settings,
  X,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { modules, groups } from "../app/navigation";
import { Brand } from "../components/Brand";
import { ThemeToggle } from "../components/ThemeToggle";
import { Dialog } from "../components/Dialog";
import { useAuth } from "../features/auth/auth-context";
import styles from "./AppLayout.module.css";

export function AppLayout({ preview = false }: { preview?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, endSession } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("opspilot-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const drawer = useRef<HTMLDialogElement>(null);
  const profile = useRef<HTMLDetailsElement>(null);
  const base = preview ? "/preview/" : "/";
  const current = modules.find(
    (item) => location.pathname.split("/").filter(Boolean).at(-1) === item.path,
  );
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 851px)");
    const closeOnDesktop = (): void => {
      if (desktop.matches) setMobile(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (mobile) drawer.current?.showModal();
    else if (drawer.current?.open) drawer.current.close();
  }, [mobile]);
  useEffect(() => {
    const closeProfile = (event: PointerEvent): void => {
      if (profile.current && !profile.current.contains(event.target as Node))
        profile.current.open = false;
    };
    const escape = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && profile.current)
        profile.current.open = false;
    };
    document.addEventListener("pointerdown", closeProfile);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", closeProfile);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const closeNavigation = (): void => {
    setMobile(false);
    if (profile.current) profile.current.open = false;
  };
  const toggleCollapse = (): void => {
    setCollapsed(!collapsed);
    try {
      localStorage.setItem("opspilot-sidebar-collapsed", String(!collapsed));
    } catch {
      /* Preference remains active for this session. */
    }
  };
  const navigation = (compact: boolean) => (
    <>
      <div className={styles.sidebarHeader}>
        <Link to={`${base}dashboard`} onClick={closeNavigation}>
          <Brand compact={compact} />
        </Link>
        <button
          type="button"
          className="icon-button"
          onClick={compact || !mobile ? toggleCollapse : () => setMobile(false)}
          aria-label={
            mobile
              ? "Close navigation"
              : compact
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
        >
          {mobile ? (
            <X size={18} />
          ) : compact ? (
            <ChevronsRight size={16} />
          ) : (
            <ChevronsLeft size={16} />
          )}
        </button>
      </div>
      <nav className={styles.navigation} aria-label="Main navigation">
        {groups.map((group) => (
          <div className={styles.group} key={group}>
            <p className={styles.groupTitle}>{compact ? "—" : group}</p>
            {modules
              .filter((item) => item.group === group)
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={`${base}${item.path}`}
                  title={compact ? item.title : undefined}
                  aria-label={compact ? item.title : undefined}
                  onClick={closeNavigation}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <item.icon size={18} />
                  {!compact && <span>{item.title}</span>}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <NavLink
          to={`${base}settings`}
          onClick={closeNavigation}
          title={compact ? "Settings" : undefined}
          aria-label={compact ? "Settings" : undefined}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Settings size={18} />
          {!compact && <span>Settings</span>}
        </NavLink>
        {!compact && (
          <div className={styles.workspaceLabel}>
            <span className={styles.statusDot} />
            {preview ? "Demonstration workspace" : "OpsPilot workspace"}
          </div>
        )}
      </div>
    </>
  );
  const results = modules.filter((item) =>
    `${item.title} ${item.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  return (
    <div className={`${styles.app} ${collapsed ? styles.collapsed : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className={styles.sidebar}>{navigation(collapsed)}</aside>
      <dialog
        ref={drawer}
        className={styles.mobileDrawer}
        aria-label="Mobile navigation"
        onCancel={() => setMobile(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMobile(false);
        }}
      >
        <div className={styles.drawerInner}>{navigation(false)}</div>
      </dialog>
      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={`icon-button ${styles.mobileTrigger}`}
            aria-label="Open navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <Menu size={21} />
          </button>
          <div className={styles.breadcrumb}>
            Workspace <span>/</span>{" "}
            <strong>{current?.title || "Page not found"}</strong>
          </div>
          <div className={styles.topActions}>
            <div className={styles.search}>
              <Search size={16} />
              <input
                aria-label="Search application pages"
                placeholder="Search workspace…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSearch("");
                  if (event.key === "Enter" && search.trim() && results[0]) {
                    navigate(`${base}${results[0].path}`);
                    setSearch("");
                  }
                }}
              />
              {search.trim() && (
                <div className={styles.searchResults}>
                  <p>Pages</p>
                  {results.length ? (
                    results.map((item) => (
                      <Link
                        key={item.path}
                        to={`${base}${item.path}`}
                        onClick={() => {
                          setSearch("");
                          closeNavigation();
                        }}
                      >
                        <item.icon size={16} />
                        {item.title}
                      </Link>
                    ))
                  ) : (
                    <p>No matching pages.</p>
                  )}
                  <button type="button" onClick={() => setSearch("")}>
                    Close search
                  </button>
                </div>
              )}
            </div>
            <ThemeToggle />
            <button
              type="button"
              className="icon-button"
              aria-label="View notifications"
              onClick={() => setNotifications(true)}
            >
              <Bell size={19} />
            </button>
            <details className={styles.profile} ref={profile}>
              <summary aria-label="User account">
                <span className={styles.avatar}>
                  {preview
                    ? "D"
                    : (
                        user?.firstName?.[0] ||
                        user?.email[0] ||
                        "U"
                      ).toUpperCase()}
                </span>
                <span className={styles.profileName}>
                  {preview ? "Demo workspace" : user?.firstName || user?.email}
                  <small>{preview ? "Preview access" : "Signed in"}</small>
                </span>
                <ChevronDown size={14} />
              </summary>
              <div className={styles.userMenu}>
                {user && !preview && <p>{user.email}</p>}
                <Link to={`${base}settings`} onClick={closeNavigation}>
                  <Settings size={15} />
                  Account settings
                </Link>
                {preview ? (
                  <Link to="/login">
                    <ArrowUpRight size={15} />
                    Go to sign in
                  </Link>
                ) : (
                  <button type="button" onClick={endSession}>
                    <LogOut size={15} />
                    End browser session
                  </button>
                )}
              </div>
            </details>
          </div>
        </header>
        {preview && (
          <div className={styles.previewBanner}>
            <span>
              <strong>Demonstration mode</strong> · Sample dashboard data.
              Business integrations are pending.
            </span>
            <Link to="/login">
              Sign in <ArrowUpRight size={13} />
            </Link>
          </div>
        )}
        <main
          id="main-content"
          className={styles.content}
          tabIndex={-1}
          key={location.pathname}
        >
          <Outlet context={{ preview, base }} />
        </main>
      </section>
      {notifications && (
        <Dialog title="Notifications" onClose={() => setNotifications(false)}>
          <div className="empty-state">
            <Bell size={32} />
            <h3>Notifications are not connected</h3>
            <p>
              Notifications are not connected to this workspace yet. No
              notification history has been loaded.
            </p>
          </div>
        </Dialog>
      )}
    </div>
  );
}
