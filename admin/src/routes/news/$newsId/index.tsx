import { NewsAPI } from '@admin/src/api/news';
import { urlImg } from '@admin/src/utils/url';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { OrbitProgress } from 'react-loading-indicators';
import Markdown from 'react-markdown';

export const Route = createFileRoute('/news/$newsId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { newsId } = Route.useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ['news', newsId],
    queryFn: () => NewsAPI.getById(Number.parseInt(newsId)),
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await NewsAPI.deleteById(Number.parseInt(newsId));
    },
    onError: (err) => {
      toast.error(`Gagal menghapus (${err.message})`);
    },
    onSuccess: () => {
      toast.success('Berita berhasil dihapus');
      router.history.back();
    },
  });

  return (
    <motion.div
      initial={{ y: 200, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'circOut' }}
    >
      {/* Loading */}
      {isPending ||
        (deleteMutation.isPending && (
          <div className="fixed left-0 top-0 z-50 w-screen h-screen bg-base-100/50 grid place-items-center">
            <OrbitProgress
              variant="spokes"
              color="#747474"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ))}

      <header className="flex items-center gap-3 px-2 py-1 bg-base-200">
        <button className="btn" onClick={() => router.history.back()}>
          <ArrowLeft width={20} />
        </button>

        <h1 className="w-full">Berita</h1>

        <button
          className="btn btn-error"
          onClick={() => deleteMutation.mutate()}
        >
          Hapus Berita
        </button>
      </header>

      <div className="w-full flex justify-center p-2 md:p-8">
        {data != null && (
          <main className="w-full max-w-200">
            <h1 className="mb-2 text-3xl">{data.title}</h1>
            <p className="mb-2">{data.summary}</p>
            <div className="flex justify-between">
              <p className="flex items-center gap-1 mb-3 text-base-content/60">
                <User width={18} /> {data.user.name}
              </p>
              <p className="flex items-center gap-1 mb-3 text-base-content/60">
                <Calendar width={18} />{' '}
                {data.createdAt.toLocaleDateString('id-ID')}
              </p>
            </div>
            <img
              src={urlImg(data.image)}
              className="w-full h-100 rounded-xl object-cover"
            />
            <div className="mt-4">
              <Markdown>{data.content}</Markdown>
            </div>
          </main>
        )}
      </div>
    </motion.div>
  );
}
