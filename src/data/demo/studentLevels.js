// What changes when the student portal's level switcher moves. Each level is a different demo student.
// `chapters` and `subjects` map keys used in the question bank to display names.
export const LEVELS = ['school', 'college', 'university']

export const studentLevels = {
  school: {
    studentId: 'st-rahim',
    points: 640,
    streak: 4,
    curriculum: { en: 'NCTB · Class 9–10 (SSC)', bn: 'এনসিটিবি · ৯ম–১০ম শ্রেণি (এসএসসি)' },
    subjects: {
      physics: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
    },
    chapters: {
      motion: { en: 'Ch 2 · Motion', bn: 'অধ্যায় ২ · গতি' },
      force: { en: 'Ch 3 · Force', bn: 'অধ্যায় ৩ · বল' },
      work: { en: 'Ch 4 · Work, power & energy', bn: 'অধ্যায় ৪ · কাজ, ক্ষমতা ও শক্তি' },
    },
    continue: { title: { en: 'Physics · Newton’s laws', bn: 'পদার্থবিজ্ঞান · নিউটনের সূত্র' }, done: 12, total: 20 },
    alert: {
      title: { en: 'Physics · Newton’s second law', bn: 'পদার্থবিজ্ঞান · নিউটনের দ্বিতীয় সূত্র' },
      body: { en: 'Appeared in 8 of the last 10 board exams', bn: 'গত ১০টি বোর্ড পরীক্ষার ৮টিতে এসেছে' },
    },
    exam: { title: { en: 'Physics · Motion & force', bn: 'পদার্থবিজ্ঞান · গতি ও বল' } },
    tutor: [
      {
        q: { en: 'Explain Newton’s second law with an example', bn: 'উদাহরণসহ নিউটনের দ্বিতীয় সূত্র ব্যাখ্যা করো' },
        a: {
          en: 'Newton’s second law says the rate of change of momentum equals the force applied, so F = ma.\n\nExample: push a 5 kg trolley with 20 N on a smooth floor. Its acceleration is a = F/m = 20/5 = 4 m/s². Push twice as hard and it speeds up twice as fast; load it twice as heavy and it speeds up half as fast.',
          bn: 'নিউটনের দ্বিতীয় সূত্র বলে, ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমান, তাই F = ma।\n\nউদাহরণ: মসৃণ মেঝেতে ৫ kg ভরের ট্রলিকে ২০ N বলে ধাক্কা দিলে ত্বরণ a = F/m = ২০/৫ = ৪ m/s²। দ্বিগুণ বল দিলে দ্বিগুণ দ্রুত বেগ বাড়বে; ভর দ্বিগুণ হলে অর্ধেক দ্রুত।',
        },
        cite: { en: 'Physics, Class 9–10 (NCTB) · Ch 3 · p. 47', bn: 'পদার্থবিজ্ঞান, ৯ম–১০ম শ্রেণি (এনসিটিবি) · অধ্যায় ৩ · পৃ. ৪৭' },
      },
      {
        q: { en: 'What is the difference between speed and velocity?', bn: 'দ্রুতি ও বেগের পার্থক্য কী?' },
        a: {
          en: 'Speed tells you how fast something moves; it has only magnitude (a scalar). Velocity tells you how fast and in which direction; it has magnitude and direction (a vector).\n\nA bus going round a roundabout at a steady 30 km/h has constant speed, but its velocity keeps changing because its direction changes.',
          bn: 'দ্রুতি বলে কোনো বস্তু কত জোরে চলছে; এর শুধু মান আছে (স্কেলার)। বেগ বলে কত জোরে ও কোন দিকে; এর মান ও দিক দুটোই আছে (ভেক্টর)।\n\nগোলচত্বরে ৩০ km/h স্থির দ্রুতিতে ঘোরা বাসের দ্রুতি ধ্রুব, কিন্তু দিক বদলায় বলে বেগ বদলাতে থাকে।',
        },
        cite: { en: 'Physics, Class 9–10 (NCTB) · Ch 2 · p. 24', bn: 'পদার্থবিজ্ঞান, ৯ম–১০ম শ্রেণি (এনসিটিবি) · অধ্যায় ২ · পৃ. ২৪' },
      },
      {
        q: { en: 'Give me a board-style creative question on work and energy', bn: 'কাজ ও শক্তি নিয়ে একটি বোর্ড-প্যাটার্নের সৃজনশীল প্রশ্ন দাও' },
        a: {
          en: 'Stem: Rafiq lifts a 20 kg sack of rice to a 1.5 m high shelf in 3 s (g = 9.8 m/s²).\n(a) What is power? (1)\n(b) Why is no work done when you push a wall? (2)\n(c) Find the work Rafiq does. (3)\n(d) Would his power change if he took 6 s? Explain with calculation. (4)',
          bn: 'উদ্দীপক: রফিক ২০ kg-এর একটি চালের বস্তা ৩ s-এ ১.৫ m উঁচু তাকে তোলে (g = ৯.৮ m/s²)।\n(ক) ক্ষমতা কী? (১)\n(খ) দেয়াল ধাক্কা দিলে কাজ হয় না কেন? (২)\n(গ) রফিকের কৃতকাজ নির্ণয় করো। (৩)\n(ঘ) ৬ s সময় নিলে তার ক্ষমতা কি বদলাবে? গাণিতিকভাবে ব্যাখ্যা করো। (৪)',
        },
        cite: { en: 'Pattern from Dhaka, Rajshahi & Cumilla boards 2019–2024', bn: 'ঢাকা, রাজশাহী ও কুমিল্লা বোর্ড ২০১৯–২০২৪ অনুসারে' },
      },
    ],
  },
  college: {
    studentId: 'st-tasnim',
    points: 820,
    streak: 9,
    curriculum: { en: 'NCTB · HSC Science', bn: 'এনসিটিবি · এইচএসসি বিজ্ঞান' },
    subjects: {
      chemistry: { en: 'Chemistry', bn: 'রসায়ন' },
    },
    chapters: {
      mole: { en: 'Mole concept', bn: 'মোল ধারণা' },
      gas: { en: 'Gases', bn: 'গ্যাস' },
      solution: { en: 'Solution concentration', bn: 'দ্রবণের ঘনমাত্রা' },
      stoich: { en: 'Stoichiometry', bn: 'স্টয়কিওমিতি' },
    },
    continue: { title: { en: 'Chemistry · Mole concept', bn: 'রসায়ন · মোল ধারণা' }, done: 15, total: 24 },
    alert: {
      title: { en: 'Chemistry · Mole concept', bn: 'রসায়ন · মোল ধারণা' },
      body: { en: 'Appeared in 8 of the last 10 board exams and in DU admission 2022', bn: 'গত ১০টি বোর্ড পরীক্ষার ৮টিতে ও ঢাবি ভর্তি ২০২২-এ এসেছে' },
    },
    exam: { title: { en: 'Chemistry · Quantitative chemistry', bn: 'রসায়ন · পরিমাণগত রসায়ন' } },
    tutor: [
      {
        q: { en: 'How do I convert grams to moles?', bn: 'গ্রামকে মোলে কীভাবে রূপান্তর করব?' },
        a: {
          en: 'Divide the mass by the molar mass: n = m / M.\n\nExample: 22 g of CO₂. M = 12 + 2 × 16 = 44 g/mol, so n = 22 / 44 = 0.5 mol. To go back, multiply: m = n × M.',
          bn: 'ভরকে মোলার ভর দিয়ে ভাগ করো: n = m / M।\n\nউদাহরণ: ২২ g CO₂। M = ১২ + ২ × ১৬ = ৪৪ g/mol, তাই n = ২২ / ৪৪ = ০.৫ মোল। উল্টো করতে গুণ করো: m = n × M।',
        },
        cite: { en: 'Chemistry 1st paper, HSC (NCTB) · Ch 3 · p. 112', bn: 'রসায়ন ১ম পত্র, এইচএসসি (এনসিটিবি) · অধ্যায় ৩ · পৃ. ১১২' },
      },
      {
        q: { en: 'Molarity vs molality — when do I use which?', bn: 'মোলারিটি ও মোলালিটি — কখন কোনটি ব্যবহার করব?' },
        a: {
          en: 'Molarity (M) = moles of solute per litre of solution. Use it for titrations and lab work at room temperature.\n\nMolality (m) = moles of solute per kilogram of solvent. It does not change with temperature, so use it for boiling-point and freezing-point questions.',
          bn: 'মোলারিটি (M) = প্রতি লিটার দ্রবণে দ্রবের মোল। কক্ষ তাপমাত্রায় টাইট্রেশন ও ল্যাবের কাজে ব্যবহার করো।\n\nমোলালিটি (m) = প্রতি কিলোগ্রাম দ্রাবকে দ্রবের মোল। তাপমাত্রায় বদলায় না, তাই স্ফুটনাঙ্ক ও হিমাঙ্কের প্রশ্নে ব্যবহার করো।',
        },
        cite: { en: 'Chemistry 2nd paper, HSC (NCTB) · Ch 3 · p. 98', bn: 'রসায়ন ২য় পত্র, এইচএসসি (এনসিটিবি) · অধ্যায় ৩ · পৃ. ৯৮' },
      },
      {
        q: { en: 'Which chemistry topics come most in admission tests?', bn: 'ভর্তি পরীক্ষায় রসায়নের কোন অধ্যায় বেশি আসে?' },
        a: {
          en: 'Across DU, BUET and medical admission papers from 2019 to 2024, the most frequent topics were:\n1. Mole concept and stoichiometry\n2. Solution concentration\n3. Organic reaction mechanisms\n4. Periodic properties\n\nStart with the first two; they also carry the most marks in HSC.',
          bn: '২০১৯ থেকে ২০২৪ সালের ঢাবি, বুয়েট ও মেডিকেল ভর্তি প্রশ্নে সবচেয়ে বেশি এসেছে:\n১. মোল ধারণা ও স্টয়কিওমিতি\n২. দ্রবণের ঘনমাত্রা\n৩. জৈব বিক্রিয়ার কৌশল\n৪. পর্যায়বৃত্ত ধর্ম\n\nপ্রথম দুটি দিয়ে শুরু করো; এইচএসসিতেও এগুলোতে নম্বর বেশি।',
        },
        cite: { en: 'Analysis of 36 admission papers, 2019–2024', bn: '২০১৯–২০২৪ সালের ৩৬টি ভর্তি প্রশ্নের বিশ্লেষণ' },
      },
    ],
  },
  university: {
    studentId: 'st-nusrat',
    points: 1240,
    streak: 6,
    curriculum: { en: 'University of Dhaka · CSE', bn: 'ঢাকা বিশ্ববিদ্যালয় · সিএসই' },
    subjects: {
      algorithms: { en: 'CSE-2201 Algorithms', bn: 'সিএসই-২২০১ অ্যালগরিদম' },
    },
    chapters: {
      analysis: { en: 'Asymptotic analysis', bn: 'অ্যাসিম্পটোটিক বিশ্লেষণ' },
      sorting: { en: 'Sorting', bn: 'সর্টিং' },
      graphs: { en: 'Graph algorithms', bn: 'গ্রাফ অ্যালগরিদম' },
    },
    continue: { title: { en: 'CSE-2201 · Graph algorithms', bn: 'সিএসই-২২০১ · গ্রাফ অ্যালগরিদম' }, done: 7, total: 12 },
    alert: {
      title: { en: 'CSE-2201 · Dijkstra & MST', bn: 'সিএসই-২২০১ · ডায়াকস্ট্রা ও এমএসটি' },
      body: { en: 'Asked in 5 of the last 6 semester finals', bn: 'গত ৬টি সেমিস্টার ফাইনালের ৫টিতে এসেছে' },
    },
    exam: { title: { en: 'CSE-2201 · Past-semester quiz', bn: 'সিএসই-২২০১ · আগের সেমিস্টারের কুইজ' } },
    resources: [
      { kind: 'notes', title: { en: 'Lecture 9 · Shortest paths (slides)', bn: 'লেকচার ৯ · শর্টেস্ট পাথ (স্লাইড)' }, by: 'Dr. Mahbubur Rahman', pages: 42 },
      { kind: 'past', title: { en: 'CSE-2201 Final 2024 question paper', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪ প্রশ্নপত্র' }, by: { en: 'Uploaded by department', bn: 'বিভাগ কর্তৃক আপলোড' }, pages: 4 },
      { kind: 'lab', title: { en: 'Lab 5 · BFS/DFS report template', bn: 'ল্যাব ৫ · BFS/DFS রিপোর্ট টেমপ্লেট' }, by: 'Nusrat Akter', pages: 6 },
      { kind: 'paper', title: { en: 'Survey: graph neural networks for routing', bn: 'সমীক্ষা: রাউটিংয়ের জন্য গ্রাফ নিউরাল নেটওয়ার্ক' }, by: { en: 'Recommended by mentor', bn: 'মেন্টরের সুপারিশ' }, pages: 18 },
    ],
    tutor: [
      {
        q: { en: 'Explain Dijkstra’s algorithm in simple steps', bn: 'সহজ ধাপে ডায়াকস্ট্রার অ্যালগরিদম ব্যাখ্যা করো' },
        a: {
          en: '1. Set the source distance to 0 and every other vertex to ∞.\n2. Put all vertices in a min-priority queue keyed by distance.\n3. Take out the closest vertex u.\n4. For each edge u → v with weight w, if dist[u] + w < dist[v], update dist[v].\n5. Repeat until the queue is empty.\n\nWith a binary heap this runs in O((V + E) log V). It needs non-negative edge weights.',
          bn: '১. উৎসের দূরত্ব ০ ও বাকি সব ভার্টেক্সের দূরত্ব ∞ ধরো।\n২. দূরত্ব অনুযায়ী সব ভার্টেক্স একটি মিন-প্রায়োরিটি কিউতে রাখো।\n৩. সবচেয়ে কাছের ভার্টেক্স u বের করো।\n৪. প্রতিটি এজ u → v (ওজন w)-এর জন্য dist[u] + w < dist[v] হলে dist[v] হালনাগাদ করো।\n৫. কিউ খালি না হওয়া পর্যন্ত চালাও।\n\nবাইনারি হিপে সময় O((V + E) log V)। এজ ওজন অঋণাত্মক হতে হবে।',
        },
        cite: { en: 'CLRS 4th ed. · §22.3 · course reference for CSE-2201', bn: 'CLRS ৪র্থ সংস্করণ · §২২.৩ · সিএসই-২২০১-এর রেফারেন্স' },
      },
      {
        q: { en: 'Which skills should I build for a computer-vision internship?', bn: 'কম্পিউটার ভিশন ইন্টার্নশিপের জন্য কোন দক্ষতা গড়ব?' },
        a: {
          en: 'From the 14 computer-vision roles posted on Setu this month, the most requested skills are Python (13), OpenCV (11), basic deep learning (9) and Git (7).\n\nYou already have verified Python and OpenCV. Taking the 20-minute Basic AI skill test would lift your match for the AgroSense internship from 92% to 100%.',
          bn: 'এ মাসে সেতুতে পোস্ট করা ১৪টি কম্পিউটার ভিশন পদে সবচেয়ে বেশি চাওয়া দক্ষতা: পাইথন (১৩), ওপেনসিভি (১১), বেসিক ডিপ লার্নিং (৯) ও গিট (৭)।\n\nতোমার পাইথন ও ওপেনসিভি ইতিমধ্যে যাচাইকৃত। ২০ মিনিটের বেসিক এআই স্কিল টেস্ট দিলে অ্যাগ্রোসেন্স ইন্টার্নশিপে তোমার মিল ৯২% থেকে ১০০% হবে।',
        },
        cite: { en: 'Setu opportunity data · October 2026', bn: 'সেতুর সুযোগ-তথ্য · অক্টোবর ২০২৬' },
      },
    ],
  },
}
