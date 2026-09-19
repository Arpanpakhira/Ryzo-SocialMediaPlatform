/**
 * Formats a timestamp into Instagram-style relative time
 * e.g., "Just now", "5m ago", "1hr ago", "4hrs ago", "2 days ago"
 */
export const formatStoryTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const now = Date.now();
  const past = new Date(dateString).getTime();
  if (isNaN(past)) return 'Just now';

  const diffMs = Math.max(0, now - past);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours === 1 ? '1hr ago' : `${diffHours}hrs ago`}`;
  } else {
    return `${diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}`;
  }
};
