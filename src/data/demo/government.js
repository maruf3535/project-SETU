// Demo data for the government review desk (Dhaka Review Team). Everything here is sample data.

// Fixed demo clock, so "time waiting" reads the same whenever the demo is shown
export const DEMO_NOW = '2026-10-18T11:00:00'

// Items waiting longer than this get a Priority pill
export const PRIORITY_HOURS = 48

// Items this team already reviewed today, before the demo starts
export const REVIEWED_TODAY_BASE = 11

// When each guide book in review was submitted (books have no submit date of their own)
export const bookSubmittedAt = {
  'bk-highermath': '2026-10-14T16:30:00',
}

// Who posts challenges, when it is not a company
export const posterTypes = {
  'kurigram-edu': 'public',
  aloshiksha: 'ngo',
}

// Exam sets and question banks teachers sent to the shared bank. decision lives in portalState 'government.content'
export const teacherContent = [
  {
    id: 'tc-physics-set',
    teacher: 'Md. Kamrul Hasan',
    school: { en: 'Motijheel Govt. Boys’ High School, Dhaka', bn: 'মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়, ঢাকা' },
    title: { en: 'Class 10 Physics exam set', bn: '১০ম শ্রেণির পদার্থবিজ্ঞান প্রশ্নসেট' },
    subject: { en: 'Physics · Class 10 · Ch 1–5', bn: 'পদার্থবিজ্ঞান · ১০ম শ্রেণি · অধ্যায় ১–৫' },
    questions: 24,
    mix: { mcq: 20, written: 4 },
    submittedAt: '2026-10-17T15:10:00',
    sample: [
      { en: 'A car speeds up from 10 m/s to 30 m/s in 5 s. What is its acceleration?', bn: 'একটি গাড়ির বেগ ৫ সেকেন্ডে ১০ মি/সে থেকে ৩০ মি/সে হয়। এর ত্বরণ কত?' },
      { en: 'Which of these is a vector quantity? (a) mass (b) work (c) momentum (d) energy', bn: 'কোনটি ভেক্টর রাশি? (ক) ভর (খ) কাজ (গ) ভরবেগ (ঘ) শক্তি' },
      { en: 'Explain why a passenger falls forward when a moving bus stops suddenly. (Creative question)', bn: 'চলন্ত বাস হঠাৎ থামলে যাত্রী সামনের দিকে হেলে পড়েন কেন, ব্যাখ্যা করো। (সৃজনশীল প্রশ্ন)' },
    ],
    checks: [
      { result: 'pass', label: { en: 'Matches national syllabus', bn: 'জাতীয় শিক্ষাক্রমের সাথে মেলে' }, tag: { en: 'AI 94%', bn: 'এআই ৯৪%' } },
      { result: 'pass', label: { en: 'Answer key complete, 24 of 24', bn: 'উত্তরমালা সম্পূর্ণ, ২৪টির মধ্যে ২৪টি' }, tag: { en: 'AI check', bn: 'এআই যাচাই' } },
      { result: 'pass', label: { en: 'No copied content found', bn: 'কপি করা কিছু পাওয়া যায়নি' }, tag: { en: 'AI scan', bn: 'এআই স্ক্যান' } },
    ],
  },
  {
    id: 'tc-ict-written',
    teacher: 'Shirin Akter',
    school: { en: 'Govt. Titumir College, Dhaka', bn: 'সরকারি তিতুমীর কলেজ, ঢাকা' },
    title: { en: 'HSC ICT written questions, Chapter 3', bn: 'এইচএসসি আইসিটি লিখিত প্রশ্ন, অধ্যায় ৩' },
    subject: { en: 'ICT · HSC · Number systems', bn: 'আইসিটি · এইচএসসি · সংখ্যা পদ্ধতি' },
    questions: 12,
    mix: { mcq: 0, written: 12 },
    submittedAt: '2026-10-15T12:40:00',
    sample: [
      { en: 'Convert (157)₈ to binary and hexadecimal. Show each step.', bn: '(১৫৭)₈ কে বাইনারি ও হেক্সাডেসিমেলে রূপান্তর করো। প্রতিটি ধাপ দেখাও।' },
      { en: 'Why do computers use 2’s complement to store negative numbers?', bn: 'ঋণাত্মক সংখ্যা রাখতে কম্পিউটার কেন ২-এর পরিপূরক ব্যবহার করে?' },
    ],
    checks: [
      { result: 'pass', label: { en: 'Matches national syllabus', bn: 'জাতীয় শিক্ষাক্রমের সাথে মেলে' }, tag: { en: 'AI 97%', bn: 'এআই ৯৭%' } },
      { result: 'flag', label: { en: 'Two questions repeat the 2024 Dhaka Board paper word for word', bn: 'দুটি প্রশ্ন ২০২৪ সালের ঢাকা বোর্ডের প্রশ্নের হুবহু' }, tag: { en: 'Flagged', bn: 'চিহ্নিত' } },
      { result: 'pass', label: { en: 'Marking scheme attached', bn: 'নম্বর বণ্টন সংযুক্ত' }, tag: { en: 'AI check', bn: 'এআই যাচাই' } },
    ],
  },
]

