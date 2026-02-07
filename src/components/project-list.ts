import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Project } from '../types/project';
import './project-card';

@customElement('project-list')
export class ProjectList extends LitElement {
  @property({ type: Array }) projects: Project[] = [];
  @property({ type: String }) viewMode: 'cards' | 'list' = 'cards';
  @property({ type: String }) sortMode: 'name' | 'date-desc' | 'date-asc' = 'date-desc';

  static styles = css`
    .projects-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    @media (min-width: 768px) {
      .projects-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1200px) {
      .projects-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .list-header {
      display: grid;
      grid-template-columns: 3fr 2fr 130px 130px 130px 140px;
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
      padding: 1rem 1.5rem;
      box-shadow: 0 2px 8px var(--shadow);
      display: grid;
      grid-template-columns: 3fr 2fr 130px 130px 130px 140px;
      gap: 1rem;
      align-items: center;
      transition: var(--transition);
      border-left: 4px solid transparent;
    }

    .list-item:hover {
      box-shadow: 0 4px 16px var(--shadow-strong);
      border-left-color: var(--sage);
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

    .list-item-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--charcoal);
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

    .list-item-stat {
      text-align: right;
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 500;
      color: var(--charcoal);
    }

    .list-stat-value {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 500;
      color: var(--charcoal);
      white-space: nowrap;
    }

    .list-stat-label {
      display: none;
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

    .list-status-badge {
      font-size: 0.8rem;
      color: var(--charcoal-light);
    }
    
    .list-meta-separator {
      font-size: 0.8rem;
      color: var(--charcoal-light);
    }

    .list-status-empty {
      color: var(--charcoal-light);
      font-size: 0.85rem;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: var(--charcoal-light);
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      opacity: 0.3;
      stroke-width: 1.5;
    }

    .empty-state h3 {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      color: var(--charcoal);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      font-size: 1rem;
      max-width: 400px;
      margin: 0 auto;
    }

    @media (max-width: 1200px) {
      .list-header {
        grid-template-columns: 2.5fr 1.5fr 90px 90px 90px 120px;
        gap: 0.75rem;
      }

      .list-item {
        grid-template-columns: 2.5fr 1.5fr 90px 90px 90px 120px;
        gap: 0.75rem;
      }
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .list-header {
        grid-template-columns: 2fr 1fr auto;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
      }

      .list-header-col:nth-child(2),
      .list-header-col:nth-child(4),
      .list-header-col:nth-child(5) {
        display: none;
      }

      .list-header-col:nth-child(3) {
        display: block;
        text-align: left;
        font-size: 0;
      }

      .list-header-col:nth-child(3)::before {
        content: '€ / Meter / Zeit';
        font-size: 0.7rem;
      }

      .list-header-col:last-child {
        text-align: center;
      }

      .list-header-col:last-child::after {
        content: 'Aktionen';
      }

      .list-item {
        display: grid;
        grid-template-columns: 2fr 1fr auto;
        grid-template-rows: auto auto auto;
        gap: 0.5rem;
        align-items: start;
        padding: 0.75rem;
      }

      .list-item-name {
        grid-column: 1;
        grid-row: 1 / 4;
        align-self: start;
      }

      .list-item-title {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
      }

      .list-item-meta {
        font-size: 0.75rem;
      }

      .list-item-fabrics {
        display: none;
      }

      .list-item-stat {
        grid-column: 2;
        text-align: left;
        font-size: 0.95rem;
        padding: 0;
        line-height: 1.6;
      }

      .stat-price {
        grid-row: 1;
      }

      .stat-fabric {
        grid-row: 2;
      }

      .stat-time {
        grid-row: 3;
      }

      .list-item-actions {
        grid-column: 3;
        grid-row: 1 / 4;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        justify-content: flex-start;
        align-self: start;
      }

      .list-btn {
        width: 32px;
        height: 32px;
      }
    }
  `;

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
      // Sort by date descending (newest first)
      return sorted.sort((a, b) => {
        const dateA = a.projectDate ? new Date(a.projectDate).getTime() : 0;
        const dateB = b.projectDate ? new Date(b.projectDate).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // Sort by date ascending (oldest first)
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
          <div class="list-header-col align-right">Kosten</div>
          <div class="list-header-col align-right">Stoff</div>
          <div class="list-header-col align-right">Zeit</div>
          <div class="list-header-col"></div>
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

          return html`
            <div class="list-item">
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
                      <span class="list-status-badge">${project.status}</span>
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

              <div class="list-item-stat stat-price">
                ${project.moneySpent.toFixed(2)}€
              </div>

              <div class="list-item-stat stat-fabric">
                ${project.fabricUsed.toFixed(1)}m
              </div>

              <div class="list-item-stat stat-time">
                ${timeDisplay}
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <h3>Noch keine Projekte</h3>
            <p>Beginnen Sie mit der Verfolgung Ihrer Nähprojekte, indem Sie Ihren ersten Eintrag erstellen</p>
          </div>
        </div>
      `;
    }

    return this.viewMode === 'list'
      ? this.renderListView()
      : this.renderCardsView();
  }
}
