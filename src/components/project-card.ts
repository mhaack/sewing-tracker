import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Project } from '../types/project';

@customElement('project-card')
export class ProjectCard extends LitElement {
  @property({ type: Object }) project!: Project;
  @property({ type: Number }) index = 0;

  static styles = css`
    .project-card {
      background: white;
      border-radius: var(--radius);
      padding: 1rem 1.5rem 1.5rem;
      box-shadow: 0 4px 20px var(--shadow), 0 0 0 1px var(--sand);
      transition: var(--transition);
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .project-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--terracotta), var(--rose), var(--sage));
      opacity: 0;
      transition: var(--transition);
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px var(--shadow-strong), 0 0 0 1px var(--sage);
    }

    .project-card:hover::before {
      opacity: 1;
    }

    .project-header {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    .project-name {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      color: var(--charcoal);
      line-height: 1.2;
      letter-spacing: 0.01em;
      margin-top: 0;
      margin-bottom: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .project-meta-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }

    .project-meta-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .project-date {
      font-size: 0.85rem;
      color: var(--charcoal-light);
      font-weight: 400;
    }

    .meta-separator {
      font-size: 0.85rem;
      color: var(--charcoal-light);
    }

    .project-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
      margin-left: auto;
    }

    .btn-icon {
      background: var(--cream);
      border: 1px solid var(--sand);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      color: var(--charcoal-light);
      text-decoration: none;
    }

    .btn-icon svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    .btn-icon:hover {
      background: var(--sage);
      color: white;
      border-color: var(--sage);
      transform: scale(1.1);
    }

    .btn-delete:hover {
      background: var(--rose);
      border-color: var(--rose);
    }

    .fabric-badge {
      background: white;
      color: var(--charcoal);
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      border: 1px solid var(--sand);
      font-weight: 400;
    }

    .detail-fabrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .project-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
      padding: 1rem;
      background: var(--cream);
      border-radius: var(--radius-sm);
      align-content: start;
      margin-top: auto;
    }

    .detail.full-width {
      grid-column: 1 / -1;
    }

    .detail {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .detail-fabrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      width: 100%;
    }

    .detail-icon {
      font-size: 1rem;
      flex-shrink: 0;
    }

    .detail-label {
      font-size: 0.65rem;
      color: var(--charcoal-light);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 400;
    }

    .detail-value {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 500;
      color: var(--charcoal);
    }

    .detail-text {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 500;
      color: var(--charcoal);
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.3;
    }


    .status-badge {
      display: inline-block;
      padding: 0.3rem 0.7rem;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.2;
    }

    .status-in-bearbeitung {
      background: #ffd700;
      color: #333;
    }

    .status-fertig {
      background: #90EE90;
      color: #333;
    }

    .status-idee {
      background: #E6E6FA;
      color: #333;
    }

    .status-geplant-für-sommer,
    .status-geplant-für-winter,
    .status-geplant-für-frühling,
    .status-geplant-für-herbst {
      background: #87CEEB;
      color: #333;
    }

  `;

  private handleEdit() {
    this.dispatchEvent(new CustomEvent('edit-project', {
      detail: this.project,
      bubbles: true,
      composed: true,
    }));
  }

  private handleDelete() {
    if (confirm('Möchten Sie dieses Projekt wirklich löschen?')) {
      this.dispatchEvent(new CustomEvent('delete-project', {
        detail: this.project.id,
        bubbles: true,
        composed: true,
      }));
    }
  }

  render() {
    const { project } = this;
    const hasDetails = project.moneySpent || project.fabricUsed || project.timeSpent || project.patternBrand || project.purchasedFrom || project.fabrics.length > 0;

    // Format time from decimal hours to hours and minutes
    const totalMinutes = Math.round(project.timeSpent * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeDisplay = hours > 0 && minutes > 0
      ? `${hours}h ${minutes}m`
      : hours > 0
      ? `${hours}h`
      : `${minutes}m`;

    // Format date
    const dateDisplay = project.projectDate
      ? new Date(project.projectDate).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : null;

    return html`
      <div class="project-card" style="animation-delay: ${this.index * 0.05}s">
        <div class="project-header">
          <h3 class="project-name">${project.name}</h3>
        </div>

        ${dateDisplay || project.status ? html`
          <div class="project-meta-line">
            <div class="project-meta-content">
              ${dateDisplay ? html`
                <span class="project-date">${dateDisplay}</span>
              ` : ''}
              ${dateDisplay && project.status ? html`
                <span class="meta-separator">—</span>
              ` : ''}
              ${project.status ? html`
                <span class="status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}">${project.status}</span>
              ` : ''}
            </div>
            <div class="project-actions">
            ${project.instagramLink ? html`
              <a
                href="${project.instagramLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-icon"
                title="Auf Instagram ansehen"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            ` : ''}
            <button
              @click=${this.handleEdit}
              class="btn-icon"
              title="Bearbeiten"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button
              @click=${this.handleDelete}
              class="btn-icon btn-delete"
              title="Löschen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          </div>
        ` : html`
          <div class="project-meta-line">
            <div class="project-meta-content"></div>
            <div class="project-actions">
              ${project.instagramLink ? html`
                <a
                  href="${project.instagramLink}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-icon"
                  title="Auf Instagram ansehen"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              ` : ''}
              <button
                @click=${this.handleEdit}
                class="btn-icon"
                title="Bearbeiten"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click=${this.handleDelete}
                class="btn-icon btn-delete"
                title="Löschen"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        `}

        ${hasDetails || project.fabrics.length > 0 ? html`
          <div class="project-details">
            ${project.moneySpent ? html`
              <div class="detail">
                <div class="detail-header">
                  <span class="detail-icon">💰</span>
                  <span class="detail-label">Kosten</span>
                </div>
                <span class="detail-value">${project.moneySpent.toFixed(2)}€</span>
              </div>
            ` : ''}
            ${project.fabricUsed ? html`
              <div class="detail">
                <div class="detail-header">
                  <span class="detail-icon">📏</span>
                  <span class="detail-label">Stoff</span>
                </div>
                <span class="detail-value">${project.fabricUsed.toFixed(1)}m</span>
              </div>
            ` : ''}
            ${project.timeSpent ? html`
              <div class="detail">
                <div class="detail-header">
                  <span class="detail-icon">⏱️</span>
                  <span class="detail-label">Zeit</span>
                </div>
                <span class="detail-value">${timeDisplay}</span>
              </div>
            ` : ''}
            ${project.patternBrand ? html`
              <div class="detail">
                <div class="detail-header">
                  <span class="detail-icon">📐</span>
                  <span class="detail-label">Schnitt</span>
                </div>
                <span class="detail-text">${project.patternBrand}</span>
              </div>
            ` : ''}
            ${project.purchasedFrom ? html`
              <div class="detail">
                <div class="detail-header">
                  <span class="detail-icon">🛒</span>
                  <span class="detail-label">Gekauft bei</span>
                </div>
                <span class="detail-text">${project.purchasedFrom}</span>
              </div>
            ` : ''}
            ${project.fabrics.length > 0 ? html`
              <div class="detail full-width">
                <div class="detail-header">
                  <span class="detail-icon">🧵</span>
                  <span class="detail-label">Stoffe</span>
                </div>
                <div class="detail-fabrics">
                  ${project.fabrics.map(fabric => html`
                    <span class="fabric-badge">${fabric}</span>
                  `)}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}
