// Book reviewers: publishers send soft review copies to qualified teachers and students, who read and review them.
// Reviews show publicly on the book and feed the publisher ranking. Government audits reviewers for honesty.
// Text that differs by language is { en, bn }.

// Who can review. Teachers qualify for the subjects they teach (government-verified ID).
// Students qualify by a practice-exam average of at least QUALIFY_SCORE in a subject, or by top-rated notes.
// `pastReviews` counts reviews written before this demo; it only feeds the reviewer level.
export const reviewerPool = [
  {
    id: 'teacher-kamrul', role: 'teacher', name: 'Md. Kamrul Hasan', initials: 'KH', division: 'mymensingh',
    org: { en: 'Senior teacher, Physics · Mymensingh Zilla School', bn: 'সিনিয়র শিক্ষক, পদার্থবিজ্ঞান · ময়মনসিংহ জিলা স্কুল' },
    teaches: ['physics'], pastReviews: 3,
  },
  {
    id: 'teacher-mahbub', role: 'teacher', name: 'Dr. Mahbubur Rahman', initials: 'MR', division: 'dhaka',
    org: { en: 'Dept. of CSE · BUET', bn: 'সিএসই বিভাগ · বুয়েট' },
    teaches: ['algorithms'], pastReviews: 6,
  },
  {
    id: 'rv-rokeya', role: 'teacher', name: 'Rokeya Sultana', initials: 'RS', division: 'rajshahi',
    org: { en: 'Lecturer, Chemistry · Rajshahi Govt. College', bn: 'প্রভাষক, রসায়ন · রাজশাহী সরকারি কলেজ' },
    teaches: ['chemistry', 'biology'], pastReviews: 9,
  },
  {
    id: 'rv-shafiq', role: 'teacher', name: 'Shafiqul Islam', initials: 'SI', division: 'sylhet',
    org: { en: 'Assistant teacher, Mathematics · Sylhet Govt. Pilot High School', bn: 'সহকারী শিক্ষক, গণিত · সিলেট সরকারি পাইলট উচ্চ বিদ্যালয়' },
    teaches: ['math', 'physics'], pastReviews: 4,
  },
  {
    id: 'rv-nasrin', role: 'teacher', name: 'Nasrin Jahan', initials: 'NJ', division: 'khulna',
    org: { en: 'Senior teacher, Bangla · Khulna Zilla School', bn: 'সিনিয়র শিক্ষক, বাংলা · খুলনা জিলা স্কুল' },
    teaches: ['bangla'], pastReviews: 2,
  },
  {
    id: 'rv-joydeb', role: 'teacher', name: 'Joydeb Saha', initials: 'JS', division: 'chattogram',
    org: { en: 'Lecturer, ICT · Chattogram College', bn: 'প্রভাষক, আইসিটি · চট্টগ্রাম কলেজ' },
    teaches: ['ict'], pastReviews: 5,
  },
  // Students: `scores` = practice-exam average per subject (%), `topNotes` = subjects with highly rated notes
  { id: 'st-rahim', role: 'student', scores: { physics: 88, math: 82, bangla: 79 }, topNotes: [], pastReviews: 0 },
  { id: 'st-tasnim', role: 'student', scores: { chemistry: 91, physics: 84, biology: 76 }, topNotes: ['chemistry'], pastReviews: 1 },
  { id: 'st-nusrat', role: 'student', scores: { algorithms: 90, ict: 86 }, topNotes: ['algorithms'], pastReviews: 2 },
  { id: 'st-sadia', role: 'student', scores: { algorithms: 87, math: 84 }, topNotes: [], pastReviews: 1 },
  { id: 'st-tanjim', role: 'student', scores: { ict: 89, algorithms: 81 }, topNotes: [], pastReviews: 0 },
  { id: 'st-priya', role: 'student', scores: { math: 93, physics: 80 }, topNotes: [], pastReviews: 3 },
  // A reviewer whose pattern the government's risk checks flag: reviews outside his subject, fast reads, copied text
  {
    id: 'rv-sohel', role: 'student', name: 'Sohel Rana', initials: 'SR', division: 'dhaka',
    org: { en: 'HSC candidate · Dhaka City College', bn: 'এইচএসসি পরীক্ষার্থী · ঢাকা সিটি কলেজ' },
    scores: { math: 81 }, topNotes: [], pastReviews: 1,
  },
]

export const QUALIFY_SCORE = 80
// A review copy unlocks the review form after this share of its pages has been opened
export const READ_TO_UNLOCK = 0.5
export const REVIEW_POINTS = 50
export const DEFAULT_HONORARIUM = 300

