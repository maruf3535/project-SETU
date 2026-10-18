// More subjects for the question bank: two per level, 6 MCQ + 2 creative (long-answer at university) each.
// Same shape as questions.js plus `topic`, `board` and `year`; labels for these keys live in questionCatalog.js.
const school = [
  // Chemistry (SSC)
  {
    id: 'sx-ch1', type: 'mcq', subject: 'chemistry', chapter: 'states', topic: 'diffusion', board: 'dhaka', year: 2023,
    source: { en: 'Dhaka Board 2023', bn: 'ঢাকা বোর্ড ২০২৩' }, solved: 78,
    q: { en: 'Which of these gases diffuses fastest?', bn: 'নিচের কোন গ্যাসটির ব্যাপন হার সবচেয়ে বেশি?' },
    options: ['H₂', 'O₂', 'CO₂', 'Cl₂'], answer: 0,
    explain: {
      en: 'The rate of diffusion is inversely proportional to the square root of molar mass. H₂ (2 g/mol) is the lightest, so it diffuses fastest.',
      bn: 'ব্যাপনের হার মোলার ভরের বর্গমূলের ব্যস্তানুপাতিক। H₂ (২ g/mol) সবচেয়ে হালকা, তাই এর ব্যাপন সবচেয়ে দ্রুত।',
    },
  },
  {
    id: 'sx-ch2', type: 'mcq', subject: 'chemistry', chapter: 'states', topic: 'sublimation', board: 'rajshahi', year: 2022,
    source: { en: 'Rajshahi Board 2022', bn: 'রাজশাহী বোর্ড ২০২২' }, solved: 85,
    q: { en: 'Which of these substances sublimes on heating?', bn: 'নিচের কোন পদার্থটি তাপে ঊর্ধ্বপাতিত হয়?' },
    options: [
      { en: 'Camphor', bn: 'কর্পূর' },
      { en: 'Sodium chloride', bn: 'সোডিয়াম ক্লোরাইড' },
      { en: 'Sugar', bn: 'চিনি' },
      { en: 'Copper sulphate', bn: 'কপার সালফেট' },
    ],
    answer: 0,
    explain: {
      en: 'Camphor turns straight from solid to vapour without melting. Naphthalene, iodine and ammonium chloride do the same.',
      bn: 'কর্পূর তরলে পরিণত না হয়ে সরাসরি কঠিন থেকে বাষ্পে পরিণত হয়। ন্যাপথালিন, আয়োডিন ও অ্যামোনিয়াম ক্লোরাইডও তাই করে।',
    },
  },
  {
    id: 'sx-ch3', type: 'mcq', subject: 'chemistry', chapter: 'atomic', topic: 'subatomic', board: 'cumilla', year: 2023,
    source: { en: 'Cumilla Board 2023', bn: 'কুমিল্লা বোর্ড ২০২৩' }, solved: 74,
    q: { en: 'How many neutrons are in an atom of ³⁵Cl (atomic number 17)?', bn: '³⁵Cl (পারমাণবিক সংখ্যা ১৭) পরমাণুতে কতটি নিউট্রন আছে?' },
    options: ['17', '18', '35', '52'], answer: 1,
    explain: { en: 'Neutrons = mass number − atomic number = 35 − 17 = 18.', bn: 'নিউট্রন সংখ্যা = ভরসংখ্যা − পারমাণবিক সংখ্যা = ৩৫ − ১৭ = ১৮।' },
  },
  {
    id: 'sx-ch4', type: 'mcq', subject: 'chemistry', chapter: 'atomic', topic: 'electronConfig', board: 'jashore', year: 2022,
    source: { en: 'Jashore Board 2022', bn: 'যশোর বোর্ড ২০২২' }, solved: 69,
    q: { en: 'What is the electron configuration of sodium (atomic number 11)?', bn: 'সোডিয়ামের (পারমাণবিক সংখ্যা ১১) ইলেকট্রন বিন্যাস কোনটি?' },
    options: ['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ 3s²', '1s² 2s² 2p⁵ 3s²', '1s² 2s² 2p⁷'], answer: 0,
    explain: {
      en: '11 electrons fill 1s (2), 2s (2), 2p (6) and the last one goes to 3s: 1s² 2s² 2p⁶ 3s¹. A p subshell holds at most 6 electrons.',
      bn: '১১টি ইলেকট্রন ক্রমে 1s (২), 2s (২), 2p (৬) পূর্ণ করে, শেষটি যায় 3s-এ: 1s² 2s² 2p⁶ 3s¹। p উপস্তরে সর্বোচ্চ ৬টি ইলেকট্রন থাকে।',
    },
  },
  {
    id: 'sx-ch5', type: 'mcq', subject: 'chemistry', chapter: 'bonds', topic: 'ionic', board: 'sylhet', year: 2023,
    source: { en: 'Sylhet Board 2023', bn: 'সিলেট বোর্ড ২০২৩' }, solved: 88,
    q: { en: 'Which of these compounds has an ionic bond?', bn: 'নিচের কোন যৌগে আয়নিক বন্ধন আছে?' },
    options: ['NaCl', 'HCl', 'CH₄', 'H₂O'], answer: 0,
    explain: {
      en: 'Sodium (a metal) gives its outer electron to chlorine (a non-metal), forming Na⁺ and Cl⁻ ions held by electrostatic attraction. The other three share electrons (covalent).',
      bn: 'সোডিয়াম (ধাতু) তার বাইরের ইলেকট্রন ক্লোরিনকে (অধাতু) দিয়ে Na⁺ ও Cl⁻ আয়ন তৈরি করে, যারা স্থির-বৈদ্যুতিক আকর্ষণে যুক্ত থাকে। বাকি তিনটিতে ইলেকট্রন শেয়ার হয় (সমযোজী)।',
    },
  },
  {
    id: 'sx-ch6', type: 'mcq', subject: 'chemistry', chapter: 'bonds', topic: 'covalent', board: 'barishal', year: 2024,
    source: { en: 'Barishal Board 2024', bn: 'বরিশাল বোর্ড ২০২৪' }, solved: 62,
    q: { en: 'How many electron pairs are shared in a nitrogen (N₂) molecule?', bn: 'নাইট্রোজেন (N₂) অণুতে কয় জোড়া ইলেকট্রন শেয়ার হয়?' },
    options: ['1', '2', '3', '4'], answer: 2,
    explain: {
      en: 'Each N atom has 5 valence electrons and needs 3 more for an octet, so the two atoms share 3 pairs: a triple bond (N≡N).',
      bn: 'প্রতিটি N পরমাণুর যোজ্যতা স্তরে ৫টি ইলেকট্রন, অষ্টক পূরণে আরও ৩টি দরকার। তাই দুই পরমাণু ৩ জোড়া ইলেকট্রন শেয়ার করে: ত্রিবন্ধন (N≡N)।',
    },
  },
  {
    id: 'sx-ch7', type: 'creative', subject: 'chemistry', chapter: 'atomic', topic: 'electronConfig', board: 'chattogram', year: 2023,
    source: { en: 'Chattogram Board 2023', bn: 'চট্টগ্রাম বোর্ড ২০২৩' }, solved: 54,
    q: {
      en: 'Stem: Element X has atomic number 17 and mass number 35. Element Y has atomic number 11 and mass number 23.\n(a) What is an isotope? (1)\n(b) Why is almost all the mass of an atom in its nucleus? (2)\n(c) Write the electron configurations of X and Y and find the number of neutrons in each. (3)\n(d) Analyse what kind of bond forms between X and Y, and why. (4)',
      bn: 'উদ্দীপক: X মৌলের পারমাণবিক সংখ্যা ১৭ ও ভরসংখ্যা ৩৫। Y মৌলের পারমাণবিক সংখ্যা ১১ ও ভরসংখ্যা ২৩।\n(ক) আইসোটোপ কাকে বলে? (১)\n(খ) পরমাণুর প্রায় সব ভর নিউক্লিয়াসে থাকে কেন? (২)\n(গ) X ও Y-এর ইলেকট্রন বিন্যাস লেখো এবং প্রত্যেকের নিউট্রন সংখ্যা নির্ণয় করো। (৩)\n(ঘ) X ও Y-এর মধ্যে কোন ধরনের বন্ধন গঠিত হবে, কারণসহ বিশ্লেষণ করো। (৪)',
    },
    explain: {
      en: '(a) Atoms of the same element with the same atomic number but different mass numbers, e.g. ¹²C and ¹⁴C.\n(b) Protons and neutrons, which are each about 1840 times heavier than an electron, sit in the nucleus; electrons add almost nothing to the mass.\n(c) X (Cl): 1s² 2s² 2p⁶ 3s² 3p⁵, neutrons = 35 − 17 = 18. Y (Na): 1s² 2s² 2p⁶ 3s¹, neutrons = 23 − 11 = 12.\n(d) Y has one electron in its outer shell and loses it easily to become Y⁺ with a neon-like octet. X has seven outer electrons and gains one to become X⁻ with an argon-like octet. The opposite ions attract each other, so an ionic bond forms and the compound is YX (NaCl).',
      bn: '(ক) একই পারমাণবিক সংখ্যা কিন্তু ভিন্ন ভরসংখ্যাবিশিষ্ট একই মৌলের পরমাণুকে আইসোটোপ বলে, যেমন ¹²C ও ¹⁴C।\n(খ) প্রোটন ও নিউট্রন, যাদের প্রত্যেকে ইলেকট্রনের চেয়ে প্রায় ১৮৪০ গুণ ভারী, নিউক্লিয়াসে থাকে; ইলেকট্রনের ভর প্রায় নগণ্য।\n(গ) X (Cl): 1s² 2s² 2p⁶ 3s² 3p⁵, নিউট্রন = ৩৫ − ১৭ = ১৮। Y (Na): 1s² 2s² 2p⁶ 3s¹, নিউট্রন = ২৩ − ১১ = ১২।\n(ঘ) Y-এর সর্ববহিঃস্থ স্তরে ১টি ইলেকট্রন, যা ত্যাগ করে Y⁺ নিয়নের মতো অষ্টক পায়। X-এর বাইরের স্তরে ৭টি ইলেকট্রন, ১টি গ্রহণ করে X⁻ আর্গনের মতো অষ্টক পায়। বিপরীত আধানের আয়ন পরস্পরকে আকর্ষণ করে, তাই আয়নিক বন্ধন গঠিত হয় এবং যৌগটি YX (NaCl)।',
    },
  },
  {
    id: 'sx-ch8', type: 'creative', subject: 'chemistry', chapter: 'states', topic: 'sublimation', board: 'mymensingh', year: 2024,
    source: { en: 'Mymensingh Board 2024', bn: 'ময়মনসিংহ বোর্ড ২০২৪' }, solved: 49,
    q: {
      en: 'Stem: In the lab, a student was given a mixture of common salt (NaCl) and ammonium chloride (NH₄Cl), and a second mixture of common salt and sand.\n(a) What is sublimation? (1)\n(b) Why does a gas diffuse faster than a liquid? (2)\n(c) Describe how to separate NH₄Cl from the first mixture. (3)\n(d) Can the same method separate the second mixture? Justify your answer and suggest a suitable method. (4)',
      bn: 'উদ্দীপক: ল্যাবে একজন শিক্ষার্থীকে খাদ্যলবণ (NaCl) ও অ্যামোনিয়াম ক্লোরাইডের (NH₄Cl) একটি মিশ্রণ এবং খাদ্যলবণ ও বালির আরেকটি মিশ্রণ দেওয়া হলো।\n(ক) ঊর্ধ্বপাতন কী? (১)\n(খ) তরলের চেয়ে গ্যাসের ব্যাপন দ্রুত হয় কেন? (২)\n(গ) প্রথম মিশ্রণ থেকে NH₄Cl পৃথক করার পদ্ধতি বর্ণনা করো। (৩)\n(ঘ) একই পদ্ধতিতে দ্বিতীয় মিশ্রণ পৃথক করা যাবে কি? যুক্তিসহ মতামত দাও ও উপযুক্ত পদ্ধতি প্রস্তাব করো। (৪)',
    },
    explain: {
      en: '(a) Sublimation is the change of a solid directly into vapour on heating, without becoming a liquid.\n(b) Gas particles are far apart and the attraction between them is very weak, so they move freely and fast; liquid particles are closer and held more strongly.\n(c) Put the mixture in a china dish, cover it with an inverted funnel plugged with cotton, and heat. NH₄Cl sublimes and its vapour deposits as a white solid on the cool funnel wall; NaCl stays in the dish.\n(d) No. Neither NaCl nor sand sublimes, so heating separates nothing. Instead, add water to dissolve the salt, filter out the sand, then evaporate the filtrate to get the salt back (dissolution, filtration and evaporation).',
      bn: '(ক) তাপ প্রয়োগে কোনো কঠিন পদার্থ তরলে পরিণত না হয়ে সরাসরি বাষ্পে পরিণত হওয়াকে ঊর্ধ্বপাতন বলে।\n(খ) গ্যাসের কণাগুলো অনেক দূরে দূরে থাকে এবং আন্তঃকণা আকর্ষণ খুব দুর্বল, তাই এরা মুক্তভাবে দ্রুত চলে; তরলের কণা কাছাকাছি থাকে ও বেশি আকর্ষণে আবদ্ধ।\n(গ) মিশ্রণটি একটি চীনামাটির বাটিতে নিয়ে মুখে তুলা গোঁজা একটি উল্টানো ফানেল দিয়ে ঢেকে তাপ দিতে হবে। NH₄Cl ঊর্ধ্বপাতিত হয়ে ফানেলের ঠান্ডা গায়ে সাদা কঠিন হিসেবে জমা হয়; NaCl বাটিতে থেকে যায়।\n(ঘ) না। NaCl বা বালি কোনোটিই ঊর্ধ্বপাতিত হয় না, তাই তাপে পৃথক হবে না। বরং পানি যোগ করে লবণ দ্রবীভূত করতে হবে, ছেঁকে বালি আলাদা করতে হবে, তারপর পরিস্রুত বাষ্পীভূত করে লবণ ফিরে পাওয়া যাবে (দ্রবণ, পরিস্রাবণ ও বাষ্পীভবন)।',
    },
  },

  // Higher Mathematics (SSC)
  {
    id: 'sx-hm1', type: 'mcq', subject: 'higherMath', chapter: 'sets', topic: 'powerSet', board: 'dhaka', year: 2022,
    source: { en: 'Dhaka Board 2022', bn: 'ঢাকা বোর্ড ২০২২' }, solved: 86,
    q: { en: 'If A = {a, b, c}, how many elements does the power set P(A) have?', bn: 'A = {a, b, c} হলে শক্তি সেট P(A)-এর উপাদান সংখ্যা কত?' },
    options: ['3', '6', '8', '9'], answer: 2,
    explain: { en: 'A set with n elements has 2ⁿ subsets: 2³ = 8.', bn: 'n উপাদানবিশিষ্ট সেটের উপসেট সংখ্যা 2ⁿ: 2³ = ৮।' },
  },
  {
    id: 'sx-hm2', type: 'mcq', subject: 'higherMath', chapter: 'sets', topic: 'functions', board: 'rajshahi', year: 2023,
    source: { en: 'Rajshahi Board 2023', bn: 'রাজশাহী বোর্ড ২০২৩' }, solved: 71,
    q: { en: 'What is the domain of f(x) = (2x + 1)/(x − 3)?', bn: 'f(x) = (2x + 1)/(x − 3) ফাংশনের ডোমেন কোনটি?' },
    options: ['ℝ', 'ℝ − {3}', 'ℝ − {−1/2}', 'ℝ − {−3}'], answer: 1,
    explain: { en: 'The denominator is zero at x = 3, so f is defined for every real x except 3.', bn: 'x = ৩ হলে হর শূন্য হয়, তাই ৩ বাদে সব বাস্তব x-এর জন্য f সংজ্ঞায়িত।' },
  },
  {
    id: 'sx-hm3', type: 'mcq', subject: 'higherMath', chapter: 'algebra', topic: 'remainderTheorem', board: 'cumilla', year: 2022,
    source: { en: 'Cumilla Board 2022', bn: 'কুমিল্লা বোর্ড ২০২২' }, solved: 67,
    q: { en: 'What is the remainder when P(x) = x³ − 2x² + 3x − 4 is divided by (x − 2)?', bn: 'P(x) = x³ − 2x² + 3x − 4-কে (x − 2) দ্বারা ভাগ করলে ভাগশেষ কত?' },
    options: ['−2', '0', '2', '4'], answer: 2,
    explain: { en: 'By the remainder theorem the remainder is P(2) = 8 − 8 + 6 − 4 = 2.', bn: 'ভাগশেষ উপপাদ্য অনুযায়ী ভাগশেষ P(2) = ৮ − ৮ + ৬ − ৪ = ২।' },
  },
  {
    id: 'sx-hm4', type: 'mcq', subject: 'higherMath', chapter: 'algebra', topic: 'factorisation', board: 'dinajpur', year: 2023,
    source: { en: 'Dinajpur Board 2023', bn: 'দিনাজপুর বোর্ড ২০২৩' }, solved: 64,
    q: { en: 'Which of these is a factor of x³ − 6x² + 11x − 6?', bn: 'x³ − 6x² + 11x − 6-এর একটি উৎপাদক কোনটি?' },
    options: ['x + 1', 'x − 1', 'x + 2', 'x − 4'], answer: 1,
    explain: {
      en: 'Putting x = 1 gives 1 − 6 + 11 − 6 = 0, so (x − 1) is a factor by the factor theorem. In full, x³ − 6x² + 11x − 6 = (x − 1)(x − 2)(x − 3).',
      bn: 'x = ১ বসালে ১ − ৬ + ১১ − ৬ = ০, তাই উৎপাদক উপপাদ্য অনুযায়ী (x − 1) একটি উৎপাদক। সম্পূর্ণভাবে x³ − 6x² + 11x − 6 = (x − 1)(x − 2)(x − 3)।',
    },
  },
  {
    id: 'sx-hm5', type: 'mcq', subject: 'higherMath', chapter: 'trig', topic: 'radian', board: 'jashore', year: 2024,
    source: { en: 'Jashore Board 2024', bn: 'যশোর বোর্ড ২০২৪' }, solved: 90,
    q: { en: 'How many degrees is π/3 radian?', bn: 'π/3 রেডিয়ান সমান কত ডিগ্রি?' },
    options: ['30°', '45°', '60°', '90°'], answer: 2,
    explain: { en: 'π radian = 180°, so π/3 = 180°/3 = 60°.', bn: 'π রেডিয়ান = ১৮০°, তাই π/3 = ১৮০°/৩ = ৬০°।' },
  },
  {
    id: 'sx-hm6', type: 'mcq', subject: 'higherMath', chapter: 'trig', topic: 'trigRatios', board: 'sylhet', year: 2022,
    source: { en: 'Sylhet Board 2022', bn: 'সিলেট বোর্ড ২০২২' }, solved: 77,
    q: { en: 'If sin θ = 3/5 and θ is acute, what is cos θ?', bn: 'sin θ = 3/5 এবং θ সূক্ষ্মকোণ হলে cos θ-এর মান কত?' },
    options: ['3/4', '4/5', '5/4', '5/3'], answer: 1,
    explain: { en: 'cos θ = √(1 − sin²θ) = √(1 − 9/25) = √(16/25) = 4/5; it is positive because θ is acute.', bn: 'cos θ = √(1 − sin²θ) = √(1 − 9/25) = √(16/25) = 4/5; θ সূক্ষ্মকোণ বলে মান ধনাত্মক।' },
  },
  {
    id: 'sx-hm7', type: 'creative', subject: 'higherMath', chapter: 'sets', topic: 'setOps', board: 'barishal', year: 2023,
    source: { en: 'Barishal Board 2023', bn: 'বরিশাল বোর্ড ২০২৩' }, solved: 58,
    q: {
      en: 'Stem: U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3} and B = {2, 3, 4, 5}.\n(a) Find A ∩ B. (1)\n(b) Find (A ∪ B)′. (2)\n(c) Show that (A ∪ B)′ = A′ ∩ B′. (3)\n(d) For R = {(x, y) : x ∈ A, y ∈ B and y = x + 2}, write R in tabular form, find its domain and range, and decide whether R is a function. (4)',
      bn: 'উদ্দীপক: U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3} এবং B = {2, 3, 4, 5}।\n(ক) A ∩ B নির্ণয় করো। (১)\n(খ) (A ∪ B)′ নির্ণয় করো। (২)\n(গ) দেখাও যে, (A ∪ B)′ = A′ ∩ B′। (৩)\n(ঘ) R = {(x, y) : x ∈ A, y ∈ B এবং y = x + 2} হলে R-কে তালিকা পদ্ধতিতে লেখো, এর ডোমেন ও রেঞ্জ নির্ণয় করো এবং R ফাংশন কি না যাচাই করো। (৪)',
    },
    explain: {
      en: '(a) A ∩ B = {2, 3}.\n(b) A ∪ B = {1, 2, 3, 4, 5}, so (A ∪ B)′ = {6}.\n(c) A′ = {4, 5, 6} and B′ = {1, 6}, so A′ ∩ B′ = {6} = (A ∪ B)′. Shown.\n(d) x = 1 → y = 3, x = 2 → y = 4, x = 3 → y = 5, all in B. R = {(1, 3), (2, 4), (3, 5)}. Domain = {1, 2, 3}, range = {3, 4, 5}. Each element of the domain is paired with exactly one y, so R is a function (and also one-to-one).',
      bn: '(ক) A ∩ B = {2, 3}।\n(খ) A ∪ B = {1, 2, 3, 4, 5}, তাই (A ∪ B)′ = {6}।\n(গ) A′ = {4, 5, 6} ও B′ = {1, 6}, তাই A′ ∩ B′ = {6} = (A ∪ B)′। দেখানো হলো।\n(ঘ) x = ১ → y = ৩, x = ২ → y = ৪, x = ৩ → y = ৫, সবগুলো B-তে আছে। R = {(1, 3), (2, 4), (3, 5)}। ডোমেন = {1, 2, 3}, রেঞ্জ = {3, 4, 5}। ডোমেনের প্রতিটি উপাদানের সাথে ঠিক একটি y যুক্ত, তাই R একটি ফাংশন (এক-এক ফাংশনও)।',
    },
  },
  {
    id: 'sx-hm8', type: 'creative', subject: 'higherMath', chapter: 'trig', topic: 'identities', board: 'mymensingh', year: 2023,
    source: { en: 'Mymensingh Board 2023', bn: 'ময়মনসিংহ বোর্ড ২০২৩' }, solved: 46,
    q: {
      en: 'Stem: sin θ + cos θ = √2, where 0 < θ < π/2.\n(a) Express 135° in radians. (1)\n(b) Show that (sin θ + cos θ)² = 1 + 2 sin θ cos θ. (2)\n(c) Using the stem, find θ. (3)\n(d) Find the values of tan θ + cot θ and sec²θ + cosec²θ. (4)',
      bn: 'উদ্দীপক: sin θ + cos θ = √2, যেখানে 0 < θ < π/2।\n(ক) ১৩৫°-কে রেডিয়ানে প্রকাশ করো। (১)\n(খ) দেখাও যে, (sin θ + cos θ)² = 1 + 2 sin θ cos θ। (২)\n(গ) উদ্দীপকের সাহায্যে θ-এর মান নির্ণয় করো। (৩)\n(ঘ) tan θ + cot θ এবং sec²θ + cosec²θ-এর মান নির্ণয় করো। (৪)',
    },
    explain: {
      en: '(a) 135° = 135 × π/180 = 3π/4 radian.\n(b) (sin θ + cos θ)² = sin²θ + cos²θ + 2 sin θ cos θ = 1 + 2 sin θ cos θ, since sin²θ + cos²θ = 1.\n(c) Squaring the stem: 1 + 2 sin θ cos θ = 2, so 2 sin θ cos θ = 1. Then (sin θ − cos θ)² = 1 − 2 sin θ cos θ = 0, so sin θ = cos θ, i.e. tan θ = 1 and θ = π/4.\n(d) tan θ + cot θ = (sin²θ + cos²θ)/(sin θ cos θ) = 1/(1/2) = 2. sec²θ + cosec²θ = (sin²θ + cos²θ)/(sin²θ cos²θ) = 1/(1/4) = 4. Check with θ = π/4: 1 + 1 = 2 and 2 + 2 = 4.',
      bn: '(ক) ১৩৫° = ১৩৫ × π/১৮০ = 3π/4 রেডিয়ান।\n(খ) (sin θ + cos θ)² = sin²θ + cos²θ + 2 sin θ cos θ = 1 + 2 sin θ cos θ, কারণ sin²θ + cos²θ = 1।\n(গ) উদ্দীপক বর্গ করে: 1 + 2 sin θ cos θ = 2, তাই 2 sin θ cos θ = 1। তখন (sin θ − cos θ)² = 1 − 2 sin θ cos θ = 0, অর্থাৎ sin θ = cos θ, tan θ = 1, তাই θ = π/4।\n(ঘ) tan θ + cot θ = (sin²θ + cos²θ)/(sin θ cos θ) = 1/(1/2) = ২। sec²θ + cosec²θ = (sin²θ + cos²θ)/(sin²θ cos²θ) = 1/(1/4) = ৪। θ = π/4 বসিয়ে যাচাই: ১ + ১ = ২ এবং ২ + ২ = ৪।',
    },
  },
]

