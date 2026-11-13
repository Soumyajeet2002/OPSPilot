import { Component } from "react";
import type { ReactNode } from "react";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="empty-state">
          <h1>This workspace could not be displayed</h1>
          <p>Reload to start a fresh browser session.</p>
          <button
            className="button primary"
            onClick={() => window.location.reload()}
          >
            Reload OpsPilot
          </button>
        </main>
      );
    return this.props.children;
  }
}
