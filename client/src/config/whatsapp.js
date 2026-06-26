/**
 * Central WhatsApp funnel utility.
 * Every CTA on the site routes here so messages arrive pre-filled with a clean,
 * consistent, professional format — and every click is tracked for conversion insight.
 *
 * WhatsApp text formatting: *bold*, _italic_. Newlines are preserved via encodeURIComponent.
 */

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919080809088';

const DIVIDER = '━━━━━━━━━━━━━━━';

/**
 * Compose a branded WhatsApp message with a consistent house style:
 *   ⚡ *ZEUS IOT — <TITLE>*
 *   ━━━━━━━━━━━━━━━
 *   <intro>
 *
 *   <field lines>
 *
 *   <closing>
 *
 * @param {object} opts
 * @param {string} opts.title    - heading shown after the brand
 * @param {string} [opts.intro]  - opening sentence
 * @param {Array<[string,string]>} [opts.fields] - [emoji+label, value] rows
 * @param {string} [opts.closing]- closing call to action
 */
function compose({ title, intro, fields = [], closing }) {
  const lines = [`⚡ *ZEUS IOT — ${title}*`, DIVIDER];
  if (intro) lines.push(intro, '');
  for (const [label, value] of fields) {
    if (value) lines.push(`${label} *${value}*`);
  }
  if (fields.some(([, v]) => v)) lines.push('');
  if (closing) lines.push(closing);
  return lines.join('\n');
}

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(message) {
  const text = encodeURIComponent(message ?? messages.generic);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/**
 * Lightweight click tracking. Stores counts in localStorage (zeus_wa_stats) and
 * pushes a dataLayer event if analytics is wired up later.
 */
export function trackWhatsApp(source = 'unknown') {
  try {
    const key = 'zeus_wa_stats';
    const stats = JSON.parse(localStorage.getItem(key) || '{}');
    stats[source] = (stats[source] || 0) + 1;
    stats._total = (stats._total || 0) + 1;
    stats._last = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(stats));
  } catch { /* storage blocked — ignore */ }

  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'whatsapp_click', source });
  }
}

/** Open WhatsApp with a message + fire tracking in one call. */
export function openWhatsApp(message, source = 'unknown') {
  trackWhatsApp(source);
  window.open(waLink(message), '_blank', 'noopener,noreferrer');
}

/* ── Pre-built message templates (consistent house style) ────── */

export const messages = {
  generic: compose({
    title: 'NEW ENQUIRY',
    intro: '👋 Hi Zeus IoT! I came across your site and I have a project in mind.',
    closing: '💬 Could you tell me how we get started? Thanks!',
  }),

  hero: compose({
    title: 'NEW ENQUIRY',
    intro: '👋 Hi Zeus IoT! I love what you build and I want a custom project of my own.',
    closing: '💬 Where do we begin? Looking forward to chatting!',
  }),

  project: (title, cat) =>
    compose({
      title: 'PROJECT INTEREST',
      intro: `👋 Hi Zeus IoT! I saw a project on your site and I'd like something similar.`,
      fields: [
        ['🛠️ Inspired by:', title],
        ['🏷️ Category:', cat || ''],
      ],
      closing: '💬 Can we discuss scope, timeline and a rough quote?',
    }),

  brief: ({ type, focus, deadline, tier }) =>
    compose({
      title: 'PROJECT BRIEF',
      intro: "👋 Hi Zeus IoT! Here's a quick brief of what I'm looking for:",
      fields: [
        ['🔧 Type:', type],
        ['🎯 Focus:', focus],
        ['📅 Deadline:', deadline],
        ['⭐ Tier:', tier],
      ],
      closing: '💬 Please share the next steps and a rough quote. Thanks!',
    }),

  quickType: (type) =>
    compose({
      title: 'QUICK START',
      intro: '👋 Hi Zeus IoT! I want to get a project moving.',
      fields: [['🔧 I want to build:', type]],
      closing: '💬 Can you help me get started?',
    }),

  report: ({ format, scope, deadline, tier }) =>
    compose({
      title: 'ACADEMIC REPORT',
      intro: '👋 Hi Zeus IoT! I need help with an academic report / paper.',
      fields: [
        ['📐 Format:', format],
        ['📝 Scope:', scope],
        ['📅 Deadline:', deadline],
        ['⭐ Quality tier:', tier],
      ],
      closing: '💬 Looking forward to your guidance!',
    }),

  exit: compose({
    title: 'NEW ENQUIRY',
    intro: "👋 Hi Zeus IoT! Before I left your site I realised I should just ask — I've got a project in mind.",
    closing: '💬 Can we chat about it?',
  }),
};
