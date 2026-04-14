import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AnimatePresence, motion } from 'motion/react'

import '../styles.css'
import { Toaster } from 'react-hot-toast'
import Header from '@admin/src/components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRoute({
  component: RootComponent,
})

const childLayouts = [
  {
    path: '/login',
  },
  {
    path: '/news/create',
  },
  {
    path: '/news/',
  },
]

const queryClient = new QueryClient()

function RootComponent() {
  const location = useLocation()
  const pathname = location.pathname

  let useRegularLayout = true
  for (const item of childLayouts) {
    if (pathname.startsWith(item.path)) {
      useRegularLayout = false
      break
    }
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <Toaster />
        </div>
        <AnimatePresence>
          {useRegularLayout && (
            <motion.div
              key="header"
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              exit={{ y: -60, position: 'absolute' }}
              className="w-full"
            >
              <Header />
            </motion.div>
          )}
        </AnimatePresence>
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </QueryClientProvider>
    </>
  )
}
