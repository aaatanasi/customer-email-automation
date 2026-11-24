// Offline adaptation of a spreadsheet campaign workflow. No mail transport.
const DAY = 24 * 60 * 60 * 1000;
export const normalizeEmail = value => String(value ?? '').trim().toLowerCase();
const addresses = value => (String(value ?? '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []).map(normalizeEmail);
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pending = row => String(row.status ?? '').trim().toUpperCase() === 'PENDING';

// Explicit reconciliation: fictional recipient history, not a send-time mailbox query.
export function reconcile(rows, messages, {sender, now, limit = 1500}) {
  const owner = normalizeEmail(sender);
  if (!owner || !Number.isFinite(now)) throw new Error('A sender and reference time are required.');
  const recent = new Map();
  for (const [i, message] of messages.entries()) {
    if (i >= limit) throw new Error('History scan limit reached. No statuses were changed.');
    if (!Number.isFinite(message.at) || message.at < now - DAY || message.at > now) continue;
    if (addresses(message.from)[0] !== owner) continue;
    for (const email of addresses(message.to)) {
      recent.set(email, Math.max(message.at, recent.get(email) ?? -Infinity));
    }
  }
  return rows.map(row => {
    const email = normalizeEmail(row.email);
    return pending(row) && recent.has(email)
      ? {...row, status:'SENT', matchedAt:recent.get(email)}
      : {...row};
  });
}

// Build the client-side batch preview from current rows alone. Nothing is sent.
export function previewBatch(rows, {batchSize = 254, quota = 254} = {}) {
  const cap = Math.floor(Math.min(batchSize, quota));
  if (!Number.isFinite(cap) || cap <= 0) return [];
  const blocked = new Set(rows.filter(row => !pending(row)).map(row => normalizeEmail(row.email)));
  const seen = new Set();
  const planned = [];
  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (!pending(row) || !validEmail.test(email) || blocked.has(email) || seen.has(email)) continue;
    seen.add(email);
    planned.push(email);
    if (planned.length === cap) break;
  }
  return planned;
}
