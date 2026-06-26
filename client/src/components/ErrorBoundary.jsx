/**
 * ErrorBoundary
 * Catches render-time errors and failed lazy-chunk loads so the app never
 * shows a blank white screen. Offers a reload action.
 *
 * A common cause is a stale chunk after a new deploy — reloading fixes it.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log for diagnostics. In production this could ship to an error service.
    console.error('[ErrorBoundary]', error, info);
  }

  handleReload = () => {
    // Clear potentially stale module cache & hard reload
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isChunkError = /chunk|dynamically imported module|Failed to fetch/i.test(
      this.state.error?.message || ''
    );

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: '#070c1e', color: '#e0e3e5' }}
      >
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(229,169,60,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }}
          />
          <img
            src="/logo-loader.png"
            alt="Zeus IoT"
            className="relative w-20 h-20 object-contain opacity-80"
          />
        </div>

        <h1
          className="font-headline-xl uppercase mb-3"
          style={{ fontSize: 'clamp(22px, 5vw, 32px)', color: '#e5a93c', letterSpacing: '0.02em' }}
        >
          System Interrupt
        </h1>

        <p className="font-body-md text-on-surface-variant mb-2 max-w-md" style={{ fontSize: 15 }}>
          {isChunkError
            ? 'A newer version of the site is available. A quick refresh will get you back online.'
            : 'Something unexpected happened while loading this view.'}
        </p>

        {this.state.error?.message && !isChunkError && (
          <p
            className="font-code-sm mb-6 px-4 py-2 rounded"
            style={{ fontSize: 11, color: '#ffb4ab', background: 'rgba(147,0,10,0.15)', maxWidth: 420 }}
          >
            {this.state.error.message}
          </p>
        )}

        <button
          onClick={this.handleReload}
          className="btn-thunderbolt font-label-caps uppercase tracking-widest mt-4"
          style={{ fontSize: 12, padding: '14px 32px' }}
        >
          Reload Zeus
        </button>

        <a
          href="/"
          className="mt-5 font-code-sm text-on-surface-variant hover:text-secondary transition-colors"
          style={{ fontSize: 12 }}
        >
          ← Return Home
        </a>
      </div>
    );
  }
}
