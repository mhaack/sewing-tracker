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

  // Hysteresis: shrink at 80px, expand back only at 20px to prevent flickering
  private _scrollHandler = () => {
    const y = window.scrollY;
    if (!this.scrolled && y > 80) {
      this.scrolled = true;
    } else if (this.scrolled && y < 20) {
      this.scrolled = false;
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
      transition: box-shadow 0.3s ease;
    }

    .header.scrolled {
      box-shadow: 0 2px 12px var(--shadow-strong);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 2rem 1.5rem;
      transition: padding 0.3s ease;
    }

    .header.scrolled .header-content {
      padding: 0.75rem 2rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      transition: margin 0.3s ease;
    }

    .header.scrolled .header-top {
      margin-bottom: 0.25rem;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 400;
      letter-spacing: 0.02em;
      color: var(--charcoal);
      margin: 0;
      transition: font-size 0.3s ease;
    }

    .header.scrolled .logo {
      font-size: 1.75rem;
    }

    .tagline {
      font-size: 0.95rem;
      color: var(--charcoal-light);
      font-weight: 300;
      letter-spacing: 0.03em;
      margin-bottom: 0;
      max-height: 2rem;
      opacity: 1;
      overflow: hidden;
      transition: opacity 0.2s ease, max-height 0.3s ease, margin 0.3s ease;
    }

    .header.scrolled .tagline {
      opacity: 0;
      max-height: 0;
      margin-bottom: 0;
      pointer-events: none;
    }

    .stitch-decoration {
      height: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 1.25rem;
      max-height: 16px;
      opacity: 1;
      overflow: hidden;
      transition: opacity 0.2s ease, max-height 0.3s ease, margin 0.3s ease;
    }

    .header.scrolled .stitch-decoration {
      opacity: 0;
      max-height: 0;
      margin-bottom: 0;
    }

    .stitch-decoration::before {
      content: '';
      width: 60px;
      border-top: 1.5px dashed var(--terracotta);
      opacity: 0.35;
    }

    .btn-new-project {
      background: var(--terracotta);
      color: white;
      border: none;
      padding: 0.75rem 1.75rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      letter-spacing: 0.02em;
      flex-shrink: 0;
    }

    .btn-new-project:hover {
      background: var(--terracotta-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(193, 123, 99, 0.3);
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
        font-size: 2.25rem;
      }

      .header.scrolled .logo {
        font-size: 1.5rem;
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
          <div class="stitch-decoration" aria-hidden="true"></div>
          <stats-bar .stats=${this.stats} ?compact=${this.scrolled}></stats-bar>
        </div>
      </header>
    `;
  }
}
