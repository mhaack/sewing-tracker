import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Project, ProjectStats } from '../types/project';
import { getProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import type { ProjectData } from '../types/database';
import './app-header';
import './project-form';
import './project-list';

@customElement('app-shell')
export class AppShell extends LitElement {
  @state() private projects: Project[] = [];
  @state() private showForm = false;
  @state() private editingProject: Project | null = null;
  @state() private loading = true;
  @state() private error: string | null = null;
  @state() private viewMode: 'cards' | 'list' = 'cards';
  @state() private sortMode: 'name' | 'date-desc' | 'date-asc' = 'date-desc';

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%);
    }

    .main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
    }

    .view-controls {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1.5rem;
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sort-label {
      font-family: var(--font-body);
      font-size: 0.85rem;
      color: var(--charcoal-light);
      font-weight: 500;
    }

    .sort-select {
      font-family: var(--font-body);
      font-size: 0.9rem;
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      border: 1px solid var(--sand);
      border-radius: var(--radius-sm);
      background: white;
      color: var(--charcoal);
      cursor: pointer;
      transition: var(--transition);
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }

    .sort-select:hover {
      border-color: var(--sage);
    }

    .sort-select:focus {
      outline: none;
      border-color: var(--sage);
      box-shadow: 0 0 0 3px rgba(163, 177, 138, 0.1);
    }

    .view-toggle {
      display: flex;
      gap: 0;
      background: white;
      border-radius: var(--radius-sm);
      box-shadow: 0 2px 8px var(--shadow);
      overflow: hidden;
    }

    .view-btn {
      background: white;
      border: none;
      padding: 0.75rem 1rem;
      cursor: pointer;
      color: var(--charcoal-light);
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-body);
      font-size: 0.9rem;
      border-right: 1px solid var(--sand);
    }

    .view-btn:last-child {
      border-right: none;
    }

    .view-btn:hover {
      background: var(--cream);
      color: var(--charcoal);
    }

    .view-btn.active {
      background: var(--sage);
      color: white;
    }

    .view-btn svg {
      width: 20px;
      height: 20px;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
      font-size: 1.2rem;
      color: var(--charcoal-light);
    }

    .error-message {
      background: #fee;
      border: 2px solid #fcc;
      border-radius: var(--radius);
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error-message p {
      margin: 0;
      color: #c33;
      font-weight: 500;
    }

    .error-message button {
      background: #c33;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-family: var(--font-body);
    }

    @media (max-width: 768px) {
      .main {
        padding: 1.5rem 1rem;
      }

      .view-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .sort-controls {
        justify-content: space-between;
      }

      .sort-label {
        font-size: 0.8rem;
      }

      .sort-select {
        font-size: 0.85rem;
        padding: 0.4rem 1.75rem 0.4rem 0.6rem;
      }

      .view-toggle {
        width: 100%;
      }

      .view-btn {
        flex: 1;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    // Load view preference from localStorage
    const savedView = localStorage.getItem('viewMode');
    if (savedView === 'list' || savedView === 'cards') {
      this.viewMode = savedView;
    }
    await this.loadProjects();
  }

  private async loadProjects() {
    try {
      this.loading = true;
      this.error = null;
      this.projects = await getProjects();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Fehler beim Laden der Projekte';
      console.error('Error loading projects:', err);
    } finally {
      this.loading = false;
    }
  }

  private getTotalStats(): ProjectStats {
    return {
      totalProjects: this.projects.length,
      totalSpent: this.projects.reduce((sum, p) => sum + (p.moneySpent || 0), 0),
      totalFabric: this.projects.reduce((sum, p) => sum + (p.fabricUsed || 0), 0),
      totalTime: this.projects.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
    };
  }

  private handleToggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingProject = null;
    }
  }

  private handleToggleView() {
    this.viewMode = this.viewMode === 'cards' ? 'list' : 'cards';
    localStorage.setItem('viewMode', this.viewMode);
  }

  private handleSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.sortMode = select.value as 'name' | 'date-desc' | 'date-asc';
  }

  private async handleSubmitProject(e: CustomEvent) {
    const projectData = e.detail as ProjectData;

    try {
      if (this.editingProject && this.editingProject.id) {
        // Update existing project
        await updateProject(this.editingProject.id, projectData);
      } else {
        // Create new project
        await createProject(projectData);
      }

      // Reload projects from database
      await this.loadProjects();

      this.showForm = false;
      this.editingProject = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Fehler beim Speichern des Projekts';
      console.error('Error saving project:', err);
    }
  }

  private handleCancelForm() {
    this.showForm = false;
    this.editingProject = null;
  }

  private handleEditProject(e: CustomEvent) {
    this.editingProject = e.detail as Project;
    this.showForm = true;

    // Scroll to top smoothly when opening edit form
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private async handleDeleteProject(e: CustomEvent) {
    const projectId = e.detail as string;

    try {
      await deleteProject(projectId);
      // Reload projects from database
      await this.loadProjects();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Fehler beim Löschen des Projekts';
      console.error('Error deleting project:', err);
    }
  }

  render() {
    const stats = this.getTotalStats();

    return html`
      <app-header
        .showForm=${this.showForm}
        .stats=${stats}
        @toggle-form=${this.handleToggleForm}
      ></app-header>

      <main class="main">
        ${this.error ? html`
          <div class="error-message">
            <p>${this.error}</p>
            <button @click=${() => this.error = null}>Schließen</button>
          </div>
        ` : ''}

        ${this.showForm ? html`
          <project-form
            .editingProject=${this.editingProject}
            @submit-project=${this.handleSubmitProject}
            @cancel-form=${this.handleCancelForm}
          ></project-form>
        ` : ''}

        ${this.loading ? html`
          <div class="loading">Projekte werden geladen...</div>
        ` : html`
          <div class="view-controls">
            <div class="view-toggle">
              <button
                class="view-btn ${this.viewMode === 'cards' ? 'active' : ''}"
                @click=${this.handleToggleView}
                title="Kartenansicht"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Karten
              </button>
              <button
                class="view-btn ${this.viewMode === 'list' ? 'active' : ''}"
                @click=${this.handleToggleView}
                title="Listenansicht"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="3" y1="6" x2="21" y2="6" stroke-width="2" stroke-linecap="round"/>
                  <line x1="3" y1="12" x2="21" y2="12" stroke-width="2" stroke-linecap="round"/>
                  <line x1="3" y1="18" x2="21" y2="18" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Liste
              </button>
            </div>

            <div class="sort-controls">
              <label class="sort-label" for="sort-select">Sortieren nach:</label>
              <select 
                id="sort-select"
                class="sort-select"
                .value=${this.sortMode}
                @change=${this.handleSortChange}
              >
                <option value="date-desc">Neueste zuerst</option>
                <option value="date-asc">Älteste zuerst</option>
                <option value="name">Projektname</option>
              </select>
            </div>
          </div>

          <project-list
            .projects=${this.projects}
            .viewMode=${this.viewMode}
            .sortMode=${this.sortMode}
            @edit-project=${this.handleEditProject}
            @delete-project=${this.handleDeleteProject}
          ></project-list>
        `}
      </main>
    `;
  }
}
