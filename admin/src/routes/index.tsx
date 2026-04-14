import { authClient } from '@admin/src/lib/auth-client'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({}) => {
    const { data: session, error } = await authClient.getSession()
    console.log('Session', session, error)

    if (!session) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return <main></main>
}
