import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { modules } from "../../app/navigation";
import { PageHeader } from "../../components/PageHeader";
import styles from "./ModulePage.module.css";

export function ModulePage() {
  const { module: path } = useParams<{ module: string }>();
  const { base } = useOutletContext<{ base: string }>();
  const [search, setSearch] = useState("");
  const module = modules.find(
    (item) =>
      item.path === path && !["dashboard", "settings"].includes(item.path),
  );
  if (!module)
    return (
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>This workspace page does not exist.</p>
        <Link className="button" to={`${base}dashboard`}>
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    );
  if (path === "ai-assistant")
    return (
      <>
        <PageHeader
          eyebrow="INTELLIGENCE"
          title="Your operations, in focus."
          description="Ask better questions. Make more informed decisions."
        />
        <div className={styles.assistant}>
          <span className="badge">AI INTEGRATION PENDING</span>
          <div className={styles.aiIntro}>
            <span className={styles.aiIcon}>
              <Sparkles size={30} />
            </span>
            <h2>How can OpsPilot help?</h2>
            <p>
              Explore your operations through a connected intelligence
              workspace.
            </p>
            <div className={styles.prompts}>
              {module.capabilities.map((item) => (
                <div key={item}>
                  <Sparkles size={16} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.composer}>
            <label className="sr-only" htmlFor="ai-input">
              Message OpsPilot assistant
            </label>
            <textarea
              id="ai-input"
              disabled
              placeholder="AI messaging will be available when the service is connected."
              rows={2}
            />
            <button
              className="icon-button"
              disabled
              aria-label="Send message unavailable"
            >
              <Send size={18} />
            </button>
          </div>
          <p className={styles.disclaimer}>
            No AI service is connected. Messages cannot be sent and no responses
            are generated.
          </p>
        </div>
      </>
    );
  const capabilities = module.capabilities.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow={module.group.toUpperCase()}
        title={module.title}
        description={module.description}
      >
        <span className="badge">INTEGRATION PENDING</span>
      </PageHeader>
      <div className={styles.featureBanner}>
        <span className={styles.moduleIcon}>
          <module.icon size={29} />
        </span>
        <div>
          <h2>A connected {module.title.toLowerCase()} workspace</h2>
          <p>
            The interface is reserved for verified organization data. No records
            have been loaded.
          </p>
        </div>
      </div>
      <section className="panel">
        <div className={styles.sectionTitle}>
          <div>
            <h2>Planned capabilities</h2>
            <p className="muted">
              Availability depends on your workspace connections and permissions.
            </p>
          </div>
          <label className={styles.search}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Find a capabilityâ€¦"
              aria-label="Search planned capabilities"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <div className={styles.capabilities}>
          {capabilities.length ? (
            capabilities.map((item, index) => (
              <article key={item}>
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item}</h3>
                <span className="badge">PLANNED</span>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Search size={24} />
              <h3>No matching capabilities</h3>
              <button className="button" onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
      <div className={styles.dependency}>
        <LockKeyhole size={18} />
        <div>
          <h3>Data connection required</h3>
          <p>
            Your organization’s {module.title.toLowerCase()} data is not connected
            yet. Records, detail views, and supported actions will become available
            when this workspace connection is ready.
          </p>
        </div>
      </div>
      {path === "analytics" && (
        <section className="panel">
          <h2>Enterprise intelligence integrations</h2>
          <p className="muted">
            Power BI, Snowflake, and Qlik Sense require separately verified
            embedding, credentials, licensing, and permissions. None are
            connected.
          </p>
        </section>
      )}
      <Link className={styles.back} to={`${base}dashboard`}>
        Return to overview
        <ArrowUpRight size={14} />
      </Link>
    </>
  );
}
