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
      gap: 2rem;
      padding: 2rem 2.5rem;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4)),
        linear-gradient(135deg, var(--cream-dark), var(--sand));
      border-radius: var(--radius);
      box-shadow:
        0 8px 32px var(--shadow-strong),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 -1px 2px rgba(0, 0, 0, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.6);
      transition: all 0.15s ease;
      position: relative;
      overflow: hidden;
    }

    /* Fabric texture overlay */
    .stats-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(193, 123, 99, 0.03) 2px, rgba(193, 123, 99, 0.03) 4px);
      pointer-events: none;
      transition: opacity 0.15s ease;
    }

    .stats-bar.compact {
      padding: 0.4rem 1.5rem;
      gap: 1.5rem;
      border-radius: var(--radius-sm);
      box-shadow: 0 2px 8px var(--shadow);
      border: 1px solid rgba(255, 255, 255, 0.6);
    }

    .stats-bar.compact::before {
      opacity: 0;
    }


    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      position: relative;
      z-index: 1;
      transition: gap 0.15s ease;
    }

    .stats-bar.compact .stat {
      gap: 0;
      flex-direction: row;
      justify-content: center;
    }

    .stat-value-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .stat-icon {
      color: var(--terracotta);
      opacity: 0.7;
      transition: all 0.15s ease;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 4px rgba(193, 123, 99, 0.2));
    }

    .stat:hover .stat-icon {
      opacity: 1;
      transform: scale(1.1) rotate(5deg);
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
      display: block;
    }

    .stats-bar.compact .stat-icon {
      display: none;
    }


    .stat-value {
      font-family: var(--font-display);
      font-size: 2.75rem;
      font-weight: 600;
      color: var(--terracotta-rich);
      transition: all 0.15s ease;
      white-space: nowrap;
      text-shadow: 0 2px 4px rgba(193, 123, 99, 0.15);
      line-height: 1;
    }

    .stat:hover .stat-value {
      transform: scale(1.05);
      color: var(--terracotta);
    }

    .stats-bar.compact .stat-value {
      font-size: 1.1rem;
      font-weight: 500;
      text-shadow: none;
    }

    .stats-bar.compact .stat:hover .stat-value {
      transform: none;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--charcoal-light);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      transition: all 0.15s ease;
    }

    .stats-bar.compact .stat-label {
      display: none;
    }

    @media (max-width: 768px) {
      .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1rem;
      }

      .stats-bar.compact {
        grid-template-columns: repeat(4, 1fr);
        padding: 0.4rem 1rem;
        gap: 0.75rem;
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
