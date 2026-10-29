import {
  BookOpen,
  Briefcase,
  ChartColumn,
  CirclePlus,
  Factory,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  House,
  IdCard,
  Inbox,
  Landmark,
  LayoutDashboard,
  Library,
  ListVideo,
  Megaphone,
  MonitorPlay,
  NotebookPen,
  PenLine,
  Presentation,
  ScanLine,
  ShoppingBag,
  Sparkles,
  SquarePlus,
  Target,
  Timer,
  Award,
  BookMarked,
  BookCheck,
  ShieldAlert,
  UserCheck,
  Users,
  WandSparkles,
} from 'lucide-react'

export const ROLES = ['student', 'teacher', 'publisher', 'industry', 'government']

// Each nav item: `path` under /<role>, `key` into nav.* / navShort.*, `tab` = shown in the phone tab bar (max 5)
export const portals = {
  student: {
    icon: GraduationCap,
    color: 'var(--role-student)',
    user: { name: 'Nusrat Akter', initials: 'NA' },
    nav: [
      { path: '', key: 'home', icon: House, tab: true },
      { path: 'learn', key: 'learn', icon: BookOpen, tab: true },
      { path: 'exam', key: 'exam', icon: Timer },
      { path: 'notes', key: 'notes', icon: NotebookPen, tab: true },
      { path: 'store', key: 'store', icon: ShoppingBag },
      { path: 'courses', key: 'courses', icon: MonitorPlay },
      { path: 'reviews', key: 'reviewCopies', icon: BookCheck },
      { path: 'tutor', key: 'tutor', icon: Sparkles },
      { path: 'portfolio', key: 'portfolio', icon: Award, tab: true },
      { path: 'opportunities', key: 'opportunities', icon: Briefcase, tab: true },
    ],
  },
  teacher: {
    icon: Presentation,
    color: 'var(--role-teacher)',
    user: { name: 'Md. Kamrul Hasan', initials: 'KH' },
    nav: [
      { path: '', key: 'home', icon: House, tab: true },
      { path: 'generator', key: 'generator', icon: WandSparkles, tab: true },
      { path: 'omr', key: 'omr', icon: ScanLine, tab: true },
      { path: 'written', key: 'written', icon: PenLine },
      { path: 'notes', key: 'classNotes', icon: FileText, tab: true },
      { path: 'courses', key: 'courses', icon: MonitorPlay },
      { path: 'reviews', key: 'reviewCopies', icon: BookCheck },
      { path: 'research', key: 'research', icon: FlaskConical, tab: true },
    ],
  },
  publisher: {
    icon: BookMarked,
    color: 'var(--role-publisher)',
    user: { name: 'Brightpage Publications', initials: 'BP' },
    nav: [
      { path: '', key: 'overview', icon: LayoutDashboard, tab: true },
      { path: 'listings', key: 'listings', icon: Library, tab: true },
      { path: 'new', key: 'newListing', icon: SquarePlus, tab: true },
      { path: 'reviewers', key: 'reviewers', icon: UserCheck, tab: true },
      { path: 'promote', key: 'promote', icon: Megaphone, tab: true },
    ],
  },
  industry: {
    icon: Factory,
    color: 'var(--role-industry)',
    user: { name: 'AgroSense', initials: 'AS' },
    nav: [
      { path: '', key: 'overview', icon: LayoutDashboard, tab: true },
      { path: 'challenges', key: 'challenges', icon: Target, tab: true },
      { path: 'post', key: 'postChallenge', icon: CirclePlus, tab: true },
      { path: 'talent', key: 'talent', icon: Users, tab: true },
      { path: 'projects', key: 'projects', icon: Handshake, tab: true },
      { path: 'courses', key: 'courses', icon: MonitorPlay },
    ],
  },
  government: {
    icon: Landmark,
    color: 'var(--role-government)',
    user: { name: 'Dhaka Review Team', initials: 'DR' },
    nav: [
      { path: '', key: 'queue', icon: Inbox, tab: true },
      { path: 'ids', key: 'ids', icon: IdCard, tab: true },
      { path: 'integrity', key: 'integrity', icon: ShieldAlert, tab: true },
      { path: 'courses', key: 'courseReview', icon: ListVideo },
      { path: 'insights', key: 'insights', icon: ChartColumn, tab: true },
    ],
  },
}

export function portalPath(role, item) {
  return item.path ? `/${role}/${item.path}` : `/${role}`
}

export function currentNavItem(role, pathname) {
  const { nav } = portals[role]
  return nav.find((item) => item.path && pathname.startsWith(`/${role}/${item.path}`)) ?? nav[0]
}
