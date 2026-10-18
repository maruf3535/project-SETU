// Question bank per student level. MCQ `answer` is the index of the correct option.
// `source` is the board / admission test / semester the question appeared in; `solved` is the share who got it right.
const school = [
  {
    id: 'sq1', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Dhaka Board 2023', bn: 'ঢাকা বোর্ড ২০২৩' }, solved: 82,
    q: { en: 'A 5 kg block is pushed with a force of 20 N on a frictionless surface. What is its acceleration?', bn: 'ঘর্ষণহীন তলে ৫ kg ভরের একটি ব্লককে ২০ N বল দিয়ে ধাক্কা দেওয়া হলো। এর ত্বরণ কত?' },
    options: ['2 m/s²', '4 m/s²', '25 m/s²', '100 m/s²'], answer: 1,
    explain: { en: 'F = ma, so a = F/m = 20/5 = 4 m/s².', bn: 'F = ma, তাই a = F/m = ২০/৫ = ৪ m/s²।' },
  },
  {
    id: 'sq2', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Rajshahi Board 2022', bn: 'রাজশাহী বোর্ড ২০২২' }, solved: 91,
    q: { en: 'Which of Newton’s laws is called the law of inertia?', bn: 'নিউটনের কোন সূত্রকে জড়তার সূত্র বলা হয়?' },
    options: [{ en: 'First law', bn: 'প্রথম সূত্র' }, { en: 'Second law', bn: 'দ্বিতীয় সূত্র' }, { en: 'Third law', bn: 'তৃতীয় সূত্র' }, { en: 'Law of gravitation', bn: 'মহাকর্ষ সূত্র' }], answer: 0,
    explain: { en: 'The first law says a body keeps its state of rest or uniform motion unless a force acts on it. That property is inertia.', bn: 'প্রথম সূত্র বলে, বল প্রয়োগ না করলে বস্তু তার স্থির বা সুষম গতির অবস্থা বজায় রাখে। এই ধর্মই জড়তা।' },
  },
  {
    id: 'sq3', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Cumilla Board 2023', bn: 'কুমিল্লা বোর্ড ২০২৩' }, solved: 76,
    q: { en: 'A car starts from rest and reaches 20 m/s in 5 s. What is its acceleration?', bn: 'একটি গাড়ি স্থির অবস্থা থেকে ৫ s-এ ২০ m/s বেগ অর্জন করে। এর ত্বরণ কত?' },
    options: ['2 m/s²', '4 m/s²', '5 m/s²', '100 m/s²'], answer: 1,
    explain: { en: 'a = (v − u)/t = (20 − 0)/5 = 4 m/s².', bn: 'a = (v − u)/t = (২০ − ০)/৫ = ৪ m/s²।' },
  },
  {
    id: 'sq4', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Jashore Board 2021', bn: 'যশোর বোর্ড ২০২১' }, solved: 68,
    q: { en: 'What is the SI unit of momentum?', bn: 'ভরবেগের এসআই একক কোনটি?' },
    options: ['kg m s⁻¹', 'N m⁻¹', 'kg m s⁻²', 'J s'], answer: 0,
    explain: { en: 'Momentum p = mv, so its unit is kg × m/s = kg m s⁻¹.', bn: 'ভরবেগ p = mv, তাই একক kg × m/s = kg m s⁻¹।' },
  },
  {
    id: 'sq5', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Dinajpur Board 2022', bn: 'দিনাজপুর বোর্ড ২০২২' }, solved: 64,
    q: { en: 'A ball dropped from rest falls for 2 s (g = 9.8 m/s²). What is its velocity then?', bn: 'স্থির অবস্থা থেকে ছেড়ে দেওয়া একটি বল ২ s পড়ে (g = ৯.৮ m/s²)। তখন এর বেগ কত?' },
    options: ['4.9 m/s', '9.8 m/s', '19.6 m/s', '39.2 m/s'], answer: 2,
    explain: { en: 'v = u + gt = 0 + 9.8 × 2 = 19.6 m/s.', bn: 'v = u + gt = ০ + ৯.৮ × ২ = ১৯.৬ m/s।' },
  },
  {
    id: 'sq6', type: 'mcq', subject: 'physics', chapter: 'force', source: { en: 'Sylhet Board 2023', bn: 'সিলেট বোর্ড ২০২৩' }, solved: 79,
    q: { en: 'A standing passenger jerks forward when a moving bus stops suddenly. This is due to:', bn: 'চলন্ত বাস হঠাৎ থামলে দাঁড়ানো যাত্রী সামনের দিকে ঝুঁকে পড়েন। এর কারণ:' },
    options: [{ en: 'Inertia of motion', bn: 'গতি জড়তা' }, { en: 'Inertia of rest', bn: 'স্থিতি জড়তা' }, { en: 'Friction', bn: 'ঘর্ষণ' }, { en: 'Gravity', bn: 'অভিকর্ষ' }], answer: 0,
    explain: { en: 'The lower body stops with the bus, but the upper body tends to keep moving: inertia of motion.', bn: 'শরীরের নিচের অংশ বাসের সাথে থেমে যায়, কিন্তু উপরের অংশ গতিশীল থাকতে চায়: গতি জড়তা।' },
  },
  {
    id: 'sq7', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Chattogram Board 2022', bn: 'চট্টগ্রাম বোর্ড ২০২২' }, solved: 88,
    q: { en: 'A 10 N force moves an object 5 m in its own direction. How much work is done?', bn: '১০ N বল একটি বস্তুকে বলের দিকে ৫ m সরায়। কত কাজ হয়?' },
    options: ['2 J', '15 J', '50 J', '500 J'], answer: 2,
    explain: { en: 'W = Fs = 10 × 5 = 50 J.', bn: 'W = Fs = ১০ × ৫ = ৫০ J।' },
  },
  {
    id: 'sq8', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Barishal Board 2023', bn: 'বরিশাল বোর্ড ২০২৩' }, solved: 71,
    q: { en: 'What is the kinetic energy of a 2 kg mass moving at 3 m/s?', bn: '৩ m/s বেগে চলমান ২ kg ভরের গতিশক্তি কত?' },
    options: ['6 J', '9 J', '18 J', '36 J'], answer: 1,
    explain: { en: 'Eₖ = ½mv² = ½ × 2 × 3² = 9 J.', bn: 'Eₖ = ½mv² = ½ × ২ × ৩² = ৯ J।' },
  },
  {
    id: 'sq9', type: 'mcq', subject: 'physics', chapter: 'work', source: { en: 'Mymensingh Board 2023', bn: 'ময়মনসিংহ বোর্ড ২০২৩' }, solved: 93,
    q: { en: 'What is the unit of power?', bn: 'ক্ষমতার একক কোনটি?' },
    options: [{ en: 'Watt', bn: 'ওয়াট' }, { en: 'Joule', bn: 'জুল' }, { en: 'Newton', bn: 'নিউটন' }, { en: 'Pascal', bn: 'প্যাসকেল' }], answer: 0,
    explain: { en: 'Power is work per second: 1 W = 1 J/s.', bn: 'ক্ষমতা হলো প্রতি সেকেন্ডে কাজ: ১ W = ১ J/s।' },
  },
  {
    id: 'sq10', type: 'mcq', subject: 'physics', chapter: 'motion', source: { en: 'Dhaka Board 2021', bn: 'ঢাকা বোর্ড ২০২১' }, solved: 74,
    q: { en: 'For a body moving with uniform velocity, the distance–time graph is:', bn: 'সুষম বেগে চলমান বস্তুর দূরত্ব–সময় লেখচিত্র কেমন?' },
    options: [
      { en: 'A sloped straight line', bn: 'একটি হেলানো সরলরেখা' },
      { en: 'A horizontal line', bn: 'একটি অনুভূমিক রেখা' },
      { en: 'A parabola', bn: 'একটি পরাবৃত্ত' },
      { en: 'A vertical line', bn: 'একটি উল্লম্ব রেখা' },
    ],
    answer: 0,
    explain: { en: 'Equal distance in equal time gives a straight line; its slope is the velocity.', bn: 'সমান সময়ে সমান দূরত্ব মানে সরলরেখা; এর ঢাল হলো বেগ।' },
  },
  {
    id: 'sc1', type: 'creative', subject: 'physics', chapter: 'force', source: { en: 'AI generated', bn: 'এআই তৈরি' }, ai: true, solved: 58,
    q: { en: 'Explain why a passenger jerks forward when a moving bus stops suddenly.', bn: 'চলন্ত বাস হঠাৎ থামলে যাত্রী কেন সামনের দিকে ঝুঁকে পড়েন, ব্যাখ্যা করো।' },
    explain: { en: 'The bus and the passenger’s feet stop together because of friction. The upper body, still moving forward, keeps its motion because of inertia of motion, so it leans forward.', bn: 'ঘর্ষণের কারণে বাস ও যাত্রীর পা একসাথে থেমে যায়। উপরের অংশ গতি জড়তার কারণে সামনে চলতে থাকে, তাই যাত্রী সামনে ঝুঁকে পড়েন।' },
  },
  {
    id: 'sc2', type: 'creative', subject: 'physics', chapter: 'force', source: { en: 'Dhaka Board 2022', bn: 'ঢাকা বোর্ড ২০২২' }, solved: 47,
    q: { en: 'A 1000 kg car moving at 20 m/s stops in 4 s. (a) Find its deceleration. (b) Find the braking force.', bn: '২০ m/s বেগে চলমান ১০০০ kg ভরের গাড়ি ৪ s-এ থেমে যায়। (ক) মন্দন নির্ণয় করো। (খ) ব্রেকিং বল নির্ণয় করো।' },
    explain: { en: '(a) a = (0 − 20)/4 = −5 m/s², so the deceleration is 5 m/s². (b) F = ma = 1000 × 5 = 5000 N.', bn: '(ক) a = (০ − ২০)/৪ = −৫ m/s², তাই মন্দন ৫ m/s²। (খ) F = ma = ১০০০ × ৫ = ৫০০০ N।' },
  },
]

