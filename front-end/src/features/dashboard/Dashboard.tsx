import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

type IconName =
  | "home"
  | "grid"
  | "users"
  | "folder"
  | "check"
  | "target"
  | "wallet"
  | "box"
  | "settings"
  | "chart"
  | "file"
  | "brain"
  | "search"
  | "sun"
  | "moon"
  | "bell"
  | "chevron"
  | "arrow"
  | "bolt"
  | "calendar"
  | "rupee"
  | "activity"
  | "clock";
const iconPaths: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  grid: "M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 11a4 4 0 0 0 0-8 M21 21v-2a4 4 0 0 0-3-3.87",
  folder:
    "M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  check:
    "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  target:
    "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  wallet:
    "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13H5a2 2 0 0 1-2-2z M3 8h18 M16 14h.01",
  box: "M3 7l9-4 9 4-9 5z M3 7v10l9 4 9-4V7 M12 12v9",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.67 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.34 10a1.7 1.7 0 0 0 1.56 1.03h.1v2.4h-.1A1.7 1.7 0 0 0 19.4 15z",
  chart: "M3 3v18h18 M7 14l4-4 4 3 6-7 M7 18v-4 M12 18v-7 M17 18v-5 M22 18v-9",
  file: "M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M14 2v6h6 M8 13h8 M8 17h8",
  brain:
    "M12 18V5 M12 5a4 4 0 0 0-7.5 2A4 4 0 0 0 5 15a4 4 0 0 0 7 3 M12 5a4 4 0 0 1 7.5 2A4 4 0 0 1 19 15a4 4 0 0 1-7 3 M8 9h.01 M16 9h.01 M8 14h.01 M16 14h.01",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16 M21 21l-4.35-4.35",
  sun: "M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.64 5.64l1.42 1.42 M16.94 16.94l1.42 1.42 M5.64 18.36l1.42-1.42 M16.94 7.06l1.42-1.42 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  moon: "M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  chevron: "m7 10 5 5 5-5",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  bolt: "M13 2 4 14h7l-1 8 10-13h-7z",
  calendar: "M3 5h18v16H3z M16 3v4 M8 3v4 M3 10h18",
  rupee: "M6 4h12 M6 9h12 M6 4c8 0 8 9 0 9h-1l9 8",
  activity: "M3 12h4l3-8 4 16 3-8h4",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M12 6v6l4 2",
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

const navigation: {
  label: string;
  icon: IconName;
  path: string;
}[] = [
  { label: "Overview", icon: "home", path: "/dashboard" },
  { label: "Departments", icon: "grid", path: "/departments" },
  { label: "Employees", icon: "users", path: "/employees" },
  { label: "Projects", icon: "folder", path: "/projects" },
  { label: "Tasks", icon: "check", path: "/tasks" },
  { label: "CRM", icon: "target", path: "/crm" },
  { label: "Finance & Expenses", icon: "wallet", path: "/finance" },
  { label: "Inventory", icon: "box", path: "/inventory" },
  { label: "Automation", icon: "settings", path: "/automation" },
  {
    label: "Analytics & Reports",
    icon: "chart",
    path: "/analytics",
  },
  { label: "Documents", icon: "file", path: "/documents" },
  { label: "AI Assistant", icon: "brain", path: "/ai-assistant" },
];

const revenueData = [
  { month: "Jun", revenue: 5 },
  { month: "Jul", revenue: 8 },
  { month: "Aug", revenue: 9.5 },
  { month: "Sep", revenue: 13.5 },
  { month: "Oct", revenue: 12.5 },
  { month: "Nov", revenue: 16.2 },
];

const departmentData = [
  { name: "Engineering", value: 95 },
  { name: "Product", value: 92 },
  { name: "Sales", value: 88 },
  { name: "Marketing", value: 85 },
  { name: "HR", value: 90 },
  { name: "Finance", value: 87 },
];

const projectData = [
  { name: "On Track", value: 52, color: "#0878ff" },
  { name: "At Risk", value: 29, color: "#319bff" },
  { name: "Delayed", value: 19, color: "#b5d7ff" },
];

const activities = [
  { text: "New project ‘OpsPilot v2.0’ created", time: "2m ago" },
  { text: "Employee Sarah Johnson joined the team", time: "15m ago" },
  { text: "Task ‘API Integration’ marked complete", time: "32m ago" },
  { text: "New expense report submitted", time: "1h ago" },
];

const deadlines = [
  {
    day: "12",
    month: "NOV",
    title: "Project Alpha – Final Review",
    due: "Due in 2 days",
    priority: "High",
  },
  {
    day: "14",
    month: "NOV",
    title: "Monthly Reports Submission",
    due: "Due in 4 days",
    priority: "Medium",
  },
  {
    day: "16",
    month: "NOV",
    title: "Team Performance Review",
    due: "Due in 6 days",
    priority: "Low",
  },
];

