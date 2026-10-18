import ChallengeDetail from './industry/ChallengeDetail'
import IndustryChallenges from './industry/Challenges'
import IndustryOverview from './industry/Overview'
import PostChallenge from './industry/PostChallenge'
import Projects from './industry/Projects'
import Talent from './industry/Talent'

// Built portal pages, keyed by `${role}:${nav key}`. Anything missing falls back to the placeholder.
export const pages = {
  'industry:overview': IndustryOverview,
  'industry:challenges': IndustryChallenges,
  'industry:postChallenge': PostChallenge,
  'industry:talent': Talent,
  'industry:projects': Projects,
}

// Pages reached from inside a portal but not shown in its navigation
export const extraRoutes = {
  industry: [{ path: 'challenges/:id', element: ChallengeDetail }],
}
