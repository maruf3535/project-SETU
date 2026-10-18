// Peer notes. status: reviewed | in_review. `authorId` links a note to a demo student's "Mine" tab.
export const notes = [
  {
    id: 'nt-trig', level: 'school', authorId: null, author: 'Sadia M.', initials: 'SM',
    title: { en: 'Trigonometry formulas, one page', bn: 'ত্রিকোণমিতির সূত্র, এক পৃষ্ঠায়' },
    subject: { en: 'Higher Math · Class 10', bn: 'উচ্চতর গণিত · ১০ম শ্রেণি' },
    pages: 1, rating: 4.7, ratings: 98, status: 'reviewed', createdAt: '2026-10-11',
  },
  {
    id: 'nt-newton', level: 'school', authorId: null, author: 'Arif H.', initials: 'AH',
    title: { en: 'Newton’s three laws, mind map with solved sums', bn: 'নিউটনের তিন সূত্র, সমাধানসহ মাইন্ড ম্যাপ' },
    subject: { en: 'Physics · Class 9–10', bn: 'পদার্থবিজ্ঞান · ৯ম–১০ম শ্রেণি' },
    pages: 3, rating: 4.9, ratings: 164, status: 'reviewed', createdAt: '2026-10-02',
  },
  {
    id: 'nt-rahim', level: 'school', authorId: 'st-rahim', author: 'Rahim Uddin', initials: 'RU',
    title: { en: 'All formulas of Physics Ch 2–4', bn: 'পদার্থবিজ্ঞান অধ্যায় ২–৪-এর সব সূত্র' },
    subject: { en: 'Physics · Class 9–10', bn: 'পদার্থবিজ্ঞান · ৯ম–১০ম শ্রেণি' },
    pages: 2, rating: 0, ratings: 0, status: 'in_review', createdAt: '2026-10-17',
  },
  {
    id: 'nt-organic', level: 'college', authorId: null, author: 'Tanvir A.', initials: 'TA',
    title: { en: 'Organic reactions cheat-sheet', bn: 'জৈব বিক্রিয়ার চিট-শিট' },
    subject: { en: 'Chemistry · Class 12', bn: 'রসায়ন · দ্বাদশ শ্রেণি' },
    pages: 6, rating: 4.9, ratings: 212, status: 'reviewed', createdAt: '2026-09-28',
  },
  {
    id: 'nt-mole', level: 'college', authorId: 'st-tasnim', author: 'Tasnim Ferdous', initials: 'TF',
    title: { en: 'Mole concept shortcuts for admission tests', bn: 'ভর্তি পরীক্ষার জন্য মোল ধারণার শর্টকাট' },
    subject: { en: 'Chemistry · HSC', bn: 'রসায়ন · এইচএসসি' },
    pages: 4, rating: 4.6, ratings: 41, status: 'reviewed', createdAt: '2026-10-05',
  },
  {
    id: 'nt-vectors', level: 'college', authorId: null, author: 'Nafisa K.', initials: 'NK',
    title: { en: 'Vectors: every board question type', bn: 'ভেক্টর: বোর্ডের সব ধরনের প্রশ্ন' },
    subject: { en: 'Physics 1st paper · HSC', bn: 'পদার্থবিজ্ঞান ১ম পত্র · এইচএসসি' },
    pages: 8, rating: 4.4, ratings: 57, status: 'reviewed', createdAt: '2026-10-09',
  },
  {
    id: 'nt-graphs', level: 'university', authorId: 'st-nusrat', author: 'Nusrat Akter', initials: 'NA',
    title: { en: 'Graph algorithms, handwritten lecture notes', bn: 'গ্রাফ অ্যালগরিদম, হাতে লেখা লেকচার নোট' },
    subject: { en: 'CSE-2201 · Algorithms', bn: 'সিএসই-২২০১ · অ্যালগরিদম' },
    pages: 14, rating: 4.8, ratings: 77, status: 'reviewed', createdAt: '2026-10-03',
  },
  {
    id: 'nt-dbms', level: 'university', authorId: null, author: 'Tanjim R.', initials: 'TR',
    title: { en: 'Database normalisation cheat-sheet', bn: 'ডেটাবেস নরমালাইজেশন চিট-শিট' },
    subject: { en: 'CSE-2203 · Databases', bn: 'সিএসই-২২০৩ · ডেটাবেস' },
    pages: 2, rating: 4.5, ratings: 30, status: 'reviewed', createdAt: '2026-10-13',
  },
]

// Reward tiers from the proposal (Figure 6), by average rating of a contributor's notes
export const rewardTiers = [
  { min: 4.8, key: 'master' },
  { min: 4.0, key: 'senior' },
  { min: 3.5, key: 'active' },
]

export const FREE_BOOK_POINTS = 2000
