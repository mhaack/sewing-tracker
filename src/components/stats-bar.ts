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

  static styles = css`
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--cream-dark), var(--sand));
      border-radius: var(--radius);
      box-shadow: inset 0 2px 8px var(--shadow);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-value {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      color: var(--terracotta);
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--charcoal-light);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 300;
    }

    @media (max-width: 768px) {
      .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1rem;
      }
    }
  `;

  render() {
    // Format time from decimal hours to hours and minutes
    const totalMinutes = Math.round(this.stats.totalTime * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeDisplay = hours > 0 && minutes > 0
      ? `${hours}h ${minutes}m`
      : hours > 0
      ? `${hours}h`
      : `${minutes}m`;

    return html`
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-value">${this.stats.totalProjects}</span>
          <span class="stat-label">Projekte</span>
        </div>
        <div class="stat">
          <span class="stat-value">${this.stats.totalSpent.toFixed(2)}€</span>
          <span class="stat-label">Gesamtausgaben</span>
        </div>
        <div class="stat">
          <span class="stat-value">${this.stats.totalFabric.toFixed(1)}m</span>
          <span class="stat-label">Stoff verwendet</span>
        </div>
        <div class="stat">
          <span class="stat-value">${timeDisplay}</span>
          <span class="stat-label">Zeit</span>
        </div>
      </div>
    `;
  }
}