const college = [
  {
    id: 'cq1', type: 'mcq', subject: 'chemistry', chapter: 'mole', source: { en: 'Dhaka Board 2023', bn: 'ঢাকা বোর্ড ২০২৩' }, solved: 90,
    q: { en: 'How many molecules are there in one mole of a substance?', bn: 'এক মোল পদার্থে কতটি অণু থাকে?' },
    options: ['6.022 × 10²³', '6.022 × 10²²', '3.011 × 10²³', '1.204 × 10²⁴'], answer: 0,
    explain: { en: 'One mole holds Avogadro’s number of particles, 6.022 × 10²³.', bn: 'এক মোলে অ্যাভোগাড্রো সংখ্যক কণা থাকে, ৬.০২২ × ১০²³।' },
  },
  {
    id: 'cq2', type: 'mcq', subject: 'chemistry', chapter: 'mole', source: { en: 'Rajshahi Board 2022', bn: 'রাজশাহী বোর্ড ২০২২' }, solved: 84,
    q: { en: 'What is the molar mass of H₂SO₄?', bn: 'H₂SO₄-এর মোলার ভর কত?' },
    options: ['49 g/mol', '96 g/mol', '98 g/mol', '100 g/mol'], answer: 2,
    explain: { en: '2(1) + 32 + 4(16) = 98 g/mol.', bn: '২(১) + ৩২ + ৪(১৬) = ৯৮ g/mol।' },
  },
  {
    id: 'cq3', type: 'mcq', subject: 'chemistry', chapter: 'mole', source: { en: 'DU admission 2022', bn: 'ঢাবি ভর্তি ২০২২' }, solved: 72,
    q: { en: 'How many moles are in 22 g of CO₂?', bn: '২২ g CO₂-তে কত মোল আছে?' },
    options: ['0.25', '0.5', '1', '2'], answer: 1,
    explain: { en: 'Molar mass of CO₂ is 44 g/mol, so 22/44 = 0.5 mol.', bn: 'CO₂-এর মোলার ভর ৪৪ g/mol, তাই ২২/৪৪ = ০.৫ মোল।' },
  },
  {
    id: 'cq4', type: 'mcq', subject: 'chemistry', chapter: 'gas', source: { en: 'Cumilla Board 2023', bn: 'কুমিল্লা বোর্ড ২০২৩' }, solved: 86,
    q: { en: 'What volume does one mole of an ideal gas occupy at STP?', bn: 'আদর্শ তাপমাত্রা ও চাপে এক মোল আদর্শ গ্যাসের আয়তন কত?' },
    options: ['11.2 L', '22.4 L', '24.0 L', '44.8 L'], answer: 1,
    explain: { en: 'At STP the molar volume of an ideal gas is 22.4 L.', bn: 'আদর্শ তাপমাত্রা ও চাপে আদর্শ গ্যাসের মোলার আয়তন ২২.৪ L।' },
  },
  {
    id: 'cq5', type: 'mcq', subject: 'chemistry', chapter: 'solution', source: { en: 'BUET admission 2021', bn: 'বুয়েট ভর্তি ২০২১' }, solved: 61,
    q: { en: '4 g of NaOH is dissolved to make 500 mL of solution. What is its molarity?', bn: '৪ g NaOH দ্রবীভূত করে ৫০০ mL দ্রবণ তৈরি করা হলো। এর মোলারিটি কত?' },
    options: ['0.1 M', '0.2 M', '0.4 M', '2 M'], answer: 1,
    explain: { en: '4/40 = 0.1 mol in 0.5 L, so 0.1/0.5 = 0.2 M.', bn: '৪/৪০ = ০.১ মোল, ০.৫ L-এ; তাই ০.১/০.৫ = ০.২ M।' },
  },
  {
    id: 'cq6', type: 'mcq', subject: 'chemistry', chapter: 'mole', source: { en: 'Sylhet Board 2022', bn: 'সিলেট বোর্ড ২০২২' }, solved: 88,
    q: { en: 'What is the mass of 0.5 mol of water?', bn: '০.৫ মোল পানির ভর কত?' },
    options: ['4.5 g', '9 g', '18 g', '36 g'], answer: 1,
    explain: { en: 'Molar mass of H₂O is 18 g/mol, so 0.5 × 18 = 9 g.', bn: 'H₂O-এর মোলার ভর ১৮ g/mol, তাই ০.৫ × ১৮ = ৯ g।' },
  },
  {
    id: 'cq7', type: 'mcq', subject: 'chemistry', chapter: 'stoich', source: { en: 'Chattogram Board 2023', bn: 'চট্টগ্রাম বোর্ড ২০২৩' }, solved: 77,
    q: { en: 'In 2H₂ + O₂ → 2H₂O, how many moles of water form from 4 mol of H₂ with excess O₂?', bn: '2H₂ + O₂ → 2H₂O বিক্রিয়ায় অতিরিক্ত O₂-এর সাথে ৪ মোল H₂ থেকে কত মোল পানি তৈরি হয়?' },
    options: ['2', '4', '6', '8'], answer: 1,
    explain: { en: 'H₂ and H₂O are in a 2 : 2 ratio, so 4 mol H₂ gives 4 mol H₂O.', bn: 'H₂ ও H₂O-এর অনুপাত ২ : ২, তাই ৪ মোল H₂ থেকে ৪ মোল H₂O।' },
  },
  {
    id: 'cq8', type: 'mcq', subject: 'chemistry', chapter: 'mole', source: { en: 'BUET admission 2022', bn: 'বুয়েট ভর্তি ২০২২' }, solved: 55,
    q: { en: 'How many atoms are in one mole of O₂?', bn: 'এক মোল O₂-তে কতটি পরমাণু আছে?' },
    options: ['6.022 × 10²³', '1.204 × 10²⁴', '3.011 × 10²³', '2.409 × 10²⁴'], answer: 1,
    explain: { en: 'Each O₂ molecule has 2 atoms: 2 × 6.022 × 10²³ = 1.204 × 10²⁴.', bn: 'প্রতিটি O₂ অণুতে ২টি পরমাণু: ২ × ৬.০২২ × ১০²³ = ১.২০৪ × ১০²⁴।' },
  },
  {
    id: 'cq9', type: 'mcq', subject: 'chemistry', chapter: 'stoich', source: { en: 'Jashore Board 2022', bn: 'যশোর বোর্ড ২০২২' }, solved: 70,
    q: { en: 'What is the mass percentage of carbon in CH₄?', bn: 'CH₄-এ কার্বনের ভর শতাংশ কত?' },
    options: ['25%', '50%', '75%', '80%'], answer: 2,
    explain: { en: '12/16 × 100 = 75%.', bn: '১২/১৬ × ১০০ = ৭৫%।' },
  },
  {
    id: 'cq10', type: 'mcq', subject: 'chemistry', chapter: 'solution', source: { en: 'Dinajpur Board 2023', bn: 'দিনাজপুর বোর্ড ২০২৩' }, solved: 66,
    q: { en: 'Molality is the number of moles of solute per:', bn: 'মোলালিটি হলো দ্রবের মোল সংখ্যা প্রতি:' },
    options: [
      { en: 'litre of solution', bn: 'লিটার দ্রবণে' },
      { en: 'kilogram of solvent', bn: 'কিলোগ্রাম দ্রাবকে' },
      { en: 'kilogram of solution', bn: 'কিলোগ্রাম দ্রবণে' },
      { en: 'litre of solvent', bn: 'লিটার দ্রাবকে' },
    ],
    answer: 1,
    explain: { en: 'Molality (m) = moles of solute ÷ mass of solvent in kg.', bn: 'মোলালিটি (m) = দ্রবের মোল ÷ কিলোগ্রামে দ্রাবকের ভর।' },
  },
  {
    id: 'cc1', type: 'creative', subject: 'chemistry', chapter: 'solution', source: { en: 'Rajshahi Board 2023', bn: 'রাজশাহী বোর্ড ২০২৩' }, solved: 52,
    q: { en: 'What mass of NaCl is needed to prepare 250 mL of a 0.1 M solution?', bn: '২৫০ mL ০.১ M দ্রবণ তৈরি করতে কত ভরের NaCl প্রয়োজন?' },
    explain: { en: 'Moles = 0.1 × 0.25 = 0.025 mol. Mass = 0.025 × 58.5 = 1.46 g.', bn: 'মোল = ০.১ × ০.২৫ = ০.০২৫ মোল। ভর = ০.০২৫ × ৫৮.৫ = ১.৪৬ g।' },
  },
]

