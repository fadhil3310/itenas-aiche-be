import { urlImg } from '@admin/src/utils/url';
import type { NewsModel } from '@backend/src/controllers/admin/news/model';
import { Link } from '@tanstack/react-router';
import type { Static } from 'elysia';

export function NewsCard({
  data,
}: {
  data: Static<typeof NewsModel.StandardResponse>;
}) {
  return (
    <Link to={'/news/' + data.id}>
      <div className="relative h-full bg-base-300 shadow-lg rounded-2xl cursor-pointer">
        <img
          src={urlImg(data.image)}
          className="w-full h-62.5 object-cover rounded-tl-2xl rounded-tr-2xl"
        />
        <div className="p-4 space-y-1">
          <h2 className="font-bold">{data.title}</h2>
          <p className="text-sm">{data.content}</p>
          <p className="text-xs text-base-content/60">Oleh: {data.user.name}</p>
        </div>
      </div>
    </Link>
  );
}
