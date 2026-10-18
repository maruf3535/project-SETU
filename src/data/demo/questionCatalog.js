// Labels and lookup tables for the question bank.
// `boards` names where a question appeared; `catalog` lists subject → chapter → topic per level in teaching order;
// `existingMeta` adds topic, board and year to the questions in questions.js, which only carry a `source` text.

export const boards = {
  dhaka: { en: 'Dhaka Board', bn: 'ঢাকা বোর্ড' },
  rajshahi: { en: 'Rajshahi Board', bn: 'রাজশাহী বোর্ড' },
  cumilla: { en: 'Cumilla Board', bn: 'কুমিল্লা বোর্ড' },
  jashore: { en: 'Jashore Board', bn: 'যশোর বোর্ড' },
  chattogram: { en: 'Chattogram Board', bn: 'চট্টগ্রাম বোর্ড' },
  barishal: { en: 'Barishal Board', bn: 'বরিশাল বোর্ড' },
  sylhet: { en: 'Sylhet Board', bn: 'সিলেট বোর্ড' },
  dinajpur: { en: 'Dinajpur Board', bn: 'দিনাজপুর বোর্ড' },
  mymensingh: { en: 'Mymensingh Board', bn: 'ময়মনসিংহ বোর্ড' },
  du: { en: 'DU admission', bn: 'ঢাবি ভর্তি' },
  buet: { en: 'BUET admission', bn: 'বুয়েট ভর্তি' },
  medical: { en: 'Medical admission', bn: 'মেডিকেল ভর্তি' },
  final: { en: 'Semester final', bn: 'সেমিস্টার ফাইনাল' },
  mid: { en: 'Mid-term', bn: 'মিড-টার্ম' },
  ai: { en: 'AI generated', bn: 'এআই তৈরি' },
}