// Reviewer level by total reviews (this demo's + earlier ones)
export const REVIEWER_LEVELS = [
  { key: 'gold', min: 8 },
  { key: 'silver', min: 3 },
  { key: 'bronze', min: 0 },
]

export const CRITERIA = ['syllabus', 'clarity', 'questions', 'value']

// Ranking: Bayesian average of reviewer stars. CONFIDENCE reviews' worth of the platform mean are mixed in,
// so a publisher with one or two glowing reviews can't jump straight to the top.
export const CONFIDENCE = 5
// Taken off a publisher's score while a government case about hired reviewers is open
export const INTEGRITY_PENALTY = 0.3

// Publishers' review calls: qualified reviewers can request a copy until the seats are filled
export const reviewCalls = [
  { bookId: 'bk-physics', publisherId: 'brightpage', seats: 10, honorarium: 300, deadline: '2026-11-20' },
  { bookId: 'bk-admission', publisherId: 'alokito', seats: 15, honorarium: 400, deadline: '2026-11-30' },
  { bookId: 'bk-ict-hsc', publisherId: 'shikkhalok', seats: 8, honorarium: 250, deadline: '2026-11-15' },
]

// Copies sent to reviewers. via: invite | request. status: invited | requested | reading | reviewed | declined
// pagesSeen = distinct pages opened in the reader
export const reviewCopies = [
  { id: 'rc-rahim-physics', bookId: 'bk-physics', reviewerId: 'st-rahim', via: 'request', status: 'reading', honorarium: 300, at: '2026-10-20', pagesSeen: [1, 2, 3, 4, 5, 6] },
  { id: 'rc-tasnim-physics', bookId: 'bk-physics', reviewerId: 'st-tasnim', via: 'request', status: 'requested', honorarium: 300, at: '2026-10-26', pagesSeen: [] },
  { id: 'rc-kamrul-admission', bookId: 'bk-admission', reviewerId: 'teacher-kamrul', via: 'invite', status: 'invited', honorarium: 400, at: '2026-10-25', pagesSeen: [] },
  { id: 'rc-mahbub-ict', bookId: 'bk-ict-hsc', reviewerId: 'teacher-mahbub', via: 'invite', status: 'invited', honorarium: 250, at: '2026-10-27', pagesSeen: [] },
  { id: 'rc-priya-algo', bookId: 'bk-algo', reviewerId: 'st-priya', via: 'invite', status: 'reading', honorarium: 300, at: '2026-10-22', pagesSeen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
]

const s = (en, bn) => ({ en, bn })

// Published reviews. `readPct` = share of the copy opened, `readHours` = time from receiving the copy to submitting.
// status: public | reported | removed
export const bookReviews = [
  {
    id: 'rv-1', bookId: 'bk-physics', reviewerId: 'teacher-kamrul', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 4 },
    text: s(
      'I teach Class 9–10 physics and checked every chapter against the 2026 NCTB syllabus; nothing is missing. The solved board questions are grouped the way students actually revise. I now recommend it to my sections.',
      'আমি ৯ম–১০ম শ্রেণির পদার্থবিজ্ঞান পড়াই এবং প্রতিটি অধ্যায় ২০২৬ এনসিটিবি সিলেবাসের সাথে মিলিয়ে দেখেছি; কিছুই বাদ নেই। সমাধানকৃত বোর্ড প্রশ্নগুলো শিক্ষার্থীরা যেভাবে রিভিশন দেয় সেভাবেই সাজানো। এখন আমার শাখাগুলোতে এটি সুপারিশ করি।',
    ),
    at: '2026-02-04', readPct: 100, readHours: 140, status: 'public',
    reply: { text: s('Thank you, sir. Chapter 6 practice set has been expanded in the October update.', 'ধন্যবাদ, স্যার। অক্টোবরের আপডেটে অধ্যায় ৬-এর অনুশীলনী বাড়ানো হয়েছে।'), at: '2026-02-06' },
  },
  {
    id: 'rv-2', bookId: 'bk-physics', reviewerId: 'rv-shafiq', stars: 4, criteria: { syllabus: 5, clarity: 4, questions: 4, value: 4 },
    text: s(
      'Strong on numericals. A few diagrams in Ch 8 are small on a phone screen, but the content is accurate.',
      'গাণিতিক সমস্যায় শক্তিশালী। অধ্যায় ৮-এর কয়েকটি চিত্র ফোনের পর্দায় ছোট দেখায়, তবে বিষয়বস্তু নির্ভুল।',
    ),
    at: '2026-03-11', readPct: 85, readHours: 96, status: 'public',
  },
  {
    id: 'rv-3', bookId: 'bk-algo', reviewerId: 'teacher-mahbub', stars: 4, criteria: { syllabus: 4, clarity: 5, questions: 5, value: 4 },
    text: s(
      'The graph and DP chapters match what we teach in CSE-2201. I would like more proofs of correctness, but as a problem workbook it is the best I have seen in Bangla.',
      'গ্রাফ ও ডিপি অধ্যায় সিএসই-২২০১-এ আমরা যা পড়াই তার সাথে মেলে। সঠিকতার প্রমাণ আরও থাকলে ভালো হতো, তবে প্রবলেম ওয়ার্কবুক হিসেবে বাংলায় দেখা সেরা।',
    ),
    at: '2026-04-02', readPct: 92, readHours: 210, status: 'public',
    reply: { text: s('Noted. Proof sketches are planned for the next edition.', 'ধন্যবাদ। পরের সংস্করণে প্রমাণের রূপরেখা যোগ করা হবে।'), at: '2026-04-05' },
  },
  {
    id: 'rv-4', bookId: 'bk-algo', reviewerId: 'st-nusrat', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 5 },
    text: s(
      'Solved 60 problems from it before my term final. Explanations are short and the Bangla problem statements help a lot.',
      'টার্ম ফাইনালের আগে এখান থেকে ৬০টি সমস্যা সমাধান করেছি। ব্যাখ্যাগুলো সংক্ষিপ্ত, আর বাংলা সমস্যা-বিবরণ অনেক সাহায্য করে।',
    ),
    at: '2026-05-19', readPct: 74, readHours: 300, status: 'public',
  },
  {
    id: 'rv-5', bookId: 'bk-algo', reviewerId: 'st-sadia', stars: 4, criteria: { syllabus: 4, clarity: 4, questions: 5, value: 3 },
    text: s('Great problem set, a little pricey for students.', 'চমৎকার সমস্যা-সংকলন, শিক্ষার্থীদের জন্য দাম একটু বেশি।'),
    at: '2026-06-08', readPct: 66, readHours: 120, status: 'public',
  },
  {
    id: 'rv-6', bookId: 'bk-chem-easy', reviewerId: 'rv-rokeya', stars: 4, criteria: { syllabus: 4, clarity: 5, questions: 3, value: 4 },
    text: s(
      'Very readable explanations. The MCQ answers in Ch 7 have three mistakes I reported to the publisher.',
      'ব্যাখ্যাগুলো খুব সহজপাঠ্য। অধ্যায় ৭-এর এমসিকিউ উত্তরে তিনটি ভুল আছে, প্রকাশককে জানিয়েছি।',
    ),
    at: '2026-07-14', readPct: 100, readHours: 160, status: 'public',
  },
  {
    id: 'rv-7', bookId: 'bk-chem-easy', reviewerId: 'st-tasnim', stars: 3, criteria: { syllabus: 3, clarity: 4, questions: 3, value: 3 },
    text: s('Easy to read but skips some stoichiometry steps students need.', 'পড়তে সহজ, তবে শিক্ষার্থীদের দরকারি কিছু স্টয়কিওমেট্রির ধাপ বাদ দিয়েছে।'),
    at: '2026-08-01', readPct: 70, readHours: 90, status: 'public',
  },
  {
    id: 'rv-8', bookId: 'bk-chem-easy', reviewerId: 'rv-sohel', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 5 },
    text: s('Best book ever. Every student must buy this book. 100% recommended, no mistakes at all.', 'সর্বকালের সেরা বই। প্রত্যেক শিক্ষার্থীর এই বই কেনা উচিত। ১০০% সুপারিশকৃত, কোনো ভুল নেই।'),
    at: '2026-10-12', readPct: 50, readHours: 1, status: 'public',
  },
  {
    id: 'rv-9', bookId: 'bk-bio-nobodoy', reviewerId: 'rv-sohel', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 5 },
    text: s('Best book ever. Every student must buy this book. 100% recommended, no mistakes at all.', 'সর্বকালের সেরা বই। প্রত্যেক শিক্ষার্থীর এই বই কেনা উচিত। ১০০% সুপারিশকৃত, কোনো ভুল নেই।'),
    at: '2026-10-13', readPct: 50, readHours: 1, status: 'public',
  },
  {
    id: 'rv-10', bookId: 'bk-bio-nobodoy', reviewerId: 'rv-rokeya', stars: 3, criteria: { syllabus: 4, clarity: 3, questions: 3, value: 3 },
    text: s('Covers the syllabus, but the diagrams are low quality and a few labels are wrong.', 'সিলেবাস কভার করে, তবে চিত্রগুলোর মান কম এবং কয়েকটি লেবেল ভুল।'),
    at: '2026-09-02', readPct: 90, readHours: 130, status: 'public',
  },
  {
    id: 'rv-11', bookId: 'bk-hsc-chem', reviewerId: 'rv-rokeya', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 4 },
    text: s(
      'Both papers are complete and the admission questions are marked chapter by chapter. My students use it alongside the textbook.',
      'দুই পত্রই সম্পূর্ণ এবং ভর্তি প্রশ্নগুলো অধ্যায় অনুযায়ী চিহ্নিত। আমার শিক্ষার্থীরা পাঠ্যবইয়ের পাশাপাশি এটি ব্যবহার করে।',
    ),
    at: '2026-05-03', readPct: 95, readHours: 240, status: 'public',
  },
  {
    id: 'rv-12', bookId: 'bk-hsc-chem', reviewerId: 'st-tasnim', stars: 5, criteria: { syllabus: 5, clarity: 4, questions: 5, value: 5 },
    text: s('My main chemistry guide for HSC. Organic chapter summaries are excellent.', 'এইচএসসির জন্য আমার প্রধান রসায়ন গাইড। জৈব অধ্যায়ের সারসংক্ষেপ চমৎকার।'),
    at: '2026-06-21', readPct: 88, readHours: 180, status: 'public',
  },
  {
    id: 'rv-13', bookId: 'bk-admission', reviewerId: 'rv-shafiq', stars: 4, criteria: { syllabus: 4, clarity: 4, questions: 5, value: 4 },
    text: s('Huge question bank with correct solutions in the math part. Index could be better.', 'বিশাল প্রশ্ন ব্যাংক, গণিত অংশের সমাধান নির্ভুল। সূচি আরও ভালো হতে পারত।'),
    at: '2026-07-30', readPct: 60, readHours: 110, status: 'public',
  },
  {
    id: 'rv-14', bookId: 'bk-admission', reviewerId: 'st-priya', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 5, value: 4 },
    text: s('Topic tags made it easy to practise weak areas before the DU test.', 'বিষয়-ট্যাগের কারণে ঢাবি পরীক্ষার আগে দুর্বল অংশ অনুশীলন করা সহজ হয়েছে।'),
    at: '2026-08-17', readPct: 72, readHours: 150, status: 'public',
  },
  {
    id: 'rv-15', bookId: 'bk-bangla-grammar', reviewerId: 'rv-nasrin', stars: 5, criteria: { syllabus: 5, clarity: 5, questions: 4, value: 5 },
    text: s('Grammar rules are explained with fresh examples, and the 2026 board pattern is followed.', 'ব্যাকরণের নিয়মগুলো নতুন উদাহরণসহ ব্যাখ্যা করা, আর ২০২৬ বোর্ড প্যাটার্ন অনুসরণ করা হয়েছে।'),
    at: '2026-09-10', readPct: 100, readHours: 200, status: 'public',
  },
  {
    id: 'rv-16', bookId: 'bk-ict-hsc', reviewerId: 'rv-joydeb', stars: 3, criteria: { syllabus: 3, clarity: 3, questions: 4, value: 3 },
    text: s('Programming chapter uses outdated examples; networking part is fine.', 'প্রোগ্রামিং অধ্যায়ে পুরোনো উদাহরণ; নেটওয়ার্কিং অংশ ঠিক আছে।'),
    at: '2026-08-25', readPct: 80, readHours: 100, status: 'public',
  },
  {
    id: 'rv-17', bookId: 'bk-ict-hsc', reviewerId: 'st-tanjim', stars: 4, criteria: { syllabus: 4, clarity: 4, questions: 4, value: 4 },
    text: s('HTML and C sections are clear. Good practice MCQs.', 'এইচটিএমএল ও সি অংশ পরিষ্কার। ভালো অনুশীলনী এমসিকিউ।'),
    at: '2026-09-18', readPct: 68, readHours: 75, status: 'public',
  },
]

// Government cases on reviewers, keyed by reviewer id. status: suspended | clarified | cleared | upheld
export const reviewerCases = {}

export const REPORT_REASONS = ['fake', 'offTopic', 'abusive', 'conflict']
