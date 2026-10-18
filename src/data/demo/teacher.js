// Teacher portal demo data. The level switcher picks one of two teacher personas.
// Text that differs by language is { en, bn }.
export const TEACHER_LEVELS = ['school', 'university']

export const teacherLevels = {
  school: {
    id: 'teacher-kamrul',
    name: 'Md. Kamrul Hasan',
    initials: 'KH',
    detail: { en: 'Senior teacher, Physics · Mymensingh Zilla School', bn: 'সিনিয়র শিক্ষক, পদার্থবিজ্ঞান · ময়মনসিংহ জিলা স্কুল' },
    curriculum: { en: 'NCTB · Class 9–10 (SSC)', bn: 'এনসিটিবি · ৯ম–১০ম শ্রেণি (এসএসসি)' },
    // Sections this teacher takes, with head count
    sections: [
      { id: '10b', label: { en: 'Class 10 Section B', bn: '১০ম শ্রেণি খ শাখা' }, students: 48 },
      { id: '10a', label: { en: 'Class 10 Section A', bn: '১০ম শ্রেণি ক শাখা' }, students: 54 },
      { id: '10c', label: { en: 'Class 10 Section C', bn: '১০ম শ্রেণি গ শাখা' }, students: 50 },
      { id: '9a', label: { en: 'Class 9 Section A', bn: '৯ম শ্রেণি ক শাখা' }, students: 52 },
    ],
    stats: { liveExams: 3, scriptsTotal: 128, scriptsChecked: 12, average: 74 },
    exams: [
      { id: 'ex-force', title: { en: 'Physics · Ch 3 Force, MCQ quiz', bn: 'পদার্থবিজ্ঞান · অধ্যায় ৩ বল, এমসিকিউ কুইজ' }, section: '10b', state: 'live', submitted: 41, closes: '2026-10-18T16:00:00' },
      { id: 'ex-motion', title: { en: 'Physics · Ch 2 Motion, class test', bn: 'পদার্থবিজ্ঞান · অধ্যায় ২ গতি, ক্লাস টেস্ট' }, section: '10a', state: 'live', submitted: 37, closes: '2026-10-18T17:30:00' },
      { id: 'ex-work', title: { en: 'Physics · Ch 4 Work & energy, MCQ quiz', bn: 'পদার্থবিজ্ঞান · অধ্যায় ৪ কাজ ও শক্তি, এমসিকিউ কুইজ' }, section: '9a', state: 'live', submitted: 18, closes: '2026-10-19T12:00:00' },
      { id: 'ex-halfyear', title: { en: 'Physics half-yearly model test', bn: 'পদার্থবিজ্ঞান অর্ধবার্ষিক মডেল টেস্ট' }, section: '10c', state: 'scheduled', opens: '2026-10-26T10:00:00' },
    ],
    subjects: [{ id: 'physics', label: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' } }],
    classes: [
      { id: 'c10', label: { en: 'Class 10', bn: '১০ম শ্রেণি' } },
      { id: 'c9', label: { en: 'Class 9', bn: '৯ম শ্রেণি' } },
    ],
    topics: [
      { id: 'motion', label: { en: 'Motion', bn: 'গতি' } },
      { id: 'force', label: { en: 'Force', bn: 'বল' } },
      { id: 'work', label: { en: 'Work & energy', bn: 'কাজ ও শক্তি' } },
      { id: 'pressure', label: { en: 'Pressure', bn: 'চাপ' } },
    ],
    defaults: { mcq: 25, creative: 8 },
  },
  university: {
    id: 'teacher-mahbub',
    name: 'Dr. Mahbubur Rahman',
    initials: 'MR',
    detail: { en: 'Dept. of CSE · BUET', bn: 'সিএসই বিভাগ · বুয়েট' },
    curriculum: { en: 'BUET · Dept. of CSE · Robotics & Vision Lab', bn: 'বুয়েট · সিএসই বিভাগ · রোবটিক্স ও ভিশন ল্যাব' },
    sections: [
      { id: 'cse2201a', label: { en: 'CSE-2201 Section A', bn: 'সিএসই-২২০১ সেকশন এ' }, students: 60 },
      { id: 'cse2201b', label: { en: 'CSE-2201 Section B', bn: 'সিএসই-২২০১ সেকশন বি' }, students: 60 },
      { id: 'cse4127', label: { en: 'CSE-4127 Computer Vision', bn: 'সিএসই-৪১২৭ কম্পিউটার ভিশন' }, students: 42 },
    ],
    // Demo numbers for the university persona
    stats: { courses: 2, supervised: 6, scriptsTotal: 46, scriptsChecked: 9, average: 71 },
    courses: [
      { code: 'CSE-2201', title: { en: 'Algorithms', bn: 'অ্যালগরিদম' }, students: 120 },
      { code: 'CSE-4127', title: { en: 'Computer Vision', bn: 'কম্পিউটার ভিশন' }, students: 42 },
    ],
    exams: [
      { id: 'ex-graphs', title: { en: 'CSE-2201 · Quiz 3, Graph algorithms', bn: 'সিএসই-২২০১ · কুইজ ৩, গ্রাফ অ্যালগরিদম' }, section: 'cse2201a', state: 'live', submitted: 52, closes: '2026-10-18T18:00:00' },
      { id: 'ex-cv-mid', title: { en: 'CSE-4127 · Mid-term', bn: 'সিএসই-৪১২৭ · মিড-টার্ম' }, section: 'cse4127', state: 'scheduled', opens: '2026-10-22T09:30:00' },
      { id: 'ex-sort', title: { en: 'CSE-2201 · Quiz 4, Sorting', bn: 'সিএসই-২২০১ · কুইজ ৪, সর্টিং' }, section: 'cse2201b', state: 'scheduled', opens: '2026-10-29T11:00:00' },
    ],
    subjects: [{ id: 'algorithms', label: { en: 'CSE-2201 Algorithms', bn: 'সিএসই-২২০১ অ্যালগরিদম' } }],
    classes: [{ id: 'l2t2', label: { en: 'Level 2 Term 2', bn: 'লেভেল ২ টার্ম ২' } }],
    topics: [
      { id: 'analysis', label: { en: 'Asymptotic analysis', bn: 'অ্যাসিম্পটোটিক বিশ্লেষণ' } },
      { id: 'sorting', label: { en: 'Sorting', bn: 'সর্টিং' } },
      { id: 'graphs', label: { en: 'Graph algorithms', bn: 'গ্রাফ অ্যালগরিদম' } },
      { id: 'dp', label: { en: 'Dynamic programming', bn: 'ডায়নামিক প্রোগ্রামিং' } },
    ],
    defaults: { mcq: 8, creative: 1 },
  },
}

// Questions that complete a full SSC Physics paper (25 MCQ + 8 creative) together with questionBank.school,
// plus Dynamic programming for the university course. Creative questions with `parts` follow the SSC format:
// stem in `q`, then knowledge (1), comprehension (2), application (3) and higher-order (4) with a model answer.
export const extraQuestions = {
  school: [
    // Pressure
    {
      id: 'tq-p1', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Mymensingh Board 2022', bn: 'ময়মনসিংহ বোর্ড ২০২২' }, solved: 72,
      q: { en: 'What is the SI unit of pressure?', bn: 'চাপের এসআই একক কী?' },
      options: ['N', 'Pa', 'J', 'W'], answer: 1,
      explain: { en: 'Pressure is force per area: N/m², called the pascal (Pa).', bn: 'চাপ = বল/ক্ষেত্রফল: N/m², যার নাম প্যাসকেল (Pa)।' },
    },
    {
      id: 'tq-p2', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Dhaka Board 2023', bn: 'ঢাকা বোর্ড ২০২৩' }, solved: 58,
      q: { en: 'The pressure at 10 m depth in water (ρ = 1000 kg/m³, g = 9.8 m/s²) is:', bn: 'পানির ১০ m গভীরে চাপ কত? (ρ = ১০০০ kg/m³, g = ৯.৮ m/s²)' },
      options: ['9,800 Pa', '98,000 Pa', '980 Pa', '1,000 Pa'], answer: 1,
      explain: { en: 'P = hρg = 10 × 1000 × 9.8 = 98,000 Pa.', bn: 'P = hρg = ১০ × ১০০০ × ৯.৮ = ৯৮,০০০ Pa।' },
    },
    {
      id: 'tq-p3', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Rajshahi Board 2021', bn: 'রাজশাহী বোর্ড ২০২১' }, solved: 81,
      q: { en: 'Why does a sharp knife cut more easily than a blunt one?', bn: 'ধারালো ছুরি ভোঁতা ছুরির চেয়ে সহজে কাটে কেন?' },
      options: [
        { en: 'Smaller area gives more pressure', bn: 'ক্ষেত্রফল কম হলে চাপ বেশি হয়' },
        { en: 'It is heavier', bn: 'এটি বেশি ভারী' },
        { en: 'Larger area gives more pressure', bn: 'ক্ষেত্রফল বেশি হলে চাপ বেশি হয়' },
        { en: 'It has less friction', bn: 'এতে ঘর্ষণ কম' },
      ],
      answer: 0,
      explain: { en: 'P = F/A: the same force on a thinner edge gives a larger pressure.', bn: 'P = F/A: একই বল সরু প্রান্তে পড়লে চাপ বেশি হয়।' },
    },
    {
      id: 'tq-p4', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Jashore Board 2022', bn: 'যশোর বোর্ড ২০২২' }, solved: 77,
      q: { en: 'Normal atmospheric pressure at sea level is about:', bn: 'সমুদ্রপৃষ্ঠে স্বাভাবিক বায়ুমণ্ডলীয় চাপ প্রায় কত?' },
      options: ['76 cm Hg', '76 mm Hg', '10 cm Hg', '760 cm Hg'], answer: 0,
      explain: { en: 'Air at sea level holds up a 76 cm column of mercury, about 1.013 × 10⁵ Pa.', bn: 'সমুদ্রপৃষ্ঠে বায়ু ৭৬ cm উঁচু পারদস্তম্ভ ধরে রাখে, যা প্রায় ১.০১৩ × ১০⁵ Pa।' },
    },
    {
      id: 'tq-p5', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Dinajpur Board 2023', bn: 'দিনাজপুর বোর্ড ২০২৩' }, solved: 69,
      q: { en: 'A hydraulic press works on:', bn: 'হাইড্রোলিক প্রেস কোন নীতিতে কাজ করে?' },
      options: [
        { en: 'Pascal’s law', bn: 'প্যাসকেলের সূত্র' },
        { en: 'Archimedes’ principle', bn: 'আর্কিমিডিসের নীতি' },
        { en: 'Hooke’s law', bn: 'হুকের সূত্র' },
        { en: 'Newton’s first law', bn: 'নিউটনের প্রথম সূত্র' },
      ],
      answer: 0,
      explain: { en: 'Pressure applied to an enclosed liquid passes undiminished to every part of it.', bn: 'আবদ্ধ তরলে প্রযুক্ত চাপ তরলের সব অংশে সমানভাবে সঞ্চারিত হয়।' },
    },
    {
      id: 'tq-p6', type: 'mcq', subject: 'physics', chapter: 'pressure', source: { en: 'Barishal Board 2024', bn: 'বরিশাল বোর্ড ২০২৪' }, solved: 84,
      q: { en: 'A force of 600 N acts on an area of 2 m². The pressure is:', bn: '২ m² ক্ষেত্রফলের ওপর ৬০০ N বল ক্রিয়া করে। চাপ কত?' },
      options: ['300 Pa', '1,200 Pa', '602 Pa', '598 Pa'], answer: 0,
      explain: { en: 'P = F/A = 600/2 = 300 Pa.', bn: 'P = F/A = ৬০০/২ = ৩০০ Pa।' },
    },
    // Motion
    {
      id: 'tq-m1', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Dinajpur Board 2019', bn: 'দিনাজপুর বোর্ড ২০১৯' }, solved: 86,
      q: { en: 'A body covers 100 m in 20 s with uniform velocity. Its velocity is:', bn: 'একটি বস্তু সুষম বেগে ২০ s-এ ১০০ m অতিক্রম করে। এর বেগ কত?' },
      options: ['5 m/s', '20 m/s', '80 m/s', '2,000 m/s'], answer: 0,
      explain: { en: 'v = s/t = 100/20 = 5 m/s.', bn: 'v = s/t = ১০০/২০ = ৫ m/s।' },
    },
    {
      id: 'tq-m2', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Jashore Board 2020', bn: 'যশোর বোর্ড ২০২০' }, solved: 67,
      q: { en: 'A stone is dropped from rest. Its velocity after 3 s is (g = 9.8 m/s²):', bn: 'একটি পাথর স্থির অবস্থা থেকে ছেড়ে দেওয়া হলো। ৩ s পর এর বেগ কত? (g = ৯.৮ m/s²)' },
      options: ['9.8 m/s', '19.6 m/s', '29.4 m/s', '3.27 m/s'], answer: 2,
      explain: { en: 'v = u + gt = 0 + 9.8 × 3 = 29.4 m/s.', bn: 'v = u + gt = ০ + ৯.৮ × ৩ = ২৯.৪ m/s।' },
    },
    {
      id: 'tq-m3', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Barishal Board 2021', bn: 'বরিশাল বোর্ড ২০২১' }, solved: 89,
      q: { en: 'Which of these is a vector quantity?', bn: 'নিচের কোনটি ভেক্টর রাশি?' },
      options: [
        { en: 'Speed', bn: 'দ্রুতি' },
        { en: 'Distance', bn: 'দূরত্ব' },
        { en: 'Displacement', bn: 'সরণ' },
        { en: 'Time', bn: 'সময়' },
      ],
      answer: 2,
      explain: { en: 'Displacement has both size and direction.', bn: 'সরণের মান ও দিক দুটোই আছে।' },
    },
    // Force
    {
      id: 'tq-f1', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Sylhet Board 2019', bn: 'সিলেট বোর্ড ২০১৯' }, solved: 83,
      q: { en: 'The momentum of a 2 kg body moving at 5 m/s is:', bn: '৫ m/s বেগে চলমান ২ kg ভরের বস্তুর ভরবেগ কত?' },
      options: ['2.5 kg m/s', '7 kg m/s', '10 kg m/s', '25 kg m/s'], answer: 2,
      explain: { en: 'p = mv = 2 × 5 = 10 kg m/s.', bn: 'p = mv = ২ × ৫ = ১০ kg m/s।' },
    },
    {
      id: 'tq-f2', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Chattogram Board 2020', bn: 'চট্টগ্রাম বোর্ড ২০২০' }, solved: 80,
      q: { en: 'How a rocket moves forward is explained by Newton’s:', bn: 'রকেটের সামনে চলা নিউটনের কোন সূত্র দিয়ে ব্যাখ্যা করা যায়?' },
      options: [
        { en: 'First law', bn: 'প্রথম সূত্র' },
        { en: 'Second law', bn: 'দ্বিতীয় সূত্র' },
        { en: 'Third law', bn: 'তৃতীয় সূত্র' },
        { en: 'Law of gravitation', bn: 'মহাকর্ষ সূত্র' },
      ],
      answer: 2,
      explain: { en: 'Gas pushed backwards pushes the rocket forwards: action and reaction.', bn: 'পেছনে ছুড়ে দেওয়া গ্যাস রকেটকে সামনে ঠেলে: ক্রিয়া ও প্রতিক্রিয়া।' },
    },
    // Work & energy
    {
      id: 'tq-w1', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Dhaka Board 2019', bn: 'ঢাকা বোর্ড ২০১৯' }, solved: 90,
      q: { en: 'A 10 N force moves a body 5 m in its own direction. The work done is:', bn: '১০ N বল একটি বস্তুকে বলের দিকে ৫ m সরায়। কৃতকাজ কত?' },
      options: ['2 J', '15 J', '50 J', '500 J'], answer: 2,
      explain: { en: 'W = Fs = 10 × 5 = 50 J.', bn: 'W = Fs = ১০ × ৫ = ৫০ J।' },
    },
    {
      id: 'tq-w2', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Rajshahi Board 2020', bn: 'রাজশাহী বোর্ড ২০২০' }, solved: 73,
      q: { en: 'The kinetic energy of a 2 kg body moving at 3 m/s is:', bn: '৩ m/s বেগে চলমান ২ kg ভরের বস্তুর গতিশক্তি কত?' },
      options: ['3 J', '6 J', '9 J', '18 J'], answer: 2,
      explain: { en: 'KE = ½mv² = ½ × 2 × 3² = 9 J.', bn: 'KE = ½mv² = ½ × ২ × ৩² = ৯ J।' },
    },
    {
      id: 'tq-w3', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Cumilla Board 2021', bn: 'কুমিল্লা বোর্ড ২০২১' }, solved: 92,
      q: { en: 'What is the SI unit of power?', bn: 'ক্ষমতার এসআই একক কী?' },
      options: [
        { en: 'Joule', bn: 'জুল' },
        { en: 'Watt', bn: 'ওয়াট' },
        { en: 'Newton', bn: 'নিউটন' },
        { en: 'Pascal', bn: 'প্যাসকেল' },
      ],
      answer: 1,
      explain: { en: 'Power is work per second: J/s, called the watt.', bn: 'ক্ষমতা = প্রতি সেকেন্ডে কাজ: J/s, যার নাম ওয়াট।' },
    },
    {
      id: 'tq-w4', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Mymensingh Board 2022', bn: 'ময়মনসিংহ বোর্ড ২০২২' }, solved: 70,
      q: { en: 'The potential energy of a 5 kg body at a height of 4 m is (g = 9.8 m/s²):', bn: '৪ m উচ্চতায় ৫ kg ভরের বস্তুর বিভবশক্তি কত? (g = ৯.৮ m/s²)' },
      options: ['20 J', '49 J', '196 J', '245 J'], answer: 2,
      explain: { en: 'PE = mgh = 5 × 9.8 × 4 = 196 J.', bn: 'PE = mgh = ৫ × ৯.৮ × ৪ = ১৯৬ J।' },
    },

    // Creative questions in the SSC format
    {
      id: 'tc-p1', type: 'creative', subject: 'physics', chapter: 'pressure', source: { en: 'Sylhet Board 2022', bn: 'সিলেট বোর্ড ২০২২' }, solved: 44,
      q: { en: 'A 60 kg student stands on one foot, whose contact area with the floor is 150 cm². Then she stands on both feet. (g = 9.8 m/s²)', bn: '৬০ kg ভরের একজন শিক্ষার্থী এক পায়ে দাঁড়ায়, মেঝের সাথে পায়ের স্পর্শতলের ক্ষেত্রফল ১৫০ cm²। এরপর সে দুই পায়ে দাঁড়ায়। (g = ৯.৮ m/s²)' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is pressure?', bn: 'চাপ কাকে বলে?' }, answer: { en: 'The force acting perpendicularly on unit area of a surface.', bn: 'কোনো তলের একক ক্ষেত্রফলের ওপর লম্বভাবে প্রযুক্ত বলকে চাপ বলে।' } },
        { kind: 'comprehension', q: { en: 'Why can a camel walk easily on sand?', bn: 'উট বালুর ওপর সহজে হাঁটতে পারে কেন?' }, answer: { en: 'Its wide, flat feet spread its weight over a large area, so the pressure on the sand is low and the feet do not sink.', bn: 'উটের চওড়া ও চ্যাপ্টা পা তার ওজনকে বড় ক্ষেত্রফলে ছড়িয়ে দেয়, ফলে বালুর ওপর চাপ কম হয় এবং পা দেবে যায় না।' } },
        { kind: 'application', q: { en: 'Find the pressure on the floor when she stands on one foot.', bn: 'এক পায়ে দাঁড়ালে মেঝের ওপর চাপ নির্ণয় করো।' }, answer: { en: 'W = mg = 60 × 9.8 = 588 N. A = 150 cm² = 0.015 m². P = 588/0.015 = 39,200 Pa.', bn: 'W = mg = ৬০ × ৯.৮ = ৫৮৮ N। A = ১৫০ cm² = ০.০১৫ m²। P = ৫৮৮/০.০১৫ = ৩৯,২০০ Pa।' } },
        { kind: 'higherOrder', q: { en: '“Standing on both feet halves the pressure on the floor.” Analyse the statement mathematically.', bn: '“দুই পায়ে দাঁড়ালে মেঝের ওপর চাপ অর্ধেক হয়।” উক্তিটি গাণিতিকভাবে বিশ্লেষণ করো।' }, answer: { en: 'On both feet A = 0.03 m², so P = 588/0.03 = 19,600 Pa, half of 39,200 Pa. The weight stays the same while the area doubles, and P = F/A, so the statement is correct.', bn: 'দুই পায়ে A = ০.০৩ m², তাই P = ৫৮৮/০.০৩ = ১৯,৬০০ Pa, যা ৩৯,২০০ Pa-এর অর্ধেক। ওজন একই থাকে কিন্তু ক্ষেত্রফল দ্বিগুণ হয়, আর P = F/A, তাই উক্তিটি সঠিক।' } },
      ],
    },
    {
      id: 'tc-p2', type: 'creative', subject: 'physics', chapter: 'pressure', source: { en: 'Rajshahi Board 2023', bn: 'রাজশাহী বোর্ড ২০২৩' }, solved: 46,
      q: { en: 'A 5 m tall water tank is full. A tap is fitted 1 m above the bottom of the tank. (ρ = 1000 kg/m³, g = 9.8 m/s²)', bn: '৫ m উঁচু একটি পানির ট্যাংক পানিতে পূর্ণ। ট্যাংকের তলা থেকে ১ m ওপরে একটি কল লাগানো আছে। (ρ = ১০০০ kg/m³, g = ৯.৮ m/s²)' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is the SI unit of pressure?', bn: 'চাপের এসআই একক কী?' }, answer: { en: 'The pascal (Pa), equal to 1 N/m².', bn: 'প্যাসকেল (Pa), যা ১ N/m²-এর সমান।' } },
        { kind: 'comprehension', q: { en: 'Why are dam walls made thicker at the bottom?', bn: 'বাঁধের দেয়াল নিচের দিকে বেশি পুরু করা হয় কেন?' }, answer: { en: 'Liquid pressure rises with depth (P = hρg), so the bottom of the wall must withstand the greatest pressure.', bn: 'গভীরতা বাড়লে তরলের চাপ বাড়ে (P = hρg), তাই দেয়ালের নিচের অংশকে সবচেয়ে বেশি চাপ সহ্য করতে হয়।' } },
        { kind: 'application', q: { en: 'Find the water pressure at the tap.', bn: 'কলের মুখে পানির চাপ নির্ণয় করো।' }, answer: { en: 'Depth of the tap h = 5 − 1 = 4 m. P = hρg = 4 × 1000 × 9.8 = 39,200 Pa.', bn: 'কলের গভীরতা h = ৫ − ১ = ৪ m। P = hρg = ৪ × ১০০০ × ৯.৮ = ৩৯,২০০ Pa।' } },
        { kind: 'higherOrder', q: { en: '“If the tap were fitted at the bottom, water would come out faster.” Analyse the statement.', bn: '“কলটি তলায় লাগালে পানি আরও জোরে বের হতো।” উক্তিটি বিশ্লেষণ করো।' }, answer: { en: 'At the bottom h = 5 m, so P = 5 × 1000 × 9.8 = 49,000 Pa, more than 39,200 Pa. Greater pressure pushes the water out with greater speed, so the statement is correct.', bn: 'তলায় h = ৫ m, তাই P = ৫ × ১০০০ × ৯.৮ = ৪৯,০০০ Pa, যা ৩৯,২০০ Pa-এর চেয়ে বেশি। বেশি চাপ পানিকে বেশি বেগে বের করে দেয়, তাই উক্তিটি সঠিক।' } },
      ],
    },
    {
      id: 'tc-m1', type: 'creative', subject: 'physics', chapter: 'motion', source: { en: 'Cumilla Board 2022', bn: 'কুমিল্লা বোর্ড ২০২২' }, solved: 51,
      q: { en: 'A bus starts from rest and accelerates uniformly at 2 m/s² for 10 s. It then moves at constant velocity for 20 s.', bn: 'একটি বাস স্থির অবস্থা থেকে ১০ s ধরে ২ m/s² সুষম ত্বরণে চলে। এরপর ২০ s সমবেগে চলে।' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is acceleration?', bn: 'ত্বরণ কাকে বলে?' }, answer: { en: 'The rate of change of velocity with time.', bn: 'সময়ের সাথে বেগ পরিবর্তনের হারকে ত্বরণ বলে।' } },
        { kind: 'comprehension', q: { en: 'Why is the acceleration zero when a body moves with uniform velocity?', bn: 'সুষম বেগে চলমান বস্তুর ত্বরণ শূন্য কেন?' }, answer: { en: 'Its velocity does not change, so the change in velocity per second, which is the acceleration, is zero.', bn: 'বস্তুর বেগ পরিবর্তিত হয় না, তাই প্রতি সেকেন্ডে বেগের পরিবর্তন, অর্থাৎ ত্বরণ, শূন্য।' } },
        { kind: 'application', q: { en: 'Find the velocity of the bus after 10 s.', bn: '১০ s পর বাসের বেগ নির্ণয় করো।' }, answer: { en: 'v = u + at = 0 + 2 × 10 = 20 m/s.', bn: 'v = u + at = ০ + ২ × ১০ = ২০ m/s।' } },
        { kind: 'higherOrder', q: { en: '“The bus covers more distance at constant velocity than while accelerating.” Analyse the statement mathematically.', bn: '“ত্বরণের সময়ের চেয়ে সমবেগে চলার সময় বাসটি বেশি দূরত্ব অতিক্রম করে।” উক্তিটি গাণিতিকভাবে বিশ্লেষণ করো।' }, answer: { en: 'First 10 s: s = ½at² = ½ × 2 × 10² = 100 m. Next 20 s: s = vt = 20 × 20 = 400 m. Since 400 m > 100 m, the statement is correct.', bn: 'প্রথম ১০ s: s = ½at² = ½ × ২ × ১০² = ১০০ m। পরের ২০ s: s = vt = ২০ × ২০ = ৪০০ m। যেহেতু ৪০০ m > ১০০ m, উক্তিটি সঠিক।' } },
      ],
    },
    {
      id: 'tc-m2', type: 'creative', subject: 'physics', chapter: 'motion', source: { en: 'Jashore Board 2023', bn: 'যশোর বোর্ড ২০২৩' }, solved: 42,
      q: { en: 'A ball is thrown straight up at 19.6 m/s. Ignore air resistance. (g = 9.8 m/s²)', bn: 'একটি বলকে ১৯.৬ m/s বেগে খাড়া ওপরের দিকে ছোড়া হলো। বাতাসের বাধা উপেক্ষা করো। (g = ৯.৮ m/s²)' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is free fall?', bn: 'মুক্তভাবে পড়ন্ত বস্তু কাকে বলে?' }, answer: { en: 'The motion of a body falling under gravity alone, with no other force acting.', bn: 'অন্য কোনো বল ছাড়া শুধু অভিকর্ষের প্রভাবে বস্তুর পতনকে মুক্ত পতন বলে।' } },
        { kind: 'comprehension', q: { en: 'Why is the ball’s velocity zero at the highest point?', bn: 'সর্বোচ্চ বিন্দুতে বলের বেগ শূন্য হয় কেন?' }, answer: { en: 'Gravity reduces its upward velocity by 9.8 m/s every second. When the velocity reaches zero the ball stops rising and starts to fall.', bn: 'অভিকর্ষ প্রতি সেকেন্ডে বলের ঊর্ধ্বমুখী বেগ ৯.৮ m/s কমায়। বেগ শূন্য হলে বল আর ওঠে না, নিচে পড়তে শুরু করে।' } },
        { kind: 'application', q: { en: 'Find the maximum height the ball reaches.', bn: 'বলটি সর্বোচ্চ কত উচ্চতায় উঠবে নির্ণয় করো।' }, answer: { en: 'h = u²/2g = 19.6²/(2 × 9.8) = 384.16/19.6 = 19.6 m.', bn: 'h = u²/2g = ১৯.৬²/(২ × ৯.৮) = ৩৮৪.১৬/১৯.৬ = ১৯.৬ m।' } },
        { kind: 'higherOrder', q: { en: '“The ball takes the same time to go up as to come down.” Analyse the statement mathematically.', bn: '“বলটির উঠতে ও নামতে একই সময় লাগে।” উক্তিটি গাণিতিকভাবে বিশ্লেষণ করো।' }, answer: { en: 'Going up: t = u/g = 19.6/9.8 = 2 s. Coming down from 19.6 m: h = ½gt², so t² = 2 × 19.6/9.8 = 4 and t = 2 s. Both times are 2 s, so the statement is correct when air resistance is ignored.', bn: 'ওঠার সময়: t = u/g = ১৯.৬/৯.৮ = ২ s। ১৯.৬ m থেকে নামার সময়: h = ½gt², তাই t² = ২ × ১৯.৬/৯.৮ = ৪ এবং t = ২ s। দুটোই ২ s, তাই বাতাসের বাধা উপেক্ষা করলে উক্তিটি সঠিক।' } },
      ],
    },
    {
      id: 'tc-w1', type: 'creative', subject: 'physics', chapter: 'work', source: { en: 'Chattogram Board 2023', bn: 'চট্টগ্রাম বোর্ড ২০২৩' }, solved: 49,
      q: { en: 'Rakib (50 kg) climbs a 6 m high staircase in 12 s. Mitu (40 kg) climbs the same staircase in 8 s. (g = 9.8 m/s²)', bn: 'রাকিব (৫০ kg) ১২ s-এ ৬ m উঁচু একটি সিঁড়ি বেয়ে ওঠে। মিতু (৪০ kg) একই সিঁড়ি ৮ s-এ বেয়ে ওঠে। (g = ৯.৮ m/s²)' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is power?', bn: 'ক্ষমতা কাকে বলে?' }, answer: { en: 'The rate of doing work.', bn: 'কাজ করার হারকে ক্ষমতা বলে।' } },
        { kind: 'comprehension', q: { en: 'Why is no work done when you push a wall that does not move?', bn: 'না নড়া দেয়ালকে ঠেললে কোনো কাজ হয় না কেন?' }, answer: { en: 'Work is force times displacement (W = Fs). The wall does not move, so s = 0 and W = 0.', bn: 'কাজ = বল × সরণ (W = Fs)। দেয়াল সরে না, তাই s = ০ এবং W = ০।' } },
        { kind: 'application', q: { en: 'Find the work Rakib does against gravity.', bn: 'অভিকর্ষের বিরুদ্ধে রাকিবের কৃতকাজ নির্ণয় করো।' }, answer: { en: 'W = mgh = 50 × 9.8 × 6 = 2,940 J.', bn: 'W = mgh = ৫০ × ৯.৮ × ৬ = ২,৯৪০ J।' } },
        { kind: 'higherOrder', q: { en: '“Mitu is more powerful than Rakib though she is lighter.” Analyse the statement mathematically.', bn: '“মিতু হালকা হলেও রাকিবের চেয়ে বেশি ক্ষমতাসম্পন্ন।” উক্তিটি গাণিতিকভাবে বিশ্লেষণ করো।' }, answer: { en: 'Rakib: P = 2,940/12 = 245 W. Mitu: W = 40 × 9.8 × 6 = 2,352 J, P = 2,352/8 = 294 W. 294 W > 245 W, so the statement is correct: she does less work but in much less time.', bn: 'রাকিব: P = ২,৯৪০/১২ = ২৪৫ W। মিতু: W = ৪০ × ৯.৮ × ৬ = ২,৩৫২ J, P = ২,৩৫২/৮ = ২৯৪ W। ২৯৪ W > ২৪৫ W, তাই উক্তিটি সঠিক: সে কম কাজ করে, কিন্তু অনেক কম সময়ে।' } },
      ],
    },
    {
      id: 'tc-w2', type: 'creative', subject: 'physics', chapter: 'work', source: { en: 'Dhaka Board 2024', bn: 'ঢাকা বোর্ড ২০২৪' }, solved: 53,
      q: { en: 'A 2 kg ball is dropped from the roof of a 20 m tall building. Ignore air resistance. (g = 9.8 m/s²)', bn: '২০ m উঁচু একটি ভবনের ছাদ থেকে ২ kg ভরের একটি বল ছেড়ে দেওয়া হলো। বাতাসের বাধা উপেক্ষা করো। (g = ৯.৮ m/s²)' },
      parts: [
        { kind: 'knowledge', q: { en: 'What is energy?', bn: 'শক্তি কাকে বলে?' }, answer: { en: 'The capacity to do work.', bn: 'কাজ করার সামর্থ্যকে শক্তি বলে।' } },
        { kind: 'comprehension', q: { en: 'Why does the ball’s kinetic energy increase as it falls?', bn: 'পড়ার সময় বলের গতিশক্তি বাড়ে কেন?' }, answer: { en: 'Gravity accelerates the ball, so its speed and KE = ½mv² rise. The potential energy it loses turns into kinetic energy.', bn: 'অভিকর্ষ বলকে ত্বরান্বিত করে, তাই এর দ্রুতি ও গতিশক্তি KE = ½mv² বাড়ে। হারানো বিভবশক্তি গতিশক্তিতে রূপান্তরিত হয়।' } },
        { kind: 'application', q: { en: 'Find the ball’s potential energy on the roof.', bn: 'ছাদে বলের বিভবশক্তি নির্ণয় করো।' }, answer: { en: 'PE = mgh = 2 × 9.8 × 20 = 392 J.', bn: 'PE = mgh = ২ × ৯.৮ × ২০ = ৩৯২ J।' } },
        { kind: 'higherOrder', q: { en: '“Halfway down, the ball’s potential and kinetic energy are equal.” Analyse the statement.', bn: '“অর্ধেক পথ নামার পর বলের বিভবশক্তি ও গতিশক্তি সমান হয়।” উক্তিটি বিশ্লেষণ করো।' }, answer: { en: 'At 10 m: PE = 2 × 9.8 × 10 = 196 J. Total mechanical energy stays 392 J, so KE = 392 − 196 = 196 J. PE = KE, so the statement is correct by conservation of energy.', bn: '১০ m উচ্চতায়: PE = ২ × ৯.৮ × ১০ = ১৯৬ J। মোট যান্ত্রিক শক্তি ৩৯২ J থাকে, তাই KE = ৩৯২ − ১৯৬ = ১৯৬ J। PE = KE, তাই শক্তির সংরক্ষণশীলতা অনুযায়ী উক্তিটি সঠিক।' } },
      ],
    },
  ],
  university: [
    {
      id: 'tq-d1', type: 'mcq', subject: 'algorithms', chapter: 'dp', source: { en: 'CSE-2201 Final 2024', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪' }, solved: 71,
      q: { en: 'What is the time of the standard DP for the longest common subsequence of strings of length m and n?', bn: 'm ও n দৈর্ঘ্যের দুটি স্ট্রিংয়ের লংগেস্ট কমন সাবসিকোয়েন্সের সাধারণ ডিপি সমাধানের সময় কত?' },
      options: ['O(m + n)', 'O(mn)', 'O(2ⁿ)', 'O(n log n)'], answer: 1,
    },
    {
      id: 'tq-d2', type: 'mcq', subject: 'algorithms', chapter: 'dp', source: { en: 'CSE-2201 Mid 2023', bn: 'সিএসই-২২০১ মিড ২০২৩' }, solved: 63,
      q: { en: 'Dynamic programming applies when a problem has optimal substructure and:', bn: 'সমস্যায় অপটিমাল সাবস্ট্রাকচার এবং আর কী থাকলে ডায়নামিক প্রোগ্রামিং কাজে লাগে?' },
      options: [
        { en: 'Overlapping subproblems', bn: 'পুনরাবৃত্ত উপসমস্যা' },
        { en: 'A greedy choice', bn: 'গ্রিডি পছন্দ' },
        { en: 'Sorted input', bn: 'সাজানো ইনপুট' },
        { en: 'No recursion', bn: 'রিকার্শন না থাকা' },
      ],
      answer: 0,
    },
    {
      id: 'tc-d1', type: 'creative', subject: 'algorithms', chapter: 'dp', source: { en: 'CSE-2201 Final 2023', bn: 'সিএসই-২২০১ ফাইনাল ২০২৩' }, solved: 41,
      q: { en: 'Write the recurrence for 0/1 knapsack and fill the table for capacity 5 with items (w, v) = (2, 3), (3, 4), (4, 5).', bn: '০/১ ন্যাপস্যাকের রিকারেন্স লেখো এবং ধারণক্ষমতা ৫ ও আইটেম (w, v) = (২, ৩), (৩, ৪), (৪, ৫)-এর জন্য টেবিল পূরণ করো।' },
    },
  ],
}

// OMR: one answer key per level and the sheets in the sample batch.
// `answers` holds the bubble each student filled (0–3) or null for blank.
const schoolKey = [1, 0, 1, 2, 0, 3, 1, 0, 2, 1, 3, 0, 2, 1, 0, 3, 2, 1, 0, 2]
const universityKey = [1, 1, 1, 1, 0, 0, 2, 1, 0, 0, 2, 3, 1, 0, 2, 1, 3, 0, 1, 2]

// Copies the key, then applies wrong marks { questionIndex: bubble } and blanks
function sheet(key, wrong = {}, blank = []) {
  return key.map((a, i) => (blank.includes(i) ? null : (wrong[i] ?? a)))
}

export const omrBatches = {
  school: {
    title: { en: 'Physics · Ch 3 Force · Class 10 Section B', bn: 'পদার্থবিজ্ঞান · অধ্যায় ৩ বল · ১০ম শ্রেণি খ শাখা' },
    key: schoolKey,
    total: 40,
    // Already scanned before the first sample sheet; with Afsana's 18 the average reads 15.6
    before: { count: 31, sum: 481 },
    hardest: { q: 14, missed: 61 },
    idLabel: 'roll',
    sheets: [
      { roll: '1042', name: 'Afsana R.', seconds: 0.8, answers: sheet(schoolKey, { 5: 1, 13: 3 }) },
      { roll: '1043', name: 'Tanvir H.', seconds: 0.7, answers: sheet(schoolKey, { 2: 0, 13: 2, 16: 0 }, [19]) },
      { roll: '1044', name: 'Mim A.', seconds: 0.9, answers: sheet(schoolKey, { 13: 0 }) },
      { roll: '1045', name: 'Sabbir K.', seconds: 0.8, answers: sheet(schoolKey, { 1: 2, 7: 1, 9: 0, 13: 2, 15: 1 }, [18]) },
      { roll: '1046', name: 'Nabila S.', seconds: 0.7, answers: sheet(schoolKey, { 10: 1, 13: 3 }, [6]) },
    ],
  },
  university: {
    title: { en: 'CSE-2201 · Quiz 3, Graph algorithms · Section A', bn: 'সিএসই-২২০১ · কুইজ ৩, গ্রাফ অ্যালগরিদম · সেকশন এ' },
    key: universityKey,
    total: 60,
    before: { count: 17, sum: 241 },
    hardest: { q: 7, missed: 54 },
    idLabel: 'studentId',
    sheets: [
      { roll: '2105042', name: 'Farhan I.', seconds: 0.8, answers: sheet(universityKey, { 6: 0, 11: 1 }, [17]) },
      { roll: '2105043', name: 'Raisa N.', seconds: 0.9, answers: sheet(universityKey, { 6: 3 }) },
      { roll: '2105047', name: 'Tahmid A.', seconds: 0.7, answers: sheet(universityKey, { 2: 0, 6: 0, 9: 2, 14: 1 }) },
    ],
  },
}

// Written answers: one question per level, a few scripts with the student's answer per part
// and the suggested marks with a one-line reason.
export const writtenQuestions = {
  school: {
    title: { en: 'Physics · Ch 3 Force · Creative question 2', bn: 'পদার্থবিজ্ঞান · অধ্যায় ৩ বল · সৃজনশীল প্রশ্ন ২' },
    stem: {
      en: 'Rafi pushes a 40 kg trolley along a straight road. Starting from rest, it reaches 3 m/s in 6 s. He then keeps it moving at that constant velocity for 10 s. Friction on the trolley is 60 N throughout.',
      bn: 'রাফি একটি সোজা রাস্তায় ৪০ kg ভরের একটি ট্রলি ঠেলছে। স্থির অবস্থা থেকে ৬ s-এ ট্রলিটির বেগ হয় ৩ m/s। এরপর সে ১০ s ধরে ট্রলিটিকে ওই সমবেগে চালিয়ে নেয়। পুরো সময় ট্রলির ওপর ঘর্ষণ বল ৬০ N।',
    },
    parts: [
      { label: { en: 'a', bn: 'ক' }, kind: 'knowledge', max: 1, prompt: { en: 'What is inertia?', bn: 'জড়তা কী?' } },
      { label: { en: 'b', bn: 'খ' }, kind: 'comprehension', max: 2, prompt: { en: 'Explain why Rafi must keep pushing to move the trolley at constant velocity.', bn: 'ট্রলিটিকে সমবেগে চালাতে রাফিকে কেন ঠেলতেই হয়, ব্যাখ্যা করো।' } },
      { label: { en: 'c', bn: 'গ' }, kind: 'application', max: 3, prompt: { en: 'Find the force Rafi applied during the first 6 s.', bn: 'প্রথম ৬ s-এ রাফির প্রযুক্ত বল নির্ণয় করো।' } },
      { label: { en: 'd', bn: 'ঘ' }, kind: 'higherOrder', max: 4, prompt: { en: '“Rafi did more work in the last 10 s than in the first 6 s.” Analyse the statement mathematically.', bn: '“প্রথম ৬ s-এর চেয়ে শেষ ১০ s-এ রাফি বেশি কাজ করেছে।” উক্তিটি গাণিতিকভাবে বিশ্লেষণ করো।' } },
    ],
    scripts: [
      {
        id: 'ws-1042', roll: '1042', name: 'Afsana Rahman', initials: 'AR', section: '10b',
        answers: [
          { text: { en: 'Inertia is the tendency of a body to stay in its state of rest or uniform motion.', bn: 'বস্তু যে ধর্মের কারণে তার স্থির বা সুষম গতির অবস্থা বজায় রাখতে চায়, তাকে জড়তা বলে।' }, ai: 1, reason: { en: 'Matches the textbook definition.', bn: 'পাঠ্যবইয়ের সংজ্ঞার সাথে মিলে যায়।' } },
          { text: { en: 'Friction of 60 N acts against the motion. For constant velocity the net force must be zero, so Rafi has to apply 60 N forward to balance the friction.', bn: 'গতির বিপরীতে ৬০ N ঘর্ষণ বল কাজ করে। সমবেগে চলতে হলে লব্ধি বল শূন্য হতে হবে, তাই ঘর্ষণ বল প্রশমিত করতে রাফিকে সামনের দিকে ৬০ N বল দিতে হয়।' }, ai: 2, reason: { en: 'Links zero net force to constant velocity and names friction.', bn: 'সমবেগের সাথে শূন্য লব্ধি বলের সম্পর্ক ও ঘর্ষণ উল্লেখ করেছে।' } },
          { text: { en: 'a = (v − u)/t = (3 − 0)/6 = 0.5 m/s². Net force = ma = 40 × 0.5 = 20 N. Applied force = 20 + 60 = 80 N.', bn: 'a = (v − u)/t = (৩ − ০)/৬ = ০.৫ m/s²। লব্ধি বল = ma = ৪০ × ০.৫ = ২০ N। প্রযুক্ত বল = ২০ + ৬০ = ৮০ N।' }, ai: 3, reason: { en: 'Correct acceleration, adds friction, correct answer with unit.', bn: 'ত্বরণ সঠিক, ঘর্ষণ যোগ করেছে, এককসহ সঠিক উত্তর।' } },
          { text: { en: 'First 6 s: s = ½at² = ½ × 0.5 × 36 = 9 m, W = 80 × 9 = 720 J. Last 10 s: s = 3 × 10 = 30 m, W = 60 × 30 = 1800 J.', bn: 'প্রথম ৬ s: s = ½at² = ½ × ০.৫ × ৩৬ = ৯ m, W = ৮০ × ৯ = ৭২০ J। শেষ ১০ s: s = ৩ × ১০ = ৩০ m, W = ৬০ × ৩০ = ১৮০০ J।' }, ai: 3, reason: { en: 'Both works are right, but there is no conclusion on the statement.', bn: 'দুটি কাজই সঠিক, তবে উক্তিটি সম্পর্কে কোনো সিদ্ধান্ত লেখেনি।' } },
        ],
      },
      {
        id: 'ws-1043', roll: '1043', name: 'Tanvir Hossain', initials: 'TH', section: '10b',
        answers: [
          { text: { en: 'Inertia means a body wants to keep doing what it is doing, at rest or moving.', bn: 'জড়তা মানে বস্তু যে অবস্থায় আছে, স্থির বা গতিশীল, সেই অবস্থাতেই থাকতে চায়।' }, ai: 1, reason: { en: 'Informal wording, but the idea is complete.', bn: 'ভাষা অনানুষ্ঠানিক, তবে ধারণাটি সম্পূর্ণ।' } },
          { text: { en: 'Because if he stops pushing the trolley will stop.', bn: 'কারণ ঠেলা বন্ধ করলে ট্রলি থেমে যাবে।' }, ai: 1, reason: { en: 'Right observation, but does not explain friction or net force.', bn: 'পর্যবেক্ষণ ঠিক, কিন্তু ঘর্ষণ বা লব্ধি বলের ব্যাখ্যা নেই।' } },
          { text: { en: 'a = 3/6 = 0.5 m/s². F = ma = 40 × 0.5 = 20 N.', bn: 'a = ৩/৬ = ০.৫ m/s²। F = ma = ৪০ × ০.৫ = ২০ N।' }, ai: 2, reason: { en: 'Finds the net force only and leaves out the 60 N friction.', bn: 'শুধু লব্ধি বল বের করেছে, ৬০ N ঘর্ষণ বাদ পড়েছে।' } },
          { text: { en: 'First 6 s: W = 20 × 9 = 180 J. Last 10 s: W = 60 × 30 = 1800 J. So the statement is true.', bn: 'প্রথম ৬ s: W = ২০ × ৯ = ১৮০ J। শেষ ১০ s: W = ৬০ × ৩০ = ১৮০০ J। তাই উক্তিটি সত্য।' }, ai: 2, reason: { en: 'Uses the wrong force for the first part; the conclusion still holds.', bn: 'প্রথম অংশে ভুল বল নিয়েছে; তবে সিদ্ধান্ত ঠিক আছে।' } },
        ],
      },
      {
        id: 'ws-1047', roll: '1047', name: 'Mim Akter', initials: 'MA', section: '10b',
        answers: [
          { text: { en: 'The property by which a body resists any change in its state of rest or motion is called inertia.', bn: 'যে ধর্মের কারণে বস্তু তার স্থিতি বা গতির অবস্থার পরিবর্তনে বাধা দেয়, তাকে জড়তা বলে।' }, ai: 1, reason: { en: 'Precise definition.', bn: 'নির্ভুল সংজ্ঞা।' } },
          { text: { en: 'By Newton’s first law, velocity stays constant only when the net force is zero. Friction (60 N) acts backwards, so Rafi must push with an equal 60 N forward; otherwise the trolley decelerates.', bn: 'নিউটনের প্রথম সূত্র অনুযায়ী লব্ধি বল শূন্য হলেই কেবল বেগ স্থির থাকে। ঘর্ষণ (৬০ N) পেছনের দিকে কাজ করে, তাই রাফিকে সামনের দিকে সমান ৬০ N বলে ঠেলতে হয়; নইলে ট্রলির মন্দন হবে।' }, ai: 2, reason: { en: 'Cites the first law and balances the forces.', bn: 'প্রথম সূত্র উল্লেখ করে বলের সাম্য দেখিয়েছে।' } },
          { text: { en: 'a = (3 − 0)/6 = 0.5 m/s². F − f = ma, so F = 40 × 0.5 + 60 = 80 N.', bn: 'a = (৩ − ০)/৬ = ০.৫ m/s²। F − f = ma, তাই F = ৪০ × ০.৫ + ৬০ = ৮০ N।' }, ai: 3, reason: { en: 'Full method and the right answer.', bn: 'সম্পূর্ণ পদ্ধতি ও সঠিক উত্তর।' } },
          { text: { en: 'First 6 s: s = ½ × 0.5 × 6² = 9 m, W₁ = 80 × 9 = 720 J. Last 10 s: s = 30 m, W₂ = 60 × 30 = 1800 J. W₂ > W₁ (1800 J > 720 J), so the statement is correct: more distance is covered in the last 10 s.', bn: 'প্রথম ৬ s: s = ½ × ০.৫ × ৬² = ৯ m, W₁ = ৮০ × ৯ = ৭২০ J। শেষ ১০ s: s = ৩০ m, W₂ = ৬০ × ৩০ = ১৮০০ J। W₂ > W₁ (১৮০০ J > ৭২০ J), তাই উক্তিটি সঠিক: শেষ ১০ s-এ দূরত্ব অনেক বেশি অতিক্রান্ত হয়েছে।' }, ai: 4, reason: { en: 'Both works correct, compares them and gives a reason.', bn: 'দুটি কাজই সঠিক, তুলনা করেছে এবং কারণ দেখিয়েছে।' } },
        ],
      },
      {
        id: 'ws-1051', roll: '1051', name: 'Sabbir Khan', initials: 'SK', section: '10b',
        answers: [
          { text: { en: 'Inertia is a force that keeps a body moving.', bn: 'জড়তা হলো এক ধরনের বল যা বস্তুকে চলমান রাখে।' }, ai: 0, reason: { en: 'Calls inertia a force, which is a misconception.', bn: 'জড়তাকে বল বলেছে, যা ভুল ধারণা।' } },
          { text: { en: 'There is friction on the road, so he has to push.', bn: 'রাস্তায় ঘর্ষণ আছে, তাই তাকে ঠেলতে হয়।' }, ai: 1, reason: { en: 'Names friction but does not explain the balance of forces.', bn: 'ঘর্ষণের কথা বলেছে, কিন্তু বলের সাম্য ব্যাখ্যা করেনি।' } },
          { text: { en: 'a = 3/6 = 0.5 m/s².', bn: 'a = ৩/৬ = ০.৫ m/s²।' }, ai: 1, reason: { en: 'Only the acceleration step is done.', bn: 'শুধু ত্বরণের ধাপটি করেছে।' } },
          { text: { en: '', bn: '' }, ai: 0, reason: { en: 'Left blank.', bn: 'উত্তর লেখেনি।' } },
        ],
      },
    ],
  },
  university: {
    title: { en: 'CSE-2201 · Mid-term · Question 2', bn: 'সিএসই-২২০১ · মিড-টার্ম · প্রশ্ন ২' },
    stem: {
      en: 'Consider quicksort on an array of n distinct keys using the Lomuto partition with the last element as pivot.',
      bn: 'n টি ভিন্ন কী-এর একটি অ্যারেতে লোমুতো পার্টিশন ব্যবহার করে কুইকসর্ট বিবেচনা করো, যেখানে শেষ উপাদানটি পিভট।',
    },
    parts: [
      { label: { en: 'a', bn: 'ক' }, kind: 'recall', max: 2, prompt: { en: 'Write the recurrence for the worst case and its solution.', bn: 'সবচেয়ে খারাপ ক্ষেত্রের রিকারেন্স ও তার সমাধান লেখো।' } },
      { label: { en: 'b', bn: 'খ' }, kind: 'application', max: 3, prompt: { en: 'Trace one partition step on [7, 2, 9, 4, 5].', bn: '[৭, ২, ৯, ৪, ৫]-এর ওপর একটি পার্টিশন ধাপ ট্রেস করো।' } },
      { label: { en: 'c', bn: 'গ' }, kind: 'analysis', max: 5, prompt: { en: 'Argue why a random pivot gives expected O(n log n) time.', bn: 'র‍্যান্ডম পিভট কেন প্রত্যাশিত O(n log n) সময় দেয়, যুক্তি দাও।' } },
    ],
    scripts: [
      {
        id: 'ws-2105042', roll: '2105042', name: 'Farhan Ishraq', initials: 'FI', section: 'cse2201a',
        answers: [
          { text: { en: 'T(n) = T(n − 1) + Θ(n), which gives Θ(n²).', bn: 'T(n) = T(n − 1) + Θ(n), যার সমাধান Θ(n²)।' }, ai: 2, reason: { en: 'Correct recurrence and solution.', bn: 'রিকারেন্স ও সমাধান দুটোই সঠিক।' } },
          { text: { en: 'Pivot 5. 7 > 5 skip; 2 < 5 swap → [2, 7, 9, 4, 5]; 9 skip; 4 < 5 swap → [2, 4, 9, 7, 5]; place pivot → [2, 4, 5, 7, 9].', bn: 'পিভট ৫। ৭ > ৫ বাদ; ২ < ৫ অদলবদল → [২, ৭, ৯, ৪, ৫]; ৯ বাদ; ৪ < ৫ অদলবদল → [২, ৪, ৯, ৭, ৫]; পিভট বসানো → [২, ৪, ৫, ৭, ৯]।' }, ai: 3, reason: { en: 'Every swap is shown and the final array is right.', bn: 'প্রতিটি অদলবদল দেখানো হয়েছে, চূড়ান্ত অ্যারে সঠিক।' } },
          { text: { en: 'A random pivot lands in the middle half with probability 1/2, so on average the recursion depth is O(log n) and each level does O(n) work.', bn: 'র‍্যান্ডম পিভট ১/২ সম্ভাবনায় মাঝের অর্ধেকে পড়ে, তাই গড়ে রিকার্শনের গভীরতা O(log n) এবং প্রতি স্তরে O(n) কাজ।' }, ai: 3, reason: { en: 'Good intuition, but no expected-value bound is derived.', bn: 'ভালো অন্তর্দৃষ্টি, তবে প্রত্যাশিত মানের সীমা প্রমাণ করেনি।' } },
        ],
      },
      {
        id: 'ws-2105043', roll: '2105043', name: 'Raisa Noor', initials: 'RN', section: 'cse2201a',
        answers: [
          { text: { en: 'T(n) = 2T(n/2) + n = O(n log n).', bn: 'T(n) = 2T(n/2) + n = O(n log n)।' }, ai: 0, reason: { en: 'This is the best case, not the worst case.', bn: 'এটি সেরা ক্ষেত্র, সবচেয়ে খারাপ ক্ষেত্র নয়।' } },
          { text: { en: 'After partition: [2, 4, 5, 9, 7].', bn: 'পার্টিশনের পর: [২, ৪, ৫, ৯, ৭]।' }, ai: 1, reason: { en: 'Pivot is placed right, but the order after it is wrong and no steps are shown.', bn: 'পিভট সঠিক স্থানে, কিন্তু পরের ক্রম ভুল এবং ধাপ দেখানো হয়নি।' } },
          { text: { en: 'Let X count comparisons. Keys zᵢ and zⱼ are compared only if one of them is the first pivot chosen from zᵢ…zⱼ, with probability 2/(j − i + 1). Summing over all pairs, E[X] = Σ 2/(j − i + 1) = O(n log n).', bn: 'ধরি X হলো তুলনার সংখ্যা। zᵢ ও zⱼ তখনই তুলনা হয় যখন zᵢ…zⱼ থেকে প্রথম বাছাই করা পিভট এদের একটি, যার সম্ভাবনা ২/(j − i + ১)। সব জোড়ার যোগফল E[X] = Σ ২/(j − i + ১) = O(n log n)।' }, ai: 5, reason: { en: 'Complete indicator-variable argument.', bn: 'ইন্ডিকেটর ভ্যারিয়েবল দিয়ে সম্পূর্ণ যুক্তি।' } },
        ],
      },
    ],
  },
}

// Notes this teacher already shared. Shown together with any note uploaded in the demo.
// They are not in the shared notes store yet, so students do not see them.
export const teacherNotes = [
  {
    id: 'tn-force', level: 'school', authorId: 'teacher-kamrul', author: 'Md. Kamrul Hasan', initials: 'KH',
    title: { en: 'Force: board creative questions with model answers', bn: 'বল: বোর্ডের সৃজনশীল প্রশ্ন ও আদর্শ উত্তর' },
    subject: { en: 'Physics · Class 9–10', bn: 'পদার্থবিজ্ঞান · ৯ম–১০ম শ্রেণি' },
    pages: 12, rating: 4.9, ratings: 236, status: 'reviewed', createdAt: '2026-09-20',
  },
  {
    id: 'tn-motion', level: 'school', authorId: 'teacher-kamrul', author: 'Md. Kamrul Hasan', initials: 'KH',
    title: { en: 'Motion graphs in one lesson', bn: 'এক পাঠে গতির লেখচিত্র' },
    subject: { en: 'Physics · Class 9–10', bn: 'পদার্থবিজ্ঞান · ৯ম–১০ম শ্রেণি' },
    pages: 6, rating: 4.7, ratings: 118, status: 'reviewed', createdAt: '2026-10-04',
  },
  {
    id: 'tn-graphs', level: 'university', authorId: 'teacher-mahbub', author: 'Dr. Mahbubur Rahman', initials: 'MR',
    title: { en: 'CSE-2201 Lecture 9: shortest paths', bn: 'সিএসই-২২০১ লেকচার ৯: শর্টেস্ট পাথ' },
    subject: { en: 'CSE-2201 · Algorithms', bn: 'সিএসই-২২০১ · অ্যালগরিদম' },
    pages: 24, rating: 4.8, ratings: 87, status: 'reviewed', createdAt: '2026-10-08',
  },
]

// Free publisher copies offered to teachers, by book id in books.js
export const teacherCopies = { school: ['bk-physics'], university: ['bk-algo'] }

// Research topics posted by the university teacher. Stipend is per month, in taka.
export const researchTopics = [
  {
    id: 'rt-leaf-edge',
    title: { en: 'Rice leaf disease detection that runs offline on low-cost phones', bn: 'কম দামি ফোনে অফলাইনে চলা ধানপাতার রোগ শনাক্তকরণ' },
    description: {
      en: 'Compress a leaf disease model so it runs under 200 ms on a ৳10,000 Android phone, and test it with photos from Rangpur fields.',
      bn: 'পাতার রোগ শনাক্তের মডেলকে এমনভাবে ছোট করা, যাতে ৳১০,০০০ দামের অ্যান্ড্রয়েড ফোনে ২০০ ms-এর কম সময়ে চলে, এবং রংপুরের মাঠের ছবি দিয়ে তা যাচাই করা।',
    },
    skills: ['Python', 'Machine learning', 'OpenCV'],
    seats: 2,
    stipend: 8000,
    postedAt: '2026-10-02',
    applicants: ['st-sadia', 'st-nusrat', 'st-tasnim'],
    invited: [],
  },
  {
    id: 'rt-bangla-omr',
    title: { en: 'Bangla handwritten digit reading for OMR roll numbers', bn: 'ওএমআর রোল নম্বরের হাতে লেখা বাংলা অঙ্ক পড়া' },
    description: {
      en: 'Build a dataset of handwritten Bangla roll numbers from school OMR sheets and train a reader that flags low-confidence digits for a teacher to check.',
      bn: 'স্কুলের ওএমআর শিট থেকে হাতে লেখা বাংলা রোল নম্বরের ডেটাসেট তৈরি করা এবং এমন একটি রিডার প্রশিক্ষণ দেওয়া, যা অনিশ্চিত অঙ্কগুলো শিক্ষকের যাচাইয়ের জন্য চিহ্নিত করবে।',
    },
    skills: ['Python', 'Basic AI', 'Data cleaning'],
    seats: 1,
    stipend: 6000,
    postedAt: '2026-10-11',
    applicants: ['st-nusrat', 'st-priya'],
    invited: [],
  },
]
