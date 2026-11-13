export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`brand ${compact ? "brand-compact" : ""}`}
      aria-label="OpsPilot"
    >
      {compact ? "OP" : "OPSPILOT"}
      <span className="brand-dot" aria-hidden="true" />
    </span>
  );
}