const college = [
  // Physics 1st Paper (HSC)
  {
    id: 'cx-ph1', type: 'mcq', subject: 'physics1', chapter: 'vectors', topic: 'products', board: 'dhaka', year: 2023,
    source: { en: 'Dhaka Board 2023', bn: 'ঢাকা বোর্ড ২০২৩' }, solved: 73,
    q: { en: 'If A = 2î + 3ĵ − k̂ and B = î − ĵ + 2k̂, what is A · B?', bn: 'A = 2î + 3ĵ − k̂ এবং B = î − ĵ + 2k̂ হলে A · B কত?' },
    options: ['−3', '3', '−1', '1'], answer: 0,
    explain: { en: 'A · B = (2)(1) + (3)(−1) + (−1)(2) = 2 − 3 − 2 = −3.', bn: 'A · B = (২)(১) + (৩)(−১) + (−১)(২) = ২ − ৩ − ২ = −৩।' },
  },
  {
    id: 'cx-ph2', type: 'mcq', subject: 'physics1', chapter: 'vectors', topic: 'addition', board: 'rajshahi', year: 2022,
    source: { en: 'Rajshahi Board 2022', bn: 'রাজশাহী বোর্ড ২০২২' }, solved: 89,
    q: { en: 'Forces of 3 N and 4 N act on a point at right angles. What is the magnitude of the resultant?', bn: '৩ N ও ৪ N মানের দুটি বল একটি বিন্দুতে পরস্পর লম্বভাবে ক্রিয়া করে। লব্ধির মান কত?' },
    options: ['1 N', '5 N', '7 N', '12 N'], answer: 1,
    explain: { en: 'R = √(3² + 4²) = √25 = 5 N.', bn: 'R = √(৩² + ৪²) = √২৫ = ৫ N।' },
  },
  {
    id: 'cx-ph3', type: 'mcq', subject: 'physics1', chapter: 'vectors', topic: 'resolution', board: 'cumilla', year: 2024,
    source: { en: 'Cumilla Board 2024', bn: 'কুমিল্লা বোর্ড ২০২৪' }, solved: 80,
    q: { en: 'A 10 N force acts at 30° to the horizontal. What is its horizontal component?', bn: '১০ N মানের একটি বল অনুভূমিকের সাথে ৩০° কোণে ক্রিয়া করে। এর অনুভূমিক উপাংশ কত?' },
    options: ['5 N', '8.66 N', '10 N', '17.3 N'], answer: 1,
    explain: { en: 'Fₓ = F cos 30° = 10 × 0.866 = 8.66 N.', bn: 'Fₓ = F cos ৩০° = ১০ × ০.৮৬৬ = ৮.৬৬ N।' },
  },
  {
    id: 'cx-ph4', type: 'mcq', subject: 'physics1', chapter: 'newtonian', topic: 'conservationMomentum', board: 'buet', year: 2022,
    source: { en: 'BUET admission 2022', bn: 'বুয়েট ভর্তি ২০২২' }, solved: 68,
    q: { en: 'A 4 kg gun fires a 20 g bullet at 400 m/s. What is the recoil speed of the gun?', bn: '৪ kg ভরের একটি বন্দুক থেকে ২০ g ভরের গুলি ৪০০ m/s বেগে ছোড়া হলো। বন্দুকের পশ্চাৎ বেগ কত?' },
    options: ['0.5 m/s', '1 m/s', '2 m/s', '8 m/s'], answer: 2,
    explain: { en: 'Total momentum stays zero: 4 × V = 0.02 × 400 = 8, so V = 2 m/s backwards.', bn: 'মোট ভরবেগ শূন্য থাকে: ৪ × V = ০.০২ × ৪০০ = ৮, তাই V = ২ m/s পেছনের দিকে।' },
  },
  {
    id: 'cx-ph5', type: 'mcq', subject: 'physics1', chapter: 'newtonian', topic: 'circularMotion', board: 'du', year: 2023,
    source: { en: 'DU admission 2023', bn: 'ঢাবি ভর্তি ২০২৩' }, solved: 65,
    q: { en: 'A 0.5 kg stone moves in a circle of radius 2 m at 4 m/s. What centripetal force acts on it?', bn: '০.৫ kg ভরের একটি পাথর ২ m ব্যাসার্ধের বৃত্তপথে ৪ m/s বেগে ঘোরে। এর ওপর কেন্দ্রমুখী বল কত?' },
    options: ['1 N', '2 N', '4 N', '8 N'], answer: 2,
    explain: { en: 'F = mv²/r = 0.5 × 4² / 2 = 0.5 × 16 / 2 = 4 N.', bn: 'F = mv²/r = ০.৫ × ৪² / ২ = ০.৫ × ১৬ / ২ = ৪ N।' },
  },
  {
    id: 'cx-ph6', type: 'mcq', subject: 'physics1', chapter: 'workEnergy', topic: 'power', board: 'jashore', year: 2023,
    source: { en: 'Jashore Board 2023', bn: 'যশোর বোর্ড ২০২৩' }, solved: 76,
    q: { en: 'A 60 kg man climbs 10 m of stairs in 20 s (g = 9.8 m/s²). What is his power?', bn: '৬০ kg ভরের একজন ব্যক্তি ২০ s-এ ১০ m উঁচু সিঁড়ি বেয়ে ওঠেন (g = ৯.৮ m/s²)। তার ক্ষমতা কত?' },
    options: ['30 W', '294 W', '588 W', '5880 W'], answer: 1,
    explain: { en: 'P = mgh/t = 60 × 9.8 × 10 / 20 = 5880 / 20 = 294 W.', bn: 'P = mgh/t = ৬০ × ৯.৮ × ১০ / ২০ = ৫৮৮০ / ২০ = ২৯৪ W।' },
  },
  {
    id: 'cx-ph7', type: 'creative', subject: 'physics1', chapter: 'workEnergy', topic: 'energyConservation', board: 'chattogram', year: 2022,
    source: { en: 'Chattogram Board 2022', bn: 'চট্টগ্রাম বোর্ড ২০২২' }, solved: 55,
    q: {
      en: 'Stem: A 2 kg ball is dropped from rest from a height of 20 m. Ignore air resistance (g = 9.8 m/s²).\n(a) What is a conservative force? (1)\n(b) Why is the work done by friction negative? (2)\n(c) Find the speed of the ball just before it hits the ground. (3)\n(d) At what height are the kinetic and potential energies equal? Show that the total mechanical energy stays the same at that point. (4)',
      bn: 'উদ্দীপক: ২ kg ভরের একটি বলকে ২০ m উচ্চতা থেকে স্থির অবস্থা থেকে ছেড়ে দেওয়া হলো। বায়ুর বাধা উপেক্ষা করো (g = ৯.৮ m/s²)।\n(ক) সংরক্ষণশীল বল কাকে বলে? (১)\n(খ) ঘর্ষণ বল দ্বারা কৃতকাজ ঋণাত্মক হয় কেন? (২)\n(গ) ভূমিতে পড়ার ঠিক আগে বলটির বেগ নির্ণয় করো। (৩)\n(ঘ) কোন উচ্চতায় বলটির গতিশক্তি ও বিভবশক্তি সমান হবে? সেই বিন্দুতে মোট যান্ত্রিক শক্তি অপরিবর্তিত থাকে, গাণিতিকভাবে দেখাও। (৪)',
    },
    explain: {
      en: '(a) A force whose work around any closed path is zero, so the work depends only on the start and end points (e.g. gravity, spring force).\n(b) Friction always acts opposite to the displacement, so the angle between force and displacement is 180° and W = Fs cos 180° = −Fs.\n(c) v = √(2gh) = √(2 × 9.8 × 20) = √392 ≈ 19.8 m/s.\n(d) Total energy E = mgh = 2 × 9.8 × 20 = 392 J. KE = PE means each is 196 J, so mgh′ = 196 → h′ = 196 / (2 × 9.8) = 10 m. At 10 m: PE = 2 × 9.8 × 10 = 196 J; the ball has fallen 10 m, so v² = 2 × 9.8 × 10 = 196 and KE = ½ × 2 × 196 = 196 J. Total = 392 J, the same as at the top.',
      bn: '(ক) যে বল কোনো বস্তুকে যেকোনো বদ্ধ পথে ঘুরিয়ে আনলে কৃতকাজ শূন্য হয়, অর্থাৎ কাজ শুধু আদি ও শেষ অবস্থানের ওপর নির্ভর করে, তাকে সংরক্ষণশীল বল বলে (যেমন অভিকর্ষ বল, স্প্রিং বল)।\n(খ) ঘর্ষণ বল সবসময় সরণের বিপরীতে ক্রিয়া করে, তাই বল ও সরণের মধ্যবর্তী কোণ ১৮০° এবং W = Fs cos ১৮০° = −Fs।\n(গ) v = √(2gh) = √(২ × ৯.৮ × ২০) = √৩৯২ ≈ ১৯.৮ m/s।\n(ঘ) মোট শক্তি E = mgh = ২ × ৯.৮ × ২০ = ৩৯২ J। গতিশক্তি = বিভবশক্তি হলে প্রত্যেকটি ১৯৬ J, তাই mgh′ = ১৯৬ → h′ = ১৯৬ / (২ × ৯.৮) = ১০ m। ১০ m উচ্চতায়: বিভবশক্তি = ২ × ৯.৮ × ১০ = ১৯৬ J; বলটি ১০ m পড়েছে, তাই v² = ২ × ৯.৮ × ১০ = ১৯৬ এবং গতিশক্তি = ½ × ২ × ১৯৬ = ১৯৬ J। মোট = ৩৯২ J, শীর্ষবিন্দুর সমান।',
    },
  },
  {
    id: 'cx-ph8', type: 'creative', subject: 'physics1', chapter: 'newtonian', topic: 'conservationMomentum', board: 'sylhet', year: 2024,
    source: { en: 'Sylhet Board 2024', bn: 'সিলেট বোর্ড ২০২৪' }, solved: 51,
    q: {
      en: 'Stem: A 5 kg ball moving at 6 m/s hits a 3 kg ball at rest head-on. After the collision the two balls stick together and move as one.\n(a) What is impulse? (1)\n(b) Why does a cricketer pull the hands back while catching a ball? (2)\n(c) Find the common velocity after the collision. (3)\n(d) Is kinetic energy conserved in this collision? Justify with calculation. (4)',
      bn: 'উদ্দীপক: ৬ m/s বেগে চলমান ৫ kg ভরের একটি বল স্থির ৩ kg ভরের একটি বলকে মুখোমুখি ধাক্কা দেয়। সংঘর্ষের পর বল দুটি একসাথে যুক্ত হয়ে চলে।\n(ক) বলের ঘাত কাকে বলে? (১)\n(খ) ক্রিকেটার বল ধরার সময় হাত পেছনে টেনে নেন কেন? (২)\n(গ) সংঘর্ষের পর মিলিত বেগ নির্ণয় করো। (৩)\n(ঘ) এই সংঘর্ষে গতিশক্তি সংরক্ষিত হয় কি? গাণিতিক যুক্তি দাও। (৪)',
    },
    explain: {
      en: '(a) Impulse is the product of a force and the time it acts, J = Ft, which equals the change in momentum.\n(b) Pulling the hands back increases the time over which the ball’s momentum drops to zero. Since F = Δp/t, a longer time means a smaller force on the hands, so they hurt less.\n(c) By conservation of momentum: 5 × 6 + 3 × 0 = (5 + 3)v, so v = 30/8 = 3.75 m/s in the original direction.\n(d) Initial KE = ½ × 5 × 6² = 90 J. Final KE = ½ × 8 × 3.75² = 56.25 J. 33.75 J is lost as heat, sound and deformation, so KE is not conserved. This is a perfectly inelastic collision; only momentum is conserved.',
      bn: '(ক) বল এবং বলের ক্রিয়াকালের গুণফলকে বলের ঘাত বলে, J = Ft, যা ভরবেগের পরিবর্তনের সমান।\n(খ) হাত পেছনে টানলে বলের ভরবেগ শূন্যে নামতে বেশি সময় লাগে। F = Δp/t অনুযায়ী সময় বাড়লে হাতে প্রযুক্ত বল কমে, তাই আঘাত কম লাগে।\n(গ) ভরবেগের সংরক্ষণ সূত্রে: ৫ × ৬ + ৩ × ০ = (৫ + ৩)v, তাই v = ৩০/৮ = ৩.৭৫ m/s, আদি গতির দিকে।\n(ঘ) আদি গতিশক্তি = ½ × ৫ × ৬² = ৯০ J। শেষ গতিশক্তি = ½ × ৮ × ৩.৭৫² = ৫৬.২৫ J। ৩৩.৭৫ J তাপ, শব্দ ও বিকৃতিতে রূপান্তরিত হয়, তাই গতিশক্তি সংরক্ষিত হয় না। এটি সম্পূর্ণ অস্থিতিস্থাপক সংঘর্ষ; শুধু ভরবেগ সংরক্ষিত থাকে।',
    },
  },

  // Biology 1st Paper (HSC Botany)
  {
    id: 'cx-bi1', type: 'mcq', subject: 'biology1', chapter: 'cell', topic: 'organelles', board: 'medical', year: 2022,
    source: { en: 'Medical admission 2022', bn: 'মেডিকেল ভর্তি ২০২২' }, solved: 94,
    q: { en: 'Which organelle is called the powerhouse of the cell?', bn: 'কোন অঙ্গাণুকে কোষের শক্তিঘর বলা হয়?' },
    options: [
      { en: 'Mitochondrion', bn: 'মাইটোকন্ড্রিয়া' },
      { en: 'Ribosome', bn: 'রাইবোসোম' },
      { en: 'Golgi body', bn: 'গলজি বস্তু' },
      { en: 'Lysosome', bn: 'লাইসোসোম' },
    ],
    answer: 0,
    explain: { en: 'Aerobic respiration (Krebs cycle and the electron transport chain) takes place in mitochondria, which make most of the cell’s ATP.', bn: 'সবাত শ্বসনের ক্রেবস চক্র ও ইলেকট্রন পরিবহন তন্ত্র মাইটোকন্ড্রিয়াতে ঘটে, যেখানে কোষের অধিকাংশ ATP তৈরি হয়।' },
  },
  {
    id: 'cx-bi2', type: 'mcq', subject: 'biology1', chapter: 'cell', topic: 'mitosis', board: 'dhaka', year: 2022,
    source: { en: 'Dhaka Board 2022', bn: 'ঢাকা বোর্ড ২০২২' }, solved: 84,
    q: { en: 'In which stage of mitosis do the chromosomes line up on the equatorial plate?', bn: 'মাইটোসিসের কোন ধাপে ক্রোমোসোমগুলো বিষুবীয় অঞ্চলে সারিবদ্ধ হয়?' },
    options: [
      { en: 'Prophase', bn: 'প্রোফেজ' },
      { en: 'Metaphase', bn: 'মেটাফেজ' },
      { en: 'Anaphase', bn: 'অ্যানাফেজ' },
      { en: 'Telophase', bn: 'টেলোফেজ' },
    ],
    answer: 1,
    explain: { en: 'In metaphase the spindle fibres attach to the centromeres and the chromosomes arrange themselves on the equatorial plate.', bn: 'মেটাফেজে স্পিন্ডল তন্তু সেন্ট্রোমিয়ারে যুক্ত হয় এবং ক্রোমোসোমগুলো বিষুবীয় প্লেটে সারিবদ্ধ হয়।' },
  },
  {
    id: 'cx-bi3', type: 'mcq', subject: 'biology1', chapter: 'cell', topic: 'meiosis', board: 'medical', year: 2023,
    source: { en: 'Medical admission 2023', bn: 'মেডিকেল ভর্তি ২০২৩' }, solved: 58,
    q: { en: 'In which sub-stage of prophase I does crossing over take place?', bn: 'প্রোফেজ-১-এর কোন উপধাপে ক্রসিং ওভার ঘটে?' },
    options: [
      { en: 'Leptotene', bn: 'লেপ্টোটিন' },
      { en: 'Zygotene', bn: 'জাইগোটিন' },
      { en: 'Pachytene', bn: 'প্যাকাইটিন' },
      { en: 'Diplotene', bn: 'ডিপ্লোটিন' },
    ],
    answer: 2,
    explain: { en: 'Homologous chromosomes pair in zygotene; non-sister chromatids exchange segments (crossing over) in pachytene. The chiasmata become visible in diplotene.', bn: 'জাইগোটিনে হোমোলোগাস ক্রোমোসোম জোড় বাঁধে; প্যাকাইটিনে নন-সিস্টার ক্রোমাটিডের মধ্যে অংশ বিনিময় (ক্রসিং ওভার) ঘটে। ডিপ্লোটিনে কায়াজমা দৃশ্যমান হয়।' },
  },
  {
    id: 'cx-bi4', type: 'mcq', subject: 'biology1', chapter: 'tissue', topic: 'meristematic', board: 'barishal', year: 2023,
    source: { en: 'Barishal Board 2023', bn: 'বরিশাল বোর্ড ২০২৩' }, solved: 72,
    q: { en: 'Which meristem increases the girth (thickness) of a plant?', bn: 'কোন ভাজক টিস্যু উদ্ভিদের বেড় (প্রস্থ) বৃদ্ধি করে?' },
    options: [
      { en: 'Apical meristem', bn: 'শীর্ষস্থ ভাজক টিস্যু' },
      { en: 'Intercalary meristem', bn: 'নিবেশিত ভাজক টিস্যু' },
      { en: 'Lateral meristem', bn: 'পার্শ্বীয় ভাজক টিস্যু' },
      { en: 'Promeristem', bn: 'প্রোমেরিস্টেম' },
    ],
    answer: 2,
    explain: { en: 'Lateral meristems such as the vascular cambium and cork cambium divide sideways and cause secondary growth in girth. Apical meristems increase length.', bn: 'ভাস্কুলার ক্যাম্বিয়াম ও কর্ক ক্যাম্বিয়ামের মতো পার্শ্বীয় ভাজক টিস্যু পাশের দিকে বিভাজিত হয়ে প্রস্থে গৌণ বৃদ্ধি ঘটায়। শীর্ষস্থ ভাজক টিস্যু দৈর্ঘ্য বাড়ায়।' },
  },
  {
    id: 'cx-bi5', type: 'mcq', subject: 'biology1', chapter: 'physiology', topic: 'photosynthesis', board: 'du', year: 2022,
    source: { en: 'DU admission 2022', bn: 'ঢাবি ভর্তি ২০২২' }, solved: 61,
    q: { en: 'In C₄ plants, what is the first stable product of CO₂ fixation?', bn: 'C₄ উদ্ভিদে CO₂ সংবন্ধনের প্রথম স্থায়ী পদার্থ কোনটি?' },
    options: [
      { en: '3-phosphoglyceric acid', bn: '৩-ফসফোগ্লিসারিক অ্যাসিড' },
      { en: 'Oxaloacetic acid', bn: 'অক্সালোঅ্যাসিটিক অ্যাসিড' },
      { en: 'Ribulose bisphosphate', bn: 'রাইবুলোজ বিসফসফেট' },
      { en: 'Glucose', bn: 'গ্লুকোজ' },
    ],
    answer: 1,
    explain: { en: 'In C₄ plants (e.g. maize, sugarcane), PEP carboxylase fixes CO₂ with phosphoenolpyruvate in mesophyll cells to make 4-carbon oxaloacetic acid. In C₃ plants the first product is 3-carbon 3-PGA.', bn: 'C₄ উদ্ভিদে (যেমন ভুট্টা, আখ) মেসোফিল কোষে PEP কার্বক্সিলেজ ফসফোইনলপাইরুভিক অ্যাসিডের সাথে CO₂ যুক্ত করে ৪-কার্বনের অক্সালোঅ্যাসিটিক অ্যাসিড তৈরি করে। C₃ উদ্ভিদে প্রথম পদার্থ ৩-কার্বনের 3-PGA।' },
  },
  {
    id: 'cx-bi6', type: 'mcq', subject: 'biology1', chapter: 'physiology', topic: 'respiration', board: 'mymensingh', year: 2024,
    source: { en: 'Mymensingh Board 2024', bn: 'ময়মনসিংহ বোর্ড ২০২৪' }, solved: 70,
    q: { en: 'What is the net gain of ATP from glycolysis of one glucose molecule?', bn: 'এক অণু গ্লুকোজের গ্লাইকোলাইসিসে নিট কয়টি ATP লাভ হয়?' },
    options: ['2', '4', '36', '38'], answer: 0,
    explain: { en: 'Glycolysis makes 4 ATP but uses 2 ATP in its first steps, so the net gain is 2 ATP (plus 2 NADH).', bn: 'গ্লাইকোলাইসিসে ৪টি ATP তৈরি হয় কিন্তু শুরুর ধাপে ২টি ATP খরচ হয়, তাই নিট লাভ ২টি ATP (সাথে ২টি NADH)।' },
  },
  {
    id: 'cx-bi7', type: 'creative', subject: 'biology1', chapter: 'cell', topic: 'mitosis', board: 'rajshahi', year: 2023,
    source: { en: 'Rajshahi Board 2023', bn: 'রাজশাহী বোর্ড ২০২৩' }, solved: 57,
    q: {
      en: 'Stem: Cell A in an onion root tip divides once and forms two daughter cells, each with the same chromosome number as the mother cell. Cell B in an anther divides twice and forms four daughter cells, each with half the chromosome number.\n(a) What is a chromatid? (1)\n(b) Why is mitosis called equational division? (2)\n(c) Explain the anaphase of the division in cell A. (3)\n(d) Analyse the importance of the division in cell B for keeping the chromosome number constant from generation to generation. (4)',
      bn: 'উদ্দীপক: পেঁয়াজের মূলাগ্রের কোষ A একবার বিভাজিত হয়ে দুটি অপত্য কোষ তৈরি করে, যাদের প্রত্যেকের ক্রোমোসোম সংখ্যা মাতৃকোষের সমান। পরাগধানীর কোষ B দুবার বিভাজিত হয়ে চারটি অপত্য কোষ তৈরি করে, যাদের ক্রোমোসোম সংখ্যা অর্ধেক।\n(ক) ক্রোমাটিড কী? (১)\n(খ) মাইটোসিসকে সমীকরণিক বিভাজন বলা হয় কেন? (২)\n(গ) কোষ A-এর বিভাজনের অ্যানাফেজ ধাপ ব্যাখ্যা করো। (৩)\n(ঘ) বংশপরম্পরায় ক্রোমোসোম সংখ্যা স্থির রাখতে কোষ B-এর বিভাজনের গুরুত্ব বিশ্লেষণ করো। (৪)',
    },
    explain: {
      en: '(a) Each of the two identical copies of a replicated chromosome, joined at the centromere, is a chromatid.\n(b) In mitosis the daughter cells get the same number and kind of chromosomes as the mother cell, so the division is equal in quality and quantity.\n(c) Cell A shows mitosis. In anaphase the centromere of each chromosome splits, the sister chromatids separate, and the spindle fibres pull them to opposite poles. The chromosomes look V, L, J or I shaped as they move, and each pole gets a full set.\n(d) Cell B shows meiosis. It halves the chromosome number (2n → n) when gametes form; fertilisation joins two n gametes to restore 2n in the zygote. Without meiosis the number would double every generation. Crossing over and independent assortment during meiosis also create variation, which helps evolution and adaptation.',
      bn: '(ক) প্রতিলিপিত ক্রোমোসোমের সেন্ট্রোমিয়ারে যুক্ত দুটি অভিন্ন অংশের প্রত্যেকটিকে ক্রোমাটিড বলে।\n(খ) মাইটোসিসে অপত্য কোষ মাতৃকোষের সমান সংখ্যক ও একই ধরনের ক্রোমোসোম পায়, অর্থাৎ গুণগত ও পরিমাণগতভাবে সমান হয়, তাই একে সমীকরণিক বিভাজন বলে।\n(গ) কোষ A-তে মাইটোসিস ঘটে। অ্যানাফেজে প্রতিটি ক্রোমোসোমের সেন্ট্রোমিয়ার বিভক্ত হয়, সিস্টার ক্রোমাটিড আলাদা হয় এবং স্পিন্ডল তন্তু এদের বিপরীত মেরুর দিকে টেনে নেয়। চলার সময় ক্রোমোসোমগুলো V, L, J বা I আকৃতির দেখায় এবং প্রতি মেরুতে এক সেট ক্রোমোসোম পৌঁছায়।\n(ঘ) কোষ B-তে মিয়োসিস ঘটে। গ্যামেট তৈরির সময় এটি ক্রোমোসোম সংখ্যা অর্ধেক (2n → n) করে; নিষেকে দুটি n গ্যামেট মিলে জাইগোটে আবার 2n হয়। মিয়োসিস না হলে প্রতি প্রজন্মে ক্রোমোসোম সংখ্যা দ্বিগুণ হতো। এ ছাড়া ক্রসিং ওভার ও স্বাধীন বিন্যাসে প্রকরণ সৃষ্টি হয়, যা বিবর্তন ও অভিযোজনে সহায়তা করে।',
    },
  },
  {
    id: 'cx-bi8', type: 'creative', subject: 'biology1', chapter: 'physiology', topic: 'photosynthesis', board: 'dinajpur', year: 2022,
    source: { en: 'Dinajpur Board 2022', bn: 'দিনাজপুর বোর্ড ২০২২' }, solved: 53,
    q: {
      en: 'Stem: Rahim kept one potted plant in sunlight and another identical plant in the dark for 48 hours. He then boiled a leaf from each in alcohol and tested it with iodine solution.\n(a) What is photolysis of water? (1)\n(b) Why is the Calvin cycle called the light-independent reaction? (2)\n(c) Explain the result of the iodine test for the two leaves. (3)\n(d) Analyse how photosynthesis and respiration complement each other. (4)',
      bn: 'উদ্দীপক: রহিম একটি টবের গাছ সূর্যালোকে এবং একই রকম আরেকটি গাছ অন্ধকারে ৪৮ ঘণ্টা রাখল। এরপর প্রতিটি থেকে একটি পাতা অ্যালকোহলে ফুটিয়ে আয়োডিন দ্রবণ দিয়ে পরীক্ষা করল।\n(ক) পানির ফটোলাইসিস কী? (১)\n(খ) ক্যালভিন চক্রকে আলো-নিরপেক্ষ বিক্রিয়া বলা হয় কেন? (২)\n(গ) পাতা দুটির আয়োডিন পরীক্ষার ফলাফল ব্যাখ্যা করো। (৩)\n(ঘ) সালোকসংশ্লেষণ ও শ্বসন কীভাবে পরস্পরের পরিপূরক, বিশ্লেষণ করো। (৪)',
    },
    explain: {
      en: '(a) The splitting of water by light energy in the light reaction: 2H₂O → 4H⁺ + 4e⁻ + O₂. It supplies electrons and releases oxygen.\n(b) The Calvin cycle does not use light directly; it uses the ATP and NADPH made in the light reaction to fix CO₂ into sugar, so it can run without light as long as these are available.\n(c) Boiling in alcohol removes chlorophyll so the colour change is visible. The leaf from sunlight turns blue-black because photosynthesis made starch. The leaf from the dark stays yellowish-brown: no photosynthesis took place, and the stored starch was used up in respiration over 48 hours.\n(d) Photosynthesis uses CO₂ and water to make glucose and O₂, storing light energy as chemical energy. Respiration uses that glucose and O₂ to release energy as ATP, giving back CO₂ and water. The products of one are the raw materials of the other, so together they cycle carbon and oxygen and keep the balance of gases in the air.',
      bn: '(ক) আলোক বিক্রিয়ায় আলোর শক্তিতে পানির বিশ্লিষ্ট হওয়াকে ফটোলাইসিস বলে: 2H₂O → 4H⁺ + 4e⁻ + O₂। এতে ইলেকট্রন সরবরাহ হয় ও অক্সিজেন মুক্ত হয়।\n(খ) ক্যালভিন চক্র সরাসরি আলো ব্যবহার করে না; আলোক বিক্রিয়ায় তৈরি ATP ও NADPH ব্যবহার করে CO₂-কে শর্করায় পরিণত করে। এগুলো থাকলে আলো ছাড়াই চলতে পারে, তাই একে আলো-নিরপেক্ষ বিক্রিয়া বলে।\n(গ) অ্যালকোহলে ফোটালে ক্লোরোফিল দূর হয়, ফলে রঙের পরিবর্তন দেখা যায়। সূর্যালোকের পাতাটি নীল-কালো হয়, কারণ সালোকসংশ্লেষণে শ্বেতসার তৈরি হয়েছে। অন্ধকারের পাতাটি হলদে-বাদামি থাকে: সালোকসংশ্লেষণ হয়নি, আর ৪৮ ঘণ্টায় জমা শ্বেতসার শ্বসনে খরচ হয়ে গেছে।\n(ঘ) সালোকসংশ্লেষণে CO₂ ও পানি থেকে গ্লুকোজ ও O₂ তৈরি হয় এবং আলোকশক্তি রাসায়নিক শক্তিরূপে জমা হয়। শ্বসনে সেই গ্লুকোজ ও O₂ ব্যবহার করে ATP রূপে শক্তি মুক্ত হয় এবং CO₂ ও পানি ফিরে আসে। একটির উৎপাদ অন্যটির কাঁচামাল, তাই দুটি মিলে কার্বন ও অক্সিজেনের চক্র চালু রাখে এবং বায়ুতে গ্যাসের ভারসাম্য বজায় রাখে।',
    },
  },
]

