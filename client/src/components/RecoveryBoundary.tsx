import { Component, type ReactNode } from "react";
import { downloadRecovery } from "@/lib/device-storage";
export default class RecoveryBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; message: string }
> {
  state = { failed: false, message: "" };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="max-w-xl mx-auto p-8 mt-12">
        <h1 className="text-3xl mb-4">Let’s take a moment.</h1>
        <p className="mb-5">
          Vihaara could not open this screen. Your saved data has not been
          removed. Your browser may have blocked storage, or a saved record may
          be unreadable.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="primary-link"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <button
            className="primary-link"
            onClick={() => {
              try {
                downloadRecovery();
                this.setState({
                  message:
                    "Recovery copy downloaded. Keep this unencrypted file somewhere private.",
                });
              } catch {
                this.setState({
                  message:
                    "Your browser is blocking storage. Allow site storage in browser settings, then try again.",
                });
              }
            }}
          >
            Download recovery copy
          </button>
        </div>
        <p className="mt-4 text-sm" role="status">
          {this.state.message}
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          After saving a recovery copy, you can clear this site’s data in
          browser settings to start fresh. This removes saved entries on this
          device.
        </p>
      </main>
    );
  }
}
