import { urlImg } from '@admin/src/utils/url';
import type { AboutUsAdmin } from '@backend/src/controllers/admin/aboutUs/model';
import { Link } from '@tanstack/react-router';
import type { Static } from 'elysia';

export function AboutUsCard({
  data,
}: {
  data: Static<typeof AboutUsAdmin.StandardResponse>;
}) {
  return (
    <Link to={'/aboutUs/' + data.id}>
      <div className="relative h-full bg-base-300 shadow-lg rounded-2xl cursor-pointer">
        <div className="absolute left-4 top-4 bg-linear-to-r from-[#2563EB] to-[#22C55E] px-3 py-1 rounded-2xl uppercase font-bold text-xs shadow-lg">
          {data.category.name}
        </div>
        <img
          src={urlImg(data.image)}
          className="w-full h-62.5 object-cover rounded-tl-2xl rounded-tr-2xl"
        />
        <div className="p-4 space-y-1">
          <h2 className="font-bold">{data.title}</h2>
          <p className='text-sm'>{data.content}</p>
        </div>
      </div>
    </Link>
  );
}
