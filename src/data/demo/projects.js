// Larger milestone-paid projects offered directly to a teacher–student team.
// milestone status: paid | submitted | in_progress | upcoming
export const projects = [
  {
    id: 'pr-rice-app',
    orgId: 'agrosense',
    title: { en: 'Mobile app for rice leaf disease detection', bn: 'ধানপাতার রোগ শনাক্তের মোবাইল অ্যাপ' },
    lab: { en: 'Robotics & Vision Lab, Dept. of CSE, BUET', bn: 'রোবটিক্স ও ভিশন ল্যাব, সিএসই বিভাগ, বুয়েট' },
    lead: 'Dr. Mahbubur Rahman',
    members: ['st-nusrat', 'st-sadia', 'st-tanjim'],
    budget: 240000,
    milestones: [
      { title: { en: 'Dataset and baseline model', bn: 'ডেটাসেট ও প্রাথমিক মডেল' }, amount: 60000, due: '2026-09-15', status: 'paid' },
      { title: { en: 'On-device model in the app', bn: 'অ্যাপের ভেতরে অন-ডিভাইস মডেল' }, amount: 90000, due: '2026-11-30', status: 'in_progress' },
      { title: { en: 'Field pilot with 50 farmers in Rangpur', bn: 'রংপুরে ৫০ জন কৃষকের সাথে মাঠ পরীক্ষা' }, amount: 90000, due: '2027-01-31', status: 'upcoming' },
    ],
  },
  {
    id: 'pr-cold-chain',
    orgId: 'agrosense',
    title: { en: 'Cold-storage temperature monitoring', bn: 'কোল্ড স্টোরেজের তাপমাত্রা পর্যবেক্ষণ' },
    lab: { en: 'Embedded Systems Lab, Dept. of EEE, CUET', bn: 'এমবেডেড সিস্টেমস ল্যাব, ইইই বিভাগ, চুয়েট' },
    lead: 'Dr. Nazma Sultana',
    members: ['st-fahim', 'st-rakib'],
    budget: 150000,
    milestones: [
      { title: { en: 'Sensor prototype', bn: 'সেন্সর প্রোটোটাইপ' }, amount: 50000, due: '2026-08-31', status: 'paid' },
      { title: { en: 'Live dashboard with SMS alerts', bn: 'এসএমএস সতর্কতাসহ লাইভ ড্যাশবোর্ড' }, amount: 50000, due: '2026-10-15', status: 'submitted' },
      { title: { en: 'Pilot in three Bogura cold stores', bn: 'বগুড়ার তিনটি কোল্ড স্টোরে পরীক্ষা' }, amount: 50000, due: '2026-12-20', status: 'upcoming' },
    ],
  },
]
