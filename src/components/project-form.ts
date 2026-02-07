import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Project } from '../types/project';

@customElement('project-form')
export class ProjectForm extends LitElement {
  @property({ type: Object }) editingProject: Project | null = null;

  @state() private formData = {
    name: '',
    instagramLink: '',
    fabrics: [] as string[],
    moneySpent: 0,
    fabricUsed: 0,
    timeSpent: 0,
    comments: '',
    projectDate: '',
    status: '',
    patternBrand: '',
    purchasedFrom: ''
  };

  @state() private timeHours = 0;
  @state() private timeMinutes = 0;

  @state() private fabricInput = '';

  static styles = css`
    .form-container {
      margin-bottom: 2.5rem;
      animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .project-form {
      background: white;
      padding: 2rem;
      border-radius: var(--radius);
      box-shadow: 0 4px 20px var(--shadow), 0 0 0 1px var(--sand);
      max-width: 900px;
      margin: 0 auto;
      overflow: hidden;
    }

    .form-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      color: var(--charcoal);
      margin-bottom: 1.5rem;
      letter-spacing: 0.01em;
    }

    .form-group {
      margin-bottom: 1.25rem;
      min-width: 0;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .form-grid-2 > .form-group {
      min-width: 0;
    }

    .form-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .form-grid-3 > .form-group {
      min-width: 0;
    }

    .time-input-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 100%;
      max-width: 100%;
    }

    .time-separator {
      font-weight: 500;
      color: var(--charcoal-light);
      flex-shrink: 0;
    }

    .form-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--charcoal);
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      padding: 0.85rem 1rem;
      border: 2px solid var(--sand);
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 0.95rem;
      background: var(--cream);
      color: var(--charcoal);
      transition: var(--transition);
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--sage);
      background: white;
      box-shadow: 0 0 0 3px rgba(157, 177, 157, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    /* Override input width for time inputs - must come after general input rules */
    .time-input-group input {
      width: 65px !important;
      min-width: 65px !important;
      max-width: 65px !important;
      flex-shrink: 0;
      padding: 0.85rem 0.5rem !important;
      text-align: center !important;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
    }

    .fabric-input-group {
      display: flex;
      gap: 0.75rem;
    }

    .fabric-input-group input {
      flex: 1;
    }

    .btn-add {
      background: var(--sage);
      color: white;
      border: none;
      padding: 0.85rem 1.5rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      white-space: nowrap;
    }

    .btn-add:hover {
      background: var(--sage-dark);
    }

    .fabric-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .fabric-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--cream-dark);
      color: var(--charcoal);
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      border: 1px solid var(--sand);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .remove-tag {
      background: none;
      border: none;
      color: var(--terracotta);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      line-height: 1;
    }

    .remove-tag:hover {
      color: var(--rose);
      transform: scale(1.2);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--sand);
    }

    .btn-submit {
      flex: 1;
      background: var(--sage);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      letter-spacing: 0.02em;
    }

    .btn-submit:hover {
      background: var(--sage-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(157, 177, 157, 0.3);
    }

    .btn-cancel {
      background: transparent;
      color: var(--charcoal-light);
      border: 2px solid var(--sand);
      padding: 1rem 2rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-cancel:hover {
      border-color: var(--charcoal-light);
      color: var(--charcoal);
    }

    @media (max-width: 768px) {
      .project-form {
        padding: 1.5rem;
      }

      .form-row,
      .form-grid-2,
      .form-grid-3 {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .fabric-input-group {
        flex-direction: column;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadEditingProject();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('editingProject')) {
      this.loadEditingProject();
    }
  }

  private loadEditingProject() {
    if (this.editingProject) {
      // Convert timeSpent (decimal hours) to hours and minutes
      const totalMinutes = Math.round(this.editingProject.timeSpent * 60);
      this.timeHours = Math.floor(totalMinutes / 60);
      this.timeMinutes = totalMinutes % 60;

      this.formData = {
        name: this.editingProject.name,
        instagramLink: this.editingProject.instagramLink || '',
        fabrics: [...this.editingProject.fabrics],
        moneySpent: this.editingProject.moneySpent,
        fabricUsed: this.editingProject.fabricUsed,
        timeSpent: this.editingProject.timeSpent,
        comments: this.editingProject.comments || '',
        projectDate: this.editingProject.projectDate || '',
        status: this.editingProject.status || '',
        patternBrand: this.editingProject.patternBrand || '',
        purchasedFrom: this.editingProject.purchasedFrom || '',
      };
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    // Convert hours and minutes to decimal hours for storage
    const timeSpent = this.timeHours + (this.timeMinutes / 60);

    // Only include id when editing, Supabase will generate UUID for new projects
    const projectData = this.editingProject
      ? { ...this.formData, timeSpent, id: this.editingProject.id }
      : { ...this.formData, timeSpent };

    this.dispatchEvent(new CustomEvent('submit-project', {
      detail: projectData,
      bubbles: true,
      composed: true,
    }));

    this.resetForm();
  }

  private handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel-form', {
      bubbles: true,
      composed: true,
    }));
    this.resetForm();
  }

  private resetForm() {
    this.formData = {
      name: '',
      instagramLink: '',
      fabrics: [],
      moneySpent: 0,
      fabricUsed: 0,
      timeSpent: 0,
      comments: '',
      projectDate: '',
      status: '',
      patternBrand: '',
      purchasedFrom: ''
    };
    this.fabricInput = '';
    this.timeHours = 0;
    this.timeMinutes = 0;
  }

  private addFabric() {
    if (this.fabricInput.trim()) {
      this.formData = {
        ...this.formData,
        fabrics: [...this.formData.fabrics, this.fabricInput.trim()]
      };
      this.fabricInput = '';
    }
  }

  private removeFabric(index: number) {
    this.formData = {
      ...this.formData,
      fabrics: this.formData.fabrics.filter((_, i) => i !== index)
    };
  }

  private handleFabricKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addFabric();
    }
  }

  render() {
    return html`
      <div class="form-container">
        <form @submit=${this.handleSubmit} class="project-form">
          <h2 class="form-title">
            ${this.editingProject ? 'Projekt bearbeiten' : 'Neues Projekt'}
          </h2>

