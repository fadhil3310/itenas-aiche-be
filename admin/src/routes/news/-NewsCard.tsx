import { urlImg } from '@admin/src/utils/url';
import type { NewsAdminModel } from '@backend/src/controllers/admin/news/model';
import { Link } from '@tanstack/react-router';
import type { Static } from 'elysia';
import { Calendar, Lock, User } from 'lucide-react';

export function NewsCard({
  data,
}: {
  data: Static<typeof NewsAdminModel.StandardResponse>;
}) {
  return (
    <Link to={'/news/' + data.id}>
      <div className="relative flex flex-col h-full bg-base-300 shadow-lg rounded-2xl cursor-pointer">
        {data.status == 'DRAFT' && (
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-base-100 px-3 py-1 rounded-2xl uppercase font-bold text-xs shadow-lg">
            <Lock width={14} /> Draft
          </div>
        )}

        <img
          src={urlImg(data.image)}
          className="w-full h-62.5 object-cover rounded-tl-2xl rounded-tr-2xl shrink-0"
        />
        <div className="flex flex-col h-full p-4 pb-3 space-y-1">
          <h2 className="font-bold">{data.title}</h2>
          <p className="h-full text-sm">{data.summary}</p>
          <div className="flex justify-between">
            <p className="flex items-center gap-1 text-base-content/60 text-xs">
              <User width={14} /> {data.user.name}
            </p>
            <p className="flex items-center gap-1 text-base-content/60 text-xs">
              <Calendar width={14} />{' '}
              {data.createdAt.toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
