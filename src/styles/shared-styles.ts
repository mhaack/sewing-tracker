import { css } from 'lit';

/**
 * Shared status badge styles — import into any component that renders status badges.
 * Use with getStatusStyle() from '../utils/status' to set --badge-bg / --badge-color.
 */
export const statusBadgeStyles = css`
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.02em;
    background: var(--badge-bg, var(--cream));
    color: var(--badge-color, var(--charcoal-light));
    white-space: nowrap;
  }

  .status-badge.status-complete {
    animation: gentlePulse 3s ease-in-out infinite;
  }

  @keyframes gentlePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(122, 147, 121, 0); }
    50% { box-shadow: 0 0 0 4px rgba(122, 147, 121, 0.12); }
  }
`;
