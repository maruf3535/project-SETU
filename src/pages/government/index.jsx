import Ids from './Ids'
import Insights from './Insights'
import Queue from './Queue'
import ReviewDecision from './ReviewDecision'

// Built pages of the government portal, keyed by nav key from src/data/portals.js
export const pages = { queue: Queue, ids: Ids, insights: Insights }

// Pages reached from inside the portal but not listed in its navigation
export const extraRoutes = [{ path: 'review/:kind/:id', element: ReviewDecision }]
