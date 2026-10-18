import { initialsOf, profileIdFor, profiles } from '../../data/demo/profiles'
import { useDemo } from '../../store/DemoStore'

// The signed-in user's profile for a portal: seed details with any saved edits on top
export function useProfile(role) {
  const demo = useDemo()
  const id = profileIdFor(role, demo)
  const seed = profiles[id]
  const saved = demo.profiles?.[id] ?? {}
  const fields = { ...seed.fields, ...(saved.fields ?? {}) }
  const name = fields.name ?? fields.org
  return {
    id,
    ...seed,
    ...saved,
    fields,
    name,
    initials: initialsOf(name),
    edited: Boolean(demo.profiles?.[id]),
    dispatch: demo.dispatch,
  }
}
