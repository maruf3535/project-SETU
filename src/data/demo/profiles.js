import { studentLevels } from './studentLevels'

// Profile details per signed-in identity. `fields` use the same ids as the sign-up form (src/data/onboarding.js).
const reviewTeam = { en: 'Dhaka Division Review Team', bn: 'ঢাকা বিভাগ পর্যালোচনা টিম' }

export const profiles = {
  'st-rahim': {
    role: 'student',
    fields: { name: 'Rahim Uddin', level: 'school', institution: 'Kurigram Govt. High School' },
    email: 'rahim.uddin@setu.demo', phone: '+880 1734-561290', division: 'rangpur', district: 'Kurigram',
    bio: { en: 'Class 10 science student. I design posters for school events and want to study engineering.', bn: '১০ম শ্রেণির বিজ্ঞানের শিক্ষার্থী। স্কুলের অনুষ্ঠানের পোস্টার ডিজাইন করি, প্রকৌশল পড়তে চাই।' },
    verifiedBy: { en: 'Rangpur Division Review Team', bn: 'রংপুর বিভাগ পর্যালোচনা টিম' }, verifiedAt: '2026-08-21',
  },
  'st-tasnim': {
    role: 'student',
    fields: { name: 'Tasnim Ferdous', level: 'college', institution: 'Mymensingh Govt. College' },
    email: 'tasnim.ferdous@setu.demo', phone: '+880 1815-334402', division: 'mymensingh', district: 'Mymensingh',
    bio: { en: 'HSC science candidate preparing for engineering admission. ICT olympiad divisional winner.', bn: 'প্রকৌশল ভর্তির প্রস্তুতি নেওয়া এইচএসসি বিজ্ঞানের শিক্ষার্থী। আইসিটি অলিম্পিয়াডের বিভাগীয় বিজয়ী।' },
    verifiedBy: { en: 'Mymensingh Division Review Team', bn: 'ময়মনসিংহ বিভাগ পর্যালোচনা টিম' }, verifiedAt: '2026-07-30',
  },
  'st-nusrat': {
    role: 'student',
    fields: { name: 'Nusrat Akter', level: 'university', institution: 'University of Dhaka' },
    email: 'nusrat.akter@setu.demo', phone: '+880 1712-345678', division: 'dhaka', district: 'Dhaka',
    bio: { en: 'Second-year CSE student working on computer vision for agriculture.', bn: 'কৃষির জন্য কম্পিউটার ভিশন নিয়ে কাজ করা সিএসই ২য় বর্ষের শিক্ষার্থী।' },
    verifiedBy: reviewTeam, verifiedAt: '2026-09-02',
  },
  'teacher-kamrul': {
    role: 'teacher',
    fields: { name: 'Md. Kamrul Hasan', level: 'highSchool', institution: 'Mymensingh Zilla School', subject: 'Physics' },
    email: 'kamrul.hasan@setu.demo', phone: '+880 1711-902215', division: 'mymensingh', district: 'Mymensingh',
    bio: { en: 'Senior Physics teacher with 18 years in the classroom. Teaches 200+ students across Class 9–10.', bn: '১৮ বছরের অভিজ্ঞ সিনিয়র পদার্থবিজ্ঞান শিক্ষক। ৯ম–১০ম শ্রেণির ২০০+ শিক্ষার্থী পড়ান।' },
    verifiedBy: { en: 'Mymensingh Division Review Team', bn: 'ময়মনসিংহ বিভাগ পর্যালোচনা টিম' }, verifiedAt: '2026-06-14',
  },
  'teacher-mahbub': {
    role: 'teacher',
    fields: { name: 'Dr. Mahbubur Rahman', level: 'universityTeacher', institution: 'BUET, Dept. of CSE', subject: 'Computer vision' },
    email: 'mahbubur.rahman@setu.demo', phone: '+880 1819-440071', division: 'dhaka', district: 'Dhaka',
    bio: { en: 'Professor, Robotics & Vision Lab. Mentors student teams on agriculture and health projects.', bn: 'অধ্যাপক, রোবটিক্স ও ভিশন ল্যাব। কৃষি ও স্বাস্থ্য প্রজেক্টে শিক্ষার্থী টিমকে মেন্টর করেন।' },
    verifiedBy: reviewTeam, verifiedAt: '2026-05-20',
  },
  brightpage: {
    role: 'publisher',
    fields: { org: 'Brightpage Publications', pubId: 'BD-PUB-2041', contact: 'Shahidul Islam' },
    email: 'brightpage@setu.demo', phone: '+880 1819-552041', division: 'dhaka', district: 'Dhaka (Banglabazar)',
    bio: { en: 'Guide books for Class 6–12 since 2004, now with verified digital soft copies.', bn: '২০০৪ সাল থেকে ৬ষ্ঠ–দ্বাদশ শ্রেণির গাইড বই, এখন যাচাইকৃত ডিজিটাল সফট কপিসহ।' },
    verifiedBy: reviewTeam, verifiedAt: '2026-04-08',
  },
  agrosense: {
    role: 'industry',
    fields: { org: 'AgroSense Ltd.', license: 'TRAD/DNCC/041218/2024', contact: 'Tanvir Ahmed' },
    email: 'tanvir@agrosense.setu.demo', phone: '+880 1911-208840', division: 'dhaka', district: 'Dhaka',
    bio: { en: 'Agri-tech startup helping farmers detect crop disease and test soil from their phones.', bn: 'কৃষকদের ফোন দিয়ে ফসলের রোগ শনাক্ত ও মাটি পরীক্ষায় সাহায্য করা অ্যাগ্রি-টেক স্টার্টআপ।' },
    verifiedBy: reviewTeam, verifiedAt: '2026-08-02',
  },
  'gov-dhaka': {
    role: 'government',
    fields: { name: 'Farhana Yasmin', office: 'Dhaka Division Review Team', employeeId: 'GOV-DHK-1187' },
    email: 'review.dhaka@setu.demo', phone: '+880 1552-118700', division: 'dhaka', district: 'Dhaka',
    bio: { en: 'Lead reviewer. Checks content, IDs and challenges before they go live.', bn: 'প্রধান পর্যালোচক। প্রকাশের আগে কনটেন্ট, আইডি ও চ্যালেঞ্জ যাচাই করেন।' },
    verifiedBy: { en: 'Ministry of Education', bn: 'শিক্ষা মন্ত্রণালয়' }, verifiedAt: '2026-03-01',
  },
}

// Which profile belongs to the signed-in user of a portal right now
export function profileIdFor(role, demo) {
  if (role === 'student') return studentLevels[demo.studentLevel].studentId
  if (role === 'teacher') return demo.portalState?.['teacher.level'] === 'university' ? 'teacher-mahbub' : 'teacher-kamrul'
  return { publisher: 'brightpage', industry: 'agrosense', government: 'gov-dhaka' }[role]
}

// "Md. Kamrul Hasan" → "KH": skip honorifics, take the first letters of the first two remaining words
export function initialsOf(name) {
  const words = name.split(/\s+/).filter((w) => w && !/^(md|dr|mr|mrs|ms)\.?$/i.test(w))
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'
}
