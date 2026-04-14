import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { NewsAPI } from '@admin/src/api/news'
import { NewsCard } from './NewsCard'
import { SearchBar } from './MenuBar'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { OrbitProgress } from 'react-loading-indicators'

export const Route = createFileRoute('/news/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounce(search, 100)

  const { data, isPending, error } = useQuery({
    queryKey: ['all-news', searchDebounced],
    queryFn: () => NewsAPI.getAllNews(searchDebounced),
  })

  return (
    <main className="w-full flex justify-center p-4 md:p-8">
      <div className="w-full max-w-[1000px]">
        <div className="flex justify-end mb-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Loading */}
        {isPending && (
          <div className="w-full h-[300px] grid place-items-center">
            <OrbitProgress
              variant="spokes"
              color="#747474"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        )}
        {error && <p>Gagal mengambil berita</p>}
        {data?.length == 0 && <h2 className="text-center">Tidak ada berita</h2>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.map((news) => (
            <NewsCard news={news} />
          ))}
        </div>
      </div>
    </main>
  )
}
