// Part-time, research and government roles (paid challenges come from challenges.js).
// kind: parttime | research | govt. `pay` is in taka; `payUnit` keys into student.opps.payUnits.
export const roles = [
  {
    id: 'op-cv-intern', kind: 'parttime', org: 'AgroSense Ltd.',
    title: { en: 'Computer vision intern', bn: 'কম্পিউটার ভিশন ইন্টার্ন' },
    where: { en: 'Startup · Remote', bn: 'স্টার্টআপ · রিমোট' },
    hours: { en: '12 h / week · 3 months', bn: 'সপ্তাহে ১২ ঘণ্টা · ৩ মাস' },
    pay: 15000, payUnit: 'month',
    skills: ['Python', 'OpenCV', 'Basic AI'],
    task: { en: 'Help build a phone app that detects leaf disease in rice fields from photos taken by farmers.', bn: 'কৃষকের তোলা ছবি থেকে ধানক্ষেতের পাতার রোগ শনাক্ত করার একটি ফোন অ্যাপ তৈরিতে সাহায্য করুন।' },
  },
  {
    id: 'op-water', kind: 'research', org: 'Dept. of Environmental Science, University of Dhaka',
    title: { en: 'Research assistant, water quality', bn: 'গবেষণা সহকারী, পানির মান' },
    where: { en: 'University lab · Dhaka', bn: 'বিশ্ববিদ্যালয় ল্যাব · ঢাকা' },
    hours: { en: '6 weeks', bn: '৬ সপ্তাহ' },
    pay: 8000, payUnit: 'total',
    skills: ['Field survey', 'Statistics', 'Python'],
    task: { en: 'Collect and analyse arsenic test results from 40 tube wells in Munshiganj.', bn: 'মুন্সীগঞ্জের ৪০টি নলকূপের আর্সেনিক পরীক্ষার ফল সংগ্রহ ও বিশ্লেষণ করুন।' },
  },
  {
    id: 'op-reviewer', kind: 'govt', org: 'Government review team',
    title: { en: 'Content reviewer, Class 9 science', bn: 'কনটেন্ট রিভিউয়ার, ৯ম শ্রেণির বিজ্ঞান' },
    where: { en: 'Govt. review team · Hybrid', bn: 'সরকারি রিভিউ টিম · হাইব্রিড' },
    hours: { en: 'Ongoing', bn: 'চলমান' },
    pay: 500, payUnit: 'item',
    skills: ['Technical writing', 'Statistics'],
    task: { en: 'Check student notes and guide-book chapters against the 2026 syllabus before they go live.', bn: 'প্রকাশের আগে শিক্ষার্থীদের নোট ও গাইড বইয়ের অধ্যায় ২০২৬-এর সিলেবাসের সাথে মিলিয়ে দেখুন।' },
  },
  {
    id: 'op-fair-poster', kind: 'govt', org: 'District Science Fair Committee, Kurigram',
    title: { en: 'Poster designer for the district science fair', bn: 'জেলা বিজ্ঞান মেলার পোস্টার ডিজাইনার' },
    where: { en: 'District office · Kurigram', bn: 'জেলা কার্যালয় · কুড়িগ্রাম' },
    hours: { en: '1 week', bn: '১ সপ্তাহ' },
    pay: 2500, payUnit: 'total',
    skills: ['Graphic design', 'Canva'],
    task: { en: 'Design the main poster and five stall banners for the 2026 district science fair.', bn: '২০২৬ সালের জেলা বিজ্ঞান মেলার মূল পোস্টার ও পাঁচটি স্টল ব্যানার ডিজাইন করুন।' },
  },
]
