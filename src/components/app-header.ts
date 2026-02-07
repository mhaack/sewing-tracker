import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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

  static styles = css`
    .header {
      background: white;
      border-bottom: 1px solid var(--sand);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px var(--shadow);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 2rem 1.5rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .logo {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 400;
      letter-spacing: 0.02em;
      color: var(--charcoal);
      margin: 0;
    }

    .tagline {
      font-size: 0.95rem;
      color: var(--charcoal-light);
      font-weight: 300;
      letter-spacing: 0.03em;
      margin-bottom: 2rem;
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
    }

    .btn-new-project:hover {
      background: var(--terracotta-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(193, 123, 99, 0.3);
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1.5rem 1rem 1rem;
      }

      .logo {
        font-size: 2.25rem;
      }
    }

    @media (max-width: 480px) {
      .header-top {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .btn-new-project {
        width: 100%;
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
      <header class="header">
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
          <stats-bar .stats=${this.stats}></stats-bar>
        </div>
      </header>
    `;
  }
}