// AI checklist results that differ from the default, keyed by item id
export const bookChecks = {
  'bk-highermath': {
    flaggedPage: 88,
    checks: [
      { result: 'pass', label: { en: 'Matches national syllabus', bn: 'জাতীয় শিক্ষাক্রমের সাথে মেলে' }, tag: { en: 'AI 96%', bn: 'এআই ৯৬%' } },
      { result: 'pass', label: { en: 'No copied content found', bn: 'কপি করা কিছু পাওয়া যায়নি' }, tag: { en: 'AI scan', bn: 'এআই স্ক্যান' } },
      { result: 'flag', label: { en: 'Answer key error, p. 88', bn: 'উত্তরমালায় ভুল, পৃ. ৮৮' }, tag: { en: 'Flagged', bn: 'চিহ্নিত' } },
    ],
  },
}

export const challengeFlags = {
  'ch-gov-dropout': {
    safe: {
      en: 'Uses school attendance records. Confirm names are removed before students get the data.',
      bn: 'স্কুলের উপস্থিতির তথ্য ব্যবহার হবে। শিক্ষার্থীদের দেওয়ার আগে নাম মুছে ফেলা হয়েছে কি না নিশ্চিত করুন।',
    },
  },
}

// Pending ID requests. doc picks the drawn preview: card | letter | certificate | licence
export const idRequests = [
  {
    id: 'id-mitu',
    name: 'Mitu Akter',
    initials: 'MA',
    role: 'student',
    detail: { en: 'Class 9 · Science', bn: '৯ম শ্রেণি · বিজ্ঞান' },
    institution: { en: 'Chilmari Govt. Girls’ High School, Kurigram', bn: 'চিলমারী সরকারি বালিকা উচ্চ বিদ্যালয়, কুড়িগ্রাম' },
    division: 'rangpur',
    rural: true,
    doc: 'card',
    docTitle: { en: 'Student ID card', bn: 'শিক্ষার্থী পরিচয়পত্র' },
    docNumber: 'CGGHS-2026-0914',
    submittedAt: '2026-10-18T08:20:00',
    checks: ['name', 'institution', 'photo'],
  },
  {
    id: 'id-rakib',
    name: 'Rakib Hasan',
    initials: 'RH',
    role: 'student',
    detail: { en: 'HSC 1st year · Humanities', bn: 'এইচএসসি ১ম বর্ষ · মানবিক' },
    institution: { en: 'Murari Chand College, Sylhet', bn: 'মুরারিচাঁদ কলেজ, সিলেট' },
    division: 'sylhet',
    doc: 'card',
    docTitle: { en: 'College ID card', bn: 'কলেজ পরিচয়পত্র' },
    docNumber: 'MCC-H-26-1187',
    submittedAt: '2026-10-17T19:05:00',
    checks: ['name', 'institution', 'photoUnclear'],
  },
  {
    id: 'id-farhana',
    name: 'Farhana Islam',
    initials: 'FI',
    role: 'student',
    detail: { en: 'BSS 3rd year · Economics', bn: 'বিএসএস ৩য় বর্ষ · অর্থনীতি' },
    institution: { en: 'University of Barishal', bn: 'বরিশাল বিশ্ববিদ্যালয়' },
    division: 'barishal',
    doc: 'card',
    docTitle: { en: 'University ID card', bn: 'বিশ্ববিদ্যালয় পরিচয়পত্র' },
    docNumber: 'BU-ECO-21-046',
    submittedAt: '2026-10-17T14:30:00',
    checks: ['name', 'institution', 'photo'],
  },
  {
    id: 'id-mim',
    name: 'Mim Akter',
    initials: 'MA',
    role: 'student',
    detail: { en: 'Class 10 · Business studies', bn: '১০ম শ্রেণি · ব্যবসায় শিক্ষা' },
    institution: { en: 'Durgapur Pilot High School, Netrokona', bn: 'দুর্গাপুর পাইলট উচ্চ বিদ্যালয়, নেত্রকোনা' },
    division: 'mymensingh',
    rural: true,
    doc: 'card',
    docTitle: { en: 'Student ID card', bn: 'শিক্ষার্থী পরিচয়পত্র' },
    docNumber: 'DPHS-10-0233',
    submittedAt: '2026-10-16T10:15:00',
    checks: ['name', 'institution', 'photo'],
  },
  {
    id: 'id-shahnaz',
    name: 'Shahnaz Parvin',
    initials: 'SP',
    role: 'teacher',
    detail: { en: 'Assistant teacher · Mathematics', bn: 'সহকারী শিক্ষক · গণিত' },
    institution: { en: 'Bhola Govt. High School, Bhola', bn: 'ভোলা সরকারি উচ্চ বিদ্যালয়, ভোলা' },
    division: 'barishal',
    doc: 'letter',
    docTitle: { en: 'Appointment letter', bn: 'নিয়োগপত্র' },
    docNumber: 'DSHE/Sec-2/2019/412',
    submittedAt: '2026-10-17T11:45:00',
    checks: ['name', 'institution', 'signature'],
  },
  {
    id: 'id-nobodoy',
    name: 'Nobodoy Prokashoni',
    initials: 'NP',
    role: 'publisher',
    detail: { en: 'Contact: Abdul Mannan, Director', bn: 'যোগাযোগ: আবদুল মান্নান, পরিচালক' },
    institution: { en: 'Banglabazar, Dhaka', bn: 'বাংলাবাজার, ঢাকা' },
    division: 'dhaka',
    doc: 'certificate',
    docTitle: { en: 'Publication ID certificate', bn: 'প্রকাশনা আইডি সনদ' },
    docNumber: 'PUB-DHK-2011-0387',
    submittedAt: '2026-10-16T15:20:00',
    checks: ['name', 'registry', 'signature'],
  },
  {
    id: 'id-sonarthread',
    name: 'Sonar Thread Apparels',
    initials: 'ST',
    role: 'industry',
    detail: { en: 'Contact: Nasrin Sultana, HR manager', bn: 'যোগাযোগ: নাসরিন সুলতানা, মানবসম্পদ ব্যবস্থাপক' },
    institution: { en: 'Konabari, Gazipur', bn: 'কোনাবাড়ী, গাজীপুর' },
    division: 'dhaka',
    doc: 'licence',
    docTitle: { en: 'Trade licence', bn: 'ট্রেড লাইসেন্স' },
    docNumber: 'GCC-TL-2026-55102',
    submittedAt: '2026-10-18T09:40:00',
    checks: ['name', 'registry', 'validDate'],
  },
]

