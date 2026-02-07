import { css } from 'lit';

/**
 * Shared status badge styles — import into any component that renders status badges.
 * Use with getStatusStyle() from '../utils/status' to set --badge-bg / --badge-color.
 */
export const statusBadgeStyles = css`
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.9rem;
    border-radius: 24px;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.03em;
    background: var(--badge-bg, var(--cream));
    color: var(--badge-color, var(--charcoal-light));
    white-space: nowrap;
    border: 1.5px solid var(--badge-border, transparent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  /* Fabric tag stitch effect */
  .status-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1.5px dashed rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    pointer-events: none;
  }

  .status-badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .status-badge.status-complete {
    animation: celebrateComplete 3s ease-in-out infinite;
  }

  @keyframes celebrateComplete {
    0%, 100% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 0 rgba(107, 154, 107, 0);
    }
    50% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 6px rgba(107, 154, 107, 0.2);
    }
  }
`;