const university = [
  // Data Structures
  {
    id: 'ux-ds1', type: 'mcq', subject: 'dataStructures', chapter: 'stacksQueues', topic: 'expressions', board: 'final', year: 2023,
    source: { en: 'CSE-2101 Final 2023', bn: 'সিএসই-২১০১ ফাইনাল ২০২৩' }, solved: 82,
    q: { en: 'What is the value of the postfix expression 5 3 2 * + 4 −?', bn: 'পোস্টফিক্স রাশি 5 3 2 * + 4 −-এর মান কত?' },
    options: ['7', '12', '3', '15'], answer: 0,
    explain: { en: 'Push 5, 3, 2; * gives 6; + gives 5 + 6 = 11; push 4; − gives 11 − 4 = 7.', bn: '৫, ৩, ২ পুশ; * দিলে ৬; + দিলে ৫ + ৬ = ১১; ৪ পুশ; − দিলে ১১ − ৪ = ৭।' },
  },
  {
    id: 'ux-ds2', type: 'mcq', subject: 'dataStructures', chapter: 'stacksQueues', topic: 'stackOps', board: 'mid', year: 2024,
    source: { en: 'CSE-2101 Mid 2024', bn: 'সিএসই-২১০১ মিড ২০২৪' }, solved: 88,
    q: { en: 'On an empty stack: push 1, push 2, pop, push 3, push 4, pop, pop. In what order are the elements popped?', bn: 'খালি স্ট্যাকে: push 1, push 2, pop, push 3, push 4, pop, pop। উপাদানগুলো কোন ক্রমে পপ হয়?' },
    options: ['2, 4, 3', '2, 3, 4', '1, 2, 3', '4, 3, 2'], answer: 0,
    explain: { en: 'After push 1, 2 the top is 2, so pop gives 2. Then the stack is [1, 3, 4]; the next pops give 4, then 3. 1 stays on the stack.', bn: 'push 1, 2-এর পর শীর্ষে ২, তাই pop দেয় ২। এরপর স্ট্যাক [1, 3, 4]; পরের দুটি pop দেয় ৪, তারপর ৩। ১ স্ট্যাকে থেকে যায়।' },
  },
  {
    id: 'ux-ds3', type: 'mcq', subject: 'dataStructures', chapter: 'trees', topic: 'traversal', board: 'final', year: 2022,
    source: { en: 'CSE-2101 Final 2022', bn: 'সিএসই-২১০১ ফাইনাল ২০২২' }, solved: 91,
    q: { en: 'Which traversal of a binary search tree lists the keys in ascending order?', bn: 'বাইনারি সার্চ ট্রির কোন ট্রাভার্সাল কী-গুলোকে ঊর্ধ্বক্রমে দেয়?' },
    options: [
      { en: 'Preorder', bn: 'প্রি-অর্ডার' },
      { en: 'Inorder', bn: 'ইন-অর্ডার' },
      { en: 'Postorder', bn: 'পোস্ট-অর্ডার' },
      { en: 'Level order', bn: 'লেভেল-অর্ডার' },
    ],
    answer: 1,
    explain: { en: 'Inorder visits left subtree, node, right subtree. In a BST everything on the left is smaller and everything on the right is larger, so the output is sorted.', bn: 'ইন-অর্ডার আগে বাম সাবট্রি, তারপর নোড, তারপর ডান সাবট্রি দেখে। BST-তে বামের সব ছোট ও ডানের সব বড়, তাই ফলাফল সাজানো হয়।' },
  },
  {
    id: 'ux-ds4', type: 'mcq', subject: 'dataStructures', chapter: 'trees', topic: 'heaps', board: 'final', year: 2024,
    source: { en: 'CSE-2101 Final 2024', bn: 'সিএসই-২১০১ ফাইনাল ২০২৪' }, solved: 70,
    q: { en: 'In a binary heap stored in a 0-indexed array, where is the parent of the node at index i?', bn: '০-ইনডেক্সড অ্যারেতে রাখা বাইনারি হিপে i ইনডেক্সের নোডের প্যারেন্ট কোথায়?' },
    options: ['⌊(i − 1)/2⌋', '2i + 1', '⌊i/2⌋ + 1', '2i'], answer: 0,
    explain: { en: 'Children of i are at 2i + 1 and 2i + 2, so the parent of i is ⌊(i − 1)/2⌋.', bn: 'i-এর সন্তান 2i + 1 ও 2i + 2-এ থাকে, তাই i-এর প্যারেন্ট ⌊(i − 1)/2⌋।' },
  },
  {
    id: 'ux-ds5', type: 'mcq', subject: 'dataStructures', chapter: 'trees', topic: 'avl', board: 'mid', year: 2023,
    source: { en: 'CSE-2101 Mid 2023', bn: 'সিএসই-২১০১ মিড ২০২৩' }, solved: 79,
    q: { en: 'In an AVL tree, the balance factor of every node must be one of:', bn: 'এভিএল ট্রিতে প্রতিটি নোডের ব্যালান্স ফ্যাক্টর কোন মানগুলোর একটি হতে হবে?' },
    options: ['{−1, 0, 1}', '{0, 1}', '{−2, −1, 0, 1, 2}', '{0}'], answer: 0,
    explain: { en: 'The heights of the left and right subtrees may differ by at most 1. This keeps the height O(log n); a rotation fixes any node that reaches ±2.', bn: 'বাম ও ডান সাবট্রির উচ্চতার পার্থক্য সর্বোচ্চ ১ হতে পারে। এতে উচ্চতা O(log n) থাকে; কোনো নোড ±২ হলে রোটেশন দিয়ে ঠিক করা হয়।' },
  },
  {
    id: 'ux-ds6', type: 'mcq', subject: 'dataStructures', chapter: 'hashing', topic: 'collisions', board: 'final', year: 2023,
    source: { en: 'CSE-2101 Final 2023', bn: 'সিএসই-২১০১ ফাইনাল ২০২৩' }, solved: 74,
    q: { en: 'Keys 15, 25 and 35 are inserted in that order into an empty table of size 10 with h(k) = k mod 10 and linear probing. At which index is 35 stored?', bn: 'h(k) = k mod 10 ও লিনিয়ার প্রোবিং ব্যবহার করে ১০ আকারের খালি টেবিলে ক্রমানুসারে 15, 25 ও 35 রাখা হলো। 35 কোন ইনডেক্সে থাকবে?' },
    options: ['5', '6', '7', '8'], answer: 2,
    explain: { en: '15 → 5. 25 hashes to 5 (taken) and moves to 6. 35 hashes to 5, then 6 is taken too, so it goes to 7.', bn: '15 → 5। 25-এর হ্যাশ 5 (ভরা), তাই 6-এ যায়। 35-এর হ্যাশ 5, 6-ও ভরা, তাই 7-এ যায়।' },
  },
  {
    id: 'ux-ds7', type: 'creative', subject: 'dataStructures', chapter: 'stacksQueues', topic: 'expressions', board: 'final', year: 2024,
    source: { en: 'CSE-2101 Final 2024', bn: 'সিএসই-২১০১ ফাইনাল ২০২৪' }, solved: 56,
    q: {
      en: '(a) Convert the infix expression A + B * (C − D) / E to postfix using a stack, showing the stack after each symbol. [5]\n(b) Evaluate your postfix expression for A = 2, B = 3, C = 7, D = 1, E = 2, showing the stack at each step. [4]\n(c) Why is a stack the natural structure for this conversion, and what is its time complexity for an expression of length n? [3]',
      bn: '(ক) স্ট্যাক ব্যবহার করে ইনফিক্স রাশি A + B * (C − D) / E-কে পোস্টফিক্সে রূপান্তর করো; প্রতিটি চিহ্নের পর স্ট্যাকের অবস্থা দেখাও। [৫]\n(খ) A = 2, B = 3, C = 7, D = 1, E = 2 হলে তোমার পোস্টফিক্স রাশির মান নির্ণয় করো; প্রতি ধাপে স্ট্যাক দেখাও। [৪]\n(গ) এই রূপান্তরে স্ট্যাক কেন স্বাভাবিক পছন্দ, এবং n দৈর্ঘ্যের রাশিতে এর সময় জটিলতা কত? [৩]',
    },
    explain: {
      en: '(a) Scan left to right: A → output A. + → stack [+]. B → output AB. * has higher precedence than + → stack [+, *]. ( → stack [+, *, (]. C → ABC. − → stack [+, *, (, −]. D → ABCD. ) → pop until ( : output ABCD−, stack [+, *]. / has the same precedence as * and is left-associative, so pop * → ABCD−*, then push / → stack [+, /]. E → ABCD−*E. End: pop / and + → postfix A B C D − * E / +.\n(b) Push 2, 3, 7, 1. − → 7 − 1 = 6, stack [2, 3, 6]. * → 18, stack [2, 18]. Push 2. / → 9, stack [2, 9]. + → 11. Result 11 (check: 2 + 3 × 6 / 2 = 11).\n(c) Operators must wait until an operator of lower or equal precedence or a closing bracket arrives, and the most recently delayed one is released first: last in, first out. Each symbol is pushed and popped at most once, so conversion and evaluation both take O(n) time and O(n) extra space.',
      bn: '(ক) বাম থেকে ডানে পড়ি: A → আউটপুট A। + → স্ট্যাক [+]। B → AB। *-এর অগ্রাধিকার +-এর চেয়ে বেশি → স্ট্যাক [+, *]। ( → স্ট্যাক [+, *, (]। C → ABC। − → স্ট্যাক [+, *, (, −]। D → ABCD। ) → ( পর্যন্ত পপ: আউটপুট ABCD−, স্ট্যাক [+, *]। /-এর অগ্রাধিকার *-এর সমান ও বাম-সহযোগী, তাই * পপ → ABCD−*, তারপর / পুশ → স্ট্যাক [+, /]। E → ABCD−*E। শেষে / ও + পপ → পোস্টফিক্স A B C D − * E / +।\n(খ) 2, 3, 7, 1 পুশ। − → 7 − 1 = 6, স্ট্যাক [2, 3, 6]। * → 18, স্ট্যাক [2, 18]। 2 পুশ। / → 9, স্ট্যাক [2, 9]। + → 11। ফল ১১ (যাচাই: 2 + 3 × 6 / 2 = 11)।\n(গ) কম বা সমান অগ্রাধিকারের অপারেটর বা বন্ধনী বন্ধ না আসা পর্যন্ত অপারেটরকে অপেক্ষা করতে হয়, আর সবশেষে রাখা অপারেটরটি আগে বের হয়: লাস্ট ইন, ফার্স্ট আউট। প্রতিটি চিহ্ন সর্বোচ্চ একবার পুশ ও একবার পপ হয়, তাই রূপান্তর ও মূল্যায়ন দুটিই O(n) সময় ও O(n) অতিরিক্ত জায়গা নেয়।',
    },
  },
  {
    id: 'ux-ds8', type: 'creative', subject: 'dataStructures', chapter: 'hashing', topic: 'collisions', board: 'final', year: 2022,
    source: { en: 'CSE-2101 Final 2022', bn: 'সিএসই-২১০১ ফাইনাল ২০২২' }, solved: 48,
    q: {
      en: '(a) Insert the keys 10, 22, 31, 4, 15, 28, 17, 88, 59 in that order into an empty hash table of size 11 using h(k) = k mod 11 and linear probing. Show the final table. [5]\n(b) What is the load factor after all insertions? [2]\n(c) Explain primary clustering using your table, and compare linear probing with separate chaining. [5]',
      bn: '(ক) h(k) = k mod 11 ও লিনিয়ার প্রোবিং ব্যবহার করে ১১ আকারের খালি হ্যাশ টেবিলে ক্রমানুসারে 10, 22, 31, 4, 15, 28, 17, 88, 59 রাখো। চূড়ান্ত টেবিল দেখাও। [৫]\n(খ) সব কী রাখার পর লোড ফ্যাক্টর কত? [২]\n(গ) তোমার টেবিলের সাহায্যে প্রাইমারি ক্লাস্টারিং ব্যাখ্যা করো এবং লিনিয়ার প্রোবিংকে সেপারেট চেইনিংয়ের সাথে তুলনা করো। [৫]',
    },
    explain: {
      en: '(a) 10 → 10. 22 → 0. 31 → 9. 4 → 4. 15 → 4 (taken) → 5. 28 → 6. 17 → 6 (taken) → 7. 88 → 0 (taken) → 1. 59 → 4, 5, 6, 7 taken → 8. Final table: [0] 22, [1] 88, [2] –, [3] –, [4] 4, [5] 15, [6] 28, [7] 17, [8] 59, [9] 31, [10] 10.\n(b) α = n/m = 9/11 ≈ 0.82.\n(c) Linear probing fills runs of consecutive slots. Slots 4–10 form one long run, so any key hashing anywhere in 4–10 must walk to the end of it; 59 needed 5 probes. Long runs grow faster because more keys land in them: primary clustering. Separate chaining keeps a list per slot, so collisions only lengthen that slot’s list, there is no clustering, and α may exceed 1; the cost is extra pointer memory and poorer cache locality. Linear probing is cache-friendly but needs α kept well below 1 (e.g. rehash at 0.7).',
      bn: '(ক) 10 → 10। 22 → 0। 31 → 9। 4 → 4। 15 → 4 (ভরা) → 5। 28 → 6। 17 → 6 (ভরা) → 7। 88 → 0 (ভরা) → 1। 59 → 4, 5, 6, 7 ভরা → 8। চূড়ান্ত টেবিল: [0] 22, [1] 88, [2] –, [3] –, [4] 4, [5] 15, [6] 28, [7] 17, [8] 59, [9] 31, [10] 10।\n(খ) α = n/m = 9/11 ≈ ০.৮২।\n(গ) লিনিয়ার প্রোবিংয়ে পরপর ঘর ভরে দীর্ঘ সারি তৈরি হয়। ৪–১০ ঘর একটি লম্বা সারি, তাই ৪–১০-এর যেকোনো ঘরে হ্যাশ হওয়া কী-কে সারির শেষ পর্যন্ত যেতে হয়; 59-এর ৫টি প্রোব লেগেছে। লম্বা সারিতে বেশি কী পড়ে বলে এরা আরও দ্রুত বাড়ে: এটিই প্রাইমারি ক্লাস্টারিং। সেপারেট চেইনিংয়ে প্রতি ঘরে একটি লিস্ট থাকে, তাই কলিশনে শুধু সেই লিস্ট লম্বা হয়, ক্লাস্টারিং হয় না এবং α ১-এর বেশিও হতে পারে; তবে পয়েন্টারের জন্য বাড়তি মেমরি লাগে ও ক্যাশ লোকালিটি কম। লিনিয়ার প্রোবিং ক্যাশ-বান্ধব, কিন্তু α ১-এর বেশ নিচে রাখতে হয় (যেমন ০.৭-এ রিহ্যাশ)।',
    },
  },

  // CSE-2203 Database Systems
  {
    id: 'ux-db1', type: 'mcq', subject: 'databases', chapter: 'er', topic: 'cardinality', board: 'mid', year: 2024,
    source: { en: 'CSE-2203 Mid 2024', bn: 'সিএসই-২২০৩ মিড ২০২৪' }, solved: 92,
    q: { en: 'A student can enrol in many courses and a course can have many students. What is the cardinality of Enrols?', bn: 'একজন শিক্ষার্থী অনেক কোর্সে ভর্তি হতে পারে এবং একটি কোর্সে অনেক শিক্ষার্থী থাকতে পারে। Enrols রিলেশনশিপের কার্ডিনালিটি কী?' },
    options: [
      { en: 'One-to-one', bn: 'এক-এক' },
      { en: 'One-to-many', bn: 'এক-বহু' },
      { en: 'Many-to-many', bn: 'বহু-বহু' },
      { en: 'Many-to-one', bn: 'বহু-এক' },
    ],
    answer: 2,
    explain: { en: 'Both sides can relate to many entities on the other side, so it is many-to-many (M:N). In the relational schema it becomes a separate table keyed by both IDs.', bn: 'উভয় পাশই অন্য পাশের অনেক এনটিটির সাথে যুক্ত হতে পারে, তাই এটি বহু-বহু (M:N)। রিলেশনাল স্কিমায় এটি দুই আইডি মিলিয়ে কী-বিশিষ্ট আলাদা টেবিল হয়।' },
  },
  {
    id: 'ux-db2', type: 'mcq', subject: 'databases', chapter: 'er', topic: 'weakEntities', board: 'final', year: 2023,
    source: { en: 'CSE-2203 Final 2023', bn: 'সিএসই-২২০৩ ফাইনাল ২০২৩' }, solved: 77,
    q: { en: 'How is a weak entity set drawn in an ER diagram?', bn: 'ইআর ডায়াগ্রামে দুর্বল এনটিটি সেট কীভাবে আঁকা হয়?' },
    options: [
      { en: 'Double rectangle', bn: 'দ্বৈত আয়তক্ষেত্র' },
      { en: 'Dashed ellipse', bn: 'ড্যাশড উপবৃত্ত' },
      { en: 'Double ellipse', bn: 'দ্বৈত উপবৃত্ত' },
      { en: 'Single diamond', bn: 'একক রম্বস' },
    ],
    answer: 0,
    explain: { en: 'A weak entity set is a double rectangle and its identifying relationship a double diamond. A dashed ellipse is a derived attribute and a double ellipse a multivalued one.', bn: 'দুর্বল এনটিটি সেট দ্বৈত আয়তক্ষেত্র এবং এর আইডেন্টিফাইং রিলেশনশিপ দ্বৈত রম্বস দিয়ে আঁকা হয়। ড্যাশড উপবৃত্ত হলো ডিরাইভড অ্যাট্রিবিউট, দ্বৈত উপবৃত্ত মাল্টিভ্যালুড অ্যাট্রিবিউট।' },
  },
  {
    id: 'ux-db3', type: 'mcq', subject: 'databases', chapter: 'normalisation', topic: 'functionalDeps', board: 'final', year: 2024,
    source: { en: 'CSE-2203 Final 2024', bn: 'সিএসই-২২০৩ ফাইনাল ২০২৪' }, solved: 68,
    q: { en: 'R(A, B, C, D) has the functional dependencies A → B, B → C and C → D. What is the candidate key of R?', bn: 'R(A, B, C, D)-এ ফাংশনাল ডিপেনডেন্সি A → B, B → C ও C → D। R-এর ক্যান্ডিডেট কী কোনটি?' },
    options: ['A', 'B', 'AB', 'CD'], answer: 0,
    explain: { en: 'A⁺ = {A, B, C, D}, so A determines everything. Nothing determines A, so every key must contain it, and A alone is minimal. AB is a superkey but not minimal.', bn: 'A⁺ = {A, B, C, D}, তাই A সবকিছু নির্ধারণ করে। কিছুই A-কে নির্ধারণ করে না, তাই প্রতিটি কী-তে A থাকতে হবে, এবং শুধু A-ই ন্যূনতম। AB সুপারকী, কিন্তু ন্যূনতম নয়।' },
  },
  {
    id: 'ux-db4', type: 'mcq', subject: 'databases', chapter: 'normalisation', topic: 'normalForms', board: 'mid', year: 2023,
    source: { en: 'CSE-2203 Mid 2023', bn: 'সিএসই-২২০৩ মিড ২০২৩' }, solved: 75,
    q: { en: 'A relation is in 2NF if it is in 1NF and has no:', bn: 'একটি রিলেশন 2NF-এ থাকে যদি তা 1NF-এ থাকে এবং এতে কোনো:' },
    options: [
      { en: 'Partial dependency on a candidate key', bn: 'ক্যান্ডিডেট কী-এর ওপর আংশিক নির্ভরতা না থাকে' },
      { en: 'Transitive dependency', bn: 'ট্রানজিটিভ নির্ভরতা না থাকে' },
      { en: 'Multivalued dependency', bn: 'মাল্টিভ্যালুড নির্ভরতা না থাকে' },
      { en: 'Join dependency', bn: 'জয়েন নির্ভরতা না থাকে' },
    ],
    answer: 0,
    explain: { en: '2NF removes partial dependencies: no non-prime attribute may depend on only part of a composite candidate key. Removing transitive dependencies gives 3NF.', bn: '2NF আংশিক নির্ভরতা দূর করে: কোনো নন-প্রাইম অ্যাট্রিবিউট যৌগিক ক্যান্ডিডেট কী-এর শুধু একাংশের ওপর নির্ভর করতে পারবে না। ট্রানজিটিভ নির্ভরতা দূর করলে 3NF হয়।' },
  },
  {
    id: 'ux-db5', type: 'mcq', subject: 'databases', chapter: 'sql', topic: 'aggregation', board: 'final', year: 2022,
    source: { en: 'CSE-2203 Final 2022', bn: 'সিএসই-২২০৩ ফাইনাল ২০২২' }, solved: 86,
    q: { en: 'Which SQL clause filters groups after GROUP BY?', bn: 'GROUP BY-এর পর গ্রুপ ফিল্টার করতে কোন SQL ক্লজ ব্যবহৃত হয়?' },
    options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'], answer: 1,
    explain: { en: 'WHERE filters rows before grouping; HAVING filters the groups afterwards and may use aggregates, e.g. HAVING COUNT(*) > 30.', bn: 'WHERE গ্রুপ করার আগে সারি ফিল্টার করে; HAVING পরে গ্রুপ ফিল্টার করে এবং অ্যাগ্রিগেট ব্যবহার করতে পারে, যেমন HAVING COUNT(*) > 30।' },
  },
  {
    id: 'ux-db6', type: 'mcq', subject: 'databases', chapter: 'sql', topic: 'joins', board: 'final', year: 2024,
    source: { en: 'CSE-2203 Final 2024', bn: 'সিএসই-২২০৩ ফাইনাল ২০২৪' }, solved: 83,
    q: { en: 'Table A has 3 rows and table B has 4 rows. How many rows does A CROSS JOIN B return?', bn: 'টেবিল A-তে ৩টি ও টেবিল B-তে ৪টি সারি আছে। A CROSS JOIN B কয়টি সারি দেবে?' },
    options: ['3', '4', '7', '12'], answer: 3,
    explain: { en: 'A cross join is the Cartesian product: every row of A pairs with every row of B, 3 × 4 = 12.', bn: 'ক্রস জয়েন হলো কার্তেসীয় গুণফল: A-এর প্রতিটি সারি B-এর প্রতিটি সারির সাথে জোড়া হয়, ৩ × ৪ = ১২।' },
  },
  {
    id: 'ux-db7', type: 'creative', subject: 'databases', chapter: 'normalisation', topic: 'normalForms', board: 'final', year: 2023,
    source: { en: 'CSE-2203 Final 2023', bn: 'সিএসই-২২০৩ ফাইনাল ২০২৩' }, solved: 52,
    q: {
      en: 'Consider Enrolment(StudentID, CourseID, StudentName, CourseTitle, Instructor, InstructorRoom, Grade) with the functional dependencies:\nStudentID → StudentName\nCourseID → CourseTitle, Instructor\nInstructor → InstructorRoom\n{StudentID, CourseID} → Grade\n(a) Find the candidate key. [2]\n(b) What is the highest normal form of Enrolment? Justify. [4]\n(c) Decompose it into 3NF and show the decomposition is lossless and dependency-preserving. [6]',
      bn: 'Enrolment(StudentID, CourseID, StudentName, CourseTitle, Instructor, InstructorRoom, Grade) রিলেশনে ফাংশনাল ডিপেনডেন্সিগুলো:\nStudentID → StudentName\nCourseID → CourseTitle, Instructor\nInstructor → InstructorRoom\n{StudentID, CourseID} → Grade\n(ক) ক্যান্ডিডেট কী নির্ণয় করো। [২]\n(খ) Enrolment সর্বোচ্চ কোন নরমাল ফর্মে আছে? যুক্তি দাও। [৪]\n(গ) একে 3NF-এ বিভাজন করো এবং দেখাও যে বিভাজনটি লসলেস ও ডিপেনডেন্সি-সংরক্ষণকারী। [৬]',
    },
    explain: {
      en: '(a) {StudentID, CourseID}⁺ gives StudentName, CourseTitle, Instructor, InstructorRoom and Grade: all attributes. Neither ID alone does, so {StudentID, CourseID} is the candidate key.\n(b) 1NF only (assuming atomic values). StudentName depends on StudentID alone and CourseTitle, Instructor on CourseID alone: partial dependencies on the key, which violate 2NF. There is also a transitive dependency CourseID → Instructor → InstructorRoom.\n(c) Student(StudentID, StudentName); Course(CourseID, CourseTitle, Instructor); Instructor(Instructor, InstructorRoom); Enrolment(StudentID, CourseID, Grade). Each FD lies wholly inside one relation, so dependencies are preserved. Each join is on an attribute that is a key of one side (StudentID, CourseID, Instructor), so the decomposition is lossless. Every determinant is a key of its relation, so all four are in BCNF and therefore 3NF.',
      bn: '(ক) {StudentID, CourseID}⁺ থেকে StudentName, CourseTitle, Instructor, InstructorRoom ও Grade পাওয়া যায়: সব অ্যাট্রিবিউট। কোনো একটি আইডি একা তা পারে না, তাই {StudentID, CourseID} ক্যান্ডিডেট কী।\n(খ) শুধু 1NF (মানগুলো অ্যাটমিক ধরে)। StudentName শুধু StudentID-এর ওপর এবং CourseTitle, Instructor শুধু CourseID-এর ওপর নির্ভরশীল: কী-এর ওপর আংশিক নির্ভরতা, যা 2NF ভঙ্গ করে। এ ছাড়া CourseID → Instructor → InstructorRoom একটি ট্রানজিটিভ নির্ভরতা।\n(গ) Student(StudentID, StudentName); Course(CourseID, CourseTitle, Instructor); Instructor(Instructor, InstructorRoom); Enrolment(StudentID, CourseID, Grade)। প্রতিটি FD সম্পূর্ণভাবে একটি রিলেশনের ভেতরে আছে, তাই ডিপেনডেন্সি সংরক্ষিত। প্রতিটি জয়েন এমন অ্যাট্রিবিউটে হয় যা এক পাশের কী (StudentID, CourseID, Instructor), তাই বিভাজন লসলেস। প্রতিটি নির্ধারক তার রিলেশনের কী, তাই চারটিই BCNF-এ এবং ফলে 3NF-এও আছে।',
    },
  },
  {
    id: 'ux-db8', type: 'creative', subject: 'databases', chapter: 'sql', topic: 'joins', board: 'final', year: 2024,
    source: { en: 'CSE-2203 Final 2024', bn: 'সিএসই-২২০৩ ফাইনাল ২০২৪' }, solved: 59,
    q: {
      en: 'Schema: Student(id, name, dept), Course(id, title, credits), Enrol(student_id, course_id, grade). Write SQL to:\n(a) List the names of all students in the CSE department. [2]\n(b) For each course, show its title and the number of students enrolled, only for courses with more than 30 students. [5]\n(c) List the names of students who have not enrolled in any course, and explain why an inner join cannot answer this. [5]',
      bn: 'স্কিমা: Student(id, name, dept), Course(id, title, credits), Enrol(student_id, course_id, grade)। SQL লেখো:\n(ক) CSE বিভাগের সব শিক্ষার্থীর নাম দেখাও। [২]\n(খ) প্রতিটি কোর্সের নাম ও ভর্তি হওয়া শিক্ষার্থীর সংখ্যা দেখাও, শুধু যেসব কোর্সে ৩০ জনের বেশি শিক্ষার্থী আছে। [৫]\n(গ) যেসব শিক্ষার্থী কোনো কোর্সে ভর্তি হয়নি তাদের নাম দেখাও, এবং ইনার জয়েন দিয়ে কেন এটি পাওয়া যায় না ব্যাখ্যা করো। [৫]',
    },
    explain: {
      en: "(a) SELECT name FROM Student WHERE dept = 'CSE';\n(b) SELECT c.title, COUNT(*) AS enrolled FROM Course c JOIN Enrol e ON e.course_id = c.id GROUP BY c.id, c.title HAVING COUNT(*) > 30;\n(c) SELECT s.name FROM Student s LEFT JOIN Enrol e ON e.student_id = s.id WHERE e.student_id IS NULL;\n(or: WHERE NOT EXISTS (SELECT 1 FROM Enrol e WHERE e.student_id = s.id)). An inner join keeps only rows that match on both sides, so a student with no Enrol row never appears. A left join keeps every student and fills the Enrol columns with NULL where there is no match, and the IS NULL test picks exactly those students.",
      bn: "(ক) SELECT name FROM Student WHERE dept = 'CSE';\n(খ) SELECT c.title, COUNT(*) AS enrolled FROM Course c JOIN Enrol e ON e.course_id = c.id GROUP BY c.id, c.title HAVING COUNT(*) > 30;\n(গ) SELECT s.name FROM Student s LEFT JOIN Enrol e ON e.student_id = s.id WHERE e.student_id IS NULL;\n(অথবা: WHERE NOT EXISTS (SELECT 1 FROM Enrol e WHERE e.student_id = s.id))। ইনার জয়েন শুধু দুই পাশে মেলে এমন সারি রাখে, তাই যার কোনো Enrol সারি নেই সেই শিক্ষার্থী কখনো আসে না। লেফট জয়েন সব শিক্ষার্থী রাখে এবং মিল না থাকলে Enrol কলামে NULL বসায়; IS NULL শর্ত ঠিক সেই শিক্ষার্থীদের বেছে নেয়।",
    },
  },
]

export const extraQuestions = { school, college, university }
