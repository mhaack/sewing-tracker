/**
 * Shared status utilities for consistent status styling across components.
 */

/**
 * Returns CSS custom properties for a status badge based on the project status.
 */
export function getStatusStyle(status: string | undefined): string {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'fertig')
    return '--badge-bg: var(--status-fertig-bg); --badge-color: var(--status-fertig-text)';
  if (s === 'in bearbeitung')
    return '--badge-bg: var(--status-in-bearbeitung-bg); --badge-color: var(--status-in-bearbeitung-text)';
  if (s.startsWith('geplant'))
    return '--badge-bg: var(--status-geplant-bg); --badge-color: var(--status-geplant-text)';
  if (s === 'idee')
    return '--badge-bg: var(--status-idee-bg); --badge-color: var(--status-idee-text)';
  return '--badge-bg: var(--cream); --badge-color: var(--charcoal-light)';
}

/**
 * Returns the accent color for a status (used for card stripes, borders, etc.).
 */
export function getStatusAccentColor(status: string | undefined): string {
  if (!status) return 'var(--sand)';
  const s = status.toLowerCase();
  if (s === 'fertig') return 'var(--status-fertig)';
  if (s === 'in bearbeitung') return 'var(--status-in-bearbeitung)';
  if (s.startsWith('geplant')) return 'var(--status-geplant)';
  if (s === 'idee') return 'var(--status-idee)';
  return 'var(--sand)';
}
