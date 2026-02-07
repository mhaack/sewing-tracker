import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Project } from '../types/project';
import { statusBadgeStyles } from '../styles/shared-styles';
import { getStatusStyle, getStatusAccentColor } from '../utils/status';
import './project-card';

@customElement('project-list')
export class ProjectList extends LitElement {
  @property({ type: Array }) projects: Project[] = [];
  @property({ type: String }) viewMode: 'cards' | 'list' = 'cards';
  @property({ type: String }) sortMode: 'name' | 'date-desc' | 'date-asc' = 'date-desc';

  static styles = [
    statusBadgeStyles,
    css`
      .projects-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;
        align-items: start;
      }

      @media (min-width: 768px) {
        .projects-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
      }

      @media (min-width: 1200px) {
        .projects-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }
      }

      /* ── List view ── */

      .projects-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .list-header {
        display: grid;
        grid-template-columns: 3fr 2fr 1fr 140px;
        gap: 1rem;
        padding: 0.75rem 1.5rem;
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--charcoal-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--sand);
        margin-bottom: 0.5rem;
      }

      .list-header-col {
        text-align: left;
      }

      .list-header-col.align-right {
        text-align: right;
      }

      .list-item {
        background: white;
        border-radius: var(--radius-sm);
        padding: 1.1rem 1.5rem;
        box-shadow: 0 2px 8px var(--shadow);
        display: grid;
        grid-template-columns: 3fr 2fr 1fr 140px;
        gap: 1rem;
        align-items: center;
        transition: var(--transition);
        border-left: 4px solid var(--list-accent, transparent);
      }

      .list-item:hover {
        box-shadow: 0 4px 16px var(--shadow-strong);
        border-left-color: var(--list-accent, var(--sage));
        transform: translateX(4px);
      }

      .list-item-content {
        display: contents;
      }

      .list-item-name {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      /* Typography: use body font for list titles at smaller sizes */
      .list-item-title {
        font-family: var(--font-body);
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--charcoal);
        line-height: 1.3;
      }

      .list-item-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .list-item-date {
        font-size: 0.8rem;
        color: var(--charcoal-light);
      }

      .list-item-fabrics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }

      .list-fabric-tag {
        background: var(--cream-dark);
        color: var(--charcoal);
        padding: 0.25rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        border: 1px solid var(--sand);
      }

      .list-item-details {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 500;
        color: var(--charcoal);
        white-space: nowrap;
        flex-wrap: wrap;
      }

      .list-detail-separator {
        color: var(--sand);
        font-weight: 300;
        font-family: var(--font-body);
        font-size: 0.85rem;
      }

      .list-item-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .list-btn {
        background: var(--cream);
        border: 1px solid var(--sand);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        color: var(--charcoal-light);
        text-decoration: none;
      }

      .list-btn svg {
        width: 16px;
        height: 16px;
        stroke-width: 2;
      }

      .list-btn:hover {
        background: var(--sage);
        color: white;
        border-color: var(--sage);
      }

      .list-btn.delete:hover {
        background: var(--rose);
        border-color: var(--rose);
      }

      .list-meta-separator {
        font-size: 0.8rem;
        color: var(--charcoal-light);
      }

      .list-status-empty {
        color: var(--charcoal-light);
        font-size: 0.85rem;
      }

      /* ── Empty state ── */

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 5rem 2rem;
        color: var(--charcoal-light);
      }

      .empty-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        color: var(--terracotta);
        opacity: 0.3;
        stroke-width: 1.5;
        animation: floatBob 3s ease-in-out infinite;
      }

      @keyframes floatBob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      .empty-state h3 {
        font-family: var(--font-display);
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--charcoal);
        margin-bottom: 1rem;
        letter-spacing: 0.02em;
      }

      .empty-state p {
        font-size: 1.1rem;
        max-width: 450px;
        margin: 0 auto;
        line-height: 1.7;
        color: var(--charcoal-light);
      }

      /* ── Responsive: list view ── */

      @media (max-width: 1200px) {
        .list-header,
        .list-item {
          grid-template-columns: 2.5fr 1.5fr 1fr 120px;
          gap: 0.75rem;
        }
      }

      @media (max-width: 768px) {
        .projects-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        /* Same as desktop but drop the Stoffe column */
        .list-header,
        .list-item {
          grid-template-columns: 3fr 1fr 140px;
          gap: 0.5rem;
          padding: 0.75rem;
        }

        .list-header {
          padding: 0.5rem 0.75rem;
        }

        /* Hide Stoffe column */
        .list-header-col:nth-child(2) {
          display: none;
        }

        .list-item-fabrics {
          display: none;
        }

        .list-item-title {
          font-size: 1rem;
        }

        .list-item-meta {
          font-size: 0.75rem;
        }

        .list-item-details {
          font-size: 0.9rem;
        }
      }
    `,
  ];

