import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ProjectStats } from '../types/project';
import './stats-bar';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: Boolean }) showForm = false;
  @property({ type: Object }) stats: ProjectStats = {
    totalProjects: 0,
    totalSpent: 0,
    totalFabric: 0,
    totalTime: 0,
  };

  @state() private scrolled = false;
  private _ticking = false;
  private _preventToggle = false;

  private _scrollHandler = () => {
    if (!this._ticking) {
      window.requestAnimationFrame(() => {
        if (this._preventToggle) {
          this._ticking = false;
          return;
        }

        const y = window.scrollY;

        // Very wide hysteresis with debounce
        if (!this.scrolled && y > 200) {
          this.scrolled = true;
          // Prevent immediate toggling back
          this._preventToggle = true;
          setTimeout(() => { this._preventToggle = false; }, 300);
        } else if (this.scrolled && y < 50) {
          this.scrolled = false;
          // Prevent immediate toggling back
          this._preventToggle = true;
          setTimeout(() => { this._preventToggle = false; }, 300);
        }

        this._ticking = false;
      });
      this._ticking = true;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._scrollHandler);
  }

  static styles = css`
    .header {
      background: white;
      border-bottom: 1px solid var(--sand);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px var(--shadow);
      transition: box-shadow 0.15s ease;
      min-height: 70px;
    }

    .header.scrolled {
      box-shadow: 0 2px 8px var(--shadow-strong);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 2rem 1.5rem;
      transition: padding 0.15s ease;
      position: relative;
    }

    .header.scrolled .header-content {
      padding: 0.5rem 2rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 4.5rem;
      font-weight: 500;
      letter-spacing: 0.03em;
      color: var(--charcoal);
      margin: 0;
      text-shadow: 0 2px 4px var(--shadow);
      transition: font-size 0.15s ease;
    }

    .header.scrolled .logo {
      font-size: 1.5rem;
    }

    .tagline {
      font-family: var(--font-accent);
      font-size: 1.25rem;
      color: var(--terracotta);
      font-weight: 400;
      letter-spacing: 0.02em;
      margin-bottom: 0;
      transition: opacity 0.15s ease;
    }

    .header.scrolled .tagline {
      display: none;
    }

    .stitch-decoration {
      height: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.5rem;
      transition: opacity 0.15s ease;
    }

    .header.scrolled .stitch-decoration {
      display: none;
    }

    .stats-wrapper {
      transition: opacity 0.15s ease;
    }

    .header.scrolled .stats-wrapper {
      display: none;
    }

    .stitch-decoration::before,
    .stitch-decoration::after {
      content: '';
      width: 80px;
      border-top: 2px dashed var(--terracotta);
      opacity: 0.4;
    }

    /* Decorative thread spool */
    .stitch-decoration svg {
      width: 20px;
      height: 20px;
      color: var(--terracotta);
      opacity: 0.6;
    }

    .btn-new-project {
      background: var(--terracotta);
      color: white;
      border: 3px solid var(--terracotta-rich);
      padding: 0.9rem 2.25rem;
      border-radius: 50px;
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-bounce);
      letter-spacing: 0.03em;
      flex-shrink: 0;
      box-shadow: 0 4px 16px var(--shadow-soft), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
    }

    /* Button stitch effect */
    .btn-new-project::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow:
        -12px 0 0 rgba(255, 255, 255, 0.2),
        12px 0 0 rgba(255, 255, 255, 0.2);
    }

    .btn-new-project:hover {
      background: var(--terracotta-light);
      border-color: var(--terracotta);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 24px rgba(193, 123, 99, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .btn-new-project:active {
      transform: translateY(-1px) scale(0.98);
    }

    .header.scrolled .btn-new-project {
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1.5rem 1rem 1rem;
      }

      .header.scrolled .header-content {
        padding: 0.5rem 1rem;
      }

      .logo {
        font-size: 3rem;
      }

      .header.scrolled .logo {
        font-size: 1.25rem;
      }

      .tagline {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .header-top {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .header.scrolled .header-top {
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
      }

      .logo {
        font-size: 2.5rem;
      }

      .header.scrolled .logo {
        font-size: 1.1rem;
      }

      .btn-new-project {
        width: 100%;
      }

      .header.scrolled .btn-new-project {
        width: auto;
      }
    }
  `;

  private handleNewProject() {
    this.dispatchEvent(new CustomEvent('toggle-form', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <header class="header ${this.scrolled ? 'scrolled' : ''}">
        <div class="header-content">
          <div class="header-top">
            <h1 class="logo">Jasmina's Atelier</h1>
            <button
              class="btn-new-project"
              @click=${this.handleNewProject}
            >
              ${this.showForm ? '✕ Schließen' : '+ Neues Projekt'}
            </button>
          </div>
          <p class="tagline">Nähprojekt-Tagebuch</p>
          <div class="stitch-decoration" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" stroke-width="1.5"/>
              <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stats-wrapper">
            <stats-bar .stats=${this.stats}></stats-bar>
          </div>
        </div>
      </header>
    `;
  }
}
