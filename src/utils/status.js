export function normalizeStatus(status) {
  if (status === null || status === undefined) return 'Applied'; // افتراضي
  const s = String(status).trim().toLowerCase();

  if (s === 'applied' || s === 'apply' || s === 'applied.') return 'Applied';
  if (s === 'interviewing' || s === 'interview' || s === 'interviewing.') return 'Interviewing';
  if (s === 'offer' || s === 'offers' || s === 'offered' || s === 'offer.') return 'Offer';
  if (s === 'rejected' || s === 'reject' || s === 'rejected.') return 'Rejected';

  return s.charAt(0).toUpperCase() + s.slice(1);
}
