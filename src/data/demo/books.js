// Guide books in the government-verified store. status: live | review | fix (the publisher portal shows all three;
// students only see live books). `cover` picks one of the brand surfaces for the generated cover.
export const books = [
  {
    id: 'bk-physics', publisherId: 'brightpage', publisher: 'Brightpage Publications', level: 'school',
    title: { en: 'Physics Complete Guide', bn: 'পদার্থবিজ্ঞান সম্পূর্ণ গাইড' },
    cls: { en: 'Class 9–10', bn: '৯ম–১০ম শ্রেণি' }, subject: 'physics',
    price: 120, pages: 340, syllabus: 2026, rating: 4.8, readers: 1200, sold: 412, status: 'live', cover: 'teal',
    about: { en: 'Chapter-wise theory, solved board questions from 2015–2025 and 12 model tests aligned to the national curriculum.', bn: 'অধ্যায়ভিত্তিক তত্ত্ব, ২০১৫–২০২৫ সালের সমাধানকৃত বোর্ড প্রশ্ন এবং জাতীয় শিক্ষাক্রম অনুযায়ী ১২টি মডেল টেস্ট।' },
    inside: [
      { en: '14 chapters with summaries', bn: 'সারসংক্ষেপসহ ১৪টি অধ্যায়' },
      { en: '600+ practice questions linked to exams', bn: 'পরীক্ষার সাথে যুক্ত ৬০০+ অনুশীলনী প্রশ্ন' },
      { en: 'Solved board questions 2015–2025', bn: '২০১৫–২০২৫ সালের সমাধানকৃত বোর্ড প্রশ্ন' },
    ],
  },
  {
    id: 'bk-highermath', publisherId: 'brightpage', publisher: 'Brightpage Publications', level: 'school',
    title: { en: 'Higher Math Model Tests', bn: 'উচ্চতর গণিত মডেল টেস্ট' },
    cls: { en: 'Class 9–10', bn: '৯ম–১০ম শ্রেণি' }, subject: 'math',
    price: 90, pages: 212, syllabus: 2026, rating: 4.6, readers: 0, sold: 0, status: 'review', cover: 'amber',
    about: { en: '20 full model tests with step-by-step solutions.', bn: 'ধাপে ধাপে সমাধানসহ ২০টি পূর্ণাঙ্গ মডেল টেস্ট।' },
    inside: [
      { en: '20 model tests', bn: '২০টি মডেল টেস্ট' },
      { en: 'Step-by-step solutions', bn: 'ধাপে ধাপে সমাধান' },
    ],
  },
  {
    id: 'bk-chemlab', publisherId: 'brightpage', publisher: 'Brightpage Publications', level: 'school',
    title: { en: 'Chemistry Lab Manual', bn: 'রসায়ন ল্যাব ম্যানুয়াল' },
    cls: { en: 'Class 9–10', bn: '৯ম–১০ম শ্রেণি' }, subject: 'chemistry',
    price: 70, pages: 96, syllabus: 2026, rating: 0, readers: 0, sold: 0, status: 'fix', cover: 'mist',
    reviewNote: { en: 'Ch 4 is off-syllabus for 2026. Replace it with the new titration experiment.', bn: 'অধ্যায় ৪ ২০২৬-এর সিলেবাসের বাইরে। নতুন টাইট্রেশন পরীক্ষণ দিয়ে বদলান।' },
    about: { en: '18 experiments with diagrams and viva questions.', bn: 'চিত্র ও মৌখিক প্রশ্নসহ ১৮টি পরীক্ষণ।' },
    inside: [{ en: '18 experiments', bn: '১৮টি পরীক্ষণ' }],
  },
  {
    id: 'bk-chem-easy', publisherId: 'nobodoy', publisher: 'Nobodoy Prokashoni', level: 'school',
    title: { en: 'Chemistry Made Easy', bn: 'সহজ রসায়ন' },
    cls: { en: 'Class 9–10', bn: '৯ম–১০ম শ্রেণি' }, subject: 'chemistry',
    price: 110, pages: 288, syllabus: 2026, rating: 4.5, readers: 860, sold: 0, status: 'live', cover: 'amber',
    about: { en: 'Short explanations, colour diagrams and 400 board-style MCQs.', bn: 'সংক্ষিপ্ত ব্যাখ্যা, রঙিন চিত্র ও ৪০০ বোর্ড-প্যাটার্ন এমসিকিউ।' },
    inside: [
      { en: '12 chapters', bn: '১২টি অধ্যায়' },
      { en: '400 board-style MCQs', bn: '৪০০ বোর্ড-প্যাটার্ন এমসিকিউ' },
    ],
  },
  {
    id: 'bk-hsc-chem', publisherId: 'alokito', publisher: 'Alokito Publications', level: 'college',
    title: { en: 'HSC Chemistry 1st & 2nd Paper', bn: 'এইচএসসি রসায়ন ১ম ও ২য় পত্র' },
    cls: { en: 'Class 11–12', bn: 'একাদশ–দ্বাদশ শ্রেণি' }, subject: 'chemistry',
    price: 180, pages: 520, syllabus: 2026, rating: 4.7, readers: 2100, sold: 0, status: 'live', cover: 'teal',
    about: { en: 'Both papers in one guide, with board and admission questions marked chapter by chapter.', bn: 'দুই পত্র এক গাইডে, অধ্যায় অনুযায়ী বোর্ড ও ভর্তি প্রশ্ন চিহ্নিত।' },
    inside: [
      { en: '10 chapters across both papers', bn: 'দুই পত্রে ১০টি অধ্যায়' },
      { en: 'Admission questions 2015–2025', bn: '২০১৫–২০২৫ সালের ভর্তি প্রশ্ন' },
    ],
  },
  {
    id: 'bk-admission', publisherId: 'alokito', publisher: 'Alokito Publications', level: 'admission',
    title: { en: 'Admission Question Bank', bn: 'ভর্তি প্রশ্ন ব্যাংক' },
    cls: { en: 'DU · BUET · Medical', bn: 'ঢাবি · বুয়েট · মেডিকেল' }, subject: 'all',
    price: 220, pages: 610, syllabus: 2026, rating: 4.8, readers: 3400, sold: 0, status: 'live', cover: 'mist',
    about: { en: 'Every admission question from 2015 to 2025 with solutions and topic tags.', bn: '২০১৫ থেকে ২০২৫ সালের সব ভর্তি প্রশ্ন, সমাধান ও বিষয়-ট্যাগসহ।' },
    inside: [
      { en: '11 years of questions', bn: '১১ বছরের প্রশ্ন' },
      { en: 'Topic-wise index', bn: 'বিষয়ভিত্তিক সূচি' },
    ],
  },
  {
    id: 'bk-algo', publisherId: 'brightpage', publisher: 'Brightpage Publications', level: 'university',
    title: { en: 'Algorithms Problem Workbook', bn: 'অ্যালগরিদম প্রবলেম ওয়ার্কবুক' },
    cls: { en: 'CSE · 2nd year', bn: 'সিএসই · ২য় বর্ষ' }, subject: 'algorithms',
    price: 250, pages: 300, syllabus: 2026, rating: 4.6, readers: 540, sold: 0, status: 'live', cover: 'teal',
    about: { en: '180 solved problems in Bangla and English, mapped to common university course outlines.', bn: 'বাংলা ও ইংরেজিতে ১৮০টি সমাধানকৃত সমস্যা, বিশ্ববিদ্যালয়ের সাধারণ কোর্স-রূপরেখা অনুযায়ী।' },
    inside: [
      { en: '180 solved problems', bn: '১৮০টি সমাধানকৃত সমস্যা' },
      { en: 'Past-semester style questions', bn: 'আগের সেমিস্টারের ধাঁচে প্রশ্ন' },
    ],
  },
]

export const SAMPLE_PAGES = 12
export const POINTS_DISCOUNT = { points: 1000, percent: 20 }
