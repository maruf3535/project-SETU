// Bangladesh classes and subjects, following the NCTB group-based curriculum (Science, Business Studies,
// Humanities from Class 9). `level` is the store level students filter by: school | college | admission | university.
// Subject groups: `common` subjects apply to every student of that class; group lists add to them.

const s = (en, bn) => ({ en, bn })

const juniorSubjects = {
  common: {
    bangla1: s('Bangla 1st Paper', 'বাংলা ১ম পত্র'),
    bangla2: s('Bangla 2nd Paper', 'বাংলা ২য় পত্র'),
    english1: s('English 1st Paper', 'ইংরেজি ১ম পত্র'),
    english2: s('English 2nd Paper', 'ইংরেজি ২য় পত্র'),
    math: s('Mathematics', 'গণিত'),
    science: s('General Science', 'বিজ্ঞান'),
    bgs: s('Bangladesh & Global Studies', 'বাংলাদেশ ও বিশ্বপরিচয়'),
    ict: s('ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি'),
    religion: s('Religion & Moral Education', 'ধর্ম ও নৈতিক শিক্ষা'),
    agriculture: s('Agriculture Studies', 'কৃষিশিক্ষা'),
    homeScience: s('Home Science', 'গার্হস্থ্য বিজ্ঞান'),
    physicalEd: s('Physical Education & Health', 'শারীরিক শিক্ষা ও স্বাস্থ্য'),
    workLife: s('Work & Life Oriented Education', 'কর্ম ও জীবনমুখী শিক্ষা'),
    arts: s('Arts & Crafts', 'চারু ও কারুকলা'),
  },
}

