import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ProjectStats } from '../types/project';

@customElement('stats-bar')
export class StatsBar extends LitElement {
  @property({ type: Object }) stats: ProjectStats = {
    totalProjects: 0,
    totalSpent: 0,
    totalFabric: 0,
    totalTime: 0,
  };

  @property({ type: Boolean }) compact = false;

  static styles = css`
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, var(--cream-dark), var(--sand));
      border-radius: var(--radius);
      box-shadow: inset 0 2px 8px var(--shadow);
      transition: padding 0.3s ease, gap 0.3s ease;
    }

    .stats-bar.compact {
      padding: 0.5rem 1.5rem;
      gap: 1rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      animation: statReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
    }

    .stat:nth-child(1) { animation-delay: 0.1s; }
    .stat:nth-child(2) { animation-delay: 0.2s; }
    .stat:nth-child(3) { animation-delay: 0.3s; }
    .stat:nth-child(4) { animation-delay: 0.4s; }

    @keyframes statReveal {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .stat-value-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .stat-icon {
      color: var(--terracotta);
      opacity: 0.5;
      transition: opacity 0.3s ease;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 18px;
      height: 18px;
      display: block;
    }

    .compact .stat-icon {
      display: none;
    }

    .stat-value {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      color: var(--terracotta);
      transition: font-size 0.3s ease;
      white-space: nowrap;
    }

    .compact .stat-value {
      font-size: 1.25rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--charcoal-light);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 400;
      transition: font-size 0.3s ease;
    }

    .compact .stat-label {
      font-size: 0.65rem;
    }

    @media (max-width: 768px) {
      .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1rem;
      }

      .stats-bar.compact {
        grid-template-columns: repeat(4, 1fr);
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
      }

      .compact .stat-label {
        font-size: 0.6rem;
      }
    }

    @media (max-width: 480px) {
      .stats-bar {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 0;
        padding: 0.75rem 0;
        scrollbar-width: none;
      }

      .stats-bar::-webkit-scrollbar {
        display: none;
      }

      .stat {
        flex: 0 0 25%;
        min-width: 100px;
        scroll-snap-align: start;
        padding: 0.5rem 0.5rem;
      }

      .stat-icon svg {
        width: 16px;
        height: 16px;
      }

      .stat-value {
        font-size: 1.35rem;
      }
    }
  `;

  render() {
    const totalMinutes = Math.round(this.stats.totalTime * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeDisplay = hours > 0 && minutes > 0
      ? `${hours}h ${minutes}m`
      : hours > 0
      ? `${hours}h`
      : `${minutes}m`;

    return html`
      <div class="stats-bar ${this.compact ? 'compact' : ''}">
        <div class="stat">
          <span class="stat-value-row">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="6" r="3"/>
                <circle cx="6" cy="18" r="3"/>
                <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                <line x1="8.12" y1="8.12" x2="12" y2="12"/>
              </svg>
            </span>
            <span class="stat-value">${this.stats.totalProjects}</span>
          </span>
          <span class="stat-label">Projekte</span>
        </div>
        <div class="stat">
          <span class="stat-value-row">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M6 12h.01M18 12h.01"/>
              </svg>
            </span>
            <span class="stat-value">${this.stats.totalSpent.toFixed(2)}€</span>
          </span>
          <span class="stat-label">Gesamtausgaben</span>
        </div>
        <div class="stat">
          <span class="stat-value-row">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/>
                <path d="m14.5 12.5 2-2m-5-1 2-2m-5-1 2-2"/>
              </svg>
            </span>
            <span class="stat-value">${this.stats.totalFabric.toFixed(1)}m</span>
          </span>
          <span class="stat-label">Stoff verwendet</span>
        </div>
        <div class="stat">
          <span class="stat-value-row">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </span>
            <span class="stat-value">${timeDisplay}</span>
          </span>
          <span class="stat-label">Zeit</span>
        </div>
      </div>
    `;
  }
}
