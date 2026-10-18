// Prefilled sign-up details per role. `label` keys into onboarding.details.fields,
// select options key into onboarding.details.levels.
export const signupFields = {
  student: [
    { id: 'name', label: 'name', value: 'Nusrat Akter' },
    { id: 'level', label: 'level', type: 'select', value: 'university', options: ['school', 'college', 'university'] },
    { id: 'institution', label: 'institution', value: 'University of Dhaka' },
    { id: 'phone', label: 'phone', value: '+880 1712-345678', type: 'tel' },
  ],
  teacher: [
    { id: 'name', label: 'name', value: 'Md. Kamrul Hasan' },
    {
      id: 'level',
      label: 'level',
      type: 'select',
      value: 'highSchool',
      options: ['primary', 'highSchool', 'collegeTeacher', 'universityTeacher'],
    },
    { id: 'institution', label: 'institution', value: 'Mymensingh Zilla School' },
    { id: 'subject', label: 'subject', value: 'Physics' },
  ],
  publisher: [
    { id: 'org', label: 'org', value: 'Brightpage Publications' },
    { id: 'pubId', label: 'pubId', value: 'BD-PUB-2041' },
    { id: 'contact', label: 'contact', value: 'Shahidul Islam' },
    { id: 'phone', label: 'phone', value: '+880 1819-552041', type: 'tel' },
  ],
  industry: [
    { id: 'org', label: 'org', value: 'AgroSense Ltd.' },
    { id: 'license', label: 'license', value: 'TRAD/DNCC/041218/2024' },
    { id: 'contact', label: 'contact', value: 'Tanvir Ahmed' },
    { id: 'phone', label: 'phone', value: '+880 1911-208840', type: 'tel' },
  ],
  government: [
    { id: 'name', label: 'name', value: 'Farhana Yasmin' },
    { id: 'office', label: 'office', value: 'Dhaka Division Review Team' },
    { id: 'employeeId', label: 'employeeId', value: 'GOV-DHK-1187' },
    { id: 'phone', label: 'phone', value: '+880 1552-118700', type: 'tel' },
  ],
}

// Demo sign-in accounts; any password works
export const demoAccounts = {
  student: 'nusrat.akter@setu.demo',
  teacher: 'kamrul.hasan@setu.demo',
  publisher: 'brightpage@setu.demo',
  industry: 'tanvir@agrosense.setu.demo',
  government: 'review.dhaka@setu.demo',
}