  private handleEdit(project: Project) {
    this.dispatchEvent(new CustomEvent('edit-project', {
      detail: project,
      bubbles: true,
      composed: true,
    }));
  }

  private handleDelete(project: Project) {
    if (confirm('Möchten Sie dieses Projekt wirklich löschen?')) {
      this.dispatchEvent(new CustomEvent('delete-project', {
        detail: project.id,
        bubbles: true,
        composed: true,
      }));
    }
  }

  private getSortedProjects(): Project[] {
    const sorted = [...this.projects];
    
    if (this.sortMode === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'de-DE'));
    } else if (this.sortMode === 'date-desc') {
      return sorted.sort((a, b) => {
        const dateA = a.projectDate ? new Date(a.projectDate).getTime() : 0;
        const dateB = b.projectDate ? new Date(b.projectDate).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      return sorted.sort((a, b) => {
        const dateA = a.projectDate ? new Date(a.projectDate).getTime() : 0;
        const dateB = b.projectDate ? new Date(b.projectDate).getTime() : 0;
        return dateA - dateB;
      });
    }
  }

  private renderListView() {
    const sortedProjects = this.getSortedProjects();
    
    return html`
      <div>
        <div class="list-header">
          <div class="list-header-col">Projekt</div>
          <div class="list-header-col">Stoffe</div>
          <div class="list-header-col">Details</div>
          <div class="list-header-col align-right">Aktionen</div>
        </div>
        <div class="projects-list">
          ${sortedProjects.map(project => {
          // Format time
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
            : '';

          const isComplete = project.status?.toLowerCase() === 'fertig';

          return html`
            <div class="list-item" style="--list-accent: ${getStatusAccentColor(project.status)}">
              <div class="list-item-name">
                <div class="list-item-title">${project.name}</div>
                ${dateDisplay || project.status ? html`
                  <div class="list-item-meta">
                    ${dateDisplay ? html`
                      <span class="list-item-date">${dateDisplay}</span>
                    ` : ''}
                    ${dateDisplay && project.status ? html`
                      <span class="list-meta-separator">—</span>
                    ` : ''}
                    ${project.status ? html`
                      <span
                        class="status-badge ${isComplete ? 'status-complete' : ''}"
                        style="${getStatusStyle(project.status)}"
                      >${project.status}</span>
                    ` : ''}
                  </div>
                ` : ''}
              </div>

              <div class="list-item-fabrics">
                ${project.fabrics.slice(0, 2).map(fabric => html`
                  <span class="list-fabric-tag">${fabric}</span>
                `)}
                ${project.fabrics.length > 2 ? html`
                  <span class="list-fabric-tag">+${project.fabrics.length - 2}</span>
                ` : ''}
              </div>

              <div class="list-item-details">
                <span>${project.moneySpent.toFixed(2)}€</span>
                <span class="list-detail-separator">/</span>
                <span>${project.fabricUsed.toFixed(1)}m</span>
                <span class="list-detail-separator">/</span>
                <span>${timeDisplay}</span>
              </div>

              <div class="list-item-actions">
                ${project.instagramLink ? html`
                  <a
                    href="${project.instagramLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="list-btn"
                    title="Auf Instagram ansehen"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                ` : ''}
                <button
                  class="list-btn"
                  @click=${() => this.handleEdit(project)}
                  title="Bearbeiten"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button
                  class="list-btn delete"
                  @click=${() => this.handleDelete(project)}
                  title="Löschen"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

            </div>
          `;
        })}
        </div>
      </div>
    `;
  }

  private renderCardsView() {
    const sortedProjects = this.getSortedProjects();
    
    return html`
      <div class="projects-grid">
        ${sortedProjects.map((project, index) => html`
          <project-card
            .project=${project}
            .index=${index}
          ></project-card>
        `)}
      </div>
    `;
  }

  render() {
    if (this.projects.length === 0) {
      return html`
        <div class="${this.viewMode === 'cards' ? 'projects-grid' : 'projects-list'}">
          <div class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="6" cy="6" r="3"/>
              <circle cx="6" cy="18" r="3"/>
              <line x1="20" y1="4" x2="8.12" y2="15.88"/>
              <line x1="14.47" y1="14.48" x2="20" y2="20"/>
              <line x1="8.12" y1="8.12" x2="12" y2="12"/>
            </svg>
            <h3>Dein Atelier wartet!</h3>
            <p>Erstelle dein erstes Nähprojekt und beginne, deine kreativen Werke zu dokumentieren.</p>
          </div>
        </div>
      `;
    }

    return this.viewMode === 'list'
      ? this.renderListView()
      : this.renderCardsView();
  }
}