          <div class="form-group">
            <label>Projektname *</label>
            <input
              type="text"
              .value=${this.formData.name}
              @input=${(e: Event) => this.formData = {...this.formData, name: (e.target as HTMLInputElement).value}}
              required
              placeholder="z.B. Blumen-Sommerkleid"
            />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label>Status *</label>
              <select
                .value=${this.formData.status}
                @change=${(e: Event) => this.formData = {...this.formData, status: (e.target as HTMLSelectElement).value}}
                required
              >
                <option value="">-- Bitte wählen --</option>
                <option value="Idee">Idee</option>
                <option value="In Bearbeitung">In Bearbeitung</option>
                <option value="Geplant für Frühling">Geplant für Frühling</option>
                <option value="Geplant für Sommer">Geplant für Sommer</option>
                <option value="Geplant für Herbst">Geplant für Herbst</option>
                <option value="Geplant für Winter">Geplant für Winter</option>
                <option value="Fertig">Fertig</option>
              </select>
            </div>

            <div class="form-group">
              <label>Projektdatum *</label>
              <input
                type="date"
                .value=${this.formData.projectDate}
                @input=${(e: Event) => this.formData = {...this.formData, projectDate: (e.target as HTMLInputElement).value}}
                required
              />
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label>Instagram Link</label>
              <input
                type="url"
                .value=${this.formData.instagramLink}
                @input=${(e: Event) => this.formData = {...this.formData, instagramLink: (e.target as HTMLInputElement).value}}
                placeholder="https://instagram.com/p/..."
              />
            </div>

            <div class="form-group">
              <label>Schnitt/Label</label>
              <input
                type="text"
                .value=${this.formData.patternBrand}
                @input=${(e: Event) => this.formData = {...this.formData, patternBrand: (e.target as HTMLInputElement).value}}
                placeholder="z.B. Burda, Vogue..."
              />
            </div>

            <div class="form-group">
              <label>Gekauft bei</label>
              <input
                type="text"
                .value=${this.formData.purchasedFrom}
                @input=${(e: Event) => this.formData = {...this.formData, purchasedFrom: (e.target as HTMLInputElement).value}}
                placeholder="z.B. Stoffladen..."
              />
            </div>
          </div>

          <div class="form-group">
            <label>Verwendete Stoffe</label>
            <div class="fabric-input-group">
              <input
                type="text"
                .value=${this.fabricInput}
                @input=${(e: Event) => this.fabricInput = (e.target as HTMLInputElement).value}
                @keypress=${this.handleFabricKeyPress}
                placeholder="z.B. Baumwolle mit Blumenmuster"
              />
              <button type="button" @click=${this.addFabric} class="btn-add">
                Hinzufügen
              </button>
            </div>
            ${this.formData.fabrics.length > 0 ? html`
              <div class="fabric-tags">
                ${this.formData.fabrics.map((fabric, index) => html`
                  <span class="fabric-tag">
                    ${fabric}
                    <button
                      type="button"
                      @click=${() => this.removeFabric(index)}
                      class="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                `)}
              </div>
            ` : ''}
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ausgaben (€)</label>
              <input
                type="number"
                step="0.01"
                .value=${this.formData.moneySpent.toString()}
                @input=${(e: Event) => this.formData = {...this.formData, moneySpent: parseFloat((e.target as HTMLInputElement).value) || 0}}
                placeholder="0,00"
              />
            </div>

            <div class="form-group">
              <label>Stoff (Meter)</label>
              <input
                type="number"
                step="0.1"
                .value=${this.formData.fabricUsed.toString()}
                @input=${(e: Event) => this.formData = {...this.formData, fabricUsed: parseFloat((e.target as HTMLInputElement).value) || 0}}
                placeholder="0,0"
              />
            </div>

            <div class="form-group">
              <label>Zeit (h:min)</label>
              <div class="time-input-group">
                <input
                  type="number"
                  min="0"
                  .value=${this.timeHours.toString()}
                  @input=${(e: Event) => this.timeHours = parseInt((e.target as HTMLInputElement).value) || 0}
                  placeholder="0"
                />
                <span class="time-separator">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  .value=${this.timeMinutes.toString()}
                  @input=${(e: Event) => this.timeMinutes = parseInt((e.target as HTMLInputElement).value) || 0}
                  placeholder="00"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Kommentare</label>
            <textarea
              .value=${this.formData.comments}
              @input=${(e: Event) => this.formData = {...this.formData, comments: (e.target as HTMLTextAreaElement).value}}
              placeholder="Notizen zum Projekt, Herausforderungen, was du gelernt hast..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">
              ${this.editingProject ? 'Projekt aktualisieren' : 'Projekt speichern'}
            </button>
            <button
              type="button"
              @click=${this.handleCancel}
              class="btn-cancel"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