export const classes = [
  { id: 'class6', level: 'school', label: s('Class 6', '৬ষ্ঠ শ্রেণি'), subjects: juniorSubjects },
  { id: 'class7', level: 'school', label: s('Class 7', '৭ম শ্রেণি'), subjects: juniorSubjects },
  { id: 'class8', level: 'school', label: s('Class 8', '৮ম শ্রেণি'), subjects: juniorSubjects },
  {
    id: 'class9_10',
    level: 'school',
    label: s('Class 9–10 (SSC)', '৯ম–১০ম শ্রেণি (এসএসসি)'),
    subjects: {
      common: {
        bangla1: s('Bangla 1st Paper', 'বাংলা ১ম পত্র'),
        bangla2: s('Bangla 2nd Paper', 'বাংলা ২য় পত্র'),
        english1: s('English 1st Paper', 'ইংরেজি ১ম পত্র'),
        english2: s('English 2nd Paper', 'ইংরেজি ২য় পত্র'),
        math: s('General Mathematics', 'সাধারণ গণিত'),
        ict: s('ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি'),
        religion: s('Religion & Moral Education', 'ধর্ম ও নৈতিক শিক্ষা'),
        physicalEd: s('Physical Education, Health & Sports', 'শারীরিক শিক্ষা, স্বাস্থ্য বিজ্ঞান ও খেলাধুলা'),
        careerEd: s('Career Education', 'ক্যারিয়ার শিক্ষা'),
        agriculture: s('Agriculture Studies', 'কৃষিশিক্ষা'),
      },
      science: {
        physics: s('Physics', 'পদার্থবিজ্ঞান'),
        chemistry: s('Chemistry', 'রসায়ন'),
        biology: s('Biology', 'জীববিজ্ঞান'),
        higherMath: s('Higher Mathematics', 'উচ্চতর গণিত'),
        bgs: s('Bangladesh & Global Studies', 'বাংলাদেশ ও বিশ্বপরিচয়'),
      },
      business: {
        accounting: s('Accounting', 'হিসাববিজ্ঞান'),
        finance: s('Finance & Banking', 'ফিন্যান্স ও ব্যাংকিং'),
        entrepreneurship: s('Business Entrepreneurship', 'ব্যবসায় উদ্যোগ'),
        generalScience: s('General Science', 'সাধারণ বিজ্ঞান'),
        bgs: s('Bangladesh & Global Studies', 'বাংলাদেশ ও বিশ্বপরিচয়'),
      },
      humanities: {
        history: s('History of Bangladesh & World Civilisation', 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা'),
        geography: s('Geography & Environment', 'ভূগোল ও পরিবেশ'),
        civics: s('Civics & Citizenship', 'পৌরনীতি ও নাগরিকতা'),
        economics: s('Economics', 'অর্থনীতি'),
        generalScience: s('General Science', 'সাধারণ বিজ্ঞান'),
      },
    },
  },
  {
    id: 'class11_12',
    level: 'college',
    label: s('Class 11–12 (HSC)', 'একাদশ–দ্বাদশ শ্রেণি (এইচএসসি)'),
    subjects: {
      common: {
        bangla1: s('Bangla 1st Paper', 'বাংলা ১ম পত্র'),
        bangla2: s('Bangla 2nd Paper', 'বাংলা ২য় পত্র'),
        english1: s('English 1st Paper', 'ইংরেজি ১ম পত্র'),
        english2: s('English 2nd Paper', 'ইংরেজি ২য় পত্র'),
        ict: s('ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি'),
      },
      science: {
        physics1: s('Physics 1st Paper', 'পদার্থবিজ্ঞান ১ম পত্র'),
        physics2: s('Physics 2nd Paper', 'পদার্থবিজ্ঞান ২য় পত্র'),
        chemistry1: s('Chemistry 1st Paper', 'রসায়ন ১ম পত্র'),
        chemistry2: s('Chemistry 2nd Paper', 'রসায়ন ২য় পত্র'),
        biology1: s('Biology 1st Paper (Botany)', 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদবিজ্ঞান)'),
        biology2: s('Biology 2nd Paper (Zoology)', 'জীববিজ্ঞান ২য় পত্র (প্রাণিবিজ্ঞান)'),
        higherMath1: s('Higher Mathematics 1st Paper', 'উচ্চতর গণিত ১ম পত্র'),
        higherMath2: s('Higher Mathematics 2nd Paper', 'উচ্চতর গণিত ২য় পত্র'),
      },
      business: {
        accounting1: s('Accounting 1st Paper', 'হিসাববিজ্ঞান ১ম পত্র'),
        accounting2: s('Accounting 2nd Paper', 'হিসাববিজ্ঞান ২য় পত্র'),
        management: s('Business Organisation & Management', 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা'),
        finance: s('Finance, Banking & Insurance', 'ফিন্যান্স, ব্যাংকিং ও বিমা'),
        marketing: s('Production Management & Marketing', 'উৎপাদন ব্যবস্থাপনা ও বিপণন'),
      },
      humanities: {
        economics: s('Economics', 'অর্থনীতি'),
        civics: s('Civics & Good Governance', 'পৌরনীতি ও সুশাসন'),
        history: s('History', 'ইতিহাস'),
        islamicHistory: s('Islamic History & Culture', 'ইসলামের ইতিহাস ও সংস্কৃতি'),
        logic: s('Logic', 'যুক্তিবিদ্যা'),
        sociology: s('Sociology', 'সমাজবিজ্ঞান'),
        socialWork: s('Social Work', 'সমাজকর্ম'),
        geography: s('Geography', 'ভূগোল'),
        psychology: s('Psychology', 'মনোবিজ্ঞান'),
      },
    },
  },
  {
    id: 'admission',
    level: 'admission',
    label: s('University admission', 'বিশ্ববিদ্যালয় ভর্তি'),
    subjects: {
      units: {
        engineering: s('Engineering (BUET, CKRUET)', 'প্রকৌশল (বুয়েট, চুয়েট-কুয়েট-রুয়েট)'),
        medical: s('Medical & Dental (MBBS, BDS)', 'মেডিকেল ও ডেন্টাল (এমবিবিএস, বিডিএস)'),
        scienceUnit: s('Science unit (DU, public universities)', 'বিজ্ঞান ইউনিট (ঢাবি, পাবলিক বিশ্ববিদ্যালয়)'),
        businessUnit: s('Business Studies unit', 'ব্যবসায় শিক্ষা ইউনিট'),
        humanitiesUnit: s('Humanities unit', 'মানবিক ইউনিট'),
        gst: s('GST cluster', 'জিএসটি গুচ্ছ'),
      },
    },
  },
  {
    id: 'university',
    level: 'university',
    label: s('University', 'বিশ্ববিদ্যালয়'),
    subjects: {
      engineering: {
        cse: s('Computer Science & Engineering', 'কম্পিউটার বিজ্ঞান ও প্রকৌশল'),
        eee: s('Electrical & Electronic Engineering', 'তড়িৎ ও ইলেকট্রনিক প্রকৌশল'),
        civil: s('Civil Engineering', 'পুরকৌশল'),
        mechanical: s('Mechanical Engineering', 'যন্ত্রকৌশল'),
      },
      sciences: {
        physicsDept: s('Physics', 'পদার্থবিজ্ঞান'),
        chemistryDept: s('Chemistry', 'রসায়ন'),
        mathDept: s('Mathematics', 'গণিত'),
        statistics: s('Statistics', 'পরিসংখ্যান'),
        agriculture: s('Agriculture', 'কৃষি'),
      },
      businessArts: {
        bba: s('Business Administration (BBA)', 'ব্যবসায় প্রশাসন (বিবিএ)'),
        economicsDept: s('Economics', 'অর্থনীতি'),
        englishDept: s('English', 'ইংরেজি'),
        banglaDept: s('Bangla', 'বাংলা'),
      },
    },
  },
]

export const subjectGroups = {
  common: s('Compulsory', 'আবশ্যিক'),
  science: s('Science group', 'বিজ্ঞান বিভাগ'),
  business: s('Business Studies group', 'ব্যবসায় শিক্ষা বিভাগ'),
  humanities: s('Humanities group', 'মানবিক বিভাগ'),
  units: s('Admission test', 'ভর্তি পরীক্ষা'),
  engineering: s('Engineering', 'প্রকৌশল'),
  sciences: s('Sciences', 'বিজ্ঞান'),
  businessArts: s('Business & Arts', 'ব্যবসায় ও কলা'),
}

export function classById(id) {
  return classes.find((c) => c.id === id)
}

// The subject's label for a class, searching every group of that class
export function subjectLabel(classId, subjectId) {
  const groups = classById(classId)?.subjects ?? {}
  for (const list of Object.values(groups)) if (list[subjectId]) return list[subjectId]
  return null
}

// First subject of a class, used when the class changes and the old subject no longer applies
export function firstSubject(classId) {
  const groups = Object.values(classById(classId)?.subjects ?? {})
  return Object.keys(groups.find((g) => Object.keys(g).length) ?? {})[0] ?? ''
}