// Insights. All aggregated, all sample data except the skills chart (computed from the store).
export const insightTiles = {
  activeStudents: { lakh: 1.2, change: 14 },
  itemsVerified: { value: 8430, change: 9 },
}

// Average score in practice exams for each division's weakest topic (lower = weaker)
export const weakTopics = [
  { division: 'rangpur', topic: { en: 'Algebra', bn: 'বীজগণিত' }, score: 41 },
  { division: 'sylhet', topic: { en: 'Chemistry', bn: 'রসায়ন' }, score: 48 },
  { division: 'barishal', topic: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' }, score: 55 },
  { division: 'mymensingh', topic: { en: 'Geometry', bn: 'জ্যামিতি' }, score: 57 },
  { division: 'rajshahi', topic: { en: 'English grammar', bn: 'ইংরেজি ব্যাকরণ' }, score: 61 },
  { division: 'khulna', topic: { en: 'Biology', bn: 'জীববিজ্ঞান' }, score: 63 },
  { division: 'chattogram', topic: { en: 'ICT', bn: 'আইসিটি' }, score: 66 },
  { division: 'dhaka', topic: { en: 'Statistics', bn: 'পরিসংখ্যান' }, score: 68 },
]

// Share of enrolled students who took at least one practice exam in the last 30 days, in %
export const participation = [
  { division: 'dhaka', urban: 72, rural: 48 },
  { division: 'chattogram', urban: 68, rural: 44 },
  { division: 'khulna', urban: 63, rural: 47 },
  { division: 'rajshahi', urban: 61, rural: 45 },
  { division: 'barishal', urban: 58, rural: 39 },
  { division: 'sylhet', urban: 56, rural: 34 },
  { division: 'mymensingh', urban: 55, rural: 36 },
  { division: 'rangpur', urban: 54, rural: 37 },
]

// Median hours from upload to decision, by week (week starting)
export const turnaround = [
  { week: '2026-08-24', hours: 41 },
  { week: '2026-08-31', hours: 37 },
  { week: '2026-09-07', hours: 34 },
  { week: '2026-09-14', hours: 35 },
  { week: '2026-09-21', hours: 29 },
  { week: '2026-09-28', hours: 26 },
  { week: '2026-10-05', hours: 22 },
  { week: '2026-10-12', hours: 19 },
]