export const catalog = {
  school: {
    physics: {
      label: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
      chapters: {
        motion: {
          label: { en: 'Ch 2 · Motion', bn: 'অধ্যায় ২ · গতি' },
          topics: {
            speedVelocity: { en: 'Speed and velocity', bn: 'দ্রুতি ও বেগ' },
            acceleration: { en: 'Acceleration', bn: 'ত্বরণ' },
            freeFall: { en: 'Free fall', bn: 'মুক্তভাবে পড়ন্ত বস্তু' },
            graphs: { en: 'Motion graphs', bn: 'গতির লেখচিত্র' },
          },
        },
        force: {
          label: { en: 'Ch 3 · Force', bn: 'অধ্যায় ৩ · বল' },
          topics: {
            inertia: { en: 'Inertia and Newton’s first law', bn: 'জড়তা ও নিউটনের প্রথম সূত্র' },
            newton2: { en: 'Newton’s second law', bn: 'নিউটনের দ্বিতীয় সূত্র' },
            momentum: { en: 'Momentum', bn: 'ভরবেগ' },
            friction: { en: 'Friction', bn: 'ঘর্ষণ' },
          },
        },
        work: {
          label: { en: 'Ch 4 · Work, power & energy', bn: 'অধ্যায় ৪ · কাজ, ক্ষমতা ও শক্তি' },
          topics: {
            workDone: { en: 'Work done by a force', bn: 'বল দ্বারা কৃতকাজ' },
            energy: { en: 'Kinetic and potential energy', bn: 'গতিশক্তি ও বিভবশক্তি' },
            power: { en: 'Power', bn: 'ক্ষমতা' },
          },
        },
      },
    },
    chemistry: {
      label: { en: 'Chemistry', bn: 'রসায়ন' },
      chapters: {
        states: {
          label: { en: 'Ch 2 · States of matter', bn: 'অধ্যায় ২ · পদার্থের অবস্থা' },
          topics: {
            kineticTheory: { en: 'Kinetic theory of particles', bn: 'কণার গতিতত্ত্ব' },
            changeOfState: { en: 'Change of state', bn: 'অবস্থার পরিবর্তন' },
            diffusion: { en: 'Diffusion and effusion', bn: 'ব্যাপন ও নিঃসরণ' },
            sublimation: { en: 'Sublimation', bn: 'ঊর্ধ্বপাতন' },
          },
        },
        atomic: {
          label: { en: 'Ch 3 · Structure of matter', bn: 'অধ্যায় ৩ · পদার্থের গঠন' },
          topics: {
            subatomic: { en: 'Fundamental particles', bn: 'মৌলিক কণিকা' },
            atomicModels: { en: 'Atomic models', bn: 'পরমাণু মডেল' },
            electronConfig: { en: 'Electron configuration', bn: 'ইলেকট্রন বিন্যাস' },
            isotopes: { en: 'Isotopes', bn: 'আইসোটোপ' },
          },
        },
        bonds: {
          label: { en: 'Ch 5 · Chemical bonds', bn: 'অধ্যায় ৫ · রাসায়নিক বন্ধন' },
          topics: {
            valency: { en: 'Valency and the octet rule', bn: 'যোজনী ও অষ্টক নিয়ম' },
            ionic: { en: 'Ionic bonds', bn: 'আয়নিক বন্ধন' },
            covalent: { en: 'Covalent bonds', bn: 'সমযোজী বন্ধন' },
          },
        },
      },
    },
    higherMath: {
      label: { en: 'Higher Mathematics', bn: 'উচ্চতর গণিত' },
      chapters: {
        sets: {
          label: { en: 'Ch 1 · Sets and functions', bn: 'অধ্যায় ১ · সেট ও ফাংশন' },
          topics: {
            setOps: { en: 'Set operations', bn: 'সেটের প্রক্রিয়া' },
            powerSet: { en: 'Power set', bn: 'শক্তি সেট' },
            functions: { en: 'Relations, domain and range', bn: 'অন্বয়, ডোমেন ও রেঞ্জ' },
          },
        },
        algebra: {
          label: { en: 'Ch 2 · Algebraic expressions', bn: 'অধ্যায় ২ · বীজগাণিতিক রাশি' },
          topics: {
            polynomials: { en: 'Polynomials', bn: 'বহুপদী' },
            remainderTheorem: { en: 'Remainder theorem', bn: 'ভাগশেষ উপপাদ্য' },
            factorisation: { en: 'Factor theorem and factorisation', bn: 'উৎপাদক উপপাদ্য ও উৎপাদকে বিশ্লেষণ' },
          },
        },
        trig: {
          label: { en: 'Ch 8 · Trigonometry', bn: 'অধ্যায় ৮ · ত্রিকোণমিতি' },
          topics: {
            radian: { en: 'Radian measure', bn: 'রেডিয়ান পরিমাপ' },
            trigRatios: { en: 'Trigonometric ratios', bn: 'ত্রিকোণমিতিক অনুপাত' },
            identities: { en: 'Trigonometric identities', bn: 'ত্রিকোণমিতিক অভেদাবলি' },
          },
        },
      },
    },
  },

  college: {
    chemistry: {
      label: { en: 'Chemistry', bn: 'রসায়ন' },
      chapters: {
        mole: {
          label: { en: 'Mole concept', bn: 'মোল ধারণা' },
          topics: {
            avogadro: { en: 'Avogadro’s number', bn: 'অ্যাভোগাড্রো সংখ্যা' },
            molarMass: { en: 'Molar mass', bn: 'মোলার ভর' },
            massToMoles: { en: 'Mass–mole conversion', bn: 'ভর ও মোলের রূপান্তর' },
          },
        },
        gas: {
          label: { en: 'Gases', bn: 'গ্যাস' },
          topics: {
            gasLaws: { en: 'Boyle’s and Charles’s laws', bn: 'বয়েল ও চার্লসের সূত্র' },
            idealGas: { en: 'Ideal gas equation', bn: 'আদর্শ গ্যাস সমীকরণ' },
            molarVolume: { en: 'Molar volume at STP', bn: 'আদর্শ অবস্থায় মোলার আয়তন' },
          },
        },
        solution: {
          label: { en: 'Solution concentration', bn: 'দ্রবণের ঘনমাত্রা' },
          topics: {
            molarity: { en: 'Molarity', bn: 'মোলারিটি' },
            molality: { en: 'Molality', bn: 'মোলালিটি' },
            dilution: { en: 'Dilution', bn: 'লঘুকরণ' },
          },
        },
        stoich: {
          label: { en: 'Stoichiometry', bn: 'স্টয়কিওমিতি' },
          topics: {
            moleRatio: { en: 'Mole ratios in equations', bn: 'সমীকরণে মোল অনুপাত' },
            percentComposition: { en: 'Percentage composition', bn: 'শতকরা সংযুতি' },
            limitingReagent: { en: 'Limiting reagent', bn: 'লিমিটিং বিক্রিয়ক' },
          },
        },
      },
    },
    physics1: {
      label: { en: 'Physics 1st Paper', bn: 'পদার্থবিজ্ঞান ১ম পত্র' },
      chapters: {
        vectors: {
          label: { en: 'Vectors', bn: 'ভেক্টর' },
          topics: {
            addition: { en: 'Addition and resultant', bn: 'ভেক্টরের যোগ ও লব্ধি' },
            resolution: { en: 'Resolution into components', bn: 'ভেক্টরের বিভাজন ও উপাংশ' },
            products: { en: 'Dot and cross products', bn: 'ডট ও ক্রস গুণন' },
          },
        },
        newtonian: {
          label: { en: 'Newtonian mechanics', bn: 'নিউটনিয়ান বলবিদ্যা' },
          topics: {
            impulse: { en: 'Impulse', bn: 'বলের ঘাত' },
            conservationMomentum: { en: 'Conservation of momentum', bn: 'ভরবেগের সংরক্ষণ' },
            circularMotion: { en: 'Circular motion and centripetal force', bn: 'বৃত্তীয় গতি ও কেন্দ্রমুখী বল' },
            torque: { en: 'Torque and moment of inertia', bn: 'টর্ক ও জড়তার ভ্রামক' },
          },
        },
        workEnergy: {
          label: { en: 'Work, energy and power', bn: 'কাজ, শক্তি ও ক্ষমতা' },
          topics: {
            workByForce: { en: 'Work by constant and variable forces', bn: 'ধ্রুব ও পরিবর্তনশীল বলের কাজ' },
            energyConservation: { en: 'Conservation of mechanical energy', bn: 'যান্ত্রিক শক্তির সংরক্ষণ' },
            power: { en: 'Power and efficiency', bn: 'ক্ষমতা ও কর্মদক্ষতা' },
          },
        },
      },
    },
    biology1: {
      label: { en: 'Biology 1st Paper (Botany)', bn: 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদবিজ্ঞান)' },
      chapters: {
        cell: {
          label: { en: 'Cell and cell division', bn: 'কোষ ও কোষ বিভাজন' },
          topics: {
            organelles: { en: 'Cell organelles', bn: 'কোষীয় অঙ্গাণু' },
            mitosis: { en: 'Mitosis', bn: 'মাইটোসিস' },
            meiosis: { en: 'Meiosis', bn: 'মিয়োসিস' },
          },
        },
        tissue: {
          label: { en: 'Plant tissue', bn: 'টিস্যু ও টিস্যুতন্ত্র' },
          topics: {
            meristematic: { en: 'Meristematic tissue', bn: 'ভাজক টিস্যু' },
            permanent: { en: 'Permanent tissue', bn: 'স্থায়ী টিস্যু' },
            vascular: { en: 'Vascular bundles', bn: 'ভাস্কুলার বান্ডল' },
          },
        },
        physiology: {
          label: { en: 'Plant physiology', bn: 'উদ্ভিদ শারীরতত্ত্ব' },
          topics: {
            photosynthesis: { en: 'Photosynthesis', bn: 'সালোকসংশ্লেষণ' },
            respiration: { en: 'Respiration', bn: 'শ্বসন' },
            transpiration: { en: 'Transpiration', bn: 'প্রস্বেদন' },
          },
        },
      },
    },
  },

  university: {
    algorithms: {
      label: { en: 'CSE-2201 Algorithms', bn: 'সিএসই-২২০১ অ্যালগরিদম' },
      chapters: {
        analysis: {
          label: { en: 'Asymptotic analysis', bn: 'অ্যাসিম্পটোটিক বিশ্লেষণ' },
          topics: {
            notation: { en: 'Big-O, Ω and Θ notation', bn: 'বিগ-O, Ω ও Θ নোটেশন' },
            searching: { en: 'Cost of searching', bn: 'সার্চিংয়ের সময়' },
            recurrences: { en: 'Recurrences and the master theorem', bn: 'রিকারেন্স ও মাস্টার থিওরেম' },
          },
        },
        sorting: {
          label: { en: 'Sorting', bn: 'সর্টিং' },
          topics: {
            mergeSort: { en: 'Merge sort', bn: 'মার্জ সর্ট' },
            quicksort: { en: 'Quicksort', bn: 'কুইকসর্ট' },
            heapsort: { en: 'Heapsort', bn: 'হিপসর্ট' },
            stability: { en: 'Stability and lower bounds', bn: 'স্থিতিশীলতা ও নিম্নসীমা' },
          },
        },
        graphs: {
          label: { en: 'Graph algorithms', bn: 'গ্রাফ অ্যালগরিদম' },
          topics: {
            graphBasics: { en: 'Graph basics and representation', bn: 'গ্রাফের মৌলিক ধারণা ও উপস্থাপন' },
            traversal: { en: 'BFS and DFS', bn: 'BFS ও DFS' },
            shortestPaths: { en: 'Shortest paths', bn: 'শর্টেস্ট পাথ' },
            mst: { en: 'Minimum spanning trees', bn: 'মিনিমাম স্প্যানিং ট্রি' },
          },
        },
      },
    },
    dataStructures: {
      label: { en: 'CSE-2101 Data Structures', bn: 'সিএসই-২১০১ ডেটা স্ট্রাকচার' },
      chapters: {
        stacksQueues: {
          label: { en: 'Stacks and queues', bn: 'স্ট্যাক ও কিউ' },
          topics: {
            stackOps: { en: 'Stack operations', bn: 'স্ট্যাকের অপারেশন' },
            expressions: { en: 'Infix, postfix and evaluation', bn: 'ইনফিক্স, পোস্টফিক্স ও মূল্যায়ন' },
            queues: { en: 'Circular and priority queues', bn: 'সার্কুলার ও প্রায়োরিটি কিউ' },
          },
        },
        trees: {
          label: { en: 'Trees', bn: 'ট্রি' },
          topics: {
            traversal: { en: 'Tree traversal', bn: 'ট্রি ট্রাভার্সাল' },
            bst: { en: 'Binary search trees', bn: 'বাইনারি সার্চ ট্রি' },
            avl: { en: 'AVL trees', bn: 'এভিএল ট্রি' },
            heaps: { en: 'Binary heaps', bn: 'বাইনারি হিপ' },
          },
        },
        hashing: {
          label: { en: 'Hashing', bn: 'হ্যাশিং' },
          topics: {
            hashFunctions: { en: 'Hash functions', bn: 'হ্যাশ ফাংশন' },
            collisions: { en: 'Collision resolution', bn: 'কলিশন সমাধান' },
            loadFactor: { en: 'Load factor and rehashing', bn: 'লোড ফ্যাক্টর ও রিহ্যাশিং' },
          },
        },
      },
    },
    databases: {
      label: { en: 'CSE-2203 Database Systems', bn: 'সিএসই-২২০৩ ডেটাবেস সিস্টেম' },
      chapters: {
        er: {
          label: { en: 'ER modelling', bn: 'ইআর মডেলিং' },
          topics: {
            entitiesAttributes: { en: 'Entities and attributes', bn: 'এনটিটি ও অ্যাট্রিবিউট' },
            cardinality: { en: 'Relationships and cardinality', bn: 'রিলেশনশিপ ও কার্ডিনালিটি' },
            weakEntities: { en: 'Weak entities', bn: 'দুর্বল এনটিটি' },
          },
        },
        normalisation: {
          label: { en: 'Normalisation', bn: 'নরমালাইজেশন' },
          topics: {
            functionalDeps: { en: 'Functional dependencies and keys', bn: 'ফাংশনাল ডিপেনডেন্সি ও কী' },
            normalForms: { en: '1NF, 2NF and 3NF', bn: '১NF, ২NF ও ৩NF' },
            bcnf: { en: 'BCNF and decomposition', bn: 'BCNF ও বিভাজন' },
          },
        },
        sql: {
          label: { en: 'SQL', bn: 'এসকিউএল' },
          topics: {
            queries: { en: 'SELECT and filtering', bn: 'SELECT ও ফিল্টারিং' },
            joins: { en: 'Joins and subqueries', bn: 'জয়েন ও সাবকোয়েরি' },
            aggregation: { en: 'GROUP BY and aggregates', bn: 'GROUP BY ও অ্যাগ্রিগেট' },
          },
        },
      },
    },
  },
}

