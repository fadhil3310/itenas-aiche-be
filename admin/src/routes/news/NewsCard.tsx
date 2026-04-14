import { urlImg } from '@admin/src/utils/url'
import type { NewsModelType } from '@backend/src/controllers/admin/news/model'
import { Link } from '@tanstack/react-router'

export function NewsCard({
  news,
}: {
  news: NewsModelType['standardResponse']
}) {
  return (
    <Link to={'/news/' + news.id}>
      <div className="p-3 bg-base-300 shadow-md cursor-pointer">
        <img
          src={urlImg(news.image)}
          className="w-full h-[250px] object-cover mb-3"
        />
        <h2 className="">{news.title}</h2>
      </div>
    </Link>
  )
}
