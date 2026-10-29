import { Navigate, Route, Routes } from 'react-router-dom'
import { portals, ROLES } from './data/portals'
import PortalLayout from './layouts/PortalLayout'
import Landing from './pages/landing/Landing'
import Details from './pages/onboarding/Details'
import RoleSelect from './pages/onboarding/RoleSelect'
import SignIn from './pages/onboarding/SignIn'
import Verify from './pages/onboarding/Verify'
import Welcome from './pages/onboarding/Welcome'
import PortalPlaceholder from './pages/PortalPlaceholder'
import Profile from './pages/profile/Profile'
import PublicProfile from './pages/public/PublicProfile'
import Rankings from './pages/public/Rankings'
import { extraRoutes, pages } from './pages/registry'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/u/:slug" element={<PublicProfile />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/onboarding" element={<RoleSelect />} />
      <Route path="/onboarding/:role/details" element={<Details />} />
      <Route path="/onboarding/:role/verify" element={<Verify />} />
      {ROLES.map((role) => (
        <Route key={role} path={`/${role}`} element={<PortalLayout role={role} />}>
          {portals[role].nav.map((item) => {
            const Page = pages[`${role}:${item.key}`]
            const element = Page ? <Page /> : <PortalPlaceholder role={role} item={item} />
            return item.path ? <Route key={item.key} path={item.path} element={element} /> : <Route key={item.key} index element={element} />
          })}
          {(extraRoutes[role] ?? []).map(({ path, element: Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
          <Route path="profile" element={<Profile role={role} />} />
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
