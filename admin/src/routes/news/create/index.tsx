import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Lock, Rss } from 'lucide-react';
import { motion } from 'motion/react';
import { ImagePick } from './-ImagePick';
import { useRef } from 'react';
import { ArticleEditor, type ArticleEditorRef } from './-ArticleEditor';
import { NewsAPI } from '@admin/src/api/news';
import { useMutation } from '@tanstack/react-query';
import { OrbitProgress } from 'react-loading-indicators';
import toast from 'react-hot-toast';
import { NewsAdminModel } from '@backend/src/controllers/admin/news/model';
import { t, type Static } from 'elysia';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { StatusSelect } from './-StatusSelect';
import { PublishStatus } from '@backend/generated/prisma/enums';

export const Route = createFileRoute('/news/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: Static<typeof NewsAdminModel.Model.postBody>) => {
      return await NewsAPI.create(data);
    },
    onError: (err) => {
      toast.error(`Gagal menyimpan (${err.message})`);
    },
    onSuccess: () => {
      toast.success('Berita berhasil disimpan');
      router.history.back();
    },
  });

  const articleEditorRef = useRef<ArticleEditorRef>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Static<typeof NewsAdminModel.Model.postBody>>({
    resolver: (() => {
      const FormSchema = t.Composite([
        t.Omit(NewsAdminModel.Model.postBody, ['image']),
        t.Object({ image: t.Any() }),
      ]);
      typeboxResolver(FormSchema);
    })(),
    defaultValues: {
      status: PublishStatus.DRAFT,
    },
  });
  const onSubmit: SubmitHandler<
    Static<typeof NewsAdminModel.Model.postBody>
  > = (data) => {
    // Validate image manually as our schema validation can't do it.
    if (data.image == null) return toast.error('Foto tidak boleh kosong');
    mutation.mutate({ ...data, content: articleEditorRef.current!.getValue() });
  };

  return (
    <motion.div
      initial={{ y: 200, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'circOut' }}
    >
      {/* Loading */}
      {mutation.isPending && (
        <div className="fixed left-0 top-0 z-50 w-screen h-screen bg-base-100/50 grid place-items-center">
          <OrbitProgress
            variant="spokes"
            color="#747474"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      )}

      <header className="flex items-center gap-3 px-2 py-1 bg-base-200">
        <button
          className="btn"
          onClick={() =>
            router.history.canGoBack()
              ? router.history.back()
              : router.history.push('/news')
          }
        >
          <ArrowLeft width={20} />
        </button>

        <div className="md:w-full">
          <h1 className="max-md:hidden ">Buat Berita</h1>
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <StatusSelect onChange={onChange} value={value} {...field} />
          )}
        />
        <button
          className="btn btn-primary"
          disabled={mutation.isPending}
          onClick={handleSubmit(onSubmit)}
        >
          Simpan
        </button>
      </header>
      <div className="w-full flex justify-center p-2 md:p-8">
        <main className="w-full max-w-200 space-y-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ImagePick control={control} value={watch('image')} />

            <fieldset className="mt-2 fieldset">
              <legend className="fieldset-legend">Judul</legend>
              <input
                type="text"
                className="input w-full"
                {...register('title')}
              />
              {errors.title && (
                <p className="label" role="alert">
                  Judul tidak boleh kosong
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Ringkasan</legend>
              <input
                type="text"
                className="input w-full"
                {...register('summary')}
              />
              {errors.title && (
                <p className="label" role="alert">
                  Ringkasan tidak boleh kosong
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Artikel</legend>
              <ArticleEditor ref={articleEditorRef} />
            </fieldset>
          </form>
        </main>
      </div>
    </motion.div>
  );
}
