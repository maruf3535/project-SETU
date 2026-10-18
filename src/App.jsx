import { Navigate, Route, Routes } from 'react-router-dom'
import { portals, ROLES } from './data/portals'
import PortalLayout from './layouts/PortalLayout'
import DemoIndex from './pages/DemoIndex'
import PortalPlaceholder from './pages/PortalPlaceholder'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DemoIndex />} />
      {ROLES.map((role) => (
        <Route key={role} path={`/${role}`} element={<PortalLayout role={role} />}>
          {portals[role].nav.map((item) =>
            item.path ? (
              <Route key={item.key} path={item.path} element={<PortalPlaceholder role={role} item={item} />} />
            ) : (
              <Route key={item.key} index element={<PortalPlaceholder role={role} item={item} />} />
            ),
          )}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
