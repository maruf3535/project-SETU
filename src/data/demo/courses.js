// Courses: playlists of video lectures made by government-verified students, teachers and industry.
// Every new course is checked by the government review team first. status: review | live | returned.
// Text that differs by language is { en, bn }; text a creator typed in the demo may be a plain string.
//
// topic: { kind: 'subject', subject, classId? } (classId keys into curriculum.js; without it the label comes
// from SUBJECT_LABELS) or { kind: 'skill', skill } (a skill name as used in talent.js).
// level: the catalog filter: school | college | admission | university | skills.
// base*: numbers from before this demo, so the cards and dashboards are not empty.

const s = (en, bn) => ({ en, bn })

export const COURSE_LEVELS = ['school', 'college', 'admission', 'university', 'skills']

// SETU keeps this share of every sale
export const PLATFORM_FEE_PERCENT = 10
// Lectures a paid course can open as a free preview
export const MAX_PREVIEWS = 2
// Learners can rate once they have watched this share of the lectures
export const RATE_AFTER = 0.5
// A student may teach a subject with a practice score at least this high (or a verified skill)
export const COURSE_QUALIFY_SCORE = 80
export const MIN_LECTURES = 2
export const MAX_LECTURES = 20
export const MIN_PRICE = 20

// One shared sample video stands in for every lecture, like the single sample PDF for books
export const SAMPLE_VIDEO = 'videos/sample.mp4'

// Labels for practice-score subjects (reviewerPool scores in reviews.js)
export const SUBJECT_LABELS = {
  physics: s('Physics', 'পদার্থবিজ্ঞান'),
  chemistry: s('Chemistry', 'রসায়ন'),
  biology: s('Biology', 'জীববিজ্ঞান'),
  math: s('Mathematics', 'গণিত'),
  bangla: s('Bangla', 'বাংলা'),
  ict: s('ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি'),
  algorithms: s('Algorithms', 'অ্যালগরিদম'),
}

// Suggestions for skill courses; creators can also type their own
export const SKILL_SUGGESTIONS = [
  'Python', 'Excel', 'Canva', 'Graphic design', 'Web development', 'UI design', 'Machine learning', 'OpenCV',
  'Data cleaning', 'Data visualisation', 'Power BI', 'Field survey', 'Technical writing', 'Bangla translation',
]

const lectures = (courseId, list) =>
  list.map(([en, bn, minutes, preview = false], i) => ({ id: `${courseId}-l${i + 1}`, title: s(en, bn), minutes, preview }))

