// Demo data for the publisher portal. The signed-in publisher is fixed: Brightpage Publications.
export const MY_PUBLISHER = { id: 'brightpage', name: 'Brightpage Publications', publicationId: 'BD-PUB-2041' }

// Sales per month in ৳, oldest first. The last month is "this month"; live student purchases are added on top of it.
// cash = paid in money, points = value covered by reward-point discounts (1,000 points = 20% off)
export const monthlySales = [
  { month: '2026-05-01', cash: 29400, points: 1800 },
  { month: '2026-06-01', cash: 33100, points: 2200 },
  { month: '2026-07-01', cash: 30800, points: 2100 },
  { month: '2026-08-01', cash: 36500, points: 2900 },
  { month: '2026-09-01', cash: 41200, points: 3300 },
  { month: '2026-10-01', cash: 48600, points: 3900 },
]

// Review trail for the seeded books. kind: submitted | returned | resubmitted | approved
export const reviewHistory = {
  'bk-physics': [
    { kind: 'submitted', at: '2026-01-12' },
    { kind: 'approved', at: '2026-01-19' },
  ],
  'bk-highermath': [{ kind: 'submitted', at: '2026-10-14' }],
  'bk-chemlab': [
    { kind: 'submitted', at: '2026-09-28' },
    { kind: 'returned', at: '2026-10-06' },
  ],
  'bk-algo': [
    { kind: 'submitted', at: '2026-03-02' },
    { kind: 'returned', at: '2026-03-09', note: { en: 'Add the Bangla problem statements for chapters 7–9.', bn: 'অধ্যায় ৭–৯-এর সমস্যাগুলোর বাংলা বিবরণ যোগ করুন।' } },
    { kind: 'resubmitted', at: '2026-03-15' },
    { kind: 'approved', at: '2026-03-21' },
  ],
}

// Class/level choices when adding a book. `level` is the store level students filter by (school | college | admission | university).
export const classOptions = [
  { id: 'class6_8', level: 'school', label: { en: 'Class 6–8', bn: '৬ষ্ঠ–৮ম শ্রেণি' } },
  { id: 'class9_10', level: 'school', label: { en: 'Class 9–10', bn: '৯ম–১০ম শ্রেণি' } },
  { id: 'class11_12', level: 'college', label: { en: 'Class 11–12', bn: 'একাদশ–দ্বাদশ শ্রেণি' } },
  { id: 'admission', level: 'admission', label: { en: 'University admission', bn: 'বিশ্ববিদ্যালয় ভর্তি' } },
  { id: 'university', level: 'university', label: { en: 'University', bn: 'বিশ্ববিদ্যালয়' } },
]

export const subjects = {
  physics: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
  chemistry: { en: 'Chemistry', bn: 'রসায়ন' },
  math: { en: 'Higher Math', bn: 'উচ্চতর গণিত' },
  biology: { en: 'Biology', bn: 'জীববিজ্ঞান' },
  bangla: { en: 'Bangla', bn: 'বাংলা' },
  english: { en: 'English', bn: 'ইংরেজি' },
  ict: { en: 'ICT', bn: 'আইসিটি' },
  algorithms: { en: 'Algorithms', bn: 'অ্যালগরিদম' },
  all: { en: 'All subjects', bn: 'সব বিষয়' },
}

// Verified students on the platform per class/level, nationally, and each division's share.
// Promotion reach is capped by the size of the chosen audience.
export const audienceByClass = {
  class6_8: 412000,
  class9_10: 538000,
  class11_12: 296000,
  admission: 148000,
  university: 184000,
}

export const divisionShare = {
  dhaka: 0.27,
  chattogram: 0.19,
  rajshahi: 0.12,
  khulna: 0.11,
  rangpur: 0.1,
  mymensingh: 0.08,
  sylhet: 0.07,
  barishal: 0.06,
}

// Cost to place a book in front of one student in the store and topic pages
export const COST_PER_STUDENT = 2

const DAY = 24 * 60 * 60 * 1000

// Promotion already running when the demo opens (started six days ago, so it always shows progress)
export const seedPromotions = [
  {
    id: 'promo-physics', bookId: 'bk-physics', target: { cls: 'class9_10', division: 'all' },
    days: 14, budget: 6000, reach: 3000, startedAt: new Date(Date.now() - 6 * DAY).toISOString(),
  },
]

// Where publisher material reaches students (from the proposal). `mine` marks Brightpage's channel.
export const channels = [
  {
    id: 'textbooks',
    name: { en: 'Official textbooks', bn: 'সরকারি পাঠ্যবই' },
    audience: { en: 'All students', bn: 'সব শিক্ষার্থী' },
    pricing: { en: 'Free / open', bn: 'বিনামূল্যে / উন্মুক্ত' },
    review: { en: 'Mandatory pre-approval', bn: 'বাধ্যতামূলক পূর্বানুমোদন' },
  },
  {
    id: 'guidebooks', mine: true,
    name: { en: 'Publisher guidebooks', bn: 'প্রকাশকের গাইড বই' },
    audience: { en: 'Subscribed students', bn: 'সাবস্ক্রাইব করা শিক্ষার্থী' },
    pricing: { en: 'Monthly / annual plan', bn: 'মাসিক / বার্ষিক প্ল্যান' },
    review: { en: 'Quality screening', bn: 'মান যাচাই' },
  },
  {
    id: 'testbanks',
    name: { en: 'Teacher test banks', bn: 'শিক্ষকের প্রশ্নব্যাংক' },
    audience: { en: 'Verified teachers', bn: 'যাচাইকৃত শিক্ষক' },
    pricing: { en: 'Institutional subscription', bn: 'প্রাতিষ্ঠানিক সাবস্ক্রিপশন' },
    review: { en: 'Curriculum compliance', bn: 'শিক্ষাক্রম অনুসরণ যাচাই' },
  },
]