const university = [
  {
    id: 'uq1', type: 'mcq', subject: 'algorithms', chapter: 'analysis', source: { en: 'CSE-2201 Final 2024', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪' }, solved: 89,
    q: { en: 'What is the worst-case time of binary search on n sorted items?', bn: 'n টি সাজানো উপাদানে বাইনারি সার্চের সবচেয়ে খারাপ সময় কত?' },
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1,
    explain: { en: 'Each step halves the range, so at most log₂ n steps.', bn: 'প্রতি ধাপে পরিসর অর্ধেক হয়, তাই সর্বোচ্চ log₂ n ধাপ।' },
  },
  {
    id: 'uq2', type: 'mcq', subject: 'algorithms', chapter: 'sorting', source: { en: 'CSE-2201 Mid 2024', bn: 'সিএসই-২২০১ মিড ২০২৪' }, solved: 81,
    q: { en: 'What is the average-case time of quicksort?', bn: 'কুইকসর্টের গড় সময় কত?' },
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1,
    explain: { en: 'Balanced partitions on average give log n levels of O(n) work.', bn: 'গড়ে সুষম ভাগ হলে log n স্তরে O(n) কাজ হয়।' },
  },
  {
    id: 'uq3', type: 'mcq', subject: 'algorithms', chapter: 'graphs', source: { en: 'CSE-2201 Final 2023', bn: 'সিএসই-২২০১ ফাইনাল ২০২৩' }, solved: 87,
    q: { en: 'Which data structure does breadth-first search use?', bn: 'ব্রেডথ-ফার্স্ট সার্চ কোন ডেটা স্ট্রাকচার ব্যবহার করে?' },
    options: [{ en: 'Stack', bn: 'স্ট্যাক' }, { en: 'Queue', bn: 'কিউ' }, { en: 'Heap', bn: 'হিপ' }, { en: 'Tree', bn: 'ট্রি' }], answer: 1,
    explain: { en: 'BFS visits vertices level by level, first in first out: a queue.', bn: 'BFS স্তর অনুযায়ী ভিজিট করে, আগে আসলে আগে যায়: কিউ।' },
  },
  {
    id: 'uq4', type: 'mcq', subject: 'algorithms', chapter: 'sorting', source: { en: 'CSE-2201 Final 2023', bn: 'সিএসই-২২০১ ফাইনাল ২০২৩' }, solved: 84,
    q: { en: 'What is the worst-case time of merge sort?', bn: 'মার্জ সর্টের সবচেয়ে খারাপ সময় কত?' },
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 1,
    explain: { en: 'It always splits in half and merges in linear time: O(n log n).', bn: 'সবসময় অর্ধেক ভাগ করে রৈখিক সময়ে মেলায়: O(n log n)।' },
  },
  {
    id: 'uq5', type: 'mcq', subject: 'algorithms', chapter: 'graphs', source: { en: 'CSE-2201 Final 2024', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪' }, solved: 69,
    q: { en: 'Dijkstra’s algorithm can give wrong answers when the graph has:', bn: 'গ্রাফে কী থাকলে ডায়াকস্ট্রার অ্যালগরিদম ভুল উত্তর দিতে পারে?' },
    options: [{ en: 'Negative edge weights', bn: 'ঋণাত্মক এজ ওজন' }, { en: 'Cycles', bn: 'চক্র' }, { en: 'Undirected edges', bn: 'অদিক এজ' }, { en: 'Many edges', bn: 'অনেক এজ' }], answer: 0,
    explain: { en: 'It finalises a vertex once reached; a later negative edge could make a shorter path.', bn: 'একবার পৌঁছালে ভার্টেক্স চূড়ান্ত ধরে; পরে ঋণাত্মক এজ ছোট পথ তৈরি করতে পারে।' },
  },
  {
    id: 'uq6', type: 'mcq', subject: 'algorithms', chapter: 'sorting', source: { en: 'CSE-2201 Mid 2023', bn: 'সিএসই-২২০১ মিড ২০২৩' }, solved: 73,
    q: { en: 'Which of these sorting algorithms is stable?', bn: 'নিচের কোন সর্টিং অ্যালগরিদমটি স্থিতিশীল (stable)?' },
    options: [{ en: 'Merge sort', bn: 'মার্জ সর্ট' }, { en: 'Heapsort', bn: 'হিপসর্ট' }, { en: 'Selection sort', bn: 'সিলেকশন সর্ট' }, { en: 'Quicksort', bn: 'কুইকসর্ট' }], answer: 0,
    explain: { en: 'Merge sort keeps equal keys in their original order.', bn: 'মার্জ সর্ট সমান কী-গুলোর মূল ক্রম বজায় রাখে।' },
  },
  {
    id: 'uq7', type: 'mcq', subject: 'algorithms', chapter: 'graphs', source: { en: 'CSE-2201 Final 2022', bn: 'সিএসই-২২০১ ফাইনাল ২০২২' }, solved: 78,
    q: { en: 'How many edges does a complete graph with n vertices have?', bn: 'n ভার্টেক্সের সম্পূর্ণ গ্রাফে কতটি এজ থাকে?' },
    options: ['n', 'n − 1', 'n(n − 1)/2', 'n²'], answer: 2,
    explain: { en: 'Every pair of vertices is joined: n choose 2 = n(n − 1)/2.', bn: 'প্রতিটি জোড়া ভার্টেক্স যুক্ত: nC2 = n(n − 1)/2।' },
  },
  {
    id: 'uq8', type: 'mcq', subject: 'algorithms', chapter: 'analysis', source: { en: 'CSE-2201 Final 2024', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪' }, solved: 66,
    q: { en: 'The recurrence T(n) = 2T(n/2) + n solves to:', bn: 'T(n) = 2T(n/2) + n রিকারেন্সের সমাধান:' },
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1,
    explain: { en: 'Master theorem case 2: a = 2, b = 2, f(n) = n, so Θ(n log n).', bn: 'মাস্টার থিওরেমের দ্বিতীয় ক্ষেত্র: a = 2, b = 2, f(n) = n, তাই Θ(n log n)।' },
  },
  {
    id: 'uq9', type: 'mcq', subject: 'algorithms', chapter: 'graphs', source: { en: 'CSE-2201 Mid 2024', bn: 'সিএসই-২২০১ মিড ২০২৪' }, solved: 75,
    q: { en: 'With an adjacency list, depth-first search on V vertices and E edges takes:', bn: 'অ্যাডজেসেন্সি লিস্টে V ভার্টেক্স ও E এজের গ্রাফে ডেপথ-ফার্স্ট সার্চের সময়:' },
    options: ['O(V + E)', 'O(V²)', 'O(E log V)', 'O(VE)'], answer: 0,
    explain: { en: 'Each vertex and each edge is handled once.', bn: 'প্রতিটি ভার্টেক্স ও এজ একবার করে দেখা হয়।' },
  },
  {
    id: 'uq10', type: 'mcq', subject: 'algorithms', chapter: 'graphs', source: { en: 'CSE-2201 Final 2023', bn: 'সিএসই-২২০১ ফাইনাল ২০২৩' }, solved: 83,
    q: { en: 'Which algorithm finds a minimum spanning tree?', bn: 'কোন অ্যালগরিদম মিনিমাম স্প্যানিং ট্রি খুঁজে বের করে?' },
    options: ['Kruskal', 'Dijkstra', 'Bellman–Ford', 'Floyd–Warshall'], answer: 0,
    explain: { en: 'Kruskal adds the cheapest edge that does not form a cycle.', bn: 'ক্রুসকাল চক্র তৈরি করে না এমন সবচেয়ে সস্তা এজ যোগ করে।' },
  },
  {
    id: 'uc1', type: 'creative', subject: 'algorithms', chapter: 'sorting', source: { en: 'CSE-2201 Final 2024', bn: 'সিএসই-২২০১ ফাইনাল ২০২৪' }, solved: 49,
    q: { en: 'Explain why quicksort’s worst case is O(n²) and how a random pivot helps.', bn: 'কুইকসর্টের সবচেয়ে খারাপ সময় কেন O(n²) এবং র‍্যান্ডম পিভট কীভাবে সাহায্য করে, ব্যাখ্যা করো।' },
    explain: { en: 'If the pivot is always the smallest or largest item (e.g. sorted input), each split removes one element, giving n levels of O(n). A random pivot makes such splits very unlikely, so the expected time is O(n log n).', bn: 'পিভট সবসময় সবচেয়ে ছোট বা বড় হলে (যেমন সাজানো ইনপুট) প্রতি ভাগে একটি উপাদান কমে, ফলে n স্তরে O(n)। র‍্যান্ডম পিভটে এমন ভাগ খুব অসম্ভাব্য, তাই প্রত্যাশিত সময় O(n log n)।' },
  },
]

export const questionBank = { school, college, university }
