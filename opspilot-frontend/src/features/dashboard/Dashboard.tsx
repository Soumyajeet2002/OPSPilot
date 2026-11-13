import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
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
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  FolderKanban,
  SquareCheckBig,
  IndianRupee,
  CalendarDays,
  Activity,
  ChartNoAxesCombined,
  CircleDot,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../auth/auth-context";
import { useTheme } from "../../theme/theme-context";
import { PageHeader } from "../../components/PageHeader";
import {
  revenue,
  departments,
  projectStatus,
  activity,
  deadlines,
} from "./demo-data";
import styles from "./Dashboard.module.css";

function Metric({
  icon: Icon,
  label,
  value,
  change,
  live,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  live: boolean;
}) {
  return (
    <article className={styles.metric}>
      <div className={styles.metricTop}>
        <span className={styles.metricIcon}>
          <Icon size={18} />
        </span>
        <span>{label}</span>
        <ArrowUpRight size={15} />
      </div>
      <strong>{live ? "—" : value}</strong>
      <div className={styles.metricBottom}>
        {live ? (
          <span>Awaiting data connection</span>
        ) : (
          <>
            <span className={styles.positive}>↗ {change}</span>
            <span>vs. previous month</span>
          </>
        )}
      </div>
      {!live && (
        <svg
          className={styles.sparkline}
          viewBox="0 0 100 30"
          aria-hidden="true"
        >
          <path
            d="M0 25 12 20 22 23 34 13 44 18 57 10 68 14 78 7 89 9 100 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      )}
    </article>
  );
}
function PanelTitle({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.panelTitle}>
      <h2>
        <Icon size={16} />
        {title}
      </h2>
      {children}
    </div>
  );
}
export function Dashboard() {
  const { preview, base } = useOutletContext<{
    preview: boolean;
    base: string;
  }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [period, setPeriod] = useState("6");
  const [showData, setShowData] = useState(false);
  const chartText = theme === "dark" ? "#a1a1aa" : "#555b66";
  const chartBorder = theme === "dark" ? "#25252b" : "#e2e4e9";
  const tooltip = {
    background: "var(--color-surface-elevated)",
    border: "1px solid var(--color-border-strong)",
    color: "var(--color-text)",
    borderRadius: 8,
    fontSize: 12,
  };
  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE OVERVIEW"
        title={`Welcome back${preview ? ", Alex" : user?.firstName ? `, ${user.firstName}` : ""}.`}
        description="A clearer view of your people, projects, and progress."
      >
        <span className={styles.date}>
          <CalendarDays size={15} />
          {new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Calcutta",
          }).format(new Date())}
        </span>
        <Link className="button primary" to={`${base}tasks`}>
          <Plus size={16} />
          View tasks
        </Link>
      </PageHeader>
      <div className={styles.overviewLabel}>
        <span className="status-dot" />
        {preview
          ? "Illustrative organization overview"
          : "Organization overview"}
        <span className="badge">
          {preview ? "SAMPLE DATA" : "INTEGRATION PENDING"}
        </span>
      </div>
      {!preview && (
        <p className="notice">
          Your session is active. Your organization’s data is not connected
          yet, so no live metrics have been loaded.
        </p>
      )}
      <section className={styles.metrics} aria-label="Key metrics">
        <Metric
          icon={Users}
          label="Total employees"
          value="1,248"
          change="12.5%"
          live={!preview}
        />
        <Metric
          icon={FolderKanban}
          label="Active projects"
          value="42"
          change="8.2%"
          live={!preview}
        />
        <Metric
          icon={SquareCheckBig}
          label="Pending tasks"
          value="127"
          change="4.1%"
          live={!preview}
        />
        <Metric
          icon={IndianRupee}
          label="Monthly revenue"
          value="₹24.8L"
          change="16.7%"
          live={!preview}
        />
      </section>
      {preview ? (
        <>
          <section className={styles.chartGrid} aria-label="Sample analytics">
            <article className={`${styles.panel} ${styles.revenue}`}>
              <PanelTitle
                icon={ChartNoAxesCombined}
                title="Revenue performance"
              >
                <select
                  aria-label="Revenue chart period"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                >
                  <option value="6">Last 6 months</option>
                  <option value="3">Last 3 months</option>
                </select>
              </PanelTitle>
              <div className={styles.chartSummary}>
                <strong>
                  ₹24.8<span>L</span>
                </strong>
                <span className={styles.positive}>
                  ↗ 16.7% <small>vs. last month</small>
                </span>
              </div>
              <div
                className={styles.areaChart}
                role="img"
                aria-label="Sample revenue increased from 8.2 lakh in June to 24.8 lakh in November. Data table available below."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenue.slice(-Number(period))}
                    margin={{ top: 15, right: 12, left: -23, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenue-gradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0164ff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#0164ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke={chartBorder}
                      strokeDasharray="3 4"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: chartText, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartText, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}L`}
                    />
                    <Tooltip
                      contentStyle={tooltip}
                      formatter={(value) => `₹${value}L`}
                    />
                    <Area
                      type="monotone"
                      name="Previous period"
                      dataKey="previous"
                      stroke={chartText}
                      strokeDasharray="4 5"
                      fill="transparent"
                      strokeWidth={1}
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      name="Revenue"
                      dataKey="current"
                      stroke="#0164ff"
                      fill="url(#revenue-gradient)"
                      strokeWidth={2.5}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.chartLegend}>
                <span>
                  <i />
                  Revenue
                </span>
                <span>
                  <i className={styles.previous} />
                  Previous period
                </span>
                <button
                  type="button"
                  onClick={() => setShowData(!showData)}
                  aria-expanded={showData}
                >
                  {showData ? "Hide" : "View"} data
                </button>
              </div>
              {showData && (
                <div className="table-scroll">
                  <table>
                    <caption>Sample revenue, INR lakh</caption>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Previous</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.slice(-Number(period)).map((row) => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{row.current}</td>
                          <td>{row.previous}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
            <article className={styles.panel}>
              <PanelTitle icon={FolderKanban} title="Project distribution" />
              <div
                className={styles.donut}
                role="img"
                aria-label="42 sample projects: 27 on track, 9 at risk, 6 delayed"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatus}
                      dataKey="value"
                      innerRadius="72%"
                      outerRadius="95%"
                      paddingAngle={4}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {projectStatus.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutLabel}>
                  <strong>42</strong>
                  <span>Total projects</span>
                </div>
              </div>
              <div className={styles.legend}>
                {projectStatus.map((item) => (
                  <div key={item.name}>
                    <i style={{ background: item.color }} />
                    <span>{item.name}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>
            <article className={styles.panel}>
              <PanelTitle icon={SquareCheckBig} title="Task completion" />
              <div className={styles.completion}>
                <svg
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="87 percent of sample tasks completed"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    stroke={chartBorder}
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="49"
                    fill="none"
                    stroke="#0164ff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="268 308"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <strong>
                  87<span>%</span>
                </strong>
              </div>
              <div className={styles.taskTotal}>
                <strong>
                  1,142 <span>/ 1,320</span>
                </strong>
                <p>Tasks completed</p>
                <span className={styles.positive}>↗ 5.2% this month</span>
              </div>
            </article>
          </section>
          <section className={styles.bottomGrid}>
            <article className={styles.panel}>
              <PanelTitle
                icon={ChartNoAxesCombined}
                title="Department performance"
              />
              <div
                className={styles.barChart}
                role="img"
                aria-label="Sample department performance ranges from 85 to 95 percent"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departments}
                    margin={{ top: 25, right: 5, bottom: 0, left: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: chartText, fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis hide domain={[0, 110]} />
                    <Tooltip
                      contentStyle={tooltip}
                      cursor={{ fill: "var(--color-primary-soft)" }}
                    />
                    <Bar
                      dataKey="value"
                      name="Performance (%)"
                      fill="#0164ff"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                      label={{ position: "top", fill: chartText, fontSize: 10 }}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <details className={styles.dataDetails}>
                <summary>View performance data</summary>
                <ul>
                  {departments.map((item) => (
                    <li key={item.name}>
                      {item.name}: {item.value}%
                    </li>
                  ))}
                </ul>
              </details>
            </article>
            <article className={styles.panel}>
              <PanelTitle icon={Activity} title="Recent activity" />
              <div className={styles.activityList}>
                {activity.map((item) => (
                  <div className={styles.activity} key={item.name}>
                    <span className={styles.activityDot} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <time>{item.time}</time>
                  </div>
                ))}
              </div>
            </article>
            <article className={styles.panel}>
              <PanelTitle icon={CalendarDays} title="Upcoming deadlines" />
              <div className={styles.deadlines}>
                {deadlines.map((item) => (
                  <div className={styles.deadline} key={item.title}>
                    <div className={styles.calendar}>
                      <small>{item.month}</small>
                      <strong>{item.day}</strong>
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <span
                      className={`${styles.priority} ${styles[item.priority.toLowerCase()]}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
              <p className={styles.sampleNote}>
                Illustrative dates · November 2026
              </p>
            </article>
          </section>
        </>
      ) : (
        <section className="panel empty-state">
          <CircleDot size={32} />
          <h2>Your operational picture starts here</h2>
          <p>
            People, revenue, project performance, activities, and deadlines will
            appear when verified data services are connected.
          </p>
          <Link className="button" to="/preview/dashboard">
            Explore the sample dashboard
            <ArrowRight size={15} />
          </Link>
        </section>
      )}
      <section className={styles.quickActions}>
        <span>QUICK NAVIGATION</span>
        {[
          { path: "employees", title: "People directory", icon: Users },
          { path: "projects", title: "Project workspace", icon: FolderKanban },
          {
            path: "analytics",
            title: "Analytics & reports",
            icon: ChartNoAxesCombined,
          },
        ].map((item) => (
          <Link key={item.path} to={`${base}${item.path}`}>
            <item.icon size={16} />
            {item.title}
            <ArrowUpRight size={14} />
          </Link>
        ))}
      </section>
    </>
  );
}
