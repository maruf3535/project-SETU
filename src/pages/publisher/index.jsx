import ListingDetail from './ListingDetail'
import Listings from './Listings'
import NewListing from './NewListing'
import Overview from './Overview'
import Promote from './Promote'

// Built pages of the publisher portal, keyed by nav key from src/data/portals.js
export const pages = {
  overview: Overview,
  listings: Listings,
  newListing: NewListing,
  promote: Promote,
}

// Pages reached from inside the portal but not listed in its navigation
export const extraRoutes = [{ path: 'listings/:id', element: ListingDetail }]