// Topic, board and year for every question in questions.js, derived from its `source` text.
export const existingMeta = {
  // School · Physics
  sq1: { topic: 'newton2', board: 'dhaka', year: 2023 },
  sq2: { topic: 'inertia', board: 'rajshahi', year: 2022 },
  sq3: { topic: 'acceleration', board: 'cumilla', year: 2023 },
  sq4: { topic: 'momentum', board: 'jashore', year: 2021 },
  sq5: { topic: 'freeFall', board: 'dinajpur', year: 2022 },
  sq6: { topic: 'inertia', board: 'sylhet', year: 2023 },
  sq7: { topic: 'workDone', board: 'chattogram', year: 2022 },
  sq8: { topic: 'energy', board: 'barishal', year: 2023 },
  sq9: { topic: 'power', board: 'mymensingh', year: 2023 },
  sq10: { topic: 'graphs', board: 'dhaka', year: 2021 },
  sc1: { topic: 'inertia', board: 'ai', year: 2026 },
  sc2: { topic: 'newton2', board: 'dhaka', year: 2022 },
  // College · Chemistry
  cq1: { topic: 'avogadro', board: 'dhaka', year: 2023 },
  cq2: { topic: 'molarMass', board: 'rajshahi', year: 2022 },
  cq3: { topic: 'massToMoles', board: 'du', year: 2022 },
  cq4: { topic: 'molarVolume', board: 'cumilla', year: 2023 },
  cq5: { topic: 'molarity', board: 'buet', year: 2021 },
  cq6: { topic: 'massToMoles', board: 'sylhet', year: 2022 },
  cq7: { topic: 'moleRatio', board: 'chattogram', year: 2023 },
  cq8: { topic: 'avogadro', board: 'buet', year: 2022 },
  cq9: { topic: 'percentComposition', board: 'jashore', year: 2022 },
  cq10: { topic: 'molality', board: 'dinajpur', year: 2023 },
  cc1: { topic: 'molarity', board: 'rajshahi', year: 2023 },
  // University · CSE-2201 Algorithms
  uq1: { topic: 'searching', board: 'final', year: 2024 },
  uq2: { topic: 'quicksort', board: 'mid', year: 2024 },
  uq3: { topic: 'traversal', board: 'final', year: 2023 },
  uq4: { topic: 'mergeSort', board: 'final', year: 2023 },
  uq5: { topic: 'shortestPaths', board: 'final', year: 2024 },
  uq6: { topic: 'stability', board: 'mid', year: 2023 },
  uq7: { topic: 'graphBasics', board: 'final', year: 2022 },
  uq8: { topic: 'recurrences', board: 'final', year: 2024 },
  uq9: { topic: 'traversal', board: 'mid', year: 2024 },
  uq10: { topic: 'mst', board: 'final', year: 2023 },
  uc1: { topic: 'quicksort', board: 'final', year: 2024 },
}