export const courses = [
  {
    id: 'crs-ssc-physics',
    creatorId: 'teacher-kamrul', creatorRole: 'teacher', creatorName: 'Md. Kamrul Hasan', creatorInitials: 'KH',
    level: 'school', topic: { kind: 'subject', classId: 'class9_10', subject: 'physics' },
    title: s('SSC Physics: Motion & Force, chapter by chapter', 'এসএসসি পদার্থবিজ্ঞান: গতি ও বল, অধ্যায় ধরে ধরে'),
    about: s(
      'Short classroom-style lectures on Chapters 2 and 3 of the NCTB Physics book, with board questions solved on the board after each idea.',
      'এনসিটিবি পদার্থবিজ্ঞান বইয়ের অধ্যায় ২ ও ৩ নিয়ে ক্লাসরুমের মতো ছোট লেকচার; প্রতিটি ধারণার পর বোর্ড প্রশ্ন সমাধান।',
    ),
    price: 0, cover: 'teal', status: 'live',
    submittedAt: '2026-09-02T10:00:00', reviewedAt: '2026-09-03T12:00:00',
    baseEnrolled: 1840, baseSales: 0, baseRating: { avg: 4.8, count: 212 },
    lectures: lectures('crs-ssc-physics', [
      ['Rest, motion and reference frames', 'স্থিতি, গতি ও প্রসঙ্গ কাঠামো', 14],
      ['Speed, velocity and acceleration', 'দ্রুতি, বেগ ও ত্বরণ', 18],
      ['Equations of motion, solved problems', 'গতির সমীকরণ, সমাধানকৃত সমস্যা', 22],
      ['Newton’s first and second laws', 'নিউটনের প্রথম ও দ্বিতীয় সূত্র', 16],
      ['Momentum and the third law', 'ভরবেগ ও তৃতীয় সূত্র', 15],
      ['Board creative questions, 2019–2025', 'বোর্ডের সৃজনশীল প্রশ্ন, ২০১৯–২০২৫', 25],
    ]),
  },
  {
    id: 'crs-admission-physics',
    creatorId: 'teacher-kamrul', creatorRole: 'teacher', creatorName: 'Md. Kamrul Hasan', creatorInitials: 'KH',
    level: 'admission', topic: { kind: 'subject', classId: 'admission', subject: 'engineering' },
    title: s('Admission Physics: 60 problems that keep coming back', 'ভর্তি পদার্থবিজ্ঞান: বারবার আসা ৬০টি সমস্যা'),
    about: s(
      'The physics problems asked most often in BUET, CKRUET and DU science-unit tests since 2015, solved with shortcuts you can use in the exam hall.',
      '২০১৫ থেকে বুয়েট, চুয়েট-কুয়েট-রুয়েট ও ঢাবি বিজ্ঞান ইউনিটে সবচেয়ে বেশি আসা পদার্থবিজ্ঞানের সমস্যা, পরীক্ষার হলে কাজে লাগার মতো শর্টকাটসহ।',
    ),
    price: 250, cover: 'amber', status: 'live',
    submittedAt: '2026-08-20T09:00:00', reviewedAt: '2026-08-22T11:00:00',
    baseEnrolled: 410, baseSales: 410, baseRating: { avg: 4.7, count: 64 },
    lectures: lectures('crs-admission-physics', [
      ['How admission physics is marked', 'ভর্তি পরীক্ষায় পদার্থবিজ্ঞানের নম্বর যেভাবে দেওয়া হয়', 9, true],
      ['Vectors and projectiles', 'ভেক্টর ও প্রক্ষেপক', 28, true],
      ['Work, energy and power', 'কাজ, শক্তি ও ক্ষমতা', 26],
      ['Gravitation and satellites', 'মহাকর্ষ ও কৃত্রিম উপগ্রহ', 24],
      ['Current electricity', 'চল তড়িৎ', 30],
      ['Waves and sound', 'তরঙ্গ ও শব্দ', 22],
      ['Modern physics quick set', 'আধুনিক পদার্থবিজ্ঞানের দ্রুত সেট', 27],
    ]),
  },
  {
    id: 'crs-algo-graphs',
    creatorId: 'teacher-mahbub', creatorRole: 'teacher', creatorName: 'Dr. Mahbubur Rahman', creatorInitials: 'MR',
    level: 'university', topic: { kind: 'subject', classId: 'university', subject: 'cse' },
    title: s('Graph algorithms with worked examples', 'উদাহরণসহ গ্রাফ অ্যালগরিদম'),
    about: s(
      'BFS, DFS, shortest paths and minimum spanning trees, traced by hand on small graphs before any code. Follows the CSE-2201 outline used at most public universities.',
      'কোড লেখার আগে ছোট গ্রাফে হাতে-কলমে BFS, DFS, শর্টেস্ট পাথ ও মিনিমাম স্প্যানিং ট্রি। বেশিরভাগ পাবলিক বিশ্ববিদ্যালয়ের সিএসই-২২০১ রূপরেখা অনুযায়ী।',
    ),
    price: 0, cover: 'mist', status: 'live',
    submittedAt: '2026-07-14T10:00:00', reviewedAt: '2026-07-15T16:00:00',
    baseEnrolled: 960, baseSales: 0, baseRating: { avg: 4.9, count: 133 },
    lectures: lectures('crs-algo-graphs', [
      ['Graphs and how to store them', 'গ্রাফ ও তা সংরক্ষণের উপায়', 21],
      ['Breadth-first search', 'ব্রেডথ-ফার্স্ট সার্চ', 24],
      ['Depth-first search and topological sort', 'ডেপথ-ফার্স্ট সার্চ ও টপোলজিক্যাল সর্ট', 27],
      ['Dijkstra’s algorithm', 'ডায়াকস্ট্রার অ্যালগরিদম', 31],
      ['Bellman–Ford and negative edges', 'বেলম্যান–ফোর্ড ও ঋণাত্মক এজ', 23],
      ['Kruskal and Prim', 'ক্রুসকাল ও প্রিম', 29],
    ]),
  },
  {
    id: 'crs-canva-school',
    creatorId: 'st-rahim', creatorRole: 'student', creatorName: 'Rahim Uddin', creatorInitials: 'RU',
    level: 'skills', topic: { kind: 'skill', skill: 'Canva' },
    title: s('Canva for school posters and projects', 'স্কুলের পোস্টার ও প্রজেক্টের জন্য ক্যানভা'),
    about: s(
      'How I made the poster that won our district science fair: layouts, Bangla fonts, free images and printing on a small budget. Made for Class 6–10 students.',
      'জেলা বিজ্ঞান মেলায় প্রথম হওয়া পোস্টারটি যেভাবে বানিয়েছি: লেআউট, বাংলা ফন্ট, ফ্রি ছবি ও কম খরচে প্রিন্ট। ৬ষ্ঠ–১০ম শ্রেণির শিক্ষার্থীদের জন্য।',
    ),
    price: 60, cover: 'amber', status: 'live',
    submittedAt: '2026-09-18T19:00:00', reviewedAt: '2026-09-20T10:00:00',
    baseEnrolled: 320, baseSales: 318, baseRating: { avg: 4.6, count: 41 },
    lectures: lectures('crs-canva-school', [
      ['A tour of Canva on a phone', 'ফোনে ক্যানভার পরিচিতি', 8, true],
      ['Layouts that are easy to read', 'সহজে পড়া যায় এমন লেআউট', 11],
      ['Writing in Bangla with good fonts', 'ভালো ফন্টে বাংলায় লেখা', 9],
      ['Free photos and icons, used fairly', 'ফ্রি ছবি ও আইকন, নিয়ম মেনে', 10],
      ['Printing your poster cheaply', 'কম খরচে পোস্টার প্রিন্ট', 7],
    ]),
  },
  {
    id: 'crs-hsc-mole',
    creatorId: 'st-tasnim', creatorRole: 'student', creatorName: 'Tasnim Ferdous', creatorInitials: 'TF',
    level: 'college', topic: { kind: 'subject', subject: 'chemistry' },
    title: s('HSC Chemistry: Mole concept made easy', 'এইচএসসি রসায়ন: সহজে মোল ধারণা'),
    about: s(
      'Mole, molar mass, concentration and stoichiometry explained by a student who scored 91% in SETU practice exams, with the shortcuts that helped me.',
      'সেতুর অনুশীলনী পরীক্ষায় ৯১% পাওয়া এক শিক্ষার্থীর ব্যাখ্যায় মোল, মোলার ভর, ঘনমাত্রা ও স্টয়কিওমিতি, সাথে আমার কাজে লাগা শর্টকাট।',
    ),
    price: 80, cover: 'teal', status: 'live',
    submittedAt: '2026-09-25T21:00:00', reviewedAt: '2026-09-27T09:30:00',
    baseEnrolled: 540, baseSales: 536, baseRating: { avg: 4.7, count: 77 },
    lectures: lectures('crs-hsc-mole', [
      ['What a mole really is', 'মোল আসলে কী', 12, true],
      ['Grams ⇄ moles ⇄ particles', 'গ্রাম ⇄ মোল ⇄ কণা', 15, true],
      ['Molarity and molality', 'মোলারিটি ও মোলালিটি', 14],
      ['Balancing and stoichiometry', 'সমতাকরণ ও স্টয়কিওমিতি', 18],
      ['Limiting reagent problems', 'লিমিটিং বিক্রিয়ক সমস্যা', 16],
      ['Board and admission questions', 'বোর্ড ও ভর্তি প্রশ্ন', 20],
    ]),
  },
  {
    id: 'crs-python-zero',
    creatorId: 'st-nusrat', creatorRole: 'student', creatorName: 'Nusrat Akter', creatorInitials: 'NA',
    level: 'skills', topic: { kind: 'skill', skill: 'Python' },
    title: s('Python from zero, in Bangla', 'শূন্য থেকে পাইথন, বাংলায়'),
    about: s(
      'Eight hands-on lessons for complete beginners. Every lesson ends with a small task you can run in a free online editor, no laptop needed.',
      'একেবারে নতুনদের জন্য আটটি হাতে-কলমে পাঠ। প্রতিটি পাঠ শেষে একটি ছোট কাজ, যা ফ্রি অনলাইন এডিটরে চালানো যায়; ল্যাপটপ লাগবে না।',
    ),
    price: 150, cover: 'teal', status: 'live',
    submittedAt: '2026-08-05T20:00:00', reviewedAt: '2026-08-07T10:00:00',
    baseEnrolled: 1320, baseSales: 1290, baseRating: { avg: 4.8, count: 186 },
    lectures: lectures('crs-python-zero', [
      ['Why Python, and how to run it on a phone', 'কেন পাইথন, আর ফোনে কীভাবে চালাবে', 10, true],
      ['Variables, numbers and text', 'ভেরিয়েবল, সংখ্যা ও টেক্সট', 16],
      ['Making decisions with if', 'if দিয়ে সিদ্ধান্ত নেওয়া', 14],
      ['Loops that do the boring work', 'লুপ দিয়ে একঘেয়ে কাজ', 17],
      ['Lists and dictionaries', 'লিস্ট ও ডিকশনারি', 19],
      ['Functions', 'ফাংশন', 15],
      ['Reading a CSV of exam marks', 'পরীক্ষার নম্বরের CSV পড়া', 21],
      ['Mini project: result calculator', 'মিনি প্রজেক্ট: ফলাফল ক্যালকুলেটর', 24],
    ]),
  },
  {
    id: 'crs-excel-farm',
    creatorId: 'agrosense', creatorRole: 'industry', creatorName: 'AgroSense Ltd.', creatorInitials: 'AS',
    level: 'skills', topic: { kind: 'skill', skill: 'Excel' },
    title: s('Excel for farm survey data', 'খামার জরিপের ডেটার জন্য এক্সেল'),
    about: s(
      'The exact Excel steps our field team uses to clean and summarise farmer surveys. Free training for students who want to work on our data challenges.',
      'কৃষক জরিপ পরিষ্কার ও সারসংক্ষেপ করতে আমাদের মাঠ-দল এক্সেলের যে ধাপগুলো ব্যবহার করে। আমাদের ডেটা চ্যালেঞ্জে কাজ করতে চাওয়া শিক্ষার্থীদের জন্য বিনামূল্যে প্রশিক্ষণ।',
    ),
    price: 0, cover: 'mist', status: 'live',
    submittedAt: '2026-09-08T11:00:00', reviewedAt: '2026-09-09T15:00:00',
    baseEnrolled: 610, baseSales: 0, baseRating: { avg: 4.5, count: 58 },
    lectures: lectures('crs-excel-farm', [
      ['Opening a raw survey export', 'জরিপের কাঁচা ফাইল খোলা', 9],
      ['Cleaning names, dates and units', 'নাম, তারিখ ও একক পরিষ্কার করা', 17],
      ['Pivot tables by district and crop', 'জেলা ও ফসল ধরে পিভট টেবিল', 19],
      ['Charts a manager can read in 10 seconds', '১০ সেকেন্ডে বোঝা যায় এমন চার্ট', 13],
    ]),
  },
  {
    id: 'crs-ml-mango',
    creatorId: 'st-sadia', creatorRole: 'student', creatorName: 'Sadia Mahmud', creatorInitials: 'SM',
    level: 'university', topic: { kind: 'skill', skill: 'Machine learning' },
    title: s('Machine learning project: a mango ripeness detector', 'মেশিন লার্নিং প্রজেক্ট: আমের পাকা শনাক্তকারী'),
    about: s(
      'Build the mango ripeness detector from my RUET project step by step: collecting photos, labelling, training a small model and testing it in a Rajshahi market.',
      'আমার রুয়েট প্রজেক্টের আমের পাকা শনাক্তকারী ধাপে ধাপে বানাও: ছবি সংগ্রহ, লেবেলিং, ছোট মডেল ট্রেনিং ও রাজশাহীর বাজারে পরীক্ষা।',
    ),
    price: 200, cover: 'amber', status: 'review',
    submittedAt: '2026-10-27T10:00:00',
    baseEnrolled: 0, baseSales: 0, baseRating: { avg: 0, count: 0 },
    lectures: lectures('crs-ml-mango', [
      ['The problem and the plan', 'সমস্যা ও পরিকল্পনা', 8, true],
      ['Collecting and labelling 1,200 photos', '১,২০০ ছবি সংগ্রহ ও লেবেলিং', 18],
      ['Colour features with OpenCV', 'ওপেনসিভি দিয়ে রঙের বৈশিষ্ট্য', 22],
      ['Training a small classifier', 'ছোট ক্লাসিফায়ার ট্রেনিং', 26],
      ['Testing in a real market', 'আসল বাজারে পরীক্ষা', 15],
    ]),
  },
  {
    id: 'crs-web-first',
    creatorId: 'st-tanjim', creatorRole: 'student', creatorName: 'Tanjim Rahman', creatorInitials: 'TR',
    level: 'skills', topic: { kind: 'skill', skill: 'Web development' },
    title: s('Build your first website with HTML & CSS', 'এইচটিএমএল ও সিএসএস দিয়ে প্রথম ওয়েবসাইট'),
    about: s(
      'We rebuild the tea-garden school website I made for a client: page structure, styling for phones, and putting it online for free.',
      'একটি ক্লায়েন্টের জন্য বানানো চা-বাগান স্কুলের ওয়েবসাইটটি আবার বানাব: পেজের কাঠামো, ফোনের জন্য স্টাইল এবং বিনামূল্যে অনলাইনে তোলা।',
    ),
    price: 120, cover: 'teal', status: 'review',
    submittedAt: '2026-10-28T15:30:00',
    baseEnrolled: 0, baseSales: 0, baseRating: { avg: 0, count: 0 },
    lectures: lectures('crs-web-first', [
      ['How a web page is put together', 'একটি ওয়েব পেজ যেভাবে তৈরি', 11, true],
      ['Headings, text, images and links', 'হেডিং, লেখা, ছবি ও লিংক', 16],
      ['CSS colours, fonts and spacing', 'সিএসএস রং, ফন্ট ও স্পেসিং', 18],
      ['Layouts that work on phones', 'ফোনে ঠিকঠাক চলা লেআউট', 20],
      ['Publishing on a free host', 'ফ্রি হোস্টে প্রকাশ', 12],
    ]),
  },
  {
    id: 'crs-field-survey',
    creatorId: 'agrosense', creatorRole: 'industry', creatorName: 'AgroSense Ltd.', creatorInitials: 'AS',
    level: 'skills', topic: { kind: 'skill', skill: 'Field survey' },
    title: s('Field surveys with a smartphone', 'স্মার্টফোনে মাঠ জরিপ'),
    about: s(
      'How to plan a village survey, ask questions without leading the farmer, and record answers offline in a phone form.',
      'গ্রামের জরিপ পরিকল্পনা, কৃষককে প্রভাবিত না করে প্রশ্ন করা এবং ফোনের ফর্মে অফলাইনে উত্তর লেখার উপায়।',
    ),
    price: 100, cover: 'mist', status: 'returned',
    submittedAt: '2026-10-21T12:00:00', reviewedAt: '2026-10-24T11:00:00',
    reviewNote: s(
      'Lecture 3 shows real farmers’ phone numbers on screen. Blur them and resubmit.',
      'লেকচার ৩-এ পর্দায় প্রকৃত কৃষকদের ফোন নম্বর দেখা যাচ্ছে। ঝাপসা করে আবার জমা দিন।',
    ),
    baseEnrolled: 0, baseSales: 0, baseRating: { avg: 0, count: 0 },
    lectures: lectures('crs-field-survey', [
      ['Planning who and where to survey', 'কাকে ও কোথায় জরিপ করবে', 12, true],
      ['Asking fair questions', 'নিরপেক্ষ প্রশ্ন করা', 15],
      ['Recording answers in an offline form', 'অফলাইন ফর্মে উত্তর লেখা', 14],
      ['Checking your data the same evening', 'সেই সন্ধ্যায় ডেটা যাচাই', 10],
    ]),
  },
]