function BrandLogo() {
  return (
    <div className={styles.brand}>
      <svg viewBox="0 0 48 48" className={styles.brandMark} aria-hidden="true">
        <path d="M24 3 3 43h12l9-17 8 14h12L24 3Z" fill="#0878ff" />
        <path d="m23 19 8 15h-9l-4 8H8l15-23Z" fill="#03070d" />
        <path d="m27 23 5 9h-6l-4 7h12l5-9-12-7Z" fill="#48a3ff" />
      </svg>
      <span>OPSPILOT</span>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
  comparison,
  graph,
}: {
  icon: IconName;
  label: string;
  value: string;
  change: string;
  comparison: string;
  graph: "people" | "projects" | "tasks" | "revenue";
}) {
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricTop}>
        <span className={styles.metricIcon}>
          <Icon name={icon} size={27} />
        </span>
        <span className={styles.metricLabel}>{label}</span>
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricChange}>
        <span>↑ {change}</span>
        <small>{comparison}</small>
      </div>
      <div className={`${styles.metricGraphic} ${styles[graph]}`}>
        {graph === "revenue" ? (
          <div className={styles.miniBars}>
            {[28, 43, 58, 75, 94].map((height, i) => (
              <i key={i} style={{ height: `${height}%` }} />
            ))}
          </div>
        ) : (
          <svg viewBox="0 0 150 70" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`mini-${graph}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0878ff" stopOpacity=".35" />
                <stop offset="100%" stopColor="#0878ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 62 L22 47 L42 51 L62 29 L82 35 L103 17 L122 25 L150 5 L150 70 L0 70Z"
              fill={`url(#mini-${graph})`}
            />
            <path
              d="M0 62 L22 47 L42 51 L62 29 L82 35 L103 17 L122 25 L150 5"
              fill="none"
              stroke="#0878ff"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showWelcome, setShowWelcome] = useState(
    Boolean(location.state?.loginSuccess),
  );

  // Preserve the name before clearing the navigation state.
  const [welcomeName] = useState<string>(
    location.state?.user?.firstName || "Administrator",
  );

  useEffect(() => {
    if (!showWelcome) return;

    // Remove navigation state to prevent the welcome
    // animation from appearing again after a refresh.
    navigate(location.pathname, {
      replace: true,
      state: null,
    });

    const timer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [showWelcome, navigate, location.pathname]);
  return (
    <main className={styles.dashboard}>
      {showWelcome && (
        <div className={styles.welcomeToast} role="status">
          <div className={styles.welcomeToastIcon}>✓</div>
          <div>
            <strong>Welcome to OpsPilot, {welcomeName}!</strong>
            <span>Your workspace is ready.</span>
          </div>
        </div>
      )}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          {" "}
          <BrandLogo />
        </div>

        <div className={styles.sidebarNavigation}>
          <nav className={styles.navigation}>
            {navigation.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.activeNav : ""}`
                }
              >
                <Icon name={item.icon} size={21} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Permanently fixed footer */}
        <div className={styles.sidebarFooter}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeNav : ""}`
            }
          >
            <Icon name="settings" size={21} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      <section className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.searchBox}>
            <Icon name="search" size={22} />
            <input
              placeholder="Search anything... (⌘ + K)"
              aria-label="Search anything"
            />
          </div>

          <div className={styles.topbarActions}>
            <div className={styles.themeSwitch}>
              <Icon name="sun" size={21} />
              <button
                type="button"
                className={styles.themeToggle}
                aria-label="Toggle theme"
              >
                <span>
                  <Icon name="moon" size={19} />
                </span>
              </button>
            </div>

            <button
              type="button"
              className={styles.notificationButton}
              aria-label="Notifications"
            >
              <Icon name="bell" size={23} />
              <span>3</span>
            </button>

            <button type="button" className={styles.profileButton}>
              <div className={styles.avatar}>A</div>
              <div className={styles.profileText}>
                <strong>Administrator</strong>
                <small>Super Admin</small>
              </div>
              <Icon name="chevron" size={18} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.hero}>
            <div className={styles.earthArtwork} aria-hidden="true">
              <div className={styles.earthGlow} />
              <div className={styles.earthSurface} />
              <div className={styles.earthLights} />
            </div>

            <div className={styles.heroCopy}>
              <p className={styles.greeting}>
                <span>/</span> Good morning,
              </p>
              <h1>
                Administrator<span>.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Here's what's happening with your organization today.
              </p>
              <div className={styles.dateInfo}>
                <span>
                  <Icon name="calendar" size={19} /> Mon, Nov 10, 2026
                </span>
                <i />
                <span>Last updated: 09:24 AM</span>
              </div>
            </div>

            <button type="button" className={styles.quickAction}>
              <Icon name="bolt" size={19} />
              Quick Action
              <Icon name="arrow" size={19} />
            </button>
          </section>

          <section className={styles.metricsGrid}>
            <MetricCard
              icon="users"
              label="Total Employees"
              value="248"
              change="+12.5%"
              comparison="vs last month"
              graph="people"
            />
            <MetricCard
              icon="folder"
              label="Active Projects"
              value="42"
              change="+8.2%"
              comparison="vs last month"
              graph="projects"
            />
            <MetricCard
              icon="check"
              label="Pending Tasks"
              value="127"
              change="+4.1%"
              comparison="vs last week"
              graph="tasks"
            />
            <MetricCard
              icon="rupee"
              label="Monthly Revenue"
              value="₹24.8L"
              change="+16.7%"
              comparison="vs last month"
              graph="revenue"
            />
          </section>

          <section className={styles.analyticsGrid}>
            <article className={`${styles.panel} ${styles.revenuePanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="chart" /> Revenue Performance
                </h2>
                <button type="button" className={styles.periodButton}>
                  Last 6 Months <Icon name="chevron" size={14} />
                </button>
              </div>
              <div className={styles.revenueChart}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 15, right: 12, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0878ff"
                          stopOpacity={0.32}
                        />
                        <stop
                          offset="100%"
                          stopColor="#0878ff"
                          stopOpacity={0.015}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#1a2735"
                      strokeDasharray="2 3"
                      vertical
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#aebaca", fontSize: 11 }}
                      axisLine={{ stroke: "#253140" }}
                      tickLine={false}
                    />
                    <YAxis
                      ticks={[0, 5, 10, 15, 20]}
                      tickFormatter={(v) => `${v}L`}
                      tick={{ fill: "#aebaca", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0b1420",
                        border: "1px solid #26394e",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                      formatter={(value) => [`₹${value}L`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0878ff"
                      strokeWidth={2.5}
                      fill="url(#revenueFill)"
                      activeDot={{
                        r: 5,
                        fill: "#0878ff",
                        stroke: "#d8ebff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className={styles.chartValue}>₹24.8L</span>
            </article>

            <article className={`${styles.panel} ${styles.projectPanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="folder" /> Project Status
                </h2>
              </div>
              <div className={styles.projectContent}>
                <div className={styles.donutWrap}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius="66%"
                        outerRadius="92%"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={1}
                      >
                        {projectData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            stroke="#080d14"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.donutCenter}>
                    <strong>42</strong>
                    <span>Total</span>
                  </div>
                </div>
                <div className={styles.legend}>
                  {projectData.map((item) => (
                    <div key={item.name}>
                      <i style={{ background: item.color }} />
                      <span>{item.name}</span>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className={`${styles.panel} ${styles.taskPanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="check" /> Task Completion
                </h2>
                <button type="button" className={styles.periodButton}>
                  This Month <Icon name="chevron" size={14} />
                </button>
              </div>
              <div className={styles.taskContent}>
                <div className={styles.progressRing}>
                  <svg viewBox="0 0 120 120">
                    <circle
                      className={styles.ringTrack}
                      cx="60"
                      cy="60"
                      r="49"
                    />
                    <circle
                      className={styles.ringValue}
                      cx="60"
                      cy="60"
                      r="49"
                    />
                  </svg>
                  <strong>87%</strong>
                </div>
                <div className={styles.taskStats}>
                  <strong>1,142 / 1,320</strong>
                  <span>Tasks Completed</span>
                  <b>↑ +5.2%</b>
                  <div className={styles.progressBar}>
                    <i />
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className={styles.bottomGrid}>
            <article className={`${styles.panel} ${styles.departmentPanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="chart" /> Department Performance
                </h2>
                <button type="button" className={styles.periodButton}>
                  This Month <Icon name="chevron" size={14} />
                </button>
              </div>
              <div className={styles.departmentChart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    margin={{ top: 22, right: 3, left: 3, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#c3ccd8", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(8,120,255,.08)" }}
                      contentStyle={{
                        background: "#0b1420",
                        border: "1px solid #26394e",
                        borderRadius: 8,
                      }}
                      formatter={(value) => [`${value}%`, "Performance"]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#0878ff"
                      radius={[5, 5, 0, 0]}
                      barSize={35}
                      label={{
                        position: "top",
                        fill: "#f2f6fc",
                        fontSize: 11,
                        fontWeight: 600,
                        formatter: (value: number) => `${value}%`,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className={`${styles.panel} ${styles.activityPanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="bolt" /> Recent Activities
                </h2>
                <a href="#">
                  View All <Icon name="arrow" size={14} />
                </a>
              </div>
              <div className={styles.activityList}>
                {activities.map((activity) => (
                  <div className={styles.activityItem} key={activity.text}>
                    <i />
                    <span>{activity.text}</span>
                    <time>{activity.time}</time>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.panel} ${styles.deadlinePanel}`}>
              <div className={styles.panelHeader}>
                <h2>
                  <Icon name="calendar" /> Upcoming Deadlines
                </h2>
                <a href="#">
                  View All <Icon name="arrow" size={14} />
                </a>
              </div>
              <div className={styles.deadlineList}>
                {deadlines.map((deadline) => (
                  <div className={styles.deadlineItem} key={deadline.title}>
                    <div className={styles.deadlineDate}>
                      <small>{deadline.month}</small>
                      <strong>{deadline.day}</strong>
                    </div>
                    <div className={styles.deadlineText}>
                      <strong>{deadline.title}</strong>
                      <span>{deadline.due}</span>
                    </div>
                    <span
                      className={`${styles.priority} ${styles[deadline.priority.toLowerCase()]}`}
                    >
                      {deadline.priority}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
