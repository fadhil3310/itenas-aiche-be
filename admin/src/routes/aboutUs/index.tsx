import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AboutUsCard } from './-AboutUsCard'
import { MenuBar } from './-MenuBar'
import { OrbitProgress } from 'react-loading-indicators'
import { AboutUsAPI } from '@admin/src/api/aboutUs'

export const Route = createFileRoute('/aboutUs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, error } = useQuery({
    queryKey: ['all-aboutUs'],
    queryFn: () => AboutUsAPI.getAll(),
  })

  return (
    <main className="w-full flex justify-center p-4 md:p-8">
      <div className="w-full max-w-250">
        <div className="flex justify-end mb-4">
          <MenuBar />
        </div>

        {/* Loading */}
        {isPending && (
          <div className="w-full h-75 grid place-items-center">
            <OrbitProgress
              variant="spokes"
              color="#747474"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        )}
        {error && <p>Gagal mengambil data</p>}
        {data?.length == 0 && <h2 className="text-center">Kosong</h2>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.map((item) => (
            <AboutUsCard key={item.id + "_aboutUs"} data={item} />
          ))}
        </div>
      </div>
    </main>
  )
}