// Enrollments before this demo for the switchable demo users, so My courses has something in it
export const enrollments = [
  { courseId: 'crs-ssc-physics', userId: 'st-rahim', paid: 0, pointsUsed: 0, at: '2026-10-02T18:00:00' },
  { courseId: 'crs-python-zero', userId: 'st-tasnim', paid: 150, pointsUsed: 0, at: '2026-10-10T20:00:00' },
  { courseId: 'crs-algo-graphs', userId: 'st-nusrat', paid: 0, pointsUsed: 0, at: '2026-09-12T21:00:00' },
  { courseId: 'crs-excel-farm', userId: 'st-nusrat', paid: 0, pointsUsed: 0, at: '2026-10-15T19:00:00' },
]

// Lectures watched per `${userId}:${courseId}`
export const watched = {
  'st-rahim:crs-ssc-physics': ['crs-ssc-physics-l1', 'crs-ssc-physics-l2', 'crs-ssc-physics-l3'],
  'st-tasnim:crs-python-zero': ['crs-python-zero-l1', 'crs-python-zero-l2'],
  'st-nusrat:crs-algo-graphs': ['crs-algo-graphs-l1', 'crs-algo-graphs-l2', 'crs-algo-graphs-l3', 'crs-algo-graphs-l4', 'crs-algo-graphs-l5'],
}

// A few written ratings to show on course pages; the rest of each course's rating is in baseRating
export const ratings = [
  { id: 'rt-1', courseId: 'crs-ssc-physics', userId: 'x-afsana', name: 'Afsana Rahman', initials: 'AR', role: 'student', stars: 5, comment: s('The board questions at the end of each lecture are gold.', 'প্রতিটি লেকচারের শেষে বোর্ড প্রশ্নগুলো অসাধারণ।'), at: '2026-10-12T20:00:00' },
  { id: 'rt-2', courseId: 'crs-ssc-physics', userId: 'x-tanvir', name: 'Tanvir Hossain', initials: 'TH', role: 'student', stars: 4, comment: s('Clear and slow enough to follow. Wish there was a chapter on pressure.', 'পরিষ্কার এবং বোঝার মতো ধীর। চাপ অধ্যায়টাও থাকলে ভালো হতো।'), at: '2026-10-05T21:00:00' },
  { id: 'rt-3', courseId: 'crs-python-zero', userId: 'x-mim', name: 'Mim Akter', initials: 'MA', role: 'student', stars: 5, comment: s('I did every task on my phone. The result calculator project was fun.', 'সব কাজ ফোনেই করেছি। ফলাফল ক্যালকুলেটর প্রজেক্টটা মজার ছিল।'), at: '2026-10-18T22:00:00' },
  { id: 'rt-4', courseId: 'crs-algo-graphs', userId: 'st-nusrat', name: 'Nusrat Akter', initials: 'NA', role: 'student', stars: 5, comment: s('Tracing Dijkstra by hand first finally made it click.', 'আগে হাতে ডায়াকস্ট্রা ট্রেস করায় অবশেষে বুঝতে পেরেছি।'), at: '2026-10-01T20:00:00' },
  { id: 'rt-5', courseId: 'crs-hsc-mole', userId: 'x-farhan', name: 'Farhan Ishraq', initials: 'FI', role: 'student', stars: 5, comment: s('Explained like a friend, not like a guide book.', 'গাইড বইয়ের মতো নয়, বন্ধুর মতো বুঝিয়েছে।'), at: '2026-10-14T19:00:00' },
  { id: 'rt-6', courseId: 'crs-canva-school', userId: 'x-nabila', name: 'Nabila Sultana', initials: 'NS', role: 'student', stars: 4, comment: s('The Bangla font tips saved my class project.', 'বাংলা ফন্টের টিপসগুলো আমার ক্লাস প্রজেক্ট বাঁচিয়েছে।'), at: '2026-10-09T18:00:00' },
  { id: 'rt-7', courseId: 'crs-excel-farm', userId: 'x-raisa', name: 'Raisa Noor', initials: 'RN', role: 'student', stars: 5, comment: s('Real data, real steps. Pivot tables make sense now.', 'আসল ডেটা, আসল ধাপ। পিভট টেবিল এখন বুঝি।'), at: '2026-10-20T17:00:00' },
]

// Class sections the demo students sit in, so a teacher's course assignment reaches them
export const studentSections = {
  'st-rahim': { teacherId: 'teacher-kamrul', sectionId: '10b' },
  'st-nusrat': { teacherId: 'teacher-mahbub', sectionId: 'cse2201a' },
}

// Teachers pointing class sections to courses: { courseId, teacherId, sectionId, at }
export const assignments = [
  { courseId: 'crs-ssc-physics', teacherId: 'teacher-kamrul', sectionId: '10b', at: '2026-10-03T09:00:00' },
  { courseId: 'crs-ssc-physics', teacherId: 'teacher-kamrul', sectionId: '10a', at: '2026-10-03T09:00:00' },
  { courseId: 'crs-algo-graphs', teacherId: 'teacher-mahbub', sectionId: 'cse2201a', at: '2026-09-10T10:00:00' },
  { courseId: 'crs-python-zero', teacherId: 'teacher-mahbub', sectionId: 'cse2201a', at: '2026-10-12T10:00:00' },
]
